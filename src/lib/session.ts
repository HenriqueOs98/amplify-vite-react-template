import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/db'

export async function getSession(req: NextApiRequest, res: NextApiResponse) {
  const authStore = db.getAuthStore();
  authStore.loadFromCookie(req.headers.cookie || '');
  
  if (authStore.isValid) {
    return authStore.model;
  }
  
  return null;
}

export async function setSession(res: NextApiResponse, authData: any) {
  res.setHeader('Set-Cookie', db.getAuthStore().exportToCookie({ httpOnly: false }));
}

export async function clearSession(res: NextApiResponse) {
  db.logout();
  res.setHeader('Set-Cookie', db.getAuthStore().exportToCookie({ httpOnly: false }));
}

