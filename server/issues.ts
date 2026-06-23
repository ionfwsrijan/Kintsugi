import { randomUUID } from 'node:crypto';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { bucket, db, messaging } from './firebase.js';
import { triageIssue } from './ai.js';
import type { IssueRecord } from './types.js';
import { ensureUser, notifyUser } from './users.js';

const haversine = (aLat:number,aLng:number,bLat:number,bLng:number) => {
  const r=6371000, p=Math.PI/180, dLat=(bLat-aLat)*p, dLng=(bLng-aLng)*p;
  const h=Math.sin(dLat/2)**2+Math.cos(aLat*p)*Math.cos(bLat*p)*Math.sin(dLng/2)**2;
  return 2*r*Math.asin(Math.sqrt(h));
};

export async function findDuplicate(category:string, latitude:number, longitude:number) {
  const since = Timestamp.fromMillis(Date.now() - 7*24*3600_000);
  const snapshot = await db.collection('issues').where('category','==',category).where('createdAt','>=',since).limit(100).get();
  return snapshot.docs.map(d => ({ id:d.id,...d.data() } as IssueRecord)).find(i => i.status !== 'Resolved' && haversine(latitude,longitude,i.latitude,i.longitude) <= 80) ?? null;
}

export async function createIssue(input: any, media: Express.Multer.File, uid: string) {
  await ensureUser(uid);
  const triage = await triageIssue({ mimeType:media.mimetype,bytes:media.buffer,description:input.description,address:input.address });
  const duplicate = await findDuplicate(triage.category,input.latitude,input.longitude);
  if (duplicate) {
    await verifyIssue(duplicate.id,uid,'Automatically corroborated by a nearby matching report');
    return { issue:duplicate, merged:true };
  }
  const id=randomUUID(), now=new Date(), slaDueAt=new Date(now.getTime()+triage.slaHours*3600_000);
  const ext=media.mimetype.split('/')[1]?.replace('jpeg','jpg') ?? 'bin';
  const mediaPath=`issues/${id}/evidence.${ext}`;
  await bucket.file(mediaPath).save(media.buffer,{contentType:media.mimetype,resumable:false,metadata:{metadata:{ownerUid:uid,issueId:id}}});
  const record: IssueRecord={id,title:input.title||triage.title,description:triage.summary,category:triage.category,urgency:triage.urgency,status:'Reported',confidence:triage.confidence,hazards:triage.hazards,address:input.address,wardId:input.wardId,latitude:input.latitude,longitude:input.longitude,reporterId:uid,mediaPath,supporterCount:0,responsibleDepartment:triage.responsibleDepartment,createdAt:now.toISOString(),updatedAt:now.toISOString(),slaDueAt:slaDueAt.toISOString(),duplicateOf:null,clientRequestId:input.clientRequestId};
  await db.runTransaction(async tx=>{
    const issueRef=db.collection('issues').doc(id);
    const requestRef=db.collection('idempotency').doc(`${uid}_${input.clientRequestId}`);
    const prior=await tx.get(requestRef);
    if(prior.exists) throw Object.assign(new Error('Duplicate request'),{status:409,issueId:prior.data()?.issueId});
    tx.create(issueRef,{...record,createdAt:Timestamp.fromDate(now),updatedAt:Timestamp.fromDate(now),slaDueAt:Timestamp.fromDate(slaDueAt)});
    tx.create(requestRef,{issueId:id,createdAt:Timestamp.fromDate(now)});
    tx.create(issueRef.collection('events').doc(),{type:'REPORTED',actorId:uid,at:Timestamp.fromDate(now),detail:{confidence:triage.confidence,hazards:triage.hazards}});
    tx.update(db.collection('users').doc(uid),{reportsCount:FieldValue.increment(1),points:FieldValue.increment(40),updatedAt:Timestamp.fromDate(now)});
  });
  await notifyUser(uid,{type:'REPORT',title:'Report received and routed',body:`${record.title} was classified as ${record.urgency.toLowerCase()} priority.`,issueId:id});
  await messaging.send({topic:`ward_${input.wardId}`,notification:{title:`New ${triage.urgency.toLowerCase()} priority issue`,body:record.title},data:{issueId:id,type:'NEW_ISSUE'}}).catch(()=>undefined);
  return {issue:record,merged:false};
}

export async function verifyIssue(issueId:string,uid:string,evidence?:string){
  await ensureUser(uid);
  const issueRef=db.collection('issues').doc(issueId), verificationRef=issueRef.collection('verifications').doc(uid);
  const result=await db.runTransaction(async tx=>{
    const [issue,prior]=await Promise.all([tx.get(issueRef),tx.get(verificationRef)]);
    if(!issue.exists) throw Object.assign(new Error('Issue not found'),{status:404});
    if(prior.exists) return {alreadyVerified:true,supporterCount:issue.data()?.supporterCount??0,reporterId:issue.data()?.reporterId};
    const next=(issue.data()?.supporterCount??0)+1, status=next>=3&&issue.data()?.status==='Reported'?'Verified':issue.data()?.status;
    tx.create(verificationRef,{uid,evidence:evidence??null,createdAt:Timestamp.now()});
    tx.update(issueRef,{supporterCount:next,status,updatedAt:Timestamp.now()});
    tx.create(issueRef.collection('events').doc(),{type:'VERIFIED',actorId:uid,at:Timestamp.now(),detail:{evidence:evidence??null}});
    tx.update(db.collection('users').doc(uid),{verificationsCount:FieldValue.increment(1),points:FieldValue.increment(20),updatedAt:Timestamp.now()});
    return {alreadyVerified:false,supporterCount:next,status,reporterId:issue.data()?.reporterId};
  });
  if(!result.alreadyVerified&&result.reporterId&&result.reporterId!==uid)await notifyUser(result.reporterId,{type:'VERIFICATION',title:'A neighbour verified your report',body:'Community confidence increased and the responsible team was notified.',issueId});
  return result;
}
