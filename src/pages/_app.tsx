import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";

import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={GeistSans.className}>
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    </div>
  );
};

export default MyApp;
