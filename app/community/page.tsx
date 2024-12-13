import { Metadata } from 'next'
import { CommunityContent } from './community_ui'
import { cookies } from 'next/headers'
import { db } from '@/src/db'

export const metadata: Metadata = {
  title: 'Community | NeoCode Nexus Hub',
  description: 'Connect with other learners in the NeoCode Nexus community',
}

export default async function CommunityPage() {
  const cookieStore = cookies()
  const user = await db.getUser(cookieStore)

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">NeoCode Nexus Community</h1>
        <p>Please log in to access the community features.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">NeoCode Nexus Community</h1>
      <CommunityContent userId={user.id} />
    </div>
  )
}

