import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import "./index.css";

const Courses = () => {
  const [electives, setElectives] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [facultyData, setFacultyData] = useState({});
  const [expandedElective, setExpandedElective] = useState(null);

  useEffect(() => {
    const fetchElectives = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses/electives");
        if (!response.ok) throw new Error("Failed to fetch electives");
        const data = await response.json();
        setElectives(data);

        const detailsPromises = data.map(async (elective) => {
          try {
            const [feedbackResponse, facultyResponse] = await Promise.all([
              fetch(`http://localhost:5000/api/courses/feedbacks?electiveID=${elective.electiveID}`),
              fetch(`http://localhost:5000/api/courses/faculty?electiveID=${elective.electiveID}`)
            ]);

            if (!feedbackResponse.ok || !facultyResponse.ok) {
              throw new Error("Failed to fetch details for elective " + elective.electiveID);
            }

            const [feedbackData, facultyData] = await Promise.all([
              feedbackResponse.json(),
              facultyResponse.json()
            ]);

            return { electiveID: elective.electiveID, feedbackData, facultyData };
          } catch (error) {
            console.error("Error fetching details for elective:", elective.electiveID, error);
            return null;
          }
        });

        const detailsData = await Promise.all(detailsPromises);

        const feedbackMap = {};
        const facultyMap = {};
        detailsData.forEach((detail) => {
          if (detail) {
            feedbackMap[detail.electiveID] = detail.feedbackData;
            facultyMap[detail.electiveID] = detail.facultyData;
          }
        });

        setFeedbacks(feedbackMap);
        setFacultyData(facultyMap);
      } catch (error) {
        console.error("Error fetching electives:", error);
      }
    };

    fetchElectives();
  }, []);

  const toggleExpandedElective = (electiveID) => {
    setExpandedElective((prevID) => (prevID === electiveID ? null : electiveID));
  };

  return (
    <>
      <Navbar />
      <div className="container py-5 courses-container">
        <h1 className="text-center mb-5">Available Courses</h1>
        {electives.map((elective) => (
          <div key={elective.electiveID} className="course-card">
            <h3>{elective.electiveName}</h3>
            <button
              className="toggle-btn"
              onClick={() => toggleExpandedElective(elective.electiveID)}
            >
              {expandedElective === elective.electiveID ? "Hide Details" : "View Details"}
            </button>

            <div className={`course-details ${expandedElective === elective.electiveID ? "expanded" : ""}`}>
              <p><strong>Description:</strong> {elective.description}</p>
              <p>
  <strong>Students:</strong> {elective.studentsEnrolled.length} |{" "}
  <strong>Faculty:</strong>{" "}
  {facultyData[elective.electiveID]?.name || "Not Assigned"}
</p>

              <div id={`carousel-${elective.electiveID}`} className="carousel slide" data-bs-ride="carousel">
                <div>
                  {feedbacks[elective.electiveID]?.length === 0 ? (
                    <strong>No feedbacks</strong>
                  ) : (
                    <div className="carousel-inner">
                      {feedbacks[elective.electiveID]?.map((feedback, index) => (
                        <div
                          key={feedback.feedbackID || `feedback-${elective.electiveID}-${index}`}
                          className={`carousel-item ${index === 0 ? "active" : ""}`}
                        >
                          <p>{feedback.comments}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Courses;
