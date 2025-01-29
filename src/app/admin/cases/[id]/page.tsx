"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loader from "../../../../components/common/Loader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { toast } from "react-toastify";

interface Case {
  id: number;
  full_name: string | null;
  current_prescription: string[];
  email: string;
  phone: string;
  chews_notes: string[];
  gender: string | null;
  home_address: string | null;
  nearest_bus_stop: string | null;
  symptoms: string[];
  weight: string | null;
  height: string | null;
  blood_glucose: string | null;
  caseId: number;
}

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  isEditable: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  isEditable,
}) => (
  <div>
    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
      {label}
    </label>
    {isEditable ? (
      <input
        type={name === "date_of_birth" ? "date" : "text"}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
      />
    ) : (
      <p className="py-3 pl-11.5 pr-4.5 text-black dark:text-white">{value}</p>
    )}
  </div>
);

const ChewSettingsPage = () => {
  const { id } = useParams();
  const [chew, setChew] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Case | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetchChew();
  }, [id, API_BASE_URL]);
  const fetchChew = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cases/${id}?populate=*`);
      if (!response.ok) throw new Error("Network response was not ok");
  
      const result = await response.json();
      const caseData = result.data; // Directly access the `data` object
  
      const chewData: Case = {
        id: caseData?.id || 0,
        full_name: `${caseData?.attributes?.first_name} ${caseData?.attributes?.last_name}`,
        email: caseData?.attributes?.email || "",
        phone: caseData?.attributes?.phone_number || "", // Optional chaining
        gender: caseData?.attributes?.gender || "",
        home_address: caseData?.attributes?.home_address || "",
        caseId: caseData?.id || 0,
        current_prescription: caseData?.attributes?.current_prescription || [],
        chews_notes: caseData?.attributes?.chews_notes || [],
        symptoms: caseData?.attributes?.symptoms || [],
        weight: caseData?.attributes?.weight || "",
        height: caseData?.attributes?.height || "",
        blood_glucose: caseData?.attributes?.blood_glucose || "",
        nearest_bus_stop: caseData?.attributes?.nearest_bus_stop || "",
      };
  
      if (caseData?.attributes?.chew?.data) {
        const chewDetails = caseData.attributes.chew.data.attributes;
        chewData.chew_username = chewDetails?.username || "";
        chewData.chew_email = chewDetails?.email || "";
        chewData.chew_first_name = chewDetails?.firstName || "";
        chewData.chew_last_name = chewDetails?.lastName || "";
      }
  
      setChew(chewData);
      setFormData(chewData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setError("Failed to fetch chew data.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (formData) {
      const { name, value, type, checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev!,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const formDataS = {
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      current_prescription: Array.isArray(formData.current_prescription)
        ? formData.current_prescription.join(", ")
        : formData.current_prescription,
      home_address: formData.home_address,
      symptoms: Array.isArray(formData.symptoms)
        ? formData.symptoms.join(", ")
        : formData.symptoms,
      weight: formData.weight,
      gender: formData.gender,
      height: formData.height,
      blood_glucose: formData.blood_glucose,
      nearest_bus_stop: formData.nearest_bus_stop,
    };

    console.log("formDataS", formDataS);

    try {
      const response = await fetch(`${API_BASE_URL}/api/cases/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataS),
      });

      console.log("Request Body:", JSON.stringify(formDataS));

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error updating profile:", errorData);
        setError(errorData.error?.message || "Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully");
      fetchChew();
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    }
  };

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;
  // if (!chew) return <p>Chew not found</p>;

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName={`Chew ${formData?.full_name || "Unknown"}`} />
        <form onSubmit={handleSubmit}>
          <div className="overflow-hidden rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {Object.entries({
                Email: "email",
                Phone: "phone",
                Gender: "gender",
                Address: "home_address",
                "Nearest Bus Stop": "nearest_bus_stop",
                Symptoms: "symptoms",
                "Current Prescription": "current_prescription",
                Weight: "weight",
                Height: "height",
                "Blood Glucose": "blood_glucose",
              }).map(([label, field]) => (
                <InputField
                  key={field}
                  label={label}
                  name={field}
                  //@ts-ignore
                  value={String(formData?.[field as keyof Chew] || "")}
                  onChange={handleChange}
                  isEditable={true}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button
                type="submit"
                className="hover:bg-primarydark focus:bg-primarydark w-1/4 rounded bg-primary py-3 text-white focus-visible:outline-none"
              >
                Update Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default ChewSettingsPage;
