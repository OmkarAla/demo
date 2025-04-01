import React, { useState, useEffect } from "react";
import Navbar from "../Navbar"; // Import Navbar
import Cookies from "js-cookie";
import "./index.css";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  const name = Cookies.get("name");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user?name=${name}`);
        if (!response.ok) throw new Error("Failed to fetch user data.");

        const data = await response.json();
        setUserData(data);
        setRole(data.role);
        setFormData(data); // Initialize form data for editing
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/change-user-details?name=${name}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData }),
      });

      if (!response.ok) throw new Error("Failed to update profile.");

      alert("Profile updated successfully!");
      setUserData(formData);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating profile.");
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!userData) return <div className="no-data">No profile data available</div>;

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Profile</h2>

        {!editMode ? (
          <div className="profile-details">
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Date of Birth:</strong> {userData.dob}</p>
            <p><strong>Phone Number:</strong> {userData.phoneNumber}</p>

            {role === "student" && (
              <>
                <p><strong>Year of Study:</strong> {userData.yearOfStudy || "N/A"}</p>
                <p><strong>Section:</strong> {userData.section || "N/A"}</p>
                <p><strong>Preferred Electives:</strong> {userData.preferredElectives?.join(", ") || "None"}</p>
                <p><strong>Allotted Elective:</strong> {userData.allottedElective || "None"}</p>
                <p><strong>Status:</strong> {userData.status || "N/A"}</p>
              </>
            )}

            {role === "faculty" && (
              <>
                <p><strong>Department:</strong> {userData.department}</p>
                <p><strong>Allocated Elective Class:</strong> {userData.allocatedElectiveClass?.join(", ") || "None"}</p>
              </>
            )}

            <button onClick={() => setEditMode(true)} className="edit-btn">Edit Profile</button>
          </div>
        ) : (
          <form className="profile-form" onSubmit={handleSubmit}>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />

            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} disabled />

            <label>Date of Birth:</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} />

            <label>Phone Number:</label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />

            {role === "student" && (
              <>
                <label>Year of Study:</label>
                <input type="text" name="yearOfStudy" value={formData.yearOfStudy || ""} onChange={handleChange} />

                <label>Section:</label>
                <input type="text" name="section" value={formData.section || ""} onChange={handleChange} />
              </>
            )}

            {role === "faculty" && (
              <>
                <label>Department:</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} />
              </>
            )}

            <div className="form-buttons">
              <button type="submit" className="save-btn">Save Changes</button>
              <button type="button" className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
