import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore"; // Import Firestore
import { firebaseConfig } from "../Base/firebaseConfig";

firebase.initializeApp(firebaseConfig);

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Track if user is an admin
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    firebase.auth().signOut();
    navigate('/');
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        console.log("User is logged in");

        // Check if user is an admin
        const userRef = firebase.firestore().collection('admins').doc(user.uid);
        userRef.get().then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            if (data.role === 'admin') {
              setIsAdmin(true);
            }
          }
        }).catch((error) => {
          console.log("Error getting user data:", error);
        });

      } else {
        console.log("User is logged out");
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    });
  }, []);

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link to="/admindashboard">Admin Content</Link>
              )}
              <Link to='/member-content'>Member Content</Link>
              <Link to="/userprofile">User profile</Link>
              <button className="loginout" onClick={handleLogout}>Logout</button>
              
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
