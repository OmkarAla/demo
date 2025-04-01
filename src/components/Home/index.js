import { useState, useEffect } from "react";
import Slider from "react-slick";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./index.css";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
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
          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem("token");
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
        const response = await fetch("http://localhost:5000/api/feedbacks");
        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      } finally {
        setLoadingFeedbacks(false);
      }
    };
    fetchFeedbacks();
  }, []);

  // Slider settings for better transition
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(feedbacks.length, 3), // Show up to 3 slides at once
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

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

        {/* Feedback Carousel */}
        <div className="feedback-container">
          {loadingFeedbacks ? (
            <div className="loader">
              <div className="spinner"></div>
              <p>Loading feedbacks...</p>
            </div>
          ) : (
            <Slider {...sliderSettings} className="feedback-slider">
              {feedbacks.slice(0,24).map((feedback, index) => (
                <div key={index} className="feedback-item">
                  <p className="feedback-comment">"{feedback.comments}"</p>
                  <h4 className="feedback-author">- {feedback.studentName}</h4>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
    </div>
  );
}
