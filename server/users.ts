import { Timestamp } from 'firebase-admin/firestore';
import { db } from './firebase.js';

export type UserProfile = {
  uid: string; displayName: string; initials: string; neighbourhood: string; city: string; wardId: string;
  points: number; level: number; streak: number; notificationsEnabled: boolean; language: string;
  reportsCount: number; verificationsCount: number; rewardsClaimed: string[];
};

const defaults = (uid:string):UserProfile => ({
  uid, displayName:'Srijan Jaiswal', initials:'SJ', neighbourhood:'Indiranagar', city:'Bengaluru', wardId:'80',
  points:2480, level:8, streak:12, notificationsEnabled:true, language:'English', reportsCount:0,
  verificationsCount:0, rewardsClaimed:[]
});

export async function ensureUser(uid:string):Promise<UserProfile>{
  const ref=db.collection('users').doc(uid), snap=await ref.get();
  if(snap.exists)return { ...defaults(uid), ...snap.data(), uid } as UserProfile;
  const profile=defaults(uid), now=Timestamp.now();
  await db.runTransaction(async tx=>{
    const current=await tx.get(ref); if(current.exists)return;
    tx.create(ref,{...profile,createdAt:now,updatedAt:now});
    tx.create(ref.collection('notifications').doc(),{type:'WELCOME',title:'Welcome to Kintsugi',body:'Your civic dashboard is ready. Report or verify an issue to begin.',read:false,createdAt:now});
  });
  return profile;
}

export async function notifyUser(uid:string,input:{type:string;title:string;body:string;issueId?:string}){
  await db.collection('users').doc(uid).collection('notifications').add({...input,read:false,createdAt:Timestamp.now()});
}

export const rewardCatalog={
  'metro-pass':{title:'One-day metro pass',cost:1200},
  'tree-kit':{title:'Native tree planting kit',cost:800},
  'cafe-credit':{title:'Neighbourhood café credit',cost:500}
} as const;
