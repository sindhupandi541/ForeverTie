import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageUploading from 'react-images-uploading';
import "./ImageUploader.css";
import imageCompression from 'browser-image-compression';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import ScaleLoader from "react-spinners/ScaleLoader";

export default function ImageUploader({service_id,imageslist}) {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const maxNumber = 12;
  let navigate = useNavigate();
  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
  };
  // useEffect(() => {
  //   console.log(imageslist);
  //   if (imageslist !== undefined) {
  //     console.log(imageslist);
  //     setImages(imageslist);
  //   }
  // }, [imageslist]);
  

  const handleUpdate = async () => {
    setIsLoading(true)
    try {
      console.log('service_id',service_id);
      let formData={service_id:'',image:''};
      for (let i = 0; i < images.length; i++) {
        formData.service_id = service_id;
        formData.image=  await compressImage(images[i].file);

        console.log(formData.image);
        await uploadImage(formData);
      }
      setIsLoading(false)
      swal({
        title: 'Success',
        text: 'Service added',
        icon: "success",
      })
      navigate(-1);
      setImages([]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('An error occurred while uploading the images. Please try again later.');
    }
  };
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 500,
      useWebWorker: true,
    }
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
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
      {isLoading === true && (
        <div className="spinner-overlay">
          <div className="spinner-container">
            <ScaleLoader color="#e72e77" />
          </div>
        </div>
      )}
      {/* {Object.entries(imageslist)} */}
      {imageslist=== undefined &&
      
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
      }
      { imageslist != null  && (
  imageslist.map((image, index) => (
    <div key={index} className="image-item" style={{ display: 'inline' }}>
      <img src={`data:image/png;base64,${image}`} alt="" width="100" name='image' style={{ marginRight: '25px' }} />
    </div>
  ))
)}

    </div>
  );
}