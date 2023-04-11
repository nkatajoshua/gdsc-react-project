import React, { useState, useEffect } from "react";
import './Member-content.css';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import { firebaseConfig } from "../../Base/firebaseConfig";

firebase.initializeApp(firebaseConfig);

const MemberContent = () => {
  const [name, setName] = useState("");

  useEffect(() => {
    const userId = firebase.auth().currentUser.uid;
    const membersRef = firebase.database().ref(`members/${userId}`);
    membersRef.on("value", (snapshot) => {
      const memberData = snapshot.val();
      const memberName = memberData.name;
      setName(memberName);
    });
    return () => {
      membersRef.off("value");
    };
  }, []);

  return (
    <>
      <div className="member-content">
        <h10>Welcome, {name}!</h10>
        <p>Upcoming Event</p>
        <iframe title="YouTube video player" width="560" height="315" src="https://www.youtube.com/embed/AUZBmvBWsRg" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen ></iframe>
      </div>
    </>
  );
};

export default MemberContent;
