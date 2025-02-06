"use client";
import { BRAND } from "@/types/brand";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Loader from "../common/Loader";

interface Doctor {
  id: string;
  full_name: string;
  profile_picture: string;
  specialisation: string;
  createdAt: string;
  confirmed: boolean;
}

const DoctorTable = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const [doctor, setDoctor] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/users?populate=*&filters[role][id]=3`,
        );
        if (!response.ok) {
          throw new Error(`Error fetching doctors: ${response.statusText}`);
        }
        const result = await response.json();

        const doctorsData: Doctor[] = result.map((user: any) => ({
          id: user.id,
          full_name: user.firstName + "\t" + user.lastName,
          profile_picture: user.profile_picture || "/images/brand/person_avatar.svg",
          createdAt: new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }).format(new Date(user.createdAt)),
          specialisation: user.specialisation || "Not Listed",
          confirmed: user.confirmed,
        }));

        setDoctor(doctorsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [API_BASE_URL]);

  const exportToCSV = () => {
    const headers = [
      "ID,Full Name,Specialisation,Years of Experience,Confirmed",
    ];
    const rows = doctor.map((doctor) =>
      [
        doctor.id,
        `"${doctor.full_name}"`,
        doctor.specialisation,
        doctor.createdAt,
        doctor.confirmed ? "Confirmed" : "Pending",
      ].join(","),
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "doctors.csv";
    a.click();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Doctor List
        </h4>
        <button
          onClick={exportToCSV}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Export Doctor CSV
        </button>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Name
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Speciality
            </h5>
          </div>
       
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Confirmed Status
            </h5>
          </div>

          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Doctor Created On 
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              View Details{" "}
            </h5>
          </div>
        </div>

        {doctor.map((brand, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === doctor.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0">
                <img
  className="w-18 h-18 rounded-full"
  src={brand.profile_picture}
                  alt="Brand"
                  width={48}
                  height={48}
                />
              </div>
              <p className="hidden capitalize text-black dark:text-white sm:block">
                {brand.full_name}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">
                {brand.specialisation}
              </p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                  brand.confirmed
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {brand.confirmed ? "Confirmed" : "Pending"}
              </span>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{brand.createdAt}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <a
                href={`/admin/doctor/${brand.id}`}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                View Details
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorTable;
