import { ensureSession } from './firebase';

const base = import.meta.env.VITE_API_BASE_URL ?? '';
const publicChatBase = import.meta.env.VITE_PUBLIC_API_BASE_URL ?? 'https://kintsugi-473996237757.asia-south1.run.app';

async function request<T>(path:string, init:RequestInit={}):Promise<T>{
  const user=await ensureSession(), token=await user.getIdToken(),controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  let response:Response;
  try { response=await fetch(`${base}${path}`,{...init,signal:controller.signal,headers:{Authorization:`Bearer ${token}`,...(!(init.body instanceof FormData)?{'Content-Type':'application/json'}:{}),...init.headers}}); }
  catch(error){ throw new Error(error instanceof DOMException&&error.name==='AbortError'?'Service timed out. Check that the API and Firebase emulators are running.':'Cannot reach Kintsugi services. Start the API and Firebase emulators, then retry.'); }
  finally { clearTimeout(timer); }
  const body=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(body.error??`Request failed (${response.status})`);
  return body as T;
}

async function requestPublic<T>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 15000);
  let response: Response;
  try {
    response = await fetch(`${publicChatBase}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        ...(!(init.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers
      }
    });
  } catch (error) {
    throw new Error(error instanceof DOMException && error.name === 'AbortError' ? 'Service timed out.' : 'Cannot reach Kintsugi services.');
  } finally {
    clearTimeout(timer);
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error ?? `Request failed (${response.status})`);
  return body as T;
}

export const api={
  health:async()=>{const response=await fetch(`${base}/api/health`);if(!response.ok)throw new Error('API unavailable');return response.json() as Promise<{ok:boolean}>},
  issues:(wardId:string)=>request<{items:any[]}>(`/api/issues?wardId=${encodeURIComponent(wardId)}`),
  createIssue:(form:FormData)=>request<{issue:any;merged:boolean}>('/api/issues',{method:'POST',body:form}),
  verifyIssue:(id:string,evidence?:string)=>request<{supporterCount:number;status?:string}>(`/api/issues/${id}/verify`,{method:'POST',body:JSON.stringify({evidence})}),
  updateStatus:(id:string,status:string,note:string)=>request<{ok:true}>(`/api/issues/${id}/status`,{method:'PATCH',body:JSON.stringify({status,note})}),
  chat:(message:string,context?:unknown[])=>request<{answer:string}>('/api/ai/chat',{method:'POST',body:JSON.stringify({message,context})}),
  chatPublic:(message:string,context?:unknown[])=>requestPublic<{answer:string}>('/api/ai/chat-public',{method:'POST',body:JSON.stringify({message,context})}),
  profile:()=>request<{profile:any}>('/api/me'),
  updateProfile:(input:Record<string,unknown>)=>request<{profile:any}>('/api/me',{method:'PATCH',body:JSON.stringify(input)}),
  notifications:()=>request<{items:any[]}>('/api/notifications'),
  readNotification:(id:string)=>request<{ok:true}>(`/api/notifications/${id}/read`,{method:'POST',body:'{}'}),
  readAllNotifications:()=>request<{updated:number}>('/api/notifications/read-all',{method:'POST',body:'{}'}),
  claimReward:(rewardId:string)=>request<{points:number;reward:any}>('/api/rewards/claim',{method:'POST',body:JSON.stringify({rewardId})})
};
