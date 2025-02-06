"use client";

import React, { useState } from 'react';
import Loader from '@/components/common/Loader';
import { useRouter } from 'next/navigation';

const userGroups = [
  { value: 'chew', label: 'CHEWs (Community Health Workers)' },
  { value: 'doctor', label: 'Doctors' },
  { value: 'patient', label: 'Patients' }
];

const NotificationsPage = () => {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const [sending, setSending] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const sendNotification = async () => {
    if (!selectedGroup || !title || !message) {
      setError('Please fill in all fields');
      return;
    }

    setSending(true);
    setError('');
    setSuccess('');

    try {
      console.log('Sending notification to:', `${API_BASE_URL}/api/notifications/send`);
      console.log('Payload:', {
        segment: selectedGroup,
        title,
        message,
      });

      const response = await fetch(`${API_BASE_URL}/api/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          segment: selectedGroup,
          title,
          message,
        }),
      });

      // Log the raw response for debugging
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Server response: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(data.message || `Failed to send notification: ${response.statusText}`);
      }

      setSuccess('Notification sent successfully!');
      setTitle('');
      setMessage('');
      setSelectedGroup('');
    } catch (error: any) {
      console.error('Error details:', error);
      setError(error.message || 'Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Send Push Notifications
          </h2>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Send targeted notifications to specific user groups
          </p>
        </div>
        <button
          onClick={() => router.push('/admin')}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600">
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter notification title"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter notification message"
            rows={4}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <button
          onClick={sendNotification}
          disabled={sending || !selectedGroup || !title || !message}
          className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white transition hover:bg-opacity-90 disabled:bg-opacity-50"
        >
          {sending ? 'Sending...' : 'Send Notification'}
        </button>
      </div>
    </div>
  );
};

export default NotificationsPage; 