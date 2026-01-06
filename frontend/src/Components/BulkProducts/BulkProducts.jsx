import React, { useState } from "react";
import "./BulkProducts.css";
import upload_area from "../../assets/upload_area.svg";

const BulkProducts = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop().toLowerCase();

      if (["csv", "xlsx", "xls"].includes(fileType)) {
        setFile(selectedFile);
      } else {
        alert("Please upload only CSV or Excel files.");
        e.target.value = null;
      }
    }
  };

  const uploadToDatabase = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("bulk-products", file);

    try {
      const response = await fetch(
        "http://localhost:3000/products/bulk-upload",
        {
          method: "POST",
          headers: {      
        "auth-token": localStorage.getItem("auth-token"), 
      },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        setFile(null);
      } else {
        alert("Upload failed: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error connecting to the server.");
    }
  };

  return (
    <div className="bulk-products">
      <h1>Bulk Products Upload</h1>

      <div className="bulk-upload-container">
        <label htmlFor="file-input" className="upload-box">
          <img
            src={upload_area}
            alt="Upload"
            className="upload-thumbnail"
          />
          <p>
            {file
              ? `Selected: ${file.name}`
              : "Click to upload CSV or Excel file"}
          </p>
        </label>

        <input
          type="file"
          id="file-input"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          hidden
        />

        <button
          className="bulk-btn"
          onClick={uploadToDatabase}
          style={{ backgroundColor: file ? "#ff4141" : "#888" }}
        >
          Upload to Database
        </button>
      </div>
    </div>
  );
};

export default BulkProducts;
