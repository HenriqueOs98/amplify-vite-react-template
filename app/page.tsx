import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to NeoCode Nexus Hub</h1>
      <p className="text-xl mb-8">Your journey to mastering JavaScript starts here.</p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/courses">Start Learning</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/community">Join Community</Link>
        </Button>
      </div>
    </div>
  )
}

