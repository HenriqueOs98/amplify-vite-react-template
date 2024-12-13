import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    db.logout();
    res.setHeader('Set-Cookie', 'pb_auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    res.status(200).json({ message: 'Logged out successfully' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

