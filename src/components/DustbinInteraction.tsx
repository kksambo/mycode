import React, { useState } from "react";
import "./DustbinInteraction.css";
import binOpeningGif from "./binGif.gif"; // Import the bin opening GIF

const DustbinInteraction = () => {
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
      const response = await fetch("https://image-processing-2-thbz.onrender.com/classify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to classify the item. Please try again.");
      }

      const result = await response.json();

   
      if (result.label !== "Unknown") {
        setBinOpen(true); // Simulate bin opening
        setTimeout(() => setBinOpen(false), 5000); // Close bin after 5 seconds
        setClassificationResult(`Item accepted: ${result.label} (Confidence: ${result.confidence.toFixed(2)})`);

        // Reward the user with points
        await rewardUser();
      } else {
        setClassificationResult("Item rejected: Unknown item.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setItemImage(null); // Clear the selected image
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
      setRewardMessage(`Points allocated successfully! Updated Points: ${data.UpdatedPoints}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="dustbin-interaction">
        <nav class="navbar navbar-expand-lg navbar-dark px-4">
    <a class="navbar-brand" href="#">Admin Panel</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" href="#">Dashboard</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Users</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Activities</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Settings</a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-danger" href="#">Logout</a>
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