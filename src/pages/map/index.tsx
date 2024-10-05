"use client"

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { MapPin, Crosshair } from 'lucide-react'

// Dinamically import MapContainer to avoid server-side rendering
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false })
const useMap = dynamic(() => import('react-leaflet').then((mod) => mod.useMap), { ssr: false })
const useMapEvents = dynamic(() => import('react-leaflet').then((mod) => mod.useMapEvents), { ssr: false })
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Custom pin icon
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

// Component to handle map clicks
function MapClickHandler({ onLocationChange }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng);
    },
  });
  return null;
}

// This component will update the map view when coordinates change
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function LandsatComparison() {
  const [targetLocation, setTargetLocation] = useState({ lat: 25.7617, lng: -80.1918 }) // Miami coordinates
  const [locationName, setLocationName] = useState('')
  const [landsatData, setLandsatData] = useState(null)
  const [isDropPinMode, setIsDropPinMode] = useState(false)
  const mapRef = useRef(null)

  const handleSetLocation = async (e) => {
    e.preventDefault()
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

  const handleDropPin = () => {
    setIsDropPinMode(!isDropPinMode)
  }

  const handleMapClick = (latlng) => {
    if (isDropPinMode) {
      setTargetLocation(latlng)
      setIsDropPinMode(false)
      console.log(`Dropped pin at Latitude: ${latlng.lat}, Longitude: ${latlng.lng}`)
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

  return (
    <div className="container mx-auto p-4 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-pink-500">Inter Miami Landsat Comparison Tool</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-pink-500 border">
          <CardHeader>
            <CardTitle className="text-pink-500">Set Target Location</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSetLocation} className="space-y-4">
              <Input 
                type="text" 
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Enter location name" 
                required 
                className="bg-gray-800 text-white border-pink-500" 
              />
              <Button type="submit" className="bg-pink-500 text-white hover:bg-pink-600">Set Location</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-pink-500 border">
          <CardHeader>
            <CardTitle className="text-pink-500">Location Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleDropPin} className={`bg-pink-500 text-white hover:bg-pink-600 ${isDropPinMode ? 'ring-2 ring-white' : ''}`}>
              <MapPin className="mr-2 h-4 w-4" />
              {isDropPinMode ? 'Cancel Drop Pin' : 'Drop Pin on Map'}
            </Button>
            <Button onClick={getUserLocation} className="bg-pink-500 text-white hover:bg-pink-600">
              <Crosshair className="mr-2 h-4 w-4" />
              Use My Location
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-gray-900 border-pink-500 border">
          <CardHeader>
            <CardTitle className="text-pink-500">Map View</CardTitle>
          </CardHeader>
          <CardContent>
            {typeof window !== 'undefined' ? (
              <MapContainer center={[targetLocation.lat, targetLocation.lng]} zoom={13} style={{ height: '400px' }} ref={mapRef}>
                <ChangeView center={[targetLocation.lat, targetLocation.lng]} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[targetLocation.lat, targetLocation.lng]} icon={customPinIcon}>
                  <Popup>
                    Target Location <br />
                    Lat: {targetLocation.lat.toFixed(4)}, Lng: {targetLocation.lng.toFixed(4)}
                  </Popup>
                </Marker>
                <MapClickHandler onLocationChange={handleMapClick} />
              </MapContainer>
            ) : (
              <p>Loading map...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
