import { useState, useEffect } from "react";
import Slider from "react-slick"; // Importing Slider from react-slick
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./index.css"; // Importing CSS for styling

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true); // Loading state for feedbacks
  const [feedbacks, setFeedbacks] = useState([]); // State to hold feedback data
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await fetch("http://localhost:5000/api/auth-status", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem("token"); // Clear token if invalid
          }
        } catch (error) {
          console.error("Error verifying authentication:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/feedbacks"); // Fetch feedback data from the backend
        const data = await response.json();
        setFeedbacks(data); // Set the feedback data to state
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      } finally {
        setLoadingFeedbacks(false); // Set loading to false after fetching
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-black home-main">
      <Navbar />
      <div className="wrap-home">
      <div className="flex flex-col items-center justify-center h-[30vh] text-center p-5">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-home text-5xl font-extrabold drop-shadow-lg"
        >
          Manage Your Electives Easily
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="para-home text-lg mt-4 max-w-xl"
        >
          A seamless platform to explore, choose, and manage your electives with ease.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-6"
        >
          {isAuthenticated ? (
            <Link to="/dashboard">
              <button className="px-6 py-3 text-lg font-semibold rounded-lg shadow-md bg-yellow-400 hover:scale-105 transition-transform">
                Go to Dashboard
              </button>
            </Link>
          ) : (
            <button
              className="px-6 py-3 text-lg font-semibold rounded-lg shadow-md bg-gray-400 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate("/login")}
            >
              Login to Access
            </button>
          )}
        </motion.div>
      </div>
      <div className="feedback-container">
        {loadingFeedbacks ? ( // Show loading state
          <div className="loader">
            <div className="spinner"></div>
            <p>Loading feedbacks...</p>
          </div>
        ) : (
          <Slider dots={false} infinite={true} speed={500} slidesToShow={1} slidesToScroll={1} className="feedback-grid">
        {feedbacks.slice(0, 9).map((feedback, index) => (
              <div key={index} className="feedback-item">
                <p>{feedback.comments}</p>
                <h4>{feedback.studentName}</h4> 
              </div>
        ))}
      </Slider>
            )}
      </div>
      </div>
      
    </div>
  );
}
