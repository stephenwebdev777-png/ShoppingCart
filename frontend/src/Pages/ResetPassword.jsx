import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async () => {
    if (!newPassword) {
      alert("Please enter a new password");
      return;
    }
    if (!token) {
      alert("Reset token is missing.");
      return;
    }

    const res = await fetch("http://localhost:3000/resetpassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();
    alert(data.message);

    if (data.success) {
      navigate("/login");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9ff",
        padding: "10px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "40px 30px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            marginBottom: "30px",
            color: "#333",
            fontSize: "34px",
          }}
        >
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 10px",
            marginBottom: "20px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            fontSize: "19px",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "12px 20px",
            backgroundColor: "#ff4141",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "19px",
            fontWeight: "500",
          }}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
