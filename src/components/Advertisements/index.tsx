"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../common/Loader";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

interface Article {
  id: string;
  attributes: {
    text: string;
    description: string;
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
    createdAt: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(false);

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

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setFormData({
      text: article.attributes.text,
      createdAt: article.attributes.createdAt,
      image_url: article.attributes.image_url,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
    setFormData({
      text: "",
      createdAt: "",
      image_url: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prevState: any) => ({
        ...prevState,
        // @ts-ignore
        image_url: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("text", formData.text);
    data.append("createdAt", formData.createdAt);
    if (formData.image_url) {
      data.append("feature_image", formData.image_url);
    }

    setLoading(true);

    try {
      if (selectedArticle) {
        await axios.put(
          `${API_BASE_URL}/api/adverts/${selectedArticle.id}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.id === selectedArticle.id
              ? {
                  ...article,
                  attributes: { ...article.attributes, ...formData },
                }
              : article,
          ),
        );
      } else {
        const response = await axios.post(`${API_BASE_URL}/api/adverts`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setArticles((prevArticles) => [...prevArticles, response.data.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting article:", error);
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
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 absolute right-3 top-3 rounded-full p-2"
              aria-label="Close modal"
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
                  onChange={handleInputChange}
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
                  onChange={handleImageChange}
                  className="w-full cursor-pointer rounded-lg border p-3"
                />
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
                  {selectedArticle ? "Update" : "Create"}
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
              onClick={() => handleArticleClick(article)}
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
        {articles.length === 0 && (
          <p className="text-gray-500 text-center">No advertisements found.</p>
        )}
      </div>
    </>
  );
};

export default Advertisement;
