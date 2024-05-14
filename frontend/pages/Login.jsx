import React, { useState } from "react";
import { auth } from "../firebase"; // Correct the import path
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useSignInWithGoogle } from "react-firebase-hooks/auth"; // Import useSignInWithGoogle hook
import GoogleIcon from "../assets/google.jpg"; // Import Google icon image
import "./styles.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(""); // State variable to track login error

  
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(email, password);
      console.log("successfully email/pass")
      // If login is successful, navigate to the to-do list
      navigate("/todolist");
    } catch (error) {
      // If login fails, update loginError state with error message
      setLoginError("Invalid email or password. Please try again.");
      console.log(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle(); 
      // If login is successful, navigate to the to-do list
      console.log("User registered with Google");
      navigate("/todolist");
    } catch (error) {
      // Handle any errors that occur during Google authentication
      console.log(error.message);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login •ﻌ•</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        {loginError && <div className="error-message">{loginError}</div>}{" "}
        {/* Render login error message */}
        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
      <button onClick={handleGoogleLogin} className="google-login-button">
        <img src={GoogleIcon} alt="Google Icon" className="google-icon" />
      </button>
    </div>
  );
};

export default Login;
