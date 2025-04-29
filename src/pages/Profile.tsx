import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css"; // Import the CSS file for styling

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const userEmail = localStorage.getItem("userEmail"); // Retrieve the logged-in user's email
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);

      const userEmail = localStorage.getItem("userEmail"); // Retrieve the logged-in user's email
      if (!userEmail) {
        setError("User not logged in. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://ledwaba-and-friends.onrender.com/api/AppUsers");
        if (!response.ok) {
          throw new Error("Failed to fetch user details.");
        }

        const users = await response.json();
        const loggedInUser = users.find((u: any) => u.email === userEmail);

        if (!loggedInUser) {
          throw new Error("User not found.");
        }

        setUser(loggedInUser);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      </div>
    );
  }

  if (error) {
    
    return (
      <>
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <p className="error text-danger mb-3">{error}</p>
      <button
      className="btn btn-primary"
      onClick={() => navigate("/login")}
      >
      Go to Login
      </button>
    </div>
    </>
  );
  }

  return (
    <div className="main-container">
  <nav class="navbar navbar-expand-lg navbar-dark px-4">
    <a class="navbar-brand" href="#">{userEmail}</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" href="/">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Dispose</a>
        </li>

        <li class="nav-item">
          <a class="nav-link text-danger" href="#">Logout</a>
        </li>
      </ul>
    </div>
  </nav>


  <div className="profile-container">
      <h2 className="profile-title">User Profile</h2>
      {user && (
        <div className="profile-details">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
          <p><strong>Points:</strong> {user.points}</p>
        </div>
      )}
      <button
        className="btn btn-primary"
        onClick={() => navigate("/dustbininteraction")}
      >
        Go to Dustbin Interaction
      </button>
      </div>
      </div>
    
  );
};

export default Profile;