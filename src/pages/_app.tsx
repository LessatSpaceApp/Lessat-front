import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import Navbar from "@/components/login/navbar/navbar";

import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={GeistSans.className}>
      <div className="bg-gray-900 pattern">
      <SessionProvider>
        <Navbar/>
        <Component {...pageProps} />
      </SessionProvider>
      </div>
    </div>
  );
};

export default MyApp;
