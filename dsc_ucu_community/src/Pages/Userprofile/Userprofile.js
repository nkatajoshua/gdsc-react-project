import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { firebaseConfig } from '../../Base/firebaseConfig';
import './Userprofile.css';

firebase.initializeApp(firebaseConfig);

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      const userRef = firebase.database().ref('members/' + currentUser.uid);
      userRef.on('value', (snapshot) => {
        const member = snapshot.val();
        setUserProfile(member);
      });
    }
  }, []);

  return (
  <>
    <div className='user-content'>
      <h20>User Profile</h20>
      <p>Name: {userProfile.name}</p>
      <p>Email: {userProfile.email}</p>
      <p>Phone: {userProfile.phone}</p>
      <p>Role: {userProfile.role}</p>
      <span>
      <p>Thank you for joining us !!!</p>
      </span>
    </div>
  </>
  );
};

export default UserProfile;
