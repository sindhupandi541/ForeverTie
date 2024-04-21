import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScaleLoader from "react-spinners/ScaleLoader";
import { Link, useNavigate } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBIcon } from "mdb-react-ui-kit";
import "./Home.css";
import swal from 'sweetalert';
import { AiOutlineArrowRight, AiOutlinePlus, AiFillEdit, AiFillDelete } from "react-icons/ai";

export default function Services({ category }) {
  const date = window.sessionStorage.getItem('date');
  const address = window.sessionStorage.getItem('address');
  const [imagesList, setImagesList] = useState({});
  const [isLoading, setIsLoading] = useState(true);
const navigate = useNavigate('');
  useEffect(() => {
    loadImages();
  }, [category]);

  const loadImages = async () => {
    let res;
    try {
      setTimeout(async () => {
        if (window.sessionStorage.getItem('UserType') === 'customer') {
          console.log(date,address);
          res = await axios.get('https://server-tjm9.onrender.com/getServices', { params: { date: date,address:address } });
        } else {
          res = await axios.get('https://server-tjm9.onrender.com/adminServices');
        }
        let data = res.data.Result;
console.log(res.data.Result)
        if (category) {
          data = data.filter(image => image.category === category);
        }
        const groupedImages = groupByCategory(data);
        setImagesList(groupedImages);
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  const groupByCategory = (images) => {
    const groupedImages = {};
    images.forEach((image) => {
      const { category } = image;
      if (!groupedImages[category]) {
        groupedImages[category] = [];
      }
      groupedImages[category].push(image);
    });
    return groupedImages;
  };
  function addCategoryCard() {
    return (
      <div className="no-categories-found">

        <MDBContainer fluid className="my-5 category-details" key="add">
          <MDBRow className="justify-content-center">
            <MDBCol md="6">
              <Link to={`/addService/${category}`} style={{ textDecoration: 'none' }}>
                <MDBCard className="text-black">
                  <MDBIcon fab icon="apple" size="lg" className="px-3 pt-3 pb-2" />
                  <div className="service-image-container">
                    <AiOutlinePlus />
                  </div>
                  <MDBCardBody className='category-details-body' style={{ height: '210px' }}>
                    <div className="service-title add-category-title">
                      <p style={{ textTransform: 'uppercase' }}> Add New</p>
                      <p className="text-muted mb-4" style={{ textTransform: 'uppercase' }}>{category}</p>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </Link>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    )
  }
  function noCategoryavailable() {
    return (
      <p className='Empty-cart-message' style={{ width: '80%', margin: 'auto', marginTop: '50px' }}>No Services available at this moment<br /> Navigate to service from Menu to Add Services</p>
    )
  }
  function noCategoryavailableForCustomer() {
    if (category === undefined) {
      return (
        <p className='Empty-cart-message' style={{ width: '80%', margin: 'auto', marginTop: '10%' }}>No Services available at this moment<br /> Please come back Later</p>
      )
    }
    else {
      return (
        <p className='Empty-cart-message' style={{ width: '80%', margin: 'auto', marginTop: '10%' }}>No {category} available at this moment<br /> Please come back Later</p>
      )
    }
  }
  function handleDeleteService(service) {
    swal({
      title: "Are you sure?",
      text: `Do You Want to delete ${service.name} ${service.category}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          setIsLoading(true);
          deleteService(service);
        }
      });
  }

  async function deleteService(service) {
    const res = await axios.delete(`https://server-tjm9.onrender.com/deleteService/${service.id}`);
    setTimeout(() => {
      swal({
        title: "Success",
        text: `${service.name} deleted Successfully`,
        icon: "success",
      });
      setIsLoading(false);
      loadImages();
    }, 2000);
  }


  return (
    <>
      {isLoading === true && (
        <div className="spinner-overlay">
          <div className="spinner-container">
            <ScaleLoader color="#e72e77" />
          </div>
        </div>
      )}
      {category === undefined ? (
        Object.entries(imagesList)
          .sort(([categoryA], [categoryB]) => {
            const order = ['venue', 'cater', 'decor'];
            return order.indexOf(categoryA) - order.indexOf(categoryB);
          })
          .map(([category, images]) => (
            <div key={category} className='Service-details-outer-container'>
              {console.log('category ==>', category, 'images ==>', images)}
              <h2 style={{ textTransform: 'capitalize' }}>{category}</h2>
              <div className='services-container'>
                {images.slice(0, 3).map((ele, index) => (
                  <MDBContainer fluid className="my-5 category-details" key={index}>
                    <MDBRow className="justify-content-center">
                      <MDBCol md="6">
                        <Link to={`/detail/${ele.id}`} style={{ textDecoration: 'none' }}>
                          <MDBCard className="text-black">
                            <MDBIcon fab icon="apple" size="lg" className="px-3 pt-3 pb-2" />
                            <div className="service-image-container">
                              <MDBCardImage
                                src={`data:image/png;base64,${ele.image_data}`}
                                position="top"
                                alt={`image${index}`}
                                className='service-image'
                              />
                            </div>
                            <MDBCardBody className='category-details-body'>
                              <div className="service-title">
                                <MDBCardTitle>{ele.name}</MDBCardTitle>
                                <p className="text-muted mb-4">{ele.address}</p>
                              </div>
                              <div className="details-container">
                                <div>
                                  {category != 'decor' && <div>Capacity</div>}
                                  {category === 'cater' ? <div>Rate Per Person</div> : category === 'decor' ? <div>Rate Per Event</div> : <div>Rate Per Hour</div>}
                                  <div>Total</div>
                                </div>
                                <div>
                                  {category != 'decor' && <div>{ele.capacity}</div>}
                                  {category === 'cater' ? <div>{`$${Math.round(ele.rate / ele.capacity)}`}</div> : category === 'decor' ? <div>{`$${ele.rate}`}</div> : <div>{`$${Math.round(ele.rate / 24)}`}</div>}
                                  <div>{`$${ele.rate}`}</div>
                                </div>
                              </div>
                            </MDBCardBody>
                          </MDBCard>
                        </Link>
                      </MDBCol>
                    </MDBRow>
                    {window.sessionStorage.getItem('UserType') === 'admin' && (
                      <div className="crud-buttons">
                        <AiFillDelete onClick={() => handleDeleteService(ele)} />
                        <AiFillEdit onClick={() => navigate(`/updateService/${ele.id}`)}/>
                      </div>
                    )}
                  </MDBContainer>
                ))}
                {images.length > 3 && (
                  <div className="see-more-link" onClick={() => navigate(window.sessionStorage.getItem('UserType') === 'admin' ? `/${category}s` : `/${category}`)}>
                  See More <AiOutlineArrowRight fontSize="x-large" />
              </div>
              
                  // <div className="see-more-link">
                  //   <Link to={window.sessionStorage.getItem('UserType') === 'admin' ? `/${category}s` : `/${category}`}>See More</Link>
                  //   <AiOutlineArrowRight fontSize="x-large" />
                  // </div>
                )}
                {images.length === 0 && window.sessionStorage.getItem('UserType') === 'admin' && (
                  { addCategoryCard }
                )}
              </div>
            </div>
          ))
      ) : (
        Object.entries(imagesList)
          .sort(([categoryA], [categoryB]) => {
            const order = ['venue', 'cater', 'decor'];
            return order.indexOf(categoryA) - order.indexOf(categoryB);
          })
          .map(([category, images]) => (
            <div key={category} className='Service-details-outer-container'>
              <h2 style={{ textTransform: 'capitalize' }}>{category}</h2>
              <div className='services-container'>
                {images.map((ele, index) => (
                  <MDBContainer fluid className="my-5 category-details" key={index}>
                    <MDBRow className="justify-content-center">
                      <MDBCol md="6">
                        <Link to={`/detail/${ele.id}`} style={{ textDecoration: 'none' }}>
                          <MDBCard className="text-black">
                            <MDBIcon fab icon="apple" size="lg" className="px-3 pt-3 pb-2" />
                            <div className="service-image-container">
                              <MDBCardImage
                                src={`data:image/png;base64,${ele.image_data}`}
                                position="top"
                                alt={`image${index}`}
                                className='service-image'
                              />
                            </div>
                            <MDBCardBody className='category-details-body'>
                              <div className="service-title">
                                <MDBCardTitle>{ele.name}</MDBCardTitle>
                                <p className="text-muted mb-4">{ele.address}</p>
                              </div>
                              <div className="details-container">
                                <div>
                                  {category != 'decor' && <div>Capacity</div>}
                                  {category === 'cater' ? <div>Rate Per Person</div> : category === 'decor' ? <div>Rate Per Event</div> : <div>Rate Per Hour</div>}
                                  <div>Total</div>
                                </div>
                                <div>
                                  {category != 'decor' && <div>{ele.capacity}</div>}
                                  {category === 'cater' ? <div>{`$${Math.round(ele.rate / ele.capacity)}`}</div> : category === 'decor' ? <div>{`$${ele.rate}`}</div> : <div>{`$${Math.round(ele.rate / 24)}`}</div>}
                                  <div>{`$${ele.rate}`}</div>
                                </div>
                              </div>
                            </MDBCardBody>
                          </MDBCard>
                        </Link>
                      </MDBCol>
                    </MDBRow>
                    {window.sessionStorage.getItem('UserType') === 'admin' && (
                      <div className="crud-buttons">
                        <AiFillDelete onClick={() => handleDeleteService(ele)} />
                        <AiFillEdit onClick={() => navigate(`/updateService/${ele.id}`)}/>
                      </div>
                    )}
                  </MDBContainer>
                ))}
                {window.sessionStorage.getItem('UserType') === 'admin' && (
                  addCategoryCard()
                )}
              </div>
            </div>
          ))
      )}
      {Object.entries(imagesList).length === 0 && window.sessionStorage.getItem('UserType') === 'admin' && !isLoading && (
        <>
          {category === undefined ? noCategoryavailable() : addCategoryCard()}
        </>
      )}
      {Object.entries(imagesList).length === 0 && window.sessionStorage.getItem('UserType') === 'customer' && !isLoading && (
        <>
          {category === undefined ? noCategoryavailableForCustomer() : noCategoryavailableForCustomer()}
        </>
      )}
    </>
  );
}
