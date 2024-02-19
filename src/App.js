import { useState } from 'react';
import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes, Switch, Link, BrowserRouter } from "react-router-dom";
import LogIn from './component/LogIn';
import Home from './component/Home';

function App() {
  const [showHomePage, setShowHomePage] = useState(false);

  const handleHeaderClick = () => {
    setShowHomePage(!showHomePage);
  };

  return (
    <div className="App">
      {/* {showHomePage ? (
        <Home />
      ) : (
        <header className="App-header">
          <h1 onClick={handleHeaderClick}>
            Welcome To Start Your Career <span>click here</span>
          </h1>
        </header>
      )} */}
      
      <BrowserRouter>
      <Routes>
        <Route path='/login' element={ <LogIn/> }/>
        <Route path = '/' element = { <LogIn /> } />
        <Route path='/home' element = { <Home /> } />
        <Route path='/features' element = { <Home /> } />
        <Route path='/Services' element = { <Home /> } />
        <Route path='/Workwithus' element = { <Home /> } />
        {/* <Route path='/About' element = { <Home /> } />  */}
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
