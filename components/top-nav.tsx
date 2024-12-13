'use client'

import Link from "next/link"
import Image from "next/image"
import { LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import ThemeToggle from "./theme-toggle"
import { useAuth } from "@/src/hooks/useAuth"

export default function TopNav() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading indicator
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 h-12 border-b border-gray-800 bg-background cyberpunk-border cyberpunk-bg">
      <div className="max-w-screen-2xl mx-auto px-4 flex items-center justify-between h-full">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/placeholder.svg" alt="NeoCode Nexus" width={32} height={32} />
            <span className="font-orbitron font-orbitron-bold text-primary text-lg cyberpunk-glow">NeoCode Nexus</span>
            <span className="text-secondary font-orbitron font-orbitron-semibold text-sm">Hub</span>
          </Link>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <span>JavaScript</span>
            <span>/</span>
            <span>The Console</span>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-primary transition-colors font-orbitron font-orbitron-medium"
            onClick={() => router.push('/courses')}
          >
            Learn
          </Button>
          <Link href="/practice" className="text-muted-foreground hover:text-primary transition-colors font-orbitron font-orbitron-medium">
            Practice
          </Link>
          <Link href="/build" className="text-muted-foreground hover:text-primary transition-colors font-orbitron font-orbitron-medium">
            Build
          </Link>
          <Link href="/community" className="text-muted-foreground hover:text-primary transition-colors font-orbitron font-orbitron-medium">
            Community
          </Link>
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">{user.email[0].toUpperCase()}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="font-orbitron">
                  <span>{user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login" className="text-muted-foreground hover:text-primary transition-colors font-orbitron font-orbitron-medium">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

