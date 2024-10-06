"use client";

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle,
  Crosshair,
  Search,
  MapPin,
  Bell,
  X,
  SearchCheck,
} from "lucide-react";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

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
  iconUrl:
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF0000" width="36px" height="36px">
      <path d="M12 0C7.31 0 3.5 3.81 3.5 8.5c0 5.94 8.5 15.5 8.5 15.5s8.5-9.56 8.5-15.5C20.5 3.81 16.69 0 12 0zm0 13c-2.48 0-4.5-2.02-4.5-4.5S9.52 4 12 4s4.5 2.02 4.5 4.5S14.48 13 12 13z"/>
    </svg>
  `),
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

export default function LandsatComparison() {
  const [targetLocation, setTargetLocation] = useState({
    lat: 25.7617,
    lng: -80.1918,
  }); // Miami coordinates
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isDropPinMode, setIsDropPinMode] = useState(false);
  const [leadTime, setLeadTime] = useState(""); // lead time in days
  const [dates, setDates] = useState([]);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [landsatData, setLandsatData] = useState({
    landsat8: "",
    landsat9: "",
  });

  const handleSetLocation = async (e) => {
    e.preventDefault();
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setTargetLocation({ lat, lng });
        console.log(`Set location to Latitude: ${lat}, Longitude: ${lng}`);
      } else {
        console.log("Invalid coordinates");
      }
    } else if (locationName) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`,
        );
        const data = await response.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const newLocation = { lat: parseFloat(lat), lng: parseFloat(lon) };
          setTargetLocation(newLocation);
          console.log(
            `Latitude: ${newLocation.lat}, Longitude: ${newLocation.lng}`,
          );
        } else {
          console.log("Location not found");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    }
  };

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setTargetLocation({ lat: latitude, lng: longitude });
          console.log(
            `User's location: Latitude: ${latitude}, Longitude: ${longitude}`,
          );
        },
        (error) => {
          console.error("Error getting user location:", error);
        },
      );
    } else {
      console.log("Geolocation is not available in this browser");
    }
  };

  const toggleDropPinMode = () => {
    setIsDropPinMode(!isDropPinMode);
  };

  const handleMapClick = (latlng) => {
    if (isDropPinMode) {
      setTargetLocation(latlng);
      setIsDropPinMode(false);
      console.log(
        `Dropped pin at Latitude: ${latlng.lat}, Longitude: ${latlng.lng}`,
      );
    }
  };

  const handleDateSubmit = (e) => {
    e.preventDefault();
    const newDate = new Date(`${selectedDate}T${selectedTime}`);
    setDates([...dates, newDate]);
    setSelectedDate("");
    setSelectedTime("");
  };

  const removeDate = (index) => {
    setDates(dates.filter((_, i) => i !== index));
  };

  // Function to handle sending all data as JSON
  const handleSendData = async () => {
    const hasCoordinates = targetLocation.lat && targetLocation.lng;
    const hasLeadTime = leadTime !== "";

    if (!hasCoordinates || !hasLeadTime) {
      setErrorMessage(
        "Debe proporcionar una ubicación y un tiempo de anticipación.",
      );
      setShowError(true);
      setShowSuccess(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/next_pass?latitude=${targetLocation.lat}&longitude=${targetLocation.lng}`,
      );

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("API response:", data);

        setLandsatData({
          landsat8: data.landsat8,
          landsat9: data.landsat9,
        });
        setShowError(false);
        setShowSuccess(true);
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        setErrorMessage("La API no devolvió un formato JSON válido.");
        setShowError(true);
        setShowSuccess(false);
      }
    } catch (error) {
      console.error("Error sending data:", error);
      setErrorMessage("Error sending data to API.");
      setShowError(true);
      setShowSuccess(false);
    }
  };

  const { toast } = useToast();

  const setNotificationMutation = useMutation({
    mutationFn: async ({
      latitude,
      longitude,
      time,
      lead,
      satellite,
    }: {
      latitude: string;
      longitude: string;
      time: number;
      lead: number;
      satellite: string;
    }) => {
      await axios.post("/api/schedule", {
        latitude,
        longitude,
        time,
        lead,
        satellite,
      });
    },
    onSuccess: () => {
      toast({
        title: "Notificación programada",
      });
    },
  });

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <div className="relative h-1/2 w-full lg:h-full lg:w-2/3">
        <MapContainer
          center={[targetLocation.lat, targetLocation.lng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          className="relative z-10"
        >
          <ChangeView center={[targetLocation.lat, targetLocation.lng]} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker
            position={[targetLocation.lat, targetLocation.lng]}
            icon={customPinIcon}
          >
            <Popup>
              Target Location <br />
              Lat: {targetLocation.lat.toFixed(4)}, Lng:{" "}
              {targetLocation.lng.toFixed(4)}
            </Popup>
          </Marker>
          <MapClickHandler
            onLocationChange={handleMapClick}
            isDropPinMode={isDropPinMode}
          />
        </MapContainer>
      </div>
      <div className="flex w-full flex-col space-y-4 overflow-y-auto bg-black p-4 lg:w-1/3">
        {showError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        {showSuccess && (
          <Alert variant="success ">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle className="text-white">Datos Enviados</AlertTitle>
            <AlertDescription className="text-white">
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
            className="border-pink-500 bg-white text-black"
          />
          <h2 className="mb-4 text-center text-2xl font-bold text-pink-500">
            Or
          </h2>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Latitude"
              className="w-1/2 border-pink-500 bg-white text-black"
            />
            <Input
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Longitude"
              className="w-1/2 border-pink-500 bg-white text-black"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-pink-500 text-white hover:bg-pink-600"
          >
            <Search className="mr-2 h-5 w-5" />
            Set Location
          </Button>
        </form>
        <div className="flex space-x-2">
          <Button
            onClick={getUserLocation}
            className="flex-1 bg-pink-500 text-white hover:bg-pink-600"
          >
            <Crosshair className="mr-2 h-5 w-5" />
            Use My Location
          </Button>
          <Button
            onClick={toggleDropPinMode}
            className={`flex-1 bg-pink-500 text-white hover:bg-pink-600 ${isDropPinMode ? "ring-2 ring-white" : ""}`}
          >
            <MapPin className="mr-2 h-5 w-5" />
            {isDropPinMode ? "Cancel" : "Drop Pin"}
          </Button>
        </div>
        <div>
          <h2 className="mb-4 text-center text-2xl font-bold text-pink-500">
            Lead Time
          </h2>
          <Input
            type="number"
            value={leadTime}
            onChange={(e) => setLeadTime(e.target.value)}
            placeholder="Enter lead time (in days)"
            className="w-full border-pink-500 bg-white text-black"
          />
        </div>

        <Button
          onClick={handleSendData}
          className="w-full bg-pink-500 text-white hover:bg-pink-600"
        >
          <SearchCheck className="mr-2 h-5 w-5" />
          Get Landsat Next Pass Data
        </Button>

        {/* Mostrar datos de Landsat */}
        {landsatData.landsat8 && (
          <div className="mt-4 flex w-full items-center justify-between space-y-2 text-white">
            <div className="flex flex-col">
              <h3 className="text-lg font-bold">Próxima fecha Landsat 8:</h3>
              <p>{landsatData.landsat8}</p>
            </div>
            <Button
              onClick={() =>
                setNotificationMutation.mutate({
                  latitude,
                  longitude,
                  lead: parseFloat(leadTime),
                  satellite: "landsat_8",
                  time: new Date(landsatData.landsat8).getTime(),
                })
              }
              className="w-40 bg-pink-500 text-white hover:bg-pink-600"
            >
              <Bell className="mr-2 h-5 w-5" />
              Notify
            </Button>
          </div>
        )}
        {landsatData.landsat9 && (
          <div className="mt-4 flex w-full items-center justify-between space-y-2 text-white">
            <div className="flex flex-col">
              <h3 className="text-lg font-bold">Próxima fecha Landsat 9:</h3>
              <p>{landsatData.landsat9}</p>
            </div>
            <Button
              onClick={() =>
                setNotificationMutation.mutate({
                  latitude,
                  longitude,
                  lead: parseFloat(leadTime),
                  satellite: "landsat_9",
                  time: new Date(landsatData.landsat9).getTime(),
                })
              }
              className="w-40 bg-pink-500 text-white hover:bg-pink-600"
            >
              <Bell className="mr-2 h-5 w-5" />
              Notify
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
