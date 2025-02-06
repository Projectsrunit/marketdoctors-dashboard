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
  email: string;
  phone: string;
  gender: string | null;

  caseId: number;
  age: number;
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
  const [caseVisits, setCaseVisits] = useState<any[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetchChew();
  }, [id, API_BASE_URL]);
  const fetchChew = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/cases/${id}?populate=*`,
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();
      const caseData = result.data;

      const chewData: Case = {
        id: caseData?.id || 0,
        full_name: `${caseData?.attributes?.first_name} ${caseData?.attributes?.last_name}`,
        email: caseData?.attributes?.email || "",
        phone: caseData?.attributes?.phone_number || "",
        gender: caseData?.attributes?.gender || "",
        caseId: caseData?.id || 0,
        age: caseData?.attributes?.age || 0,
      };

      setChew(chewData);
      setFormData(chewData);

      // Extract case visits
      if (caseData?.attributes?.casevisits?.data) {
        setCaseVisits(caseData.attributes.casevisits.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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
      data: {
        first_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone,
        age: formData.age,
        gender: formData.gender,
      },
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

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cases/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete case");
      }

      toast.success("Case deleted successfully");
      // Redirect to cases list
      window.location.href = "/admin/cases";
    } catch (error) {
      console.error("Error deleting case:", error);
      toast.error("Failed to delete case");
    }
  };

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName={`Case ~ ${formData?.full_name || "Unknown"}`} />

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-boxdark">
              <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
                Confirm Delete
              </h3>
              <p className="mb-6 text-base">
                Are you sure you want to delete this case? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-lg border border-stroke bg-white px-6 py-2 text-black hover:bg-gray-100 dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:bg-opacity-90"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded-lg bg-danger px-6 py-2 text-white hover:bg-opacity-90"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="overflow-hidden rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {Object.entries({
                Email: "email",
                Name: "full_name",
                Phone: "phone",
                Gender: "gender",
                Age: "age",
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

            {caseVisits.length > 0 && (
              <div className="mt-6">
                <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
                  Case Visits
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-stroke dark:border-strokedark">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-meta-4">
                        <th className="border border-stroke px-4 py-2 dark:border-strokedark dark:text-white">
                          Date
                        </th>
                        <th className="border border-stroke px-4 py-2 dark:border-strokedark dark:text-white">
                          Weight
                        </th>
                        <th className="border border-stroke px-4 py-2 dark:border-strokedark dark:text-white">
                          Height
                        </th>
                        <th className="border border-stroke px-4 py-2 dark:border-strokedark dark:text-white">
                          Blood Pressure
                        </th>
                        <th className="border border-stroke px-4 py-2 dark:border-strokedark dark:text-white">
                          Chew Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {caseVisits.map((visit) => (
                        <tr
                          key={visit.id}
                          className="hover:bg-gray-50 dark:hover:bg-meta-3"
                        >
                          <td className="border border-stroke px-4 py-2 dark:border-strokedark dark:text-white">
                            {visit.attributes.date}
                          </td>
                          <td className="border border-stroke px-4 py-2 dark:border-strokedark dark:text-white">
                            {visit.attributes.weight || "N/A"} Kgs
                          </td>
                          <td className="border border-stroke px-4 py-2 dark:border-strokedark dark:text-white">
                            {visit.attributes.height || "N/A"} meters
                          </td>
                          <td className="border border-stroke px-4 py-2 dark:border-strokedark dark:text-white">
                            {visit.attributes.blood_pressure || "N/A"}
                          </td>
                          <td className="border border-stroke px-4 py-2 dark:border-strokedark dark:text-white">
                            {visit.attributes.chews_notes || "No notes"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button
                type="submit"
                className="hover:bg-primarydark focus:bg-primarydark w-1/4 rounded bg-primary py-3 text-white focus-visible:outline-none"
              >
                Update Profile
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-1/4 rounded bg-danger py-3 text-white hover:bg-opacity-90 focus-visible:outline-none"
              >
                Delete Case
              </button>
            </div>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default ChewSettingsPage;
