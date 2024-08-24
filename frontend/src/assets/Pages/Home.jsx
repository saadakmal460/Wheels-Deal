import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import HeroSection from '../Components/HeroSection';
import AllListings from './AllListings';


const Home = () => {

  

  return (

    <>
      <HeroSection/>
      <div className="shadow-divider"></div>
      <AllListings/>
      
    </>
  );
};

export default Home;
