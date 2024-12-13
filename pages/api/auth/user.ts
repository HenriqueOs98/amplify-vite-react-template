import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from '@/src/lib/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const user = await getSession(req, res)
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(401).json({ message: 'Not authenticated' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

