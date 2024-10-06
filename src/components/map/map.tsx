"use client"

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Crosshair, Search, MapPin, Bell, X, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

function MapClickHandler({ onLocationChange, isDropPinMode }) {
  useMapEvents({
    click(e) {
      if (isDropPinMode) {
        onLocationChange(e.latlng);
      }
    },
  });
  return null;
}

const customPinIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F3A7BD" width="36px" height="36px">
      <path d="M12 0C7.31 0 3.5 3.81 3.5 8.5c0 5.94 8.5 15.5 8.5 15.5s8.5-9.56 8.5-15.5C20.5 3.81 16.69 0 12 0zm0 13c-2.48 0-4.5-2.02-4.5-4.5S9.52 4 12 4s4.5 2.02 4.5 4.5S14.48 13 12 13z"/>
    </svg>
  `),
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
})

export default function LandsatComparison() {
  const [targetLocation, setTargetLocation] = useState({ lat: 25.7617, lng: -80.1918 })
  const [locationName, setLocationName] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [isDropPinMode, setIsDropPinMode] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [dates, setDates] = useState([])
  const [isDateModalOpen, setIsDateModalOpen] = useState(false)
  const [showError, setShowError] = useState(false) // Estado para la alerta de error
  const [errorMessage, setErrorMessage] = useState('') // Mensaje de error dinámico
  const [showSuccess, setShowSuccess] = useState(false) // Estado para la alerta de éxito

  const handleSetLocation = async (e) => {
    e.preventDefault()
    if (latitude && longitude) {
      const lat = parseFloat(latitude)
      const lng = parseFloat(longitude)
      if (!isNaN(lat) && !isNaN(lng)) {
        setTargetLocation({ lat, lng })
        console.log(`Set location to Latitude: ${lat}, Longitude: ${lng}`)
      } else {
        console.log('Invalid coordinates')
      }
    } else if (locationName) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`)
        const data = await response.json()
        if (data && data.length > 0) {
          const { lat, lon } = data[0]
          const newLocation = { lat: parseFloat(lat), lng: parseFloat(lon) }
          setTargetLocation(newLocation)
          console.log(`Latitude: ${newLocation.lat}, Longitude: ${newLocation.lng}`)
        } else {
          console.log('Location not found')
        }
      } catch (error) {
        console.error('Error fetching location:', error)
      }
    }
  }

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        setTargetLocation({ lat: latitude, lng: longitude })
        console.log(`User's location: Latitude: ${latitude}, Longitude: ${longitude}`)
      }, (error) => {
        console.error('Error getting user location:', error)
      })
    } else {
      console.log('Geolocation is not available in this browser')
    }
  }

  const toggleDropPinMode = () => {
    setIsDropPinMode(!isDropPinMode)
  }

  const handleMapClick = (latlng) => {
    if (isDropPinMode) {
      setTargetLocation(latlng)
      setIsDropPinMode(false)
      console.log(`Dropped pin at Latitude: ${latlng.lat}, Longitude: ${latlng.lng}`)
    }
  }

  const handleDateSubmit = (e) => {
    e.preventDefault()
    const newDate = new Date(`${selectedDate}T${selectedTime}`)
    setDates([...dates, newDate])
    setSelectedDate('')
    setSelectedTime('')
  }

  const removeDate = (index) => {
    setDates(dates.filter((_, i) => i !== index))
  }

  // Function to handle sending all data as JSON
  const handleSendData = () => {
    const hasCoordinates = targetLocation.lat && targetLocation.lng;
    const hasDates = dates.length > 0;

    if (!hasCoordinates || !hasDates) {
      setErrorMessage('Debe proporcionar una ubicación y al menos una fecha.');
      setShowError(true);
      return;
    }

    const data = {
      targetLocation,
      dates: dates.map(date => format(date, 'yyyy-MM-dd HH:mm')),
    }

    console.log('Sending data as JSON:', JSON.stringify(data, null, 2));
    setShowError(false); // Ocultar alerta de error si es que se estaba mostrando
    setShowSuccess(true); // Mostrar la alerta de éxito
  }

  return (
    <div className="flex h-screen">
      <div className="w-2/3 relative">
        <MapContainer center={[targetLocation.lat, targetLocation.lng]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false} className="relative z-10">
          <ChangeView center={[targetLocation.lat, targetLocation.lng]} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[targetLocation.lat, targetLocation.lng]} icon={customPinIcon}>
            <Popup>
              Target Location <br />
              Lat: {targetLocation.lat.toFixed(4)}, Lng: {targetLocation.lng.toFixed(4)}
            </Popup>
          </Marker>
          <MapClickHandler onLocationChange={handleMapClick} isDropPinMode={isDropPinMode} />
        </MapContainer>
      </div>
      <div className="w-1/3 bg-white p-4 overflow-y-auto flex flex-col space-y-4">
        {showError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        {showSuccess && (
          <Alert variant="success">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Datos Enviados</AlertTitle>
            <AlertDescription>
              Los datos han sido enviados exitosamente.
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSetLocation} className="space-y-2">
          <Input 
            type="text" 
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="Enter location name" 
            className="bg-white text-black border-pink-500" 
          />
          <h2 className="text-2xl font-bold text-center mb-4 text-pink-500">Or</h2>
          <div className="flex space-x-2">
            <Input 
              type="text" 
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Latitude" 
              className="bg-white text-black border-pink-500 w-1/2" 
            />
            <Input 
              type="text" 
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Longitude" 
              className="bg-white text-black border-pink-500 w-1/2" 
            />
          </div>
          <div className="flex justify-between">
            <Button type="submit" className="w-full bg-pink-500 text-white">
              Set Location
            </Button>
          </div>
        </form>
        <div className="flex items-center space-x-2">
          <Button onClick={getUserLocation} className="bg-pink-500 text-white">
            Get Current Location
          </Button>
          <Button onClick={toggleDropPinMode} className={`bg-pink-500 text-white ${isDropPinMode ? 'bg-red-500' : ''}`}>
            {isDropPinMode ? <X className="mr-2" /> : <MapPin className="mr-2" />} {isDropPinMode ? 'Cancel Pin Drop' : 'Drop Pin'}
          </Button>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Dialog open={isDateModalOpen} onOpenChange={setIsDateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-pink-500 text-white w-full">Add Dates</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dates</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleDateSubmit}>
                  <div className="flex space-x-2">
                    <Input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-white text-black border-pink-500 w-1/2" 
                    />
                    <Input 
                      type="time" 
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="bg-white text-black border-pink-500 w-1/2" 
                    />
                  </div>
                  <Button type="submit" className="w-full bg-pink-500 text-white mt-2">
                    Add Date
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <ul>
              {dates.map((date, index) => (
                <li key={index} className="flex justify-between items-center border-b border-gray-300 py-1">
                  {format(date, 'yyyy-MM-dd HH:mm')}
                  <Button onClick={() => removeDate(index)} className="bg-pink-500 text-white hover:bg-red-600 p-1">
                  <X className="h-4 w-4" />
                </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Button onClick={handleSendData} className="w-full bg-pink-500 text-white">
          Send Data
        </Button>
      </div>
    </div>
  )
}

