"use client";

import React, { useState } from "react";
import Loader from "@/components/common/Loader";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const userGroups = [
  { value: "chew", label: "CHEWs (Community Health Workers)" },
  { value: "doctor", label: "Doctors" },
  { value: "patient", label: "Patients" },
];

const NotificationsPage = () => {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const [sending, setSending] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [groupTitle, setGroupTitle] = useState("");
  const [groupMessage, setGroupMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Individual message state
  const [email, setEmail] = useState("");
  const [individualTitle, setIndividualTitle] = useState("");
  const [individualMessage, setIndividualMessage] = useState("");
  const [sendingIndividual, setSendingIndividual] = useState(false);

  const sendIndividualNotification = async () => {
    if (!email || !individualTitle || !individualMessage) {
      setError("Please fill in all fields for individual message");
      return;
    }

    setSendingIndividual(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/send-individual`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            title: individualTitle,
            message: individualMessage,
          }),
        },
      );

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Server response: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to send notification: ${response.statusText}`,
        );
      }

      setSuccess("Individual notification sent successfully!");
      setEmail("");
      setIndividualTitle("");
      setIndividualMessage("");
    } catch (error: any) {
      console.error("Error details:", error);
      setError(error.message || "Failed to send individual notification");
    } finally {
      setSendingIndividual(false);
    }
  };

  const sendGroupNotification = async () => {
    if (!selectedGroup || !groupTitle || !groupMessage) {
      setError("Please fill in all fields for group message");
      return;
    }

    setSending(true);
    setError("");
    setSuccess("");

    try {
      console.log(
        "Sending notification to:",
        `${API_BASE_URL}/api/notifications/send`,
      );
      console.log("Payload:", {
        segment: selectedGroup,
        title: groupTitle,
        message: groupMessage,
      });

      const response = await fetch(`${API_BASE_URL}/api/notifications/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          segment: selectedGroup,
          title: groupTitle,
          message: groupMessage,
        }),
      });

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Server response: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to send notification: ${response.statusText}`,
        );
      }

      setSuccess("Group notification sent successfully!");
      setGroupTitle("");
      setGroupMessage("");
      setSelectedGroup("");
    } catch (error: any) {
      console.error("Error details:", error);
      setError(error.message || "Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-2xl p-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-black dark:text-white">
              Send Push Notifications
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Send notifications to individual users or groups
            </p>
          </div>
          <button
            onClick={() => router.push("/admin")}
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Individual User Notification Section */}
        <div className="mb-8 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
            Send to Individual User
          </h3>

          {error && (
            <div className="bg-red-50 text-red-600 mb-4 rounded-md p-4">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4">
              <div className="rounded-md bg-green-50 p-4 text-green-600">
                {success}
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              User Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Notification Title
            </label>
            <input
              type="text"
              value={individualTitle}
              onChange={(e) => setIndividualTitle(e.target.value)}
              placeholder="Enter notification title"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Message
            </label>
            <textarea
              value={individualMessage}
              onChange={(e) => setIndividualMessage(e.target.value)}
              placeholder="Enter notification message"
              rows={4}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <button
            onClick={sendIndividualNotification}
            disabled={
              sendingIndividual ||
              !email ||
              !individualTitle ||
              !individualMessage
            }
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white transition hover:bg-opacity-90 disabled:bg-opacity-50"
          >
            {sendingIndividual ? "Sending..." : "Send Individual Notification"}
          </button>
        </div>

        {/* Group Notification Section */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
            Send to User Group
          </h3>

          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Select User Group
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
              <option value="">Select a group</option>
              {userGroups.map((group) => (
                <option key={group.value} value={group.value}>
                  {group.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Notification Title
            </label>
            <input
              type="text"
              value={groupTitle}
              onChange={(e) => setGroupTitle(e.target.value)}
              placeholder="Enter notification title"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Message
            </label>
            <textarea
              value={groupMessage}
              onChange={(e) => setGroupMessage(e.target.value)}
              placeholder="Enter notification message"
              rows={4}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <button
            onClick={sendGroupNotification}
            disabled={sending || !selectedGroup || !groupTitle || !groupMessage}
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white transition hover:bg-opacity-90 disabled:bg-opacity-50"
          >
            {sending ? "Sending..." : "Send Group Notification"}
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default NotificationsPage;
