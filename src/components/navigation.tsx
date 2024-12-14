'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-blue-600 text-white p-4 relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">Car Selling Service</Link>
        <button className="md:hidden" onClick={toggleMenu}>
          <span className="text-2xl">☰</span>
        </button>
        <div className={`absolute right-0 top-14 mt-2 w-full max-w-xs bg-white text-black rounded-md 
          shadow-lg z-[1000] ${isMenuOpen ? 'block' : 'hidden'} md:flex 
          md:static md:bg-transparent md:text-white md:shadow-none md:space-x-4 flex flex-col md:flex-row`}>
          <Link href="/cars" passHref>
            <Button className="w-full md:w-auto hover:bg-blue-500" variant={pathname === '/cars' ? 'secondary' : 'ghost'}>Browse Cars</Button>
          </Link>
          <Link href="/submit-car" passHref>
            <Button className="w-full md:w-auto hover:bg-blue-500" variant={pathname === '/submit-car' ? 'secondary' : 'ghost'}>Sell a Car</Button>
          </Link>
          {session ? (
            <Button className="w-full md:w-auto hover:bg-blue-500" variant="ghost" onClick={() => signOut()}>Logout</Button>
          ) : (
            <Link href="/login" passHref>
              <Button className="w-full md:w-auto hover:bg-blue-500" variant={pathname === '/login' ? 'secondary' : 'ghost'}>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

