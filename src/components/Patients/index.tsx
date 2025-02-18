"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Loader from "../common/Loader";

interface Patient {
  id: string;
  full_name: string;
  picture_url: string;
  phone: string;
  createdAt: string;
  confirmed: boolean;
}

const PatientsTable = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/users?populate=*&filters[role][id]=5`,
        );
        if (!response.ok) {
          throw new Error(`Error fetching doctors: ${response.statusText}`);
        }
        const result = await response.json();

        const patientsData: Patient[] = result.map((user: any) => ({
          id: user.id,
          full_name: user.firstName + " " + user.lastName,
          picture_url: user.picture_url || "/images/brand/blank_avatar.jpeg",
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

        setPatients(patientsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [API_BASE_URL]);

  const exportToCSV = () => {
    const headers = ["ID,Full Name,Phone,Date of Birth,Confirmed"];
    const rows = patients.map((patient) =>
      [
        patient.id,
        `"${patient.full_name}"`,
        patient.phone,
        patient.createdAt,
        patient.confirmed ? "Confirmed" : "Pending",
      ].join(","),
    );

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "patients.csv";
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
          Market Doctor Patients
        </h4>
        <button
          onClick={exportToCSV}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Export CSV
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
              Patient Created On{" "}
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              View Details
            </h5>
          </div>
        </div>

        {patients.map((patient, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === patients.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={patient.id}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0">
                <Image
                  src={patient.picture_url}
                  alt="Patient"
                  width={48}
                  height={48}
                />
              </div>
              <p className="hidden capitalize text-black dark:text-white sm:block">
                {patient.full_name}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{patient.phone}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                  patient.confirmed
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {patient.confirmed ? "Confirmed" : "Pending"}
              </span>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{patient.createdAt}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <a
                href={`/admin/patient/${patient.id}`}
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

export default PatientsTable;
