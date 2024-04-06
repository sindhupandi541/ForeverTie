import React, { useState } from 'react';
import axios from 'axios';
import ImageUploading from 'react-images-uploading';
import "./ImageUploader.css";

export default function ImageUploader() {
    const service_id =1;
  const [images, setImages] = useState([]);
  const maxNumber = 12;

  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
  };

  const handleUpdate = async () => {
    let formData={service_id:service_id,image:''};
    try {
      for (let i = 0; i < images.length; i++) {
        formData.image=  images[i].file;
  
        await uploadImage(formData);
      }
      alert('Images uploaded successfully!');
      setImages([]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('An error occurred while uploading the images. Please try again later.');
    }
  };
  
  const uploadImage = async (formData) => {
    try {
      await axios.post('http://localhost:8081/uploadImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      throw new Error('Error uploading image:', error);
    }
  };
  
  

  return (
    <div>
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div className="upload__image-wrapper">
            <div className="Upload-buttons-wrapper">
              <button
                className="Upload-buttons"
                style={isDragging ? { color: 'red' } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                Click or Drop here
              </button>
              &nbsp;
              <button onClick={onImageRemoveAll} className="Upload-buttons">
                Remove all images
              </button>
              {images.length > 0 && (
                <button onClick={handleUpdate} className="Upload-buttons">
                  Upload Images
                </button>
              )}
            </div>
            <div className="selected-images">
              {imageList.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image['data_url']} alt="" width="100" name='image'/>
                  <div className="image-item__btn-wrapper">
                    <button onClick={() => onImageUpdate(index)} className="handle-buttons">
                      Update
                    </button>
                    <button onClick={() => onImageRemove(index)} className="handle-buttons">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ImageUploading>
    </div>
  );
}