import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import profileIcon from "../assets/kuromi.jpg";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function Profile() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const goToEditProfile = () => {
    navigate("/edited-profile");
  };

  const goToTodoList = () => {
    navigate("/todolist");
  };

  return (
    <div className="container">
      <div className="profile-container">
        <div className="profile-img-container">
          {/* Displays the user's photo if available, otherwise displays a default profile icon */}
          <img
            src={user?.photoURL || profileIcon}
            alt="Profile"
            className="profile-img"
          />
        </div>
        <div className="profile-info">
          {/* Displays the title for the profile page */}
          <h2 className="title-profile">Profile Page ⋆˙⟡ ♡</h2>
          {/* Displays the user's email */}
          <p>Email: {user?.email}</p>
          {/* Displays the user's display name if available, otherwise displays "Anonymous" */}
          <p>Name: {user?.displayName || "Anonymous"}</p>
        </div>
        <button className="edit-profile-button" onClick={goToEditProfile}>Edit Profile</button>
        {/* Button to go back to todo list page */}
        <button className="back-to-todo-button" onClick={goToTodoList}>
          Back to To Do List 
        </button>
      </div>
    </div>
  )
}
  
export default Profile;

