import React, { useState } from 'react';
import './index.css';

const AdminDashboard = () => {
  const [email, setEmail] = useState('');
  const [electiveName, setElectiveName] = useState('');
  const [facultyName, setFacultyName] = useState('');
  const [facultyEmail, setFacultyEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleApproveUser = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/approve-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    setMessage(data.message || data.error);
  };

  const handleAddElective = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/electives-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ electiveName }),
    });
    const data = await response.json();
    setMessage(data.message || data.error);
  };

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/faculty-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ facultyName, email: facultyEmail }),
    });
    const data = await response.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {message && <p>{message}</p>}
      <div className="dashboard-section">
        <h2>Role Approval</h2>
        <form onSubmit={handleApproveUser}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="User Email"
            required
          />
          <button type="submit">Approve User</button>
        </form>
      </div>
      <div className="dashboard-section">
        <h2>Calendar</h2>
        {/* Calendar functionality will be implemented here */}
      </div>
      <div className="dashboard-section">
        <h2>Add Electives</h2>
        <form onSubmit={handleAddElective}>
          <input
            type="text"
            value={electiveName}
            onChange={(e) => setElectiveName(e.target.value)}
            placeholder="Elective Name"
            required
          />
          <button type="submit">Add Elective</button>
        </form>
      </div>
      <div className="dashboard-section">
        <h2>Add Faculty</h2>
        <form onSubmit={handleAddFaculty}>
          <input
            type="text"
            value={facultyName}
            onChange={(e) => setFacultyName(e.target.value)}
            placeholder="Faculty Name"
            required
          />
          <input
            type="email"
            value={facultyEmail}
            onChange={(e) => setFacultyEmail(e.target.value)}
            placeholder="Faculty Email"
            required
          />
          <button type="submit">Add Faculty</button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
