import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import Navbar from "../Navbar";
import "./index.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    dob: "",
    phoneNumber: "",
    department: "",
  });
  const [hide, setHide] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onHide = () => {
    setHide(!hide);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Reset error

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);

      navigate("/"); // Redirect to home after registration
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="reg-main">
      <Navbar />
      <div className="reg-card">
        <h2 className="reg-head">Register</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleRegister} className="form-reg">
          <label htmlFor="name" className="lab-reg">Name</label>
          <input type="text" name="name" placeholder="Name" onChange={handleChange} required className="input-reg" />
          <label htmlFor="email" className="lab-reg">Email</label>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="input-reg" />
          <label htmlFor="password" className="lab-reg">Password</label>
          <div className="hide-reg">
            <input className="input-log2" type={hide ? "text" : "password"} name="password" placeholder="Enter password.." onChange={handleChange} required />
            <button className="icon-log" type="button" onClick={onHide}>
              {hide ? <FaRegEyeSlash color="#333" /> : <FaRegEye color="#333" />}
            </button>
          </div>
          <label htmlFor="dob" className="lab-reg">Date of Birth</label>
          <input type="date" name="dob" onChange={handleChange} required className="input-reg" />
          <label htmlFor="phoneNumber" className="lab-reg">Phone Number</label>
          <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required className="input-reg" />
          <label htmlFor="role" className="lab-reg">Role</label>
          <select name="role" onChange={handleChange} className="input-reg">
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
          {formData.role !== "admin" && (
            <>
              <label htmlFor="department" className="lab-reg">Department</label>
              <input type="text" name="department" placeholder="Department" onChange={handleChange} required className="input-reg" />
            </>
          )}
          <button type="submit" className="btn btn-primary btn-reg">Register</button>
        </form>
        <p className="reg-para">Already Registered? <Link to="/login">Login Here.</Link></p>
      </div>
    </div>
  );
};

export default Register;
