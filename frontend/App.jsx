import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import ToDoList from "./ToDoList.jsx";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile.jsx";
import EditedProfile from "./pages/EditedProfile.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return null; 
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Protected routes */}
        <Route
          path="/todolist"
          
          element={user ? <ToDoList /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/edited-profile"
          element={user ? <EditedProfile /> : <Navigate to="/login" />}
        />
        {/* Redirects */}
        <Route
          path="/register-successful"
          element={<Navigate to="/login" />}
        />
        <Route
          path="/google-login-successful"
          element={<Navigate to="/todolist" />}
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;

