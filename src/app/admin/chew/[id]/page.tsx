"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loader from "../../../../components/common/Loader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { toast } from "react-toastify";

interface Chew {
  id: number;
  full_name: string | null;
  picture_url: string | null;
  specialisation: string[];
  experience: number;
  confirmed: boolean;
  email: string;
  phone: string;
  gender: string | null;
  address: string | null;
  languages: string[];
  date_of_birth: string | null;
  chewId: number;
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
  const [chew, setChew] = useState<Chew | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Chew | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetchChew();
  }, [id, API_BASE_URL]);
  const fetchChew = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/${id}?populate=*&filters[role][id]=4`,
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      const chewData: Chew = {
        id: result.id,
        full_name: `${result.firstName} ${result.lastName}`,
        picture_url: result.profile_picture || "/default-avatar.png",
        specialisation: result.specialisation ? [result.specialisation] : [],
        experience: Number(result.years_of_experience) || 0,
        email: result.email,
        phone: result.phone,
        gender: result.gender || "",
        address: result.home_address || "",
        languages: result.languages ? result.languages : [],
        date_of_birth: result.dateOfBirth || "",
        confirmed: result.confirmed || false,
        chewId: result.id,
      };
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
      specialisation: Array.isArray(formData.specialisation)
        ? formData.specialisation.join(", ")
        : formData.specialisation,
      home_address: formData.address,
      languages: Array.isArray(formData.languages)
        ? formData.languages.join(", ")
        : formData.languages,
      date_of_birth: formData.date_of_birth,
    };

    console.log("formDataS", formDataS);

    try {
      const response = await fetch(
        `https://shark-app-vglil.ondigitalocean.app/api/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataS),
        },
      );

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
                Specialisation: "specialisation",
                Address: "address",
                Languages: "languages",
                "Date of Birth": "date_of_birth",
              }).map(([label, field]) => (
                <InputField
                  key={field}
                  label={label}
                  name={field}
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
