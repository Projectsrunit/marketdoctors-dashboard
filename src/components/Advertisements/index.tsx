"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../common/Loader";
import { toast } from "react-toastify";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

interface Article {
  id: string;
  attributes: {
    text: string;
    createdAt: string;
    image_url: string;
  };
}

const Advertisement = () => {
  const [showModal, setShowModal] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    text: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/adverts`);
        setArticles(response.data.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
    setFormData({ text: "", image_url: "" });
    setFile(null);
    setFilePreview(null);
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
  
    setUploading(true);
    const formm = new FormData();
    formm.append("file", file);
  
    try {
      const getUrl = await fetch(`${API_BASE_URL}/api/file-forward/image`, {
        method: "POST",
        body: formm,
      });
  
      const imageUrl = await getUrl.json();
      if (!imageUrl?.fileUrl) throw new Error("Invalid upload response");
  
      setFormData((prevState) => ({
        ...prevState,
        image_url: imageUrl.fileUrl,
      }));
  
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.image_url) {
      toast.error("Please upload an image first.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        data: { text: formData.text, image_url: formData.image_url },
      };

      const response = await fetch(`${API_BASE_URL}/api/adverts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit advertisement");

      toast.success("Advertisement submitted successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting advertisement:", error);
      toast.error("Failed to submit advertisement.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <button
              type="button"
              onClick={handleCloseModal}
              className="bg-gray-200 hover:bg-gray-300 absolute right-3 top-3 rounded-full p-2"
            >
              ✕
            </button>

            <h3 className="mb-4 text-xl font-semibold">
              {selectedArticle ? "Edit Advertisement" : "Create Advertisement"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="text"
                  value={formData.text}
                  onChange={(e) =>
                    setFormData({ ...formData, text: e.target.value })
                  }
                  className="w-full rounded-lg border p-3"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">
                  Feature Image
                </label>

                <input
                  type="file"
                  onChange={handleFileChange}
                  className="mb-2"
                />
                {filePreview && (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="mb-2 h-24 w-24 rounded-md object-cover"
                  />
                )}

                <button
                  type="button"
                  className="w-full rounded-md bg-primary p-2 text-white"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                </button>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-400 hover:bg-gray-500 rounded-lg px-4 py-2 text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  {selectedArticle ? "Update" : "Create Advertisement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold dark:text-white">Advertisements</h1>
          <button
            onClick={() => setShowModal(true)}
            className="text-primary underline hover:no-underline dark:text-white"
          >
            Add Advertisement
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="cursor-pointer rounded-lg border p-4 shadow-md hover:shadow-lg"
              onClick={() => setSelectedArticle(article)}
            >
              <img
                src={article.attributes.image_url}
                alt="Advertisement"
                className="mb-4 h-40 w-full rounded object-cover"
              />
              <h3 className="text-lg font-semibold dark:text-white">
                {article.attributes.text}
              </h3>
              <p className="text-gray-500 text-sm dark:text-white">
                Created At: {article.attributes.createdAt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Advertisement;
