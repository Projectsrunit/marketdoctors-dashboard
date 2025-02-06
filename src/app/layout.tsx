"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState, Suspense } from "react";
import Loader from "@/components/common/Loader";
import { UserProvider } from "../context/UserContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Script from 'next/script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);

    // Initialize OneSignal
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID) {
      window.OneSignal = window.OneSignal || [];
      window.OneSignal.push(function() {
        window.OneSignal.init({
          appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
          safari_web_id: "web.onesignal.auto.xxxxx", // Generate this from OneSignal dashboard
          notifyButton: {
            enable: true,
          },
          allowLocalhostAsSecureOrigin: true,
        });
      });
    }
  }, []);

  return (
    <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Market Doctor Dashboard</title>
      <link rel="icon" href="/favicon.ico" />
      <Script 
        src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
        async
      />
    </head>
    <body suppressHydrationWarning={true} className="dark:bg-boxdark-2 dark:text-bodydark">
      <Suspense fallback={<div>Loading...</div>}>
        <UserProvider>
          {loading ? <Loader /> : children}
          <ToastContainer />
        </UserProvider>
      </Suspense>
    </body>
  </html>
  );
}
