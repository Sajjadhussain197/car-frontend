'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">Car Selling Service</Link>
        <div className="space-x-4">
          <Link href="/cars" passHref>
            <Button variant={pathname === '/cars' ? 'secondary' : 'ghost'}>Browse Cars</Button>
          </Link>
          <Link href="/submit-car" passHref>
            <Button variant={pathname === '/submit-car' ? 'secondary' : 'ghost'}>Sell a Car</Button>
          </Link>
          <Link href="/login" passHref>
            <Button variant={pathname === '/login' ? 'secondary' : 'ghost'}>Login</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

