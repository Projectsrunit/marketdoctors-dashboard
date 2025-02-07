"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    phone: "",
    gender: "",
    role: 3,
  });
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        formData,
      );
      toast.success("User created Successfully");
    } catch (error) {
      console.error("Error creating user:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"    >
      <h2 className="mb-4 text-center text-2xl font-bold">Create Doctor /CHEW</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label htmlFor="firstName" className="text-gray-700 mb-2 block text-sm font-medium">First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            required
            className="border-stroke w-full rounded border p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="text-gray-700 mb-2 block text-sm font-medium">Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            required
            className="border-stroke w-full rounded border p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="text-gray-700 mb-2 block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="border-stroke w-full rounded border p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="text-gray-700 mb-2 block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="border-stroke w-full rounded border p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dateOfBirth" className="text-gray-700 mb-2 block text-sm font-medium">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            onChange={handleChange}
            required
            className="border-stroke w-full rounded border p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="text-gray-700 mb-2 block text-sm font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            required
            className="border-stroke w-full rounded border p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="text-gray-700 mb-2 block text-sm font-medium">Role</label>
          <select
            name="role"
            onChange={handleChange}
            required
            className="border-stroke w-full rounded border p-2"
          >
            <option value="3">Doctor</option>
            <option value="4">Chew</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="gender" className="text-gray-700 mb-2 block text-sm font-medium">Gender</label>
          <select
            name="gender"
            onChange={handleChange}
            required
            className="border-stroke w-full rounded border p-2"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full rounded bg-blue-500 p-2 text-white transition hover:bg-blue-600"
      >
        Create User
      </button>
    </form>
  );
};

export default AddUserForm;
