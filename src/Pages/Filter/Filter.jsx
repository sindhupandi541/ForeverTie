import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import axios from 'axios';
import moment from 'moment';
import LandingNav from '../LandingPage/LandingNav'; 
import "./Filter.css";
import { AiOutlineSearch } from "react-icons/ai";

export default function Filter() {
  const [addresses, setAddresses] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState({
    date:'',
    address:''
  });
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    async function getAddresses() {
      try {
        const res = await axios.get('https://server-tjm9.onrender.com/filter');
        const uniqueAddresses = removeDuplicates(res.data.Result, 'address');
        setAddresses(uniqueAddresses);
      } catch (error) {
        console.error(error);
      }
    }

    getAddresses();
  }, []);

  const removeDuplicates = (array, key) => {
    return array.filter((item, index, self) =>
      index === self.findIndex((t) => (
        t[key] === item[key]
      ))
    );
  };

  const handleDateClick = (arg) => {
    console.log(moment(arg.date).format("YYYY-MM-DD"), arg.date);
    setSelectedDetails(prevState => ({
      ...prevState,
      date: moment(arg.date).format("MM-DD-YYYY")
    }));
    window.sessionStorage.setItem('date',moment(arg.date).format("MM-DD-YYYY"))
  }

  const handleAddressChange = (event) => {
    window.sessionStorage.setItem('address',event.target.value);
    setSelectedDetails(prevState => ({
      ...prevState,
      address: event.target.value
    }));
  };

  const handleFindServices = () => {
    const { date, address } = selectedDetails;
    if (date && address) {
      navigate(`/home/${date}/${address}`);
    } else {
      alert("Please select both date and address.");
    }
  };

  return (
    <>
      <LandingNav userLoggedIn="customer"/>
      <h3 className="demo-title">Select Date and Address</h3>
      <div className="selected-data">
        {selectedDetails.address && selectedDetails.date && (
          <div>
            <span>Selected Address: </span>{selectedDetails.address} 
            <span> and Date: </span>{selectedDetails.date}
          </div>
        )}
        <div className="reserve-button" onClick={handleFindServices}>
          <AiOutlineSearch fill='white' fontSize='larger' />
          <button type="button">Find Services</button>
        </div>
      </div>
      <div className="demo-container">
        <div className="select-container">
          <select id="addresses" value={selectedDetails.address} onChange={handleAddressChange}>
            <option disabled></option>
            {addresses.map((address, index) => (
              <option key={index} value={address.address} className='option-value'>{address.address}</option>
            ))}
          </select>
        </div>
        <div className="full-calendar">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            dateClick={handleDateClick}
            initialView='dayGridMonth'
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth'
            }}
          />
        </div>
      </div>
    </>
  );
}
