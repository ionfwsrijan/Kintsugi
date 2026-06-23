import type { NextFunction, Request, Response } from 'express';
import { auth } from './firebase.js';

export type AuthedRequest = Request & { user: { uid: string; role: string; wardIds: string[] } };

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    const decoded = await auth.verifyIdToken(token, true);
    (req as AuthedRequest).user = {
      uid: decoded.uid,
      role: String(decoded.role ?? 'citizen'),
      wardIds: Array.isArray(decoded.wardIds) ? decoded.wardIds.map(String) : []
    };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as AuthedRequest).user.role)) return res.status(403).json({ error: 'Insufficient permissions' });
    next();
  };
}

export function asyncRoute(fn: (req: Request, res: Response) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => void fn(req, res).catch(next);
}
