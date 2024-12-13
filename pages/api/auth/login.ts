import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/db'
import { setSession } from '@/src/lib/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body
      const authData = await db.authenticate(email, password)
      await setSession(res, authData)
      res.status(200).json({ user: authData.record })
    } catch (error) {
      res.status(401).json({ message: 'Authentication failed' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

