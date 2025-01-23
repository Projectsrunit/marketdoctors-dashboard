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
    feauture_image: "",
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

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setFormData({
      title: article.attributes.title,
      description: article.attributes.description,
      category: article.attributes.category,
      feauture_image: article.attributes.feauture_image,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
    setFormData({
      title: "",
      description: "",
      category: "",
      feauture_image: "",
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
        feauture_image: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    if (formData.feauture_image) {
      data.append("feauture_image", formData.feauture_image);
    }

    setLoading(true);

    try {
      if (selectedArticle) {
        // Update article
        await axios.put(
          `${API_BASE_URL}/api/health-tips/${selectedArticle.id}`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
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
        // Create new article
        const response = await axios.post(
          `${API_BASE_URL}/api/health-tips`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
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
      {/* Modal for creating/editing articles */}
      {showModal && (
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
          <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 className="mb-4 text-xl font-medium dark:text-white">
              {selectedArticle ? "Edit Article" : "Submit Health Tip"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black dark:text-white">
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
                <label className="block text-sm font-medium text-black dark:text-white">
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
                <label className="block text-sm font-medium text-black dark:text-white">
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
                <label className="block text-sm font-medium text-black dark:text-white">
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
                  {loading
                    ? "Loading"
                    : selectedArticle
                      ? "Update Article"
                      : "Post Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Articles list */}
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between border-b border-stroke px-5 py-6 dark:border-white">
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Market Doctor Articles
              </h3>
              <button
                onClick={() => setShowModal(!showModal)}
                className="text-primary underline hover:no-underline dark:text-white"
              >
                {showModal ? "Cancel" : "Add Article"}
              </button>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div className="space-y-5">
                {loading ? (
                  <p>Loading .....</p>
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
                      <h3 className="text-lg font-medium dark:text-white">
                        {article.attributes.title}
                      </h3>
                      <p className="dark:text-white">
                        {article.attributes.description}
                      </p>
                      <p className="text-sm font-bold dark:text-white">
                        Category: {article.attributes.category}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-center">
                {articles.length === 0 && <p>No articles found</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Articles;
