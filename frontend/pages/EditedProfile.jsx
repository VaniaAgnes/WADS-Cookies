import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase"; // Import Firebase auth module
import profileIcon from "../assets/kuromi.jpg";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage functions

function EditedProfile() {
  const [user] = useAuthState(auth);
  const [profilePicture, setProfilePicture] = useState(null); // State variable for profile picture
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saved, setSaved] = useState(false); // State variable to track whether changes are saved
  const navigate = useNavigate();
  const storage = getStorage(); // Initialize Firebase storage

  // Function to handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  // Function to save changes and redirect to profile page
  const saveChanges = () => {
    // Ensure that there is a user authenticated
    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    // Check if a new profile picture is selected
    if (profilePicture) {
      // Upload the new profile picture to Firebase Storage
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      uploadBytes(storageRef, profilePicture)
        .then((snapshot) => {
          console.log("Uploaded a file!");

          // Get the download URL of the uploaded profile picture
          getDownloadURL(snapshot.ref)
            .then((downloadURL) => {
              // Update user's profile with the new photo URL
              updateProfile(auth.currentUser, {
                displayName: name,
                email: email,
                photoURL: downloadURL, // Include the new profile picture URL
              })
                .then(() => {
                  console.log("Profile updated successfully");
                  setSaved(true);
                  navigate("/profile");
                })
                .catch((error) => {
                  console.error("Error updating profile:", error);
                });
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
            });
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    } else {
      // Update user's display name and email when no new profile picture is selected
      updateProfile(auth.currentUser, {
        displayName: name,
        email: email,
      })
        .then(() => {
          console.log("Profile updated successfully");
          setSaved(true);
          navigate("/profile");
        })
        .catch((error) => {
          console.error("Error updating profile:", error);
        });
    }
  };


  return (
    <div className="container">
      <div className="profile-container">
        <div className="profile-img-container">
          {/* Displays the existing profile picture or the default profile icon */}
          <img
            src={
              profilePicture
                ? URL.createObjectURL(profilePicture)
                : user?.photoURL || profileIcon
            }
            alt="Profile"
            className="profile-img"
          />
          {/* File input for profile picture selection */}
          <input type="file" onChange={handleFileUpload} />
        </div>
        <div className="profile-info">
          {/* Displays the title for the profile page */}
          <h2 className="title-profile">Profile Page ⋆˙⟡ ♡</h2>
          {/* Input field for editing display name */}
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSaved(false); // Reset saved status when name is changed
            }}
            className="profile-input"
          />
          {/* Input field for editing email */}
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setSaved(false); // Reset saved status when email is changed
            }}
            className="profile-input"
          />
          {/* Button to save changes */}
          <button className="save-button" onClick={saveChanges}>
            Save Changes
          </button>
          {/* Confirmation message */}
          {saved && <p>Changes saved successfully!</p>}
        </div>
      </div>
    </div>
  );
}

export default EditedProfile;
