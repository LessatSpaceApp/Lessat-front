import { Button } from "@/components/ui/button";
import Login from "@/components/login/login/login";
import NoSsr from "@/components/NoSsr";
import Image from "next/image";
import AppGuide from "@/components/guide/guide";
import { GeistSans } from "geist/font/sans";

export default function Component() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <AppGuide/>
      {/* Login Section */}
      <div className="flex items-center justify-center bg-black p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-white">Welcome</h2>
            <p className="mt-2 text-lg text-gray-400">
              Please sign in to your account
            </p>
          </div>
          <div className="flex items-center justify-center">
            <NoSsr>
              <Login />
            </NoSsr>
          </div>

        </div>
      </div>

      {/* Welcome Section */}
      <div className="flex items-center justify-center bg-white p-8">
        <div className="max-w-lg text-center">
          <h1 className="mb-6 text-5xl font-bold text-black">Lessat</h1>
          <p className="mb-6 text-xl text-gray-700 leading-relaxed">
            Satellite data, smarter work. Access precise daily information about
            your location and improve your work. Simply open Lessat, select your
            area, and receive notifications about the day and time the
            satellites Landsat 8 or Landsat 9 pass over your location to get
            data directly to your device.
          </p>
          <p className="text-xl text-gray-700">
            Explore Lessat and let space technology work for you!
          </p>
        </div>
      </div>
    </div>
  );
}
