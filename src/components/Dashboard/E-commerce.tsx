"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";
import { FaUsers, FaUserMd, FaPills, FaUserInjured } from "react-icons/fa";
import ChewTable from "../Chews";
import DoctorTable from "../Doctors";

const ECommerce: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [chewCount, setChewCount] = useState<number>(0);
  const [doctorCount, setDoctorCount] = useState<number>(0);
  const [patientCount, setPatientCount] = useState<number>(0);
  const API_BASE_URL = process.env.API_URL;

  const [user, setUser] = useState<number>(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://shark-app-vglil.ondigitalocean.app/api/users?populate=*`,
        );
        const data = await response.json();
        setUser(data.length);

        const chewCount = data.filter((user: any) => user.role.id === 4).length;
        setChewCount(chewCount);

        const patientCount = data.filter(
          (user: any) => user.role.id === 5,
        ).length;
        setPatientCount(patientCount);

        const doctorCount = data.filter(
          (user: any) => user.role.id === 3,
        ).length;
        setDoctorCount(doctorCount);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total users" total={String(user)}>
          <FaUsers className="text-primary dark:text-white" size={22} />
        </CardDataStats>
        <CardDataStats title="Registered Doctors" total={String(doctorCount)}>
          <FaUserMd className="text-primary dark:text-white" size={22} />
        </CardDataStats>
        <CardDataStats title="Total CHEWs" total={String(chewCount)}>
          <FaPills className="text-primary dark:text-white" size={22} />
        </CardDataStats>
        <CardDataStats title="Registered Patients" total={String(patientCount)}>
          <FaUserInjured className="text-primary dark:text-white" size={22} />
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* <ChartOne />
        <ChartTwo />
        <ChartThree />
        <MapOne /> */}
        <div className="col-span-12 xl:col-span-12 py-8">
          <ChewTable />
        </div>

        <DoctorTable />
      </div>
    </>
  );
};

export default ECommerce;
