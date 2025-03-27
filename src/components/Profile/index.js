import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './index.css';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setRole(data.role);
          } else {
            setError('User profile not found.');
          }
        } catch (err) {
          setError('Failed to fetch user data. Please try again later.');
          console.error('Firestore Error:', err);
        }
      } else {
        setError('User not logged in');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Student Profile Component
  const StudentProfile = ({ data }) => (
    <div className="profile-card student">
      <h2>Student Profile</h2>
      <div className="profile-details">
        <p><strong>Student ID:</strong> {data.studentID || 'N/A'}</p>
        <p><strong>Name:</strong> {data.name}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Date of Birth:</strong> {data.dob}</p>
        <p><strong>Phone Number:</strong> {data.phoneNumber}</p>
        <p><strong>Year of Study:</strong> {data.yearOfStudy || 'N/A'}</p>
        <p><strong>Section:</strong> {data.section || 'N/A'}</p>
        <p><strong>Preferred Electives:</strong> {data.preferredElectives ? data.preferredElectives.join(', ') : 'None'}</p>
        <p><strong>Allotted Elective:</strong> {data.allottedElective || 'None'}</p>
        <p><strong>Status:</strong> {data.status || 'N/A'}</p>
      </div>
    </div>
  );

  // 🔹 Faculty Profile Component
  const FacultyProfile = ({ data }) => (
    <div className="profile-card faculty">
      <h2>Faculty Profile</h2>
      <div className="profile-details">
        <p><strong>Faculty ID:</strong> {data.facultyID || 'N/A'}</p>
        <p><strong>Name:</strong> {data.name}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Date of Birth:</strong> {data.dob}</p>
        <p><strong>Phone Number:</strong> {data.phoneNumber}</p>
        <p><strong>Department:</strong> {data.department}</p>
        <p><strong>Allocated Elective Class:</strong> {data.allocatedElectiveClass ? data.allocatedElectiveClass.join(', ') : 'None'}</p>
      </div>
    </div>
  );

  // 🔹 Admin Profile Component
  const AdminProfile = ({ data }) => (
    <div className="profile-card admin">
      <h2>Admin Profile</h2>
      <div className="profile-details">
        <p><strong>Admin ID:</strong> {data.adminID || 'N/A'}</p>
        <p><strong>Name:</strong> {data.name}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Date of Birth:</strong> {data.dob}</p>
      </div>
    </div>
  );

  // 🔹 Loading and Error Handling
  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!userData) {
    return <div className="no-data">No profile data available</div>;
  }

  return (
    <div className="profile-container">
      {role === 'student' && <StudentProfile data={userData} />}
      {role === 'faculty' && <FacultyProfile data={userData} />}
      {role === 'admin' && <AdminProfile data={userData} />}
    </div>
  );
};

export default ProfilePage;
