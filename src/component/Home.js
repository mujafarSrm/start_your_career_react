import React, { useEffect, useState } from "react";
import "./home.css";
import "./variables.css";
import { BsFillClipboard2DataFill } from "react-icons/bs";
import { GrSecure } from "react-icons/gr";
import { FcMultipleInputs } from "react-icons/fc";
import { IoInformationCircleSharp } from "react-icons/io5";
import { FaArrowRightToBracket } from "react-icons/fa6";
import Tabs from "../Tabs";
import CustomAlert from "./LogIn";
import About from "./About";
import WeatherForeCast from "./WeatherForeCast";
import UserList from "./UserList";
import JobPostComponent from "./JobPostComponent";
import AppliedJobs from "./AppliedJobs";
import LogIn from "./LogIn";

import { useNavigate } from 'react-router-dom';


const Home = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [showPopUp, setShowPopUp] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();


  const yourAuthToken = localStorage.getItem("userToken");
  const userId = localStorage.getItem("userId");

  

  const handleHeaderClick = (setHeader) => {
    setActiveTab(setHeader);
    setShowPopUp(false);

    const trimmedHeader = setHeader.toLowerCase().replace(/\s+/g, '');
    setActiveTab(setHeader);
    navigate(`/${trimmedHeader}`);
  };

  const handleSignInClick = () => {
    // alert("Hi! Singin/LogIn Adding Soon"); 
    setShowPopUp(true);
  };

  const handleSignInClick1 = () => {
    // alert("Hi! Singin/LogIn Adding Soon");
    alert("You Need to Sign In Another Account"); 
    setShowPopUp(true);
  };

  const handleCloseAlert = () => {
    setShowPopUp(false);
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`http://localhost:5000/User/Users/${userId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const userData = await response.json();
      setCurrentUser(userData[0]);
      console.log("---------line 52 for current user", userData, userData[0]);
      localStorage.setItem('currentUser', JSON.stringify(userData[0]));
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  useEffect(()=>{
    console.log("------------line 66 in home component");
    fetchCurrentUser();
  },[userId]);

  useEffect(()=>{
    if(currentUser){
      console.log("-----------line 65 in home component for current user", currentUser.firstName);
    }
  },[currentUser]);
  
  
  return (
    <div>
      {showPopUp && <LogIn onClose={handleCloseAlert} /> }
      <div className="home-header">
        <div className="the-logo">
          <img src="/logo2syc.png"></img>
        </div>
        <div className="home-header-icons">
          <Tabs activeTab={activeTab} onHeaderClick={handleHeaderClick} />
        </div>
        {/* <div className="signIn-Button" >Sign In</div> */}
        {currentUser ? <div className="signIn-Button" >
          {currentUser.firstName}
        </div> : <div className="signIn-Button" onClick={handleSignInClick}>
          Sign In
        </div>}
      </div>
      {activeTab === "Home" && (
        <div className="home-page-middle">
          <div className="home-page-middle-text">
            <h1>Start Your Career the easy way</h1>
            <div className="middle-text-ptag">
              <p>
                By installing this application, you will benefit from excellent
                services
              </p>
              {/* <p className="middle-text-get-start-button">Get Started </p> */}
              <div className="middle-text-get-start-button" onClick={currentUser?handleSignInClick1:handleSignInClick} >
                {currentUser ? <div>Log Out</div> : <div>Get Started</div>}
                <div>
                  <FaArrowRightToBracket />
                </div>
              </div>
              <p>Try for free, No Premium Membership required!!</p>
            </div>
          </div>
          <div className="home-page-middle-image">
            <img src="/student.jpeg"></img>
          </div>
        </div>
      )}
      {activeTab === "Home" && (
        <div className="home-page-footer">
          <div className="footer-text1">
            <h3>How does it work?</h3>
            <p>
              Our online application process is designed to be efficient and
              streamlined, faster.saving you time and simplifying the entire
              process.
            </p>
          </div>
          <div className="footer-text2">
            <ul>
              <li className="footer-text2-li">
                <div className="icon-container">
                  <BsFillClipboard2DataFill />
                </div>
                <div className="text-container">
                  <strong>App analysis</strong>
                  <p>Lorem ipsum dolor sit amet</p>
                </div>
              </li>
              <li className="footer-text2-li">
                <div className="icon-container">
                  <GrSecure />
                </div>
                <div className="text-container">
                  <strong>Data Secure</strong>
                  <p>Lorem ipsum dolor sit amet</p>
                </div>
              </li>
              <li className="footer-text2-li">
                <div className="icon-container">
                  <IoInformationCircleSharp />
                </div>
                <div className="text-container">
                  <strong>Information</strong>
                  <p>Lorem ipsum dolor sit amet</p>
                </div>
              </li>
              <li className="footer-text2-li">
                <div className="icon-container">
                  <FcMultipleInputs />
                </div>
                <div className="text-container">
                  <strong>Multiple Actions</strong>
                  <p>Lorem ipsum dolor sit amet</p>
                </div>
              </li>
            </ul>
          </div>
          {/* <div className="footer-text3"></div> */}
        </div>
      )}
      {activeTab === "Features" && (
        <div>
          {/* <h1>Features Content</h1> */}
          {/* <UserList /> */}
          <JobPostComponent />
        </div>
      )}
      {activeTab === "Services" && (
        <div>
          {/* <h1>Services Content  </h1> */}
          {/* <WeatherForeCast /> */}
          <AppliedJobs />
        </div>
      )}
      {activeTab === "Work with us" && (
        <div>
          <h1>Work With Us Content  </h1>
        </div>
      )}
      {activeTab === "About" && (
        <div>
          <h1>About Content  </h1>
          <About />
        </div>
      )}
    </div>
  );
};

export default Home;
