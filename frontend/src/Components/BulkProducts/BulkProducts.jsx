/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import upload_area from '../../assets/upload_area.svg'; 
const BulkProducts = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        
    };

   

    return (
        <div className="bulk-products">
            <h1>Bulk Product Upload</h1>
            <div className="bulk-upload-container">
                <label htmlFor="file-input">
                    <img 
                        src={file ? "/assets/file-icon.png" : upload_area} 
                        className="upload-thumbnail" 
                        alt="" 
                    />
                    <p>{file ? file.name : "Click to upload CSV or Excel file"}</p>
                </label>
                <input 
                    type="file" 
                    id="file-input" 
                    accept=".csv, .xlsx, .xls" 
                    onChange={handleFileChange} 
                    hidden 
                />
                <button className="bulk-btn">Upload to Database</button>
            </div>
        </div>
    );
};

export default BulkProducts;