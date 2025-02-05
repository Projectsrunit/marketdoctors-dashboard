"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Loader from '@/components/common/Loader';

interface ChewPayment {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bank_code?: string;
  account_number?: string;
  recipient_code?: string;
}

const ChewPaymentPage = () => {
  const params = useParams();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  
  const [chew, setChew] = useState<ChewPayment | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [transferLoading, setTransferLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    const fetchChewDetails = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/users/${params.id}?populate=*`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch chew details');
        }
        const data = await response.json();
        setChew({
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          bank_code: data.bank_code,
          account_number: data.account_number,
          recipient_code: data.recipient_code
        });
      } catch (error) {
        setError('Failed to load CHEW details');
      } finally {
        setLoading(false);
      }
    };

    fetchChewDetails();
  }, [API_BASE_URL, params.id]);

  const createTransferRecipient = async () => {
    if (!chew?.bank_code || !chew?.account_number) {
      setError('Bank details are not complete');
      return null;
    }

    try {
      const response = await fetch('/api/paystack/create-recipient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'nuban',
          name: `${chew.firstName} ${chew.lastName}`,
          account_number: chew.account_number,
          bank_code: chew.bank_code,
          currency: 'NGN'
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create transfer recipient');
      }

      return data.data.recipient_code;
    } catch (error) {
      setError('Failed to create transfer recipient');
      return null;
    }
  };

  const initiateTransfer = async () => {
    setTransferLoading(true);
    setError('');
    setSuccess('');

    try {
      let recipientCode = chew?.recipient_code;

      if (!recipientCode) {
        recipientCode = await createTransferRecipient();
        if (!recipientCode) {
          return;
        }

        // Save recipient code to user profile
        await fetch(`${API_BASE_URL}/api/users/${chew?.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipient_code: recipientCode
          }),
        });
      }

      const response = await fetch('/api/paystack/initiate-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: recipientCode,
          amount: parseFloat(amount) * 100, // Convert to kobo
          reason: `Payment to ${chew?.firstName} ${chew?.lastName}`
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Transfer failed');
      }

      setSuccess('Transfer initiated successfully!');
      setAmount('');
    } catch (error: any) {
      setError(error.message || 'Failed to process transfer');
    } finally {
      setTransferLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 className="mb-6 text-2xl font-semibold text-black dark:text-white">
          Pay CHEW: {chew?.firstName} {chew?.lastName}
        </h2>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-md bg-green-50 p-4 text-green-600">
            {success}
          </div>
        )}

        <div className="mb-4">
          <label className="mb-2.5 block text-black dark:text-white">
            Amount (NGN)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount in NGN"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        {(!chew?.bank_code || !chew?.account_number) && (
          <div className="mb-4 rounded-md bg-yellow-50 p-4 text-yellow-600">
            Please ensure the CHEW has added their bank details before making a transfer.
          </div>
        )}

        <button
          onClick={initiateTransfer}
          disabled={transferLoading || !amount || !chew?.bank_code || !chew?.account_number}
          className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white disabled:bg-opacity-50"
        >
          {transferLoading ? 'Processing...' : 'Initiate Transfer'}
        </button>
      </div>
    </div>
  );
};

export default ChewPaymentPage; 