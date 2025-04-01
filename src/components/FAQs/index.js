import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import "./index.css";

const FAQs = () => {
  const [electives, setElectives] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [requests, setRequests] = useState([]);
  const [expandedElective, setExpandedElective] = useState(null);
  const [newFeedback, setNewFeedback] = useState({ electiveID: "", rating: 0, comments: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch electives
        const electivesRes = await fetch("http://localhost:5000/api/electives");
        if (!electivesRes.ok) throw new Error("Failed to fetch electives");
        const electivesData = await electivesRes.json();
        setElectives(electivesData);
        // Fetch feedbacks for each elective
        const feedbackPromises = electivesData.map(async (elective) => {
          const feedbackRes = await fetch(`http://localhost:5000/api/courses/feedbacks?electiveID=${elective.id}`);
          if (!feedbackRes.ok) return { electiveID: elective.id, feedbacks: [] };
          const feedbackData = await feedbackRes.json();
          return { electiveID: elective.id, feedbacks: feedbackData };
        });

        const feedbackResults = await Promise.all(feedbackPromises);
        const feedbackMap = {};
        feedbackResults.forEach(({ electiveID, feedbacks }) => {
          feedbackMap[electiveID] = feedbacks;
        });
        setFeedbacks(feedbackMap);

        // Fetch requests (limit to 30)
        const requestsRes = await fetch("http://localhost:5000/api/get-requests");
        if (!requestsRes.ok) throw new Error("Failed to fetch requests");
        const requestsData = await requestsRes.json();
        setRequests(requestsData.slice(0, 30));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleExpandedElective = (id) => {
    setExpandedElective((prevID) => (prevID === id ? null : id));
  };

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setNewFeedback({ ...newFeedback, [name]: value });
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    console.log(newFeedback);
    try {
      const res = await fetch(`http://localhost:5000/api/feedback-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFeedback),
      });
      if (!res.ok) throw new Error("Failed to submit feedback");

      // Update feedbacks state after submission
      setFeedbacks((prevFeedbacks) => ({
        ...prevFeedbacks,
        [newFeedback.electiveID]: [...(prevFeedbacks[newFeedback.electiveID] || []), newFeedback],
      }));

      setNewFeedback({ electiveID: "", rating: 0, comments: "" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5 faqs-container">
        <h1 className="text-center mb-5">Frequently Asked Questions (FAQs)</h1>

        {/* Feedbacks Section */}
        <h2 className="section-title">Feedbacks on Electives</h2>
        <div className="accordion" id="electiveAccordion">
          {electives.map((elective) => (
            <div key={elective.id} className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${expandedElective === elective.id ? "" : "collapsed"}`}
                  type="button"
                  onClick={() => toggleExpandedElective(elective.id)}
                >
                  {elective.name} - {elective.id}
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${expandedElective === elective.id ? "show" : ""}`}>
                <div className="accordion-body">
                  <p><strong>A few student feedbacks:</strong></p>

                  {/* Feedback Carousel */}
                  <div id={`carousel-${elective.id}`} className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                      {feedbacks[elective.electiveID]?.length === 0 ? (
                        <div className="carousel-item active">
                          <p>No feedbacks available</p>
                        </div>
                      ) : (
                        feedbacks[elective.id]?.map((feedback, index) => (
                          <div key={`${elective.id}-feedback-${index}`} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                            <p>{feedback.comments}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${elective.id}`} data-bs-slide="prev">
                      <span className="carousel-control-prev-icon"></span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${elective.id}`} data-bs-slide="next">
                      <span className="carousel-control-next-icon"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Feedback Form */}
        <h2 className="section-title mt-5">Submit Feedback</h2>
        <form onSubmit={submitFeedback} className="feedback-form">
          <div className="mb-3">
            <select className="form-select" name="electiveID" value={newFeedback.id} onChange={handleFeedbackChange} required>
              <option value="">Select an elective</option>
              {electives.map((elective) => (
                <option key={`elective-option-${elective.id}`} value={elective.id}>
                  {elective.name} - {elective.id}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <input type="number" className="form-control" name="rating" value={newFeedback.rating} onChange={handleFeedbackChange} placeholder="Rating (0-5)" min="0" max="5" required />
          </div>
          <div className="mb-3">
            <textarea className="form-control" name="comments" value={newFeedback.comments} onChange={handleFeedbackChange} placeholder="Your feedback" required></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>

        {/* Requests Section */}
        <h2 className="section-title mt-5">Pending Requests</h2>
        <div className="list-group">
          {requests.length === 0 ? (
            <p>No pending requests</p>
          ) : (
            requests.map((request, index) => (
              <div key={`request-${index}`} className="list-group-item">
                <p><strong>Elective:</strong> {request.id}</p>
                <p><strong>Reason:</strong> {request.reason}</p>
                <p><strong>Status:</strong> <span className={`badge bg-${request.status === "Approved" ? "success" : "warning"}`}>{request.status}</span></p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default FAQs;
