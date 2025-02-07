"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../common/Loader";
import { toast } from "react-toastify";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

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
  const [loadingState, setLoadingState] = useState<string | null>(null); // Handles loading state for different processes
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoadingState("fetching");
        const response = await axios.get(`${API_BASE_URL}/api/health-tips`);
        setArticles(response.data.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
        toast.error("Failed to fetch articles.");
      } finally {
        setLoadingState(null);
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
  
    setLoadingState("uploading");
    const form = new FormData();
    form.append("file", file);
  
    try {
      const getUrl = await fetch(`${API_BASE_URL}/api/file-forward/image`, {
        method: "POST",
        body: form,
      });
  
      const imageUrl = await getUrl.json();
      console.log("Upload response:", imageUrl);  // Debugging the response
  
      if (!imageUrl?.fileUrl) throw new Error("Invalid upload response");
  
      setFormData((prevState) => ({
        ...prevState,
        feauture_image: imageUrl.fileUrl,  // Ensure this URL is correct
      }));
  
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
    } finally {
      setLoadingState(null);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only require image for new articles, not for updates
    if (!formData.feauture_image) {
      toast.error("Please upload an image first.");
      return;
    }
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    if (formData.feauture_image) {
      data.append("feature_image", formData.feauture_image);
    }

    setLoadingState("submitting");

    const payload = {
      data: {
        ...formData,
      }
    };

    try {
      if (selectedArticle) {
        // Update article
        await axios.put(
          `${API_BASE_URL}/api/health-tips/${selectedArticle.id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.id === selectedArticle.id
              ? {
                  ...article,
                  attributes: { 
                    ...article.attributes,
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    feauture_image: formData.feauture_image || article.attributes.feauture_image
                  },
                }
              : article
          )
        );
      } else {
        // Create new article
        const response = await axios.post(
          `${API_BASE_URL}/api/health-tips`,
          payload,
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

        setArticles((prevArticles) => [...prevArticles, response.data.data]);
      }
      
      toast.success(selectedArticle ? "Article updated successfully!" : "Article created successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting article:", error);
      toast.error("Failed to submit article.");
    } finally {
      setLoadingState(null);
    }
  };

  const handleDeleteArticle = async (articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    setLoadingState("deleting");
    try {
      await axios.delete(`${API_BASE_URL}/api/health-tips/${articleId}`);
      
      setArticles((prevArticles) => 
        prevArticles.filter(article => article.id !== articleId)
      );
      
      toast.success("Article deleted successfully!");
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article.");
    } finally {
      setLoadingState(null);
    }
  };

  if (loadingState === "fetching") return <Loader />;

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
                  required
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
                  required
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
                  accept="image/*"
                  required={!selectedArticle} // Only required for new articles
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
                  disabled={loadingState === "uploading"}
                >
                  {loadingState === "uploading"
                    ? "Uploading..."
                    : "Upload Image"}
                </button>
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
                  disabled={loadingState === "submitting"}
                >
                  {loadingState === "submitting"
                    ? "Submitting..."
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
                {loadingState === "fetching" ? (
                  <p>Loading ...</p>
                ) : (
                  articles.map((article) => (
                    <div
                      key={article.id}
                      className="relative"
                    >
                      <div className="absolute right-2 top-2 z-10 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArticleClick(article);
                          }}
                          className="rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
                          title="Edit article"
                        >
                          <FaPencilAlt className="text-primary" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteArticle(article.id, e)}
                          className="rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
                          title="Delete article"
                        >
                          <FaTrash className="text-red" />
                        </button>
                      </div>
                      <div className="cursor-pointer">
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
