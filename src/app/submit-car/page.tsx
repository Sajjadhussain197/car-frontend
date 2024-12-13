'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SubmitCarPage() {
  const [carModel, setCarModel] = useState('')
  const [price, setPrice] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [maxPictures, setMaxPictures] = useState('')
  const [pictures, setPictures] = useState<File[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (carModel.length < 3) {
      setError('Car model must be at least 3 characters long')
      return
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      setError('Price must be a positive number')
      return
    }

    if (phoneNumber.length !== 11 || isNaN(Number(phoneNumber))) {
      setError('Phone number must be exactly 11 digits')
      return
    }

    const maxPicturesNum = Number(maxPictures)
    if (isNaN(maxPicturesNum) || maxPicturesNum < 1 || maxPicturesNum > 10) {
      setError('Max number of pictures must be between 1 and 10')
      return
    }

    if (pictures.length > maxPicturesNum) {
      setError(`You can only upload up to ${maxPicturesNum} pictures`)
      return
    }

    const formData = new FormData()
    formData.append('carModel', carModel)
    formData.append('price', price)
    formData.append('phoneNumber', phoneNumber)
    formData.append('maxPictures', maxPictures)
    pictures.forEach((pic, index) => {
      formData.append(`picture-${index}`, pic)
    })

    try {
      const response = await fetch('/api/submit-car', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setSuccess(true)
        // Reset form
        setCarModel('')
        setPrice('')
        setPhoneNumber('')
        setMaxPictures('')
        setPictures([])
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to submit car')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPictures(Array.from(e.target.files))
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center ">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Submit a Car</CardTitle>
          <CardDescription>Enter the details of the car you want to sell.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="carModel">Car Model</Label>
                <Input
                  id="carModel"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="maxPictures">Max Number of Pictures</Label>
                <Input
                  id="maxPictures"
                  type="number"
                  min="1"
                  max="10"
                  value={maxPictures}
                  onChange={(e) => setMaxPictures(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="pictures">Upload Pictures</Label>
                <Input
                  id="pictures"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <Button className="w-full mt-4" type="submit">Submit Car</Button>
          </form>
        </CardContent>
        <CardFooter>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Your car has been submitted successfully!</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

