"use client";
import { BRAND } from "@/types/brand";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Loader from "../common/Loader";

interface CaseVisit {
  id: number;
  attributes: {
    current_prescription: string;
    chews_notes: string;
    symptoms: string[];
    date: string;
  };
}

interface Chew {
  id: string;
  full_name: string;
  profile_picture: string;
  symptoms: string[];
  chews_notes: string[];
  phone: string;
  chew_name: string;
  case_visits: CaseVisit[];
}

const CasesTable = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const [chew, setChews] = useState<Chew[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [caseCounts, setCaseCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchChews = async () => {
      try {
        console.log('Attempting to fetch from:', `${API_BASE_URL}/api/cases?populate=*`);
        const response = await fetch(`${API_BASE_URL}/api/cases?populate=*`);
        console.log('Response status:', response.status);
        const text = await response.text();
        console.log('Raw response:', text);
        
        let result;
        try {
          result = JSON.parse(text);
        } catch (parseError) {
          console.error('Failed to parse JSON:', parseError);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`Error fetching cases: ${response.statusText}`);
        }

        const chewsData: Chew[] = result.data.map((user: any) => {
          // Get all symptoms from case visits
          const allSymptoms = user.attributes.casevisits?.data?.flatMap(
            (visit: any) => visit.attributes.symptoms || []
          ) || [];

          // Get all chew notes from case visits
          const allChewNotes = user.attributes.casevisits?.data?.map(
            (visit: any) => visit.attributes.chews_notes
          ).filter(Boolean) || [];

          return {
            id: user.id.toString(),
            full_name: `${user.attributes.first_name} ${user.attributes.last_name}`,
            profile_picture: user.attributes.profile_picture|| "/images/brand/person_avatar.svg",
            symptoms: allSymptoms,
            phone: user.attributes.phone_number || "Not Listed",
            chews_notes: allChewNotes,
            chew_name: user.attributes.chew?.data?.attributes ? 
              `${user.attributes.chew.data.attributes.firstName} ${user.attributes.chew.data.attributes.lastName}` : 
              "Unknown Chew",
            case_visits: user.attributes.casevisits?.data || []
          };
        });

        setChews(chewsData);
        
        // Calculate case counts based on case visits
        const counts: Record<string, number> = {};
        chewsData.forEach((chew) => {
          const visitCount = chew.case_visits.length;
          counts[chew.chew_name] = (counts[chew.chew_name] || 0) + visitCount;
        });

        setCaseCounts(counts);
      } catch (error) {
        console.error("Error fetching data:", error);
        setChews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChews();
  }, [API_BASE_URL]);

  const exportToCSV = () => {
    const headers = ["ID,Chew Name,Patient Name,Patient Phone Number,Visit Count"];
    const rows = chew.map((chew) =>
      [
        chew.id,
        chew.chew_name,
        `"${chew.full_name}"`,
        chew.phone,
        chew.case_visits.length
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
            <h5 className="text-sm font-medium uppercase dark:text-white xsm:text-base">
              Chew Name
            </h5>
          </div>
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase dark:text-white xsm:text-base">
              Patient Name
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase dark:text-white xsm:text-base">
              Phone Number
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase dark:text-white xsm:text-base">
              Number of Case Visits
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase dark:text-white xsm:text-base">
              Actions
            </h5>
          </div>
        </div>

        {chew.map((caseItem) => (
          <div
            key={caseItem.id}
            className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5"
          >
            <div className="p-2.5 text-center dark:text-white xl:p-5">
              {caseItem.chew_name}
            </div>
            <div className="p-2.5 dark:text-white xl:p-5">
              {caseItem.full_name}
            </div>
            <div className="p-2.5 text-center dark:text-white xl:p-5">
              {caseItem.phone}
            </div>
            <div className="p-2.5 text-center dark:text-white xl:p-5">
              {caseItem.case_visits.length}
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <a
                href={`/admin/cases/${caseItem.id}`}
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

export default CasesTable;
