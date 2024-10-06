import { Button } from "@/components/ui/button";
import Login from "@/components/login/login/login";
import NoSsr from "@/components/NoSsr";

export default function Component() {
  return (
<div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Login Section */}
      <div className="flex items-center justify-center bg-black p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">Welcome</h2>
            <p className="mt-2 text-sm text-gray-400">
              Please sign in to your account
            </p>
          </div>
          <div className="flex items-center justify-center space-y-4">
            <NoSsr>
              <Login />
            </NoSsr>
          </div>
        </div>
      </div>
      {/* Welcome Section */}
      <div className="flex items-center justify-center bg-white p-8">
        <div className="max-w-md text-center">
          <h1 className="mb-6 text-4xl font-extrabold text-black">Lessat</h1>
          <p className="mb-8 text-xl text-gray-700">
          Satellite data, smarter work.
Access precise daily information about your location and improve your work. Simply open Lessat, select your area and receive a notification about the day and time the satellites Lansat 8 or Landsat 9 pass over your location to get data directly to your device. 

          </p>
          <p className="text-xl text-gray-700">
          Explore Lessat and let space technology work for you!
          </p>
 
        </div>
      </div>
    </div>
  );
}
