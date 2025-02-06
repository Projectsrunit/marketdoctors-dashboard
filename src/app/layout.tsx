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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Market Doctor Dashboard</title>
      <link rel="icon" href="/favicon.ico" />
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
