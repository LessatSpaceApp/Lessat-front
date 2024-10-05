"use client"

import { useState,useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Crosshair, Search, MapPin } from 'lucide-react'
import { useGeolocation } from '@uidotdev/usehooks'

// This component will update the map view when coordinates change
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

// Component to handle map clicks
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

export default function LandsatComparison() {
  const [targetLocation, setTargetLocation] = useState({ lat: 25.7617, lng: -80.1918 }) // Miami coordinates
  const [locationName, setLocationName] = useState('')
  const [isDropPinMode, setIsDropPinMode] = useState(false)

  // Use useGeolocation hook to get user's current location
  const geolocation = useGeolocation();

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

  const handleUserLocation = () => {
    if (geolocation.latitude && geolocation.longitude) {
      setTargetLocation({
        lat: geolocation.latitude,
        lng: geolocation.longitude
      })
      console.log(`User's location: Latitude: ${geolocation.latitude}, Longitude: ${geolocation.longitude}`)
    } else if (geolocation.error) {
      console.error('Error getting user location:', geolocation.error)
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

  return (
    <div className="relative h-screen w-full">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] flex items-center space-x-2 bg-white bg-opacity-90 p-3 rounded-lg shadow-lg">
        <form onSubmit={handleSetLocation} className="flex items-center space-x-2">
          <Input 
            type="text" 
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="Enter location name" 
            required 
            className="bg-white text-black border-pink-500 w-64 h-10" 
          />
          <Button type="submit" className="bg-pink-500 text-white hover:bg-pink-600 h-10 px-4">
            <Search className="h-5 w-5" />
          </Button>
        </form>
        <Button onClick={handleUserLocation} className="bg-pink-500 text-white hover:bg-pink-600 h-10 px-4">
          <Crosshair className="h-5 w-5" />
        </Button>
        <Button 
          onClick={toggleDropPinMode} 
          className={`bg-pink-500 text-white hover:bg-pink-600 h-10 px-4 ${isDropPinMode ? 'ring-2 ring-white' : ''}`}
        >
          <MapPin className="h-5 w-5" />
        </Button>
      </div>
      
      <MapContainer center={[targetLocation.lat, targetLocation.lng]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
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
  )
}
