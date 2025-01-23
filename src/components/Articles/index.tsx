"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../common/Loader";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
interface Article {
  id: string;
  attributes: {
    title: string;
    description: string;
    category: string;
    feauture_image: string;
  };
}

const Articles = () => {
  const [showModal, setShowModal] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    feature_image: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/health-tips`);
        setArticles(response.data.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleArticleClick = (article: any) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      title: "",
      description: "",
      category: "",
      feature_image: null,
    });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e: any) => {
    setFormData((prevState) => ({
      ...prevState,
      feature_image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Form data preparation
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    if (formData.feature_image) {
      data.append("feature_image", formData.feature_image);
    }

    // Post data to the backend
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/health-tips`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log("Health tip posted:", response.data);
      handleCloseModal(); // Close the modal after posting
    } catch (error) {
      console.error("Error posting health tip:", error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between border-b border-stroke px-5 py-6 dark:border-white">
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Market Doctor Articles{" "}
              </h3>
              <button
                onClick={() => setShowModal(!showModal)}
                className="text-primary underline hover:no-underline dark:text-white"
              >
                {showModal ? "Cancel" : "Add Article"}
              </button>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              {/* Display articles */}
              <div className="space-y-5">
                {loading ? (
                  <p>
                    <Loader />
                  </p> 
                ) : (
                  articles.map((article) => (
                    <div
                      key={article.id}
                      className="cursor-pointer"
                      onClick={() => handleArticleClick(article)}
                    >
                      <img
                        src={article.attributes.feauture_image}
                        className="h-40 w-40 rounded border border-stroke object-cover dark:border-strokedark"
                      />
                      <h3 className="text-lg font-medium">
                        {article.attributes.title}
                      </h3>
                      <p>{article.attributes.description}</p>
                      <p className="text-sm font-bold dark:text-white">
                        Category: {article.attributes.category}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for submitting health tips */}
      {showModal && (
        <div>
          <div className="p-6">
            <h3 className="mb-4 text-xl font-medium">Submit Health Tip</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-stroke p-3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full rounded-lg border-[1.5px] border-stroke p-3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-stroke p-3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Attach Feature Image
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke p-3"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-400 w-1/4 py-3 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/4 bg-primary py-3 text-white"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Articles;
