"use client";
import { BRAND } from "@/types/brand";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Loader from "../common/Loader";

interface Chew {
  id: string;
  full_name: string;
  picture_url: string;
  symptoms: string[];
  chews_notes: string[];
  phone: string;
  chew_name: string; // Changed from `chew` to `chew_name`
}

const CasesTable = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const [chew, setChews] = useState<Chew[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChews = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/cases?populate=*`);
        if (!response.ok) {
          throw new Error(`Error fetching doctors: ${response.statusText}`);
        }
        const result = await response.json();

        const chewsData: Chew[] = result.data.map((user: any) => ({
          id: user.id,
          full_name: `${user.attributes.first_name} ${user.attributes.last_name}`,
          picture_url:
            user.attributes.picture_url || "/images/brand/person_avatar.svg",
          symptoms: user.attributes.symptoms || ["Not Listed"],
          phone: user.attributes.phone_number || "Not Listed",
          chews_notes: user.attributes.chews_notes,
          chew_name: `${user.attributes.chew.data.attributes.firstName} ${user.attributes.chew.data.attributes.lastName}`, // Extracting chew's name
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
    const headers = ["ID,Full Name,Symptoms,Chew Notes, Symptoms"];
    const rows = chew.map((chew) =>
      [
        chew.id,
        `"${chew.full_name}"`,
        chew.symptoms.join(", "),
        chew.chews_notes,
      ].join(","),
    );
    const csv = headers.concat(rows).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cases.csv";
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
          Market Doctor Cases
        </h4>
        <button
          onClick={exportToCSV}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Export Cases CSV
        </button>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Chew Name
            </h5>{" "}
            {/* Added new column */}
          </div>
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
            Patient  Name
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Phone Number
            </h5>
          </div>

          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Chew Notes
            </h5>
          </div>
        </div>
        {chew.map((caseItem) => (
          <div
            key={caseItem.id}
            className="grid grid-cols-3 gap-4 sm:grid-cols-5"
          >
            <div className="p-2.5 text-center xl:p-5">{caseItem.chew_name}</div>{" "}
            <div className="p-2.5 xl:p-5">{caseItem.full_name}</div>
            <div className="p-2.5 text-center xl:p-5">{caseItem.phone}</div>
            <div className="p-2.5 text-center xl:p-5">
              {caseItem.chews_notes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CasesTable;
