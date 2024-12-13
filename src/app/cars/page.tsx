import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from 'next/image'

async function getCars() {
  // In a real application, this would fetch from your API
  return [
    { id: 1, model: 'Toyota Camry', price: 25000, phoneNumber: '12345678901', images: ['/cars/car1.svg'] },
    { id: 2, model: 'Honda Civic', price: 22000, phoneNumber: '09876543210', images: ['/cars/car1.svg'] },
    // Add more mock data as needed
  ]
}

export default async function CarsPage() {
  const cars = await getCars()

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cars.map((car) => (
        <Card key={car.id}>
          <CardHeader>
            <CardTitle>{car.model}</CardTitle>
            <CardDescription>Price: ${car.price}</CardDescription>
          </CardHeader>
          <CardContent>
            <Image src={car.images[0]} alt={car.model} width={300} height={200} className="w-full h-48 object-cover" />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">View Details</Button>
            <Button>Contact Seller</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

