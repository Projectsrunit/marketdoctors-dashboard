"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../common/Loader";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (selectedArticle) {
      setFormData({
        text: selectedArticle.attributes.text,
        image_url: selectedArticle.attributes.image_url,
      });
      setFilePreview(selectedArticle.attributes.image_url);
    }
  }, [selectedArticle]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/adverts`);
      setArticles(response.data.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to fetch advertisements");
    } finally {
      setLoading(false);
    }
  };

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

      if (selectedArticle) {
        // Update existing advertisement
        const response = await fetch(`${API_BASE_URL}/api/adverts/${selectedArticle.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to update advertisement");
        toast.success("Advertisement updated successfully!");
      } else {
        // Create new advertisement
        const response = await fetch(`${API_BASE_URL}/api/adverts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to submit advertisement");
        toast.success("Advertisement created successfully!");
      }

      handleCloseModal();
      fetchArticles();
    } catch (error) {
      console.error("Error submitting advertisement:", error);
      toast.error(selectedArticle ? "Failed to update advertisement." : "Failed to submit advertisement.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!articleToDelete) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/adverts/${articleToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete advertisement");

      toast.success("Advertisement deleted successfully!");
      setShowDeleteConfirm(false);
      setArticleToDelete(null);
      fetchArticles();
    } catch (error) {
      console.error("Error deleting advertisement:", error);
      toast.error("Failed to delete advertisement.");
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
              className="absolute right-3 top-3 rounded-full bg-gray-200 p-2 hover:bg-gray-300"
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
                  {uploading ? "Uploading..." : "Upload Image"}
                </button>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-lg bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
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

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
          <div className="relative mx-4 w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-boxdark">
            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
              Confirm Delete
            </h3>
            <p className="mb-6 text-base text-body-color dark:text-bodydark">
              Are you sure you want to delete this advertisement?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setArticleToDelete(null);
                }}
                className="min-w-[100px] rounded-lg border border-stroke bg-white px-6 py-2.5 text-center text-sm font-medium text-black shadow-sm transition-all hover:bg-gray-100 dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:bg-opacity-90"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="min-w-[100px] rounded-lg bg-danger px-6 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:bg-opacity-90 dark:bg-danger dark:hover:bg-opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold dark:text-white">Advertisements</h1>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-opacity-90"
          >
            Add Advertisement
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="relative rounded-lg border p-4 shadow-md hover:shadow-lg"
            >
              <div className="absolute right-2 top-2 flex gap-2">
                <button
                  onClick={() => handleEdit(article)}
                  className="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => {
                    setArticleToDelete(article);
                    setShowDeleteConfirm(true);
                  }}
                  className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200"
                >
                  <FaTrash />
                </button>
              </div>
              <img
                src={article.attributes.image_url}
                alt="Advertisement"
                className="mb-4 h-40 w-full rounded object-cover"
              />
              <h3 className="text-lg font-semibold dark:text-white">
                {article.attributes.text}
              </h3>
              <p className="text-sm text-gray-500 dark:text-white">
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
