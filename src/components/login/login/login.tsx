import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="flex items-center justify-center  ">
      <div className="rounded-lg shadow-lg ">
        {session ? (
          <>
            <h2 className="text-xl text-pink-500 font-bold mb-4 text-center">
              Welcome, {session.user.email}!
            </h2>
            <Button
              onClick={() => router.push("/map")}
              className="w-full mb-2 bg-blue-500 text-white hover:bg-blue-600"
            >
              Schedule Reminders
            </Button>
            <Button
              onClick={() => signOut()}
              className="w-full bg-red-500 text-white hover:bg-red-600"
            >
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => signIn()}
              className="w-full text-xl bg-pink-500 font-bold text-black hover:bg-pink-600"
            >
              Sign in
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
