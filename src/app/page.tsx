"use client"

import { Button } from "@/components/ui/button"
import { useSession,  signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center ">
      <h1 className="text-4xl font-bold mb-6">Welcome to Car Selling Service</h1>
      <p className="text-xl mb-8">Find your dream car or sell your vehicle with ease.</p>
      <div className="space-x-4">
        {session?.accessToken ? (
          <Button className="bg-red-500 text-white hover:bg-red-600" size="lg" onClick={() => signOut()}>Logout</Button>
        ) : (
          <Button className="bg-blue-500 text-white hover:bg-blue-600" size="lg" onClick={() => router.push('/login')}>Login</Button>
        )}
      </div>
    </div>
  )
}

