import React, { useState } from 'react';
import LandingNav from '../LandingPage/LandingNav';
import axios from 'axios';

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert('Please select at least one image to upload.');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('photos', selectedFiles[i]);
    }

    try {
      const response = await axios.post('http://localhost:8081/uploadImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(response.data);
      alert('Images uploaded successfully!');
      setSelectedFiles(null);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('An error occurred while uploading the images. Please try again later.');
    }
  };

  return (
    <>
      <LandingNav userLoggedIn='customer' />
      <div>
        <h1>Upload Images</h1>
        <input type="file" multiple onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
    </>
  );
}
