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
  country: string | null;
  address: string | null;
  languages: string[];
  date_of_birth: string | null;
  chewId: number;
}

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isEditable: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, isEditable }) => (
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
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
  const { id } = useParams();
  const [chew, setChew] = useState<Chew | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Chew | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    const fetchChew = async () => {
      try {
        const response = await fetch(
          `https://clownfish-app-i289t.ondigitalocean.app/api/users/${id}?populate=*&filters[role][id]=4`,
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
          country: result.country || "",
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
        setError("Failed to fetch chew data.");
      } finally {
        setLoading(false);
      }
    };

    fetchChew();
  }, [id, API_BASE_URL]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (formData) {
      // @ts-ignore
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataPayload = {data:{formData}}
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/${id}?populate=*`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataPayload),
        },
      );
      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully");
        setFormData(data);
      } else {
        Error("Network response was not ok");
      }

     
      setChew((prev) => ({
        ...prev,
        ...data,
      }));
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating chew profile:", error);
      setError("Failed to update chew profile");
    }
  };



  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;
  if (!chew) return <p>Chew not found</p>;

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
                Country: "country",
                Address: "address",
                Languages: "languages",
                "Date of Birth": "date_of_birth",
              }).map(([label, field]) => (
                <InputField
                  key={field}
                  label={label}
                  name={field}
                  value={
                    String(formData?.[field as keyof Chew] || "")
                  }
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
