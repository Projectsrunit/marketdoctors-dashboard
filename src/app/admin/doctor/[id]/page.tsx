"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loader from "../../../../components/common/Loader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { toast } from "react-toastify";

interface Doctor {
  id: number;
  full_name: string | null;
  profile_picture: string | null;
  specialisation: string[];
  years_of_experience: number;
  confirmed: boolean;
  email: string;
  phone: string;
  gender: string | null;
  home_address: string | null;
  languages: string[];
  dateOfBirth: string | null;
  awards: string[];
  about: string | null;
  doctorId: number;
  consultation_fee: string | null;
  facility: string | null;
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
        type={name === "dateOfBirth" ? "date" : "text"}
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

const DoctorSettingsPage = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
  const { id } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Doctor | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetchDoctor();
  }, [id, API_BASE_URL]);
  const fetchDoctor = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/${id}?populate=*&filters[role][id]=3`,
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      const doctorData: Doctor = {
        id: result.id,
        full_name: `${result.firstName} ${result.lastName}`,
        profile_picture: result.profile_picture || "/default-avatar.png",
        specialisation: result.specialisation ? [result.specialisation] : [],
        awards: result.awards ? result.awards : [],
        years_of_experience: Number(result.years_of_experience) || 0,
        email: result.email,
        phone: result.phone,
        gender: result.gender || "",
        home_address: result.home_address || "",
        languages: result.languages ? result.languages : [],
        dateOfBirth: result.dateOfBirth || "",
        confirmed: result.confirmed || false,
        about: result.about || "",
        doctorId: result.id,
        facility: result.facility,
        consultation_fee: result.consultation_fee || "",
      };
      setDoctor(doctorData);
      setFormData(doctorData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch doctor data.");
    } finally {
      setLoading(false);
    }
  };

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
    if (!formData) return;

    const formDataS = {
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      specialisation: Array.isArray(formData.specialisation)
        ? formData.specialisation.join(", ")
        : formData.specialisation,
      home_address: formData.home_address,
      languages: Array.isArray(formData.languages)
        ? formData.languages.join(", ")
        : formData.languages,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      years_of_experience: formData.years_of_experience,
      about: formData.about,
      consultation_fee: formData.consultation_fee,
      facility: formData.facility,
      awards: formData.awards,
    };

    console.log("formDataS", formDataS);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
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
      fetchDoctor();
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    }
  };

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;
  if (!doctor) return <p>Doctor not found</p>;

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName={`Doctor ${formData?.full_name || "Unknown"}`} />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="overflow-hidden rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {Object.entries({
                "Profile Picture": "profile_picture",
                "Full Name": "full_name",
                Email: "email",
                Phone: "phone",
                Gender: "gender",
                Specialisation: "specialisation",
                Address: "home_address",
                Languages: "languages",
                "Date of Birth": "dateOfBirth",
                "Facility Name": "facility",
                Background: "about",
                Awards: "awards",

                "Doctor Fee": "consultation_fee",
                "Certifying Documents": "certify_url",
              }).map(([label, field]) => (
                <div key={field} className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-black dark:text-white">
                    {label}
                  </label>

                  {/* Profile Picture Handling */}
                  {field === "profile_picture" ? (
                    <div>
                      {formData?.[field] ? (
                        <img
                          src={formData[field]}
                          alt="Profile Picture"
                          className="h-40 w-40 rounded border border-stroke object-cover dark:border-strokedark"
                        />
                      ) : (
                        <span className="dark:text-gray-400 text-red">
                          Doctor has no profile picture
                        </span>
                      )}
                    </div>
                  ) : /* Certifying Documents Handling */
                  field === "certify_url" ? (
                    // @ts-ignore
                    formData?.[field] ? (
                      <p className="font-medium text-primary underline">
                        <a
                          // @ts-ignore
                          href={formData[field]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Certifying Documents
                        </a>
                      </p>
                    ) : (
                      <p className="text-red">
                        This user has no certifying documents.
                      </p>
                    )
                  ) : /* Background (Text Area) Handling */
                  field === "about" || field == "awards" ? (
                    <textarea
                      name={field}
                      value={formData?.[field] || ""}
                      onChange={handleChange}
                      rows={5}
                      className="w-full rounded border border-stroke bg-gray px-3 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  ) : (
                    /* Default Input Field Handling */
                    <input
                      type="text"
                      name={field}
                      // @ts-ignore
                      value={formData?.[field] || ""}
                      onChange={handleChange}
                      className="w-full rounded border border-stroke bg-gray px-3 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="hover:bg-primarydark focus:bg-primarydark w-1/4 rounded bg-primary py-3 text-white focus-visible:outline-none"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default DoctorSettingsPage;
