import React, { useState } from "react";
import upload_area from "../../assets/upload_area.svg";
import * as XLSX from "xlsx"; // Import the parser
import "./BulkProducts.css";

const BulkProducts = () => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]); // Stores table data
  const [showModal, setShowModal] = useState(false); // Controls modal visibility

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop().toLowerCase();
      if (["csv", "xlsx", "xls"].includes(fileType)) {
        setFile(selectedFile);
        handlePreview(selectedFile); // Generate preview automatically on select
      } else {
        alert("Please upload only CSV or Excel files.");
        setFile(null);
        e.target.value = "";
      }
    }
  };

  // Function to parse File into JSON for the table
  const handlePreview = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      setPreviewData(json);
    };
    reader.readAsArrayBuffer(file);
  };

  const uploadToDatabase = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/products/bulk-upload", {
        method: "POST",
        headers: { "auth-token": localStorage.getItem("auth-token") },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        alert(data.message);
        setFile(null);
        setPreviewData([]);
        document.getElementById("file-input").value = "";
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
      <h1>Bulk Product Upload</h1>

      <div className="bulk-upload-container">
        <label htmlFor="file-input" className="upload-box">
          <img src={upload_area} alt="Upload Icon" className="upload-thumbnail" />
          {!file ? (
            <p>Click to upload CSV or Excel file</p>
          ) : (
            <p style={{ color: "#ff6a00", fontWeight: "600" }}>Selected: {file.name}</p>
          )}
        </label>
        
        <input type="file" id="file-input" accept=".csv,.xlsx,.xls" onChange={handleFileChange} hidden />

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            onClick={uploadToDatabase}
            className="bulk-btn"
            style={{ flex: 2, opacity: !file ? 0.6 : 1 }}
            disabled={!file}
          >
            Upload to Database
          </button>

          {file && (
            <button 
              onClick={() => setShowModal(true)} 
              className="bulk-btn" 
              style={{ flex: 1, background: "#4b5563" }}
            >
              Preview
            </button>
          )}
        </div>
      </div>

      {/* --- PREVIEW MODAL --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>File Preview</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              {previewData.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      {Object.keys(previewData[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((val, i) => (
                          <td key={i}>{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No data found in file.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkProducts;