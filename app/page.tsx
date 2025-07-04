'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { useCurrent } from '@/features/auth/api/use-current'
import { useLogout } from '@/features/auth/api/use-logout'

export default function Home() {
  const router = useRouter()
  const { data, isLoading } = useCurrent()
  const { mutate: logout } = useLogout()

  useEffect(() => {
    if (!data && !isLoading) {
      router.push('/sign-in')
    }
  }, [data, isLoading, router])

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <main>
      <p>Only visible to logged in users.</p>
      <Button onClick={() => logout()}>Log out</Button>
    </main>
  )
}
