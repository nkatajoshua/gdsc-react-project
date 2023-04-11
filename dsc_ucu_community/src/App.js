import React from "react";

import { Routes, Route } from 'react-router-dom';
import NavBar from "./Components/Navbar";
import Footer from "./Components/Footer";
import HomePage from './Pages/Homepage/Homepage';
import LoginPage from './Pages/LoginRegpage/Loginpage';
import RegisterPage from "./Pages/LoginRegpage/Registerpage";
import MemberContent from "./Pages/Member-content/Member-content";
import UserProfile from "./Pages/Userprofile/Userprofile";
import AdminDashboard from "./Pages/Admin dash/AdminDashboard";

const App = () => {
  return (
   <>
    <NavBar/>
      <Routes>
        <Route exact path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/member-content" element={<MemberContent/>} />
        <Route path="/admindashboard" element={<AdminDashboard/>} />
        <Route path="/userprofile" element={<UserProfile/>} />
      </Routes> 
    <Footer/>
   </>
  );
};

export default App;
