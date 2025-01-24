"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { useUserContext } from "../../context/UserContext";

import { toast } from "react-toastify";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

const SignInPage = () => {
  const { setId, setUserRole, userRole } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({ identifier: "", password: "" });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Ensure the role ID for admin is 6
    const payload = { ...user, role: 6 };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/local?populate=*`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (response.ok) {
        // Set user ID and role
        // @ts-ignore
        setId(data.user.id);

        window.location.href = `/admin`;
      } else {
        toast.error(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="h-screen flex items-center justify-center rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-center">
        <div className=" w-full px-26 py-17.5 text-center  xl:block xl:w-1/2">
          <Link
            className="mb-5.5 inline-block"
            href="https://marketdoctors.com.ng/"
            passHref
          >
            <Image
              className="hidden dark:block "
              src={"/images/logo/logo.png"}
              alt="Logo"
              width={176}
              height={32}
            />
            <Image
              className="dark:hidden "
              src={"/images/logo/logo.png"}
              alt="Logo"
              width={176}
              height={32}
            />
          </Link>
        </div>

        <div className="w-full p-10 xl:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="w-full">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Admin Sign In ~ Market Doctors
              </h2>
              <div className="relative">
                <FaEnvelope className="text-gray-500 absolute left-3 top-4" />
                <input
                  type="email"
                  name="identifier"
                  value={user.identifier}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="mb-4 w-full rounded-lg border border-stroke p-3 pl-10 dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                />
              </div>

              <div className="relative">
                <FaLock className="text-gray-500 absolute left-3 top-4" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={user.password}
                  onChange={handleInputChange}
                  className="mb-4 w-full rounded-lg border border-stroke p-3 pl-10 dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 transform"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary py-3 text-white hover:bg-primary"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
