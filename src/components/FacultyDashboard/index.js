import React, { useEffect, useState } from "react";
import "animate.css"; // Animations
import "./index.css"; // Custom styles
import Cookies from "js-cookie";
import Navbar from "../Navbar";

const FacultyDashboard = () => {
  const [faculty, setFaculty] = useState(null);
  const [scheduleText, setScheduleText] = useState("");
  const [electives, setElectives] = useState([]);
  const [loading, setLoading] = useState(true);

  const facultyID = Cookies.get("facultyID");

  useEffect(() => {
    if (!facultyID) {
      console.error("No faculty ID found in cookies.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/faculty?facultyId=${facultyID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch faculty data");
        }

        const data = await response.json();

        // Combine schedule into a single text
        let combinedSchedule = "";
        data.schedule.forEach((item) => {
          combinedSchedule += item;
        });
        console.log(data)
        setScheduleText(combinedSchedule.trim());
        console.log(data.electives);
        setFaculty(data.faculty);
        setElectives(data.electives || []);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [facultyID]);

  return (
    <>
      <Navbar />
      <div className="faculty-dashboard container-fluid py-5">
        <h2 className="text-center mb-4 animate__animated animate__fadeInDown">
          Faculty Dashboard
        </h2>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {/* Faculty Details */}
            {faculty ? (
              <div className="faculty-details card shadow-sm p-3 mb-4">
                <h3>Welcome, {faculty.name}</h3>
                <p>
                  <strong>Email:</strong> {faculty.email}
                </p>
                <p>
                  <strong>Department:</strong> {faculty.department}
                </p>
                <p>
                  <strong>Phone:</strong> {faculty.phoneNumber}
                </p>
              </div>
            ) : (
              <p className="text-muted text-center">No faculty details found.</p>
            )}

            {/* Electives Section with Combined Schedule */}
            <div className="electives mt-4">
              <h3>Your Electives & Schedule</h3>
              <div className="elective-box card p-3">
                <h5>Electives</h5>
                <pre>{electives.length > 0 ? electives[0].id : "No electives assigned"}</pre>
                <h5 className="mt-3">Schedule</h5>
                <pre>{scheduleText || "No schedule available"}</pre>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default FacultyDashboard;
