"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loader from "../../../../components/common/Loader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { toast } from "react-toastify";
import StatusToggle from "../../../../components/StatusToggle/StatusToggle";

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
  home_address: string | null;
  languages: string[];
  dateOfBirth: string | null;
  chewId: number;
  qualifications: string[];
  years_of_experience: number;
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

const ChewSettingsPage = () => {
  const { id } = useParams();
  const [chew, setChew] = useState<Chew | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Chew | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
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
        home_address: result.home_address || "",
        languages: result.languages ? result.languages : [],
        dateOfBirth: result.dateOfBirth || "",
        confirmed: result.confirmed || false,
        chewId: result.id,
        years_of_experience: result.years_of_experience,
        qualifications: result.qualifications
          ? result.qualifications.map((qual: any) => qual.file_url)
          : [],
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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setFilePreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    const saveQualification = async (fileUrl: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/qualifications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              name: file?.name,
              file_url: fileUrl,
              user: id,
            },
          }),
        });

        if (!response.ok) throw new Error("Failed to save qualification");

        toast.success("Qualification document uploaded successfully!");
        fetchChew();
      } catch (error) {
        console.error("Error saving qualification:", error);
        toast.error("Failed to save document.");
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/file-forward`, {
        method: "POST",
        body: form,
      });

      const textResponse = await response.text(); // Inspect response as raw text
      console.log("Raw upload response:", textResponse);

      const imageUrl = JSON.parse(textResponse); // Parse manually to catch errors
      console.log("Parsed upload response:", imageUrl);

      if (!imageUrl?.fileUrl) throw new Error("Invalid upload response");
      setFormData((prevState: any) => ({
        ...prevState,
        qualifications: [
          ...(Array.isArray(prevState?.qualifications)
            ? prevState.qualifications
            : []),
          imageUrl.fileUrl,
        ],
      }));
      await saveQualification(imageUrl.fileUrl);

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
    } finally {
      setLoading(false);
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
      confirmed: formData.confirmed,
      years_of_experience: formData.years_of_experience,
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
      fetchChew();
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    }
  };

  const handleStatusChange = (newStatus: boolean) => {
    setFormData((prev) => (prev ? { ...prev, confirmed: newStatus } : null));
  };

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;
  // if (!chew) return <p>Chew not found</p>;

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName={`Chew ${formData?.full_name || "Unknown"}`} />
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
                "Years Of Experience": "years_of_experience",
                Languages: "languages",
                "Date of Birth": "dateOfBirth",

                "Certifying Documents": "qualifications",
              }).map(([label, field]) => (
                <div key={field} className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-black dark:text-white">
                    {label}
                  </label>

                  {/* Profile Picture Handling */}
                  {field === "profile_picture" ? (
                    <div>
                      {/* @ts-ignore */}
                      {formData?.[field] ? (
                        <img
                          // @ts-ignore
                          src={formData[field]}
                          alt="Profile Picture"
                          className="h-40 w-40 rounded border border-stroke object-cover dark:border-strokedark"
                        />
                      ) : (
                        <span className="dark:text-gray-400 text-red">
                          CHEW has no profile picture
                        </span>
                      )}
                    </div>
                  ) : /* Certifying Documents Handling */
                  field === "qualifications" ? (
                    // @ts-ignore
                    formData?.[field] ? (
                      <div>
                        <ul>
                          {formData.qualifications.map((url, index) => (
                            <li key={index}>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline"
                              >
                                View Doctor Document {index + 1}
                              </a>
                            </li>
                          ))}
                        </ul>

                        <div>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.png"
                            onChange={handleFileChange}
                            className="border-gray-300 mt-2 block w-full rounded-md border shadow-sm"
                          />
                          {filePreview && (
                            <p className="text-gray-500 mt-2 text-sm">
                              Selected File: {file?.name}
                            </p>
                          )}
                          <button
                            type="button"
                            onClick={handleUpload}
                            className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                          >
                            Upload Certifying Documents
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="text-sm font-medium text-red dark:text-white">
                          Upload Qualification Documents
                        </label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          onChange={handleFileChange}
                          className="border-gray-300 mt-2 block w-full rounded-md border shadow-sm"
                        />
                        {filePreview && (
                          <p className="text-gray-500 mt-2 text-sm">
                            Selected File: {file?.name}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={handleUpload}
                          className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        >
                          Upload
                        </button>
                      </div>
                    )
                  ) : /* Background (Text Area) Handling */
                  field === "about" || field == "awards" ? (
                    <textarea
                      name={field}
                      // @ts-ignore
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

            <div className="mt-6 flex justify-between">
              <div className="flex items-center">
                <label className="mr-2 text-sm font-medium text-black dark:text-white">
                  Confirm CHEW
                </label>
                <StatusToggle
                  enabled={formData?.confirmed}
                  setEnabled={handleStatusChange}
                />
              </div>

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

export default ChewSettingsPage;
