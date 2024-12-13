import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center ">
      <h1 className="text-4xl font-bold mb-6">Welcome to Car Selling Service</h1>
      <p className="text-xl mb-8">Find your dream car or sell your vehicle with ease.</p>
      <div className="space-x-4">
        <Link href="/cars" passHref>
          <Button size="lg">Browse Cars</Button>
        </Link>
        <Link href="/submit-car" passHref>
          <Button size="lg" variant="outline">Sell Your Car</Button>
        </Link>
      </div>
    </div>
  )
}

