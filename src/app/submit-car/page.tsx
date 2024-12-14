'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSession } from 'next-auth/react'
import { ArrowLeft, CloudCog, TrashIcon, UploadCloud, UploadCloudIcon } from 'lucide-react'

export default function SubmitCarPage() {
  const [carModel, setCarModel] = useState('')
  const [price, setPrice] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [maxPictures, setMaxPictures] = useState('')
  const [pictures, setPictures] = useState<File[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [city, setCity] = useState('Lahore')
  const router = useRouter()
  const { data: session } = useSession()

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

    const token = session?.accessToken
    console.log(phoneNumber,pictures,phoneNumber,maxPictures)
    const formData = new FormData()
    formData.append('carModel', carModel)
    formData.append('price', price)
    formData.append('phoneNumber', phoneNumber)
    formData.append('maxPictures', maxPictures  || '10')
    formData.append('city', city)
    formData.append('maxPictures', maxPictures)
    pictures.forEach((pic, index) => {
      formData.append('pictures', pic)
    })
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/create`, {
          method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
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
      const newPictures = Array.from(e.target.files);
      if (pictures.length + newPictures.length <= Number(maxPictures)) {
        setPictures([...pictures, ...newPictures]);
      } else {
        setError(`You can only upload up to ${maxPictures} pictures`);
      }
    }
  };

  const handleDeletePicture = (index: number) => {
    setPictures(pictures.filter((_, i) => i !== index));
  };

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
                <Select onValueChange={setMaxPictures} value={maxPictures}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(10)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label>City</Label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="city"
                      value="Lahore"
                      checked={city === 'Lahore'}
                      onChange={() => setCity('Lahore')}
                      className="mr-2"
                    />
                    Lahore
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="city"
                      value="Karachi"
                      checked={city === 'Karachi'}
                      onChange={() => setCity('Karachi')}
                      className="mr-2"
                    />
                    Karachi
                  </label>
                </div>
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="pictures">Upload Pictures</Label>
                <div className="flex space-x-2">
                  {pictures.length === 0 && (
                    <div className="w-20 h-20 border-dashed border-2 border-gray-300 flex items-center justify-center">
                      <Input
                        id="pictures"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute opacity-0 w-full h-full"
                      />
                      <UploadCloudIcon />
                    </div>
                  )}
                  {pictures.map((pic, index) => (
                    <div key={index} className="relative">
                      <img src={URL.createObjectURL(pic)} alt={`Picture ${index + 1}`} className="w-20 h-20 object-cover" />
                      <button
                        type="button"
                        onClick={() => handleDeletePicture(index)}
                        className="absolute top-0 right-0 text-white 
                        rounded-full p-1"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                  {pictures.length > 0 && pictures.length < Number(maxPictures) && (
                    <div className="w-20 h-20 border-dashed border-2 border-gray-300 flex items-center justify-center">
                      <Input
                        id="pictures"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute opacity-0 w-full h-full"
                      />
                      <UploadCloud className="w-6 h-6" />
                    </div>
                  )}
                </div>
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

