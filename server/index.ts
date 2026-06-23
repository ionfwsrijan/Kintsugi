import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'node:path';
import { Timestamp } from 'firebase-admin/firestore';
import { allowedOrigins, env } from './config.js';
import { db } from './firebase.js';
import { asyncRoute, requireAuth, requireRole, type AuthedRequest } from './middleware.js';
import { chatSchema, issueInputSchema, profileSchema, rewardSchema, statusSchema, verifySchema } from './schemas.js';
import { createIssue, verifyIssue } from './issues.js';
import { civicAnswer } from './ai.js';
import type { IssueRecord } from './types.js';
import { ensureUser, rewardCatalog } from './users.js';

const app=express();
app.set('trust proxy',1); app.use(helmet()); app.use(cors({origin:allowedOrigins,credentials:true})); app.use(express.json({limit:'256kb'}));
app.use('/api',rateLimit({windowMs:60_000,limit:100,standardHeaders:'draft-8',legacyHeaders:false}));
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:15*1024*1024,files:1},fileFilter:(_r,f,cb)=>cb(null,/^(image|video)\//.test(f.mimetype))});

app.get('/api/health',(_req,res)=>res.json({ok:true,service:'kintsugi-api'}));
app.get('/api/me',requireAuth,asyncRoute(async(req,res)=>res.json({profile:await ensureUser((req as AuthedRequest).user.uid)})));
app.patch('/api/me',requireAuth,asyncRoute(async(req,res)=>{
  const uid=(req as AuthedRequest).user.uid,input=profileSchema.parse(req.body),ref=db.collection('users').doc(uid);
  await ensureUser(uid); const initials=input.displayName?input.displayName.split(/\s+/).slice(0,2).map(v=>v[0]).join('').toUpperCase():undefined;
  await ref.update({...input,...(initials?{initials}:{}),updatedAt:Timestamp.now()});
  res.json({profile:await ensureUser(uid)});
}));
app.get('/api/notifications',requireAuth,asyncRoute(async(req,res)=>{
  const uid=(req as AuthedRequest).user.uid; await ensureUser(uid);
  const snap=await db.collection('users').doc(uid).collection('notifications').orderBy('createdAt','desc').limit(30).get();
  res.json({items:snap.docs.map(d=>({id:d.id,...d.data(),createdAt:d.data().createdAt?.toDate?.().toISOString()}))});
}));
app.post('/api/notifications/read-all',requireAuth,asyncRoute(async(req,res)=>{
  const uid=(req as AuthedRequest).user.uid,snap=await db.collection('users').doc(uid).collection('notifications').where('read','==',false).limit(100).get(),batch=db.batch();
  snap.docs.forEach(doc=>batch.update(doc.ref,{read:true,readAt:Timestamp.now()}));await batch.commit();res.json({updated:snap.size});
}));
app.post('/api/notifications/:id/read',requireAuth,asyncRoute(async(req,res)=>{
  await db.collection('users').doc((req as AuthedRequest).user.uid).collection('notifications').doc(String(req.params.id)).set({read:true,readAt:Timestamp.now()},{merge:true});res.json({ok:true});
}));
app.post('/api/rewards/claim',requireAuth,asyncRoute(async(req,res)=>{
  const uid=(req as AuthedRequest).user.uid,{rewardId}=rewardSchema.parse(req.body),reward=rewardCatalog[rewardId],ref=db.collection('users').doc(uid);
  await ensureUser(uid);const result=await db.runTransaction(async tx=>{const snap=await tx.get(ref),data=snap.data()!;if((data.rewardsClaimed??[]).includes(rewardId))throw Object.assign(new Error('Reward already claimed'),{status:409});if((data.points??0)<reward.cost)throw Object.assign(new Error('Not enough civic points'),{status:400});const points=data.points-reward.cost;tx.update(ref,{points,rewardsClaimed:[...(data.rewardsClaimed??[]),rewardId],updatedAt:Timestamp.now()});tx.create(ref.collection('notifications').doc(),{type:'REWARD',title:'Reward unlocked',body:`${reward.title} has been added to your profile.`,read:false,createdAt:Timestamp.now()});return{points,reward:{id:rewardId,...reward}}});res.json(result);
}));
app.get('/api/issues',requireAuth,asyncRoute(async(req,res)=>{
  const wardId=String(req.query.wardId??''); if(!wardId)return res.status(400).json({error:'wardId is required'});
  const snap=await db.collection('issues').where('wardId','==',wardId).orderBy('createdAt','desc').limit(100).get();
  res.json({items:snap.docs.map(d=>({id:d.id,...d.data(),createdAt:d.data().createdAt?.toDate?.().toISOString(),updatedAt:d.data().updatedAt?.toDate?.().toISOString(),slaDueAt:d.data().slaDueAt?.toDate?.().toISOString()}))});
}));
app.post('/api/issues',requireAuth,upload.single('media'),asyncRoute(async(req,res)=>{
  if(!req.file)return res.status(400).json({error:'Photo or video evidence is required'});
  const input=issueInputSchema.parse(req.body), result=await createIssue(input,req.file,(req as AuthedRequest).user.uid); res.status(result.merged?200:201).json(result);
}));
app.post('/api/issues/:id/verify',requireAuth,asyncRoute(async(req,res)=>res.json(await verifyIssue(String(req.params.id), (req as AuthedRequest).user.uid, verifySchema.parse(req.body).evidence))));
app.patch('/api/issues/:id/status',requireAuth,requireRole('authority','admin'),asyncRoute(async(req,res)=>{
  const input=statusSchema.parse(req.body), user=(req as AuthedRequest).user, ref=db.collection('issues').doc(String(req.params.id));
  await db.runTransaction(async tx=>{const issue=await tx.get(ref);if(!issue.exists)throw Object.assign(new Error('Issue not found'),{status:404});if(user.role!=='admin'&&!user.wardIds.includes(issue.data()?.wardId))throw Object.assign(new Error('Outside assigned ward'),{status:403});tx.update(ref,{status:input.status,updatedAt:Timestamp.now()});tx.create(ref.collection('events').doc(),{type:'STATUS_CHANGED',actorId:user.uid,at:Timestamp.now(),detail:input});});
  res.json({ok:true});
}));
app.post('/api/ai/chat',requireAuth,asyncRoute(async(req,res)=>{const input=chatSchema.parse(req.body);const snap=await db.collection('issues').where('status','in',['Reported','Verified','Assigned','In progress']).limit(30).get();res.json({answer:await civicAnswer(input.message,snap.docs.map(d=>({id:d.id,...d.data()} as IssueRecord)))});}));
app.post('/api/ai/chat-public',asyncRoute(async(req,res)=>{const input=chatSchema.parse(req.body);const snap=await db.collection('issues').where('status','in',['Reported','Verified','Assigned','In progress']).limit(30).get();res.json({answer:await civicAnswer(input.message,snap.docs.map(d=>({id:d.id,...d.data()} as IssueRecord)))});}));
app.post('/internal/agents/sla',asyncRoute(async(req,res)=>{if(req.headers['x-agent-secret']!==env.INTERNAL_AGENT_SECRET)return res.status(401).json({error:'Unauthorized'});const snap=await db.collection('issues').where('status','in',['Reported','Verified','Assigned','In progress']).where('slaDueAt','<=',Timestamp.now()).limit(200).get();const batch=db.batch();snap.docs.forEach(doc=>{batch.update(doc.ref,{escalated:true,updatedAt:Timestamp.now()});batch.create(doc.ref.collection('events').doc(),{type:'SLA_ESCALATED',actorId:'system:sla-agent',at:Timestamp.now(),detail:{}})});await batch.commit();res.json({escalated:snap.size});}));
if(env.NODE_ENV==='production'){
  const dist=path.resolve(process.cwd(),'dist');
  app.use(express.static(dist,{maxAge:'1y',immutable:true,index:false}));
  app.get('*',(_req,res)=>res.sendFile(path.join(dist,'index.html')));
}
app.use((err:any,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{console.error(err);res.status(err.status??(err.name==='ZodError'?400:500)).json({error:err.status?err.message:'Request failed',details:err.name==='ZodError'?err.issues:undefined});});
app.listen(env.PORT,()=>console.log(`Kintsugi API listening on ${env.PORT}`));
