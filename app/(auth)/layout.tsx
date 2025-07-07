import type { PropsWithChildren } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { AuthButton } from '@/features/auth/components/auth-button'

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.svg" alt="Logo" height={56} width={152} />
          </Link>

          <AuthButton />
        </nav>
        <div className="flex flex-col items-center justify-center p-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  )
}

export default AuthLayout
