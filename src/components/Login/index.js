import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import Cookies from "js-cookie";
import { auth } from "../../firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider } from "firebase/auth"; // Firebase auth import
import Navbar from "../Navbar";
import "./index.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hide, setHide] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const auth = getAuth(); // Initialize Firebase Auth

  // 🔹 Toggle password visibility
  const onHide = () => {
    setHide(!hide);
  };

  // 🔹 Validate email format
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email); // General email validation
  };

  // 🔹 Handle input changes
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setErrorMsg("");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setErrorMsg("");
  };

  // 🔹 Handle form submission (Email & Password Login)
  const submitForm = async (event) => {
    event.preventDefault();
    if (!validateEmail(email)) {
      setErrorMsg("Invalid Email Format");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Success! Response data:", data);
        console.log("Token:", data.token);
        console.log("Faculty ID:", data.facultyID);
      
        localStorage.setItem("logintoken", data.token);
        Cookies.set("facultyID", data.facultyID, { expires: 7, path: "/" });
        Cookies.set("name", data.name, {expires: 7, path: "/"});
      
        console.log("Token stored successfully.");
        navigate("/");
      }
       else {
        setErrorMsg(data.error || "Login failed");
      }
    } catch (error) {
      setErrorMsg("Server error. Please try again.");
    }
  };

  // 🔹 Social Login Function
  const socialLogin = async (providerName) => {
    let provider;

    if (providerName === "google") {
      provider = new GoogleAuthProvider();
    } else if (providerName === "github") {
      provider = new GithubAuthProvider();
    } else if (providerName === "facebook") {
      provider = new FacebookAuthProvider();
    } else {
      setErrorMsg("Invalid provider");
      return;
    }

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(); // 🔹 Get Firebase ID Token

      const response = await fetch(`http://localhost:5000/api/social-login/${providerName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }), // 🔹 Send ID Token to backend
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token); // 🔑 Store JWT token from backend
        navigate("/"); // 🚀 Redirect to homepage
      } else {
        setErrorMsg(data.error || `${providerName} login failed`);
      }
    } catch (error) {
      setErrorMsg("Authentication failed. Please try again.");
    }
  };

  return (
    <div className="log-main">
      <Navbar />
      <div className="input-card">
        <h1 className="log-head">Login</h1>
        {errorMsg && <p className="error">{errorMsg}</p>}
        
        <form className="form-log" onSubmit={submitForm}>
          <label className="lab-log" htmlFor="email">Email</label>
          <input
            className="input-log"
            type="text"
            id="email"
            placeholder="Enter Email..."
            onChange={handleEmailChange}
            value={email}
          />

          <label className="lab-log" htmlFor="password">Password</label>
          <div className="hide-btn">
            <input
              className="input-log2"
              type={hide ? "text" : "password"}
              id="password"
              placeholder="Enter password..."
              onChange={handlePasswordChange}
              value={password}
            />
            <button type="button" className="icon-log" onClick={onHide}>
              {hide ? <FaRegEyeSlash color="#333" /> : <FaRegEye color="#333" />}
            </button>
          </div>

          <button type="submit" className="btn btn-primary bnt-log">Login</button>
        </form>

        <p className="log-para">
          Not Yet Registered? <Link to="/register" className="log-reg">Register Here.</Link>
        </p>

        <div className="width-80 d-flex flex-row justify-content-between">
          <hr className="hr" /><p>OR</p><hr className="hr" />
        </div>

        <div className="d-flex flex-row">
          <button type="button" className="log-social" onClick={() => socialLogin("google")}>
            <FcGoogle className="log-im" />
          </button>
          <button type="button" className="log-social" onClick={() => socialLogin("github")}>
            <BsGithub color="#333" className="log-im" />
          </button>
          <button type="button" className="log-social" onClick={() => socialLogin("facebook")}>
            <FaFacebook style={{ color: "#1877f2" }} className="log-im" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
