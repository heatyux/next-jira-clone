'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'

export const AuthButton = () => {
  const pathanme = usePathname()
  const isSignIn = pathanme === '/sign-in'

  return (
    <Button variant="secondary" asChild>
      <Link href={isSignIn ? '/sign-up' : '/sign-in'}>
        {isSignIn ? 'Sign Up' : 'Sign In'}
      </Link>
    </Button>
  )
}
