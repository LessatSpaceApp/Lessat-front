import { Button } from "@/components/ui/button";
import Login from "@/components/login/login/login";
import NoSsr from "@/components/NoSsr";

export default function Component() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      Login Section
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
            We are more than just a soccer team. We are a movement, a culture,
            and a family united by our passion for the beautiful game.
          </p>
          <p className="text-lg text-gray-600">
            Join us in our journey to bring world-class soccer to Miami and
            create unforgettable moments on and off the pitch.
          </p>
          <div className="mt-8">
            <Button className="bg-black text-white hover:bg-gray-800">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
