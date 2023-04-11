import React, { useState, useEffect } from 'react';
import './Loginpage.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'; // import Firestore
import { firebaseConfig } from '../../Base/firebaseConfig';
import MemberContent from '../Member-content/Member-content';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../Admin dash/AdminDashboard';

firebase.initializeApp(firebaseConfig);

const LoginPage = () => {
  const navigate = useNavigate();
  const database = firebase.database();
  const [popupStyle, setPopupStyle] = useState("hide");
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showMemberContent, setShowMemberContent] = useState(false);
  const [showAdminContent, setShowAdminContent] = useState(false); // add state for admin content
  const [isAdmin, setIsAdmin] = useState(false); // add state for admin status

  const handleMemberContentClick = () => {
    setShowMemberContent(true);
    navigate('/member-content');
  };

  const handleAdminContentClick = () => {
    setShowAdminContent(true);
    navigate('/admindashboard');
  }

  const handleGoogleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        const { displayName, email, photoURL, uid } = result.user;
        setName(displayName);
        setImageUrl(photoURL);
        setIsAuthenticated(true);
        console.log("LOGIN SUCCESS! Current user: ", displayName);
        console.log("User image URL: ", photoURL);

        // Add user info to members database
        database.ref('members').child(uid).set({
          name: displayName,
          email: email,
          photoURL: photoURL
        }).then(() => {
          console.log("User info added to members database");
        }).catch((error) => {
          console.log("Error adding user info to members database:", error);
        });

        // Check if user is an admin
        firebase.firestore().collection('admins').doc(uid).get()
          .then((doc) => {
            if (doc.exists) {
              setIsAdmin(true);
              console.log("User is an admin");
            } else {
              setIsAdmin(false);
              console.log("User is not an admin");
            }
          })
          .catch((error) => {
            console.log("Error checking if user is an admin:", error);
          });

        // Navigate to member or admin content page
        if (isAdmin) {
          handleAdminContentClick();
        } else {
          handleMemberContentClick();
        }
      })
      .catch((error) => console.log("LOGIN FAILED! Error: ", error));
  };

  const handleLogout = () => {
    firebase.auth().signOut();
    setName("");
    setImageUrl("");
    setIsAuthenticated(false);
    setIsAdmin(false); // reset admin status
  };

  const handleLogin = () => {
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
  
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("LOGIN SUCCESS! Current user: ", user.email);
  
        // Check if user is a member
        database.ref('members').child(user.uid).once('value', (snapshot) => {
          const isMember = snapshot.exists();
          console.log("Is member: ", isMember);
  
          // If user is a member, show member content
          if (isMember) {
            setShowMemberContent(true);
            handleMemberContentClick(); // navigate to member content page
          }
          // If user is an admin, show admin content
          else {
            firebase.firestore().collection('admins').doc(user.uid).get().then((doc) => {
              if (doc.exists) {
                setShowAdminContent(true);
                handleAdminContentClick(); // navigate to admin content page
              }
            }).catch((error) => {
              console.log("Error getting admin data:", error);
            });
          }
        });
  
        // Update state
        setName(user.displayName);
        setImageUrl(user.photoURL);
        setIsAuthenticated(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("LOGIN FAILED! Error: ", errorCode, errorMessage);
  
        // Show error popup
        setPopupStyle('login-popup');
        setTimeout(() => setPopupStyle("hide"), 3000);
      });
  };
  
  



  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL } = user;
        setName(displayName);
        setImageUrl(photoURL);
        setIsAuthenticated(true);
        console.log("User is logged in");
      } else {
        console.log("User is logged out");
        setName("");
        setImageUrl("");
        setIsAuthenticated(false);
      }
    });
  }, []);

  return (
    <>
      <div className='page'>
        {name ? (
          <div className='welcome-screen'>
            <h1>Welcome, {name}!</h1>
            <img src={imageUrl} alt='Profile'/>
            <button onClick={handleLogout}>Logout</button>
            {isAuthenticated && (
              <div>
                {isAdmin && (
                  <button onClick={handleAdminContentClick}>Admin Content</button>
                )}
                  <button onClick={handleMemberContentClick}>Member Content</button>
              </div>
            )}
            {showMemberContent && <MemberContent name={name} />}
            {showAdminContent && <AdminDashboard/>}
          </div>
        ) : (
          <div className='cover'>
            <h1>Login</h1>
            <input type='text' id='email' placeholder='email'/>
            <input type='password' id='password' placeholder='password'/>
            <button type='submit' className='login-btn' onClick={handleLogin}>Login</button>
            <p className='login-txt'>Or login using</p>
            <div className='alt-login'>
              <div className='google'>
                <button onClick={handleGoogleSignIn} className='small-button'>Sign in with google</button>
              </div>
            </div>
            <div className={popupStyle}>
              <h3>Login Failed</h3>
              <p>Username or password incorrect</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LoginPage;
