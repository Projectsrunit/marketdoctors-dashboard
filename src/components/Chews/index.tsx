"use client";
import { BRAND } from "@/types/brand";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Loader from "../common/Loader";

interface Chew {
  id: string;
  full_name: string;
  picture_url: string;
  createdAt: string;
  confirmed: boolean;
  phone: string;
}

const ChewTable = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const [chew, setChews] = useState<Chew[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchChews = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/users?populate=*&filters[role][id]=4`,
        );
        if (!response.ok) {
          throw new Error(`Error fetching doctors: ${response.statusText}`);
        }
        const result = await response.json();

        const chewsData: Chew[] = result.map((user: any) => ({
          id: user.id,
          full_name: user.firstName + "\t" + user.lastName,
          picture_url: user.picture_url || "/images/brand/person_avatar.svg",
          createdAt: new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }).format(new Date(user.createdAt)),
          phone: user.phone || "Not Listed",
          confirmed: user.confirmed,
        }));

        setChews(chewsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChews();
  }, [API_BASE_URL]);

  const exportToCSV = () => {
    const headers = ["ID,Full Name,Phone,Years of Experience,Confirmed"];
    const rows = chew.map((chew) =>
      [
        chew.id,
        `"${chew.full_name}"`,
        chew.phone,
        chew.createdAt,
        chew.confirmed ? "Confirmed" : "Pending",
      ].join(","),
    );
    const csv = headers.concat(rows).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chews.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          CHEWs List
        </h4>
        <button
          onClick={exportToCSV}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Export CHEW CSV
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
              Phone Number
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Confirmed Status
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              CHEW CREATED ON{" "}
            </h5>
          </div>

          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              View Details{" "}
            </h5>
          </div>
        </div>

        {chew.map((brand, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === chew.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0">
                <Image
                  src={brand.picture_url}
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
              <p className="text-black dark:text-white">{brand.phone}</p>
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
                href={`/admin/chew/${brand.id}`}
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

export default ChewTable;
