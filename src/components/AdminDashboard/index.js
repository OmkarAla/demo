import React, { useState, useEffect } from 'react';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import Navbar from '../Navbar';

const AdminDashboard = () => {
  const [unapprovedUsers, setUnapprovedUsers] = useState([]);
  const [electives, setElectives] = useState([]);
  const [electiveID, setElectiveID] = useState('');
  const [electiveName, setElectiveName] = useState('');
  const [electiveFaculty, setElectiveFaculty] = useState('');
  const [studentsEnrolled, setStudentsEnrolled] = useState([]);
  const [totalSeats, setTotalSeats] = useState(0);
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [schedule, setSchedule] = useState('');
  const [credits, setCredits] = useState(0);

  const [facultyName, setFacultyName] = useState('');
  const [facultyEmail, setFacultyEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchElectives();
  }, []);

  const fetchUnapprovedUsers = async () => {
    const response = await fetch('http://localhost:5000/api/approve-get');
    const data = await response.json();
    setUnapprovedUsers(data);
  };

  const fetchElectives = async () => {
    const response = await fetch('http://localhost:5000/api/electives-get');
    const data = await response.json();
    setElectives(data);
  };

  const handleApproveUser = async (userId) => {
    const token = localStorage.getItem("token"); // Ensure token is stored after login
  
    const response = await fetch("http://localhost:5000/api/approve-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send JWT token
      },
      body: JSON.stringify({ email: userId }), // Ensure email is sent correctly
    });
  
    const data = await response.json();
    setMessage(data.message || data.error);
    fetchUnapprovedUsers();
  };
  
  const handleRejectUser = async (userId) => {
    const token = localStorage.getItem("token");
  
    const response = await fetch("http://localhost:5000/api/reject-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send JWT token
      },
      body: JSON.stringify({ email: userId }), // Ensure email is sent correctly
    });
  
    const data = await response.json();
    setMessage(data.message || data.error);
    fetchUnapprovedUsers();
  };
  

  const handleAddElective = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/electives-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        electiveID, 
        electiveName, 
        electiveFaculty, 
        studentsEnrolled, 
        totalSeats, 
        department, 
        description, 
        schedule, 
        credits 
      }),

    });
    const data = await response.json();
    setMessage(data.message || data.error);
    fetchElectives();
  };

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/faculty-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ facultyName, email: facultyEmail }),
    });
    const data = await response.json();
    setMessage(data.message || data.error);
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid py-5 admin-dashboard">
        {message && <p className="text-center text-success">{message}</p>}
        <div className="row">
          {/* Electives Section */}
          <div className="col-md-4">
            <div className="section-card">
              <h3 style={{ color: 'black' }}>Electives</h3>
              <div className="list-group">
                {electives.map((elective, index) => (
                  <a key={index} href="#" className="list-group-item list-group-item-action">
                    {elective.name}
                  </a>
                ))}
              </div>
              <form onSubmit={handleAddElective} className="mt-3">
                <input
                  type="text"
                  className="form-control mb-2"
                  value={electiveID}
                  onChange={(e) => setElectiveID(e.target.value)}
                  placeholder="Elective ID"
                  required
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  value={electiveName}
                  onChange={(e) => setElectiveName(e.target.value)}
                  placeholder="Elective Name"
                  required
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  value={electiveFaculty}
                  onChange={(e) => setElectiveFaculty(e.target.value)}
                  placeholder="Elective Faculty ID"
                  required
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  value={studentsEnrolled}
                  onChange={(e) => setStudentsEnrolled(e.target.value.split(','))}
                  placeholder="Students Enrolled (comma separated)"
                  required
                />
                <label>Total Seats</label>
                <input
                  type="number"
                  className="form-control mb-2"
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(e.target.value)}
                  placeholder="Total Seats"
                  required
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Department"
                  required
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  required
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="Schedule"
                  required
                />
                <label>Credits</label>
                <input
                  type="number"
                  className="form-control mb-2"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  placeholder="Credits"
                  required
                />

                <button type="submit" className="action-btn w-100">
                  Add Elective
                </button>
              </form>
            </div>
          </div>

          {/* Management Section */}
          <div className="col-md-4">
            <div className="section-card">
              <h3 style={{ color: 'black' }}>Faculty</h3>
              <form onSubmit={handleAddFaculty}>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  placeholder="Faculty Name"
                  required
                />
                <input
                  type="email"
                  className="form-control mb-2"
                  value={facultyEmail}
                  onChange={(e) => setFacultyEmail(e.target.value)}
                  placeholder="Faculty Email"
                  required
                />
                <button type="submit" className="action-btn w-100 mb-2">
                  Add Faculty
                </button>
              </form>
            </div>
          </div>

          {/* Pending Requests Section */}
          <div className="col-md-4">
            <div className="section-card">
              <h3 style={{ color: 'black' }}>Pending Requests</h3>
              <button className="action-btn w-100 mb-3" onClick={fetchUnapprovedUsers}>
                Fetch Unapproved Users
              </button>
              {unapprovedUsers.map((user) => (
                <div key={user.id} className="request-item p-2 animate__animated animate__fadeIn">
                  {user.name} - {user.role}
                  <button className="action-btn btn-sm ms-2" onClick={() => handleApproveUser(user.id)}>
                    Approve
                  </button>
                  <button
                    className="action-btn btn-sm ms-2"
                    style={{ background: '#dc3545' }}
                    onClick={() => handleRejectUser(user.id)}
                  >
                    Reject
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
