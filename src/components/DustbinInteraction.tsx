import React, {useEffect, useState } from "react";
import "./DustbinInteraction.css";
import binOpeningGif from "./binGif.gif"; // Import the bin opening GIF
import { useNavigate, Link } from "react-router-dom";

const DustbinInteraction = () => {
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    useEffect(() => {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("userEmail");
      if (token && userEmail) {
        setName("Logout");
        setEmail(userEmail);
      } else {
        setName("login");
      }
    
      if (!token || !userEmail) {
        setName('login');
       
      }
    }, []);
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [classificationResult, setClassificationResult] = useState<string | null>(null);
  const [binOpen, setBinOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setItemImage(e.target.files[0]);
    }
  };

  const handleScan = async () => {
    if (!itemImage) {
      alert("Please select an image of the item.");
      return;
    }

    setLoading(true);
    setError(null);
    setClassificationResult(null);
    setRewardMessage(null);

    const formData = new FormData();
    formData.append("file", itemImage);

    try {
      // Send the image to the Flask API
      const response = await fetch("https://geminiapp-dp6r.onrender.com/classify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to classify the item. Please try again.");
      }

      const result = await response.json();
      console.log(result);

   
      if (result.classification !== "Unknown") {
        setBinOpen(true); 
        setTimeout(() => setBinOpen(false), 5000); 
        setClassificationResult(`Item accepted: ${result.classification}`);

       
        await rewardUser();
      } else {
        setClassificationResult("Item rejected: Unknown item.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setItemImage(null); 
    }
  };

  const rewardUser = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail"); // Retrieve the logged-in user's email
      if (!userEmail) {
        throw new Error("User email not found. Please log in again.");
      }

      const response = await fetch("https://ledwaba-and-friends.onrender.com/api/givePoints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserEmail: userEmail,
          Points: 10,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reward points. Please try again.");
      }

      const data = await response.json();
      setRewardMessage(`you got yourself 10 points`);
    } catch (err: any) {
      setError(err.message);
    }
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    if (name === "login") {
      navigate("/login");
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setEmail("");
    setName("login");

    
    navigate("/"); 
  };
  return (
    <div className="dustbin-interaction">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <nav className="navbar navbar-expand-lg navbar-dark px-4">
        <Link className="navbar-brand" to="#">{email}</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link active" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">Profile</Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-danger"
                to={name === "Logout" ? "/" : `/${name}`}
                onClick={handleLogout}
              >
                {name}
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <center>
        <h2>Dustbin Interaction</h2>
        <div className="image-upload">
          <label htmlFor="item-image">Take a picture or select from storage:</label>
          <input
            type="file"
            id="item-image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button onClick={handleScan} disabled={loading}>
          {loading ? "Processing..." : "Deposit Item"}
        </button>

        {binOpen && (
          <div className="bin-animation">
            <img src={binOpeningGif} alt="Bin Opening" />
          </div>
        )}

        {classificationResult && (
          <div className="classification-result">
            <p>{classificationResult}</p>
          </div>
        )}

        {rewardMessage && (
          <div className="reward-message">
            <p>{rewardMessage}</p>
          </div>
        )}

        {error && <p className="error">Error: {error}</p>}
      </center>
    </div>
  );
};

export default DustbinInteraction;

