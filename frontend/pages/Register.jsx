import React, { useState } from "react";
import { auth } from "../firebase"; 
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSignInWithGoogle } from "react-firebase-hooks/auth"; 
import googleIcon from "../assets/google.jpg"; 
import "./styles.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const [loginError, setLoginError] = useState(""); 
  const navigate = useNavigate();
  const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(email, password);
      // Redirect to login page after successful registration
      navigate("/login");
    } catch (error) {
      console.log(error.message);
      setLoginError(error.message); // Set error message for display
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate("/todolist"); // Redirect to to-do list after successful Google login
    } catch (error) {
      console.log(error.message);
      setLoginError(error.message); // Set error message for display
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register ⋆˚✿˖°</h2>
      <form onSubmit={handleRegister} className="register-form">
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
        {error && <div className="error-message">{error.message}</div>}
        <button type="submit" className="submit-button">Register</button>
      </form>
      {loginError && <p>{loginError}</p>} {/* Display error message */}
      <button onClick={handleGoogleLogin} className="google-login-button">
        <img src={googleIcon} alt="Google Icon" className="google-icon" />
      </button>
      <Link to="/login" className="already-registered">Already Registered? </Link>
    </div>
  );
};

export default Register;
