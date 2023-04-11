import React, { useState } from 'react';
import './Regpage.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import { firebaseConfig } from '../../Base/firebaseConfig';
import { useNavigate } from 'react-router-dom';

firebase.initializeApp(firebaseConfig);

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Club Member');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        user.sendEmailVerification()
          .then(() => {
            const database = firebase.database();
            const newMember = {
              name,
              email,
              phone,
              role,
            };
            database.ref('members').child(user.uid).set(newMember)
              .then(() => {
                alert('Registration successful. Please check your email to verify your account.');
                navigate('/login'); // Use navigate instead of firebase.auth().signInWithEmailAndPassword
              })
              .catch((error) => {
                setErrorMessage(error.message);
              });
          })
          .catch((error) => {
            setErrorMessage(error.message);
          });
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <>
      <div className='page'>
        <div className='cover'>
          <h1>Register</h1>
          <form className='member-form' onSubmit={handleRegister}>
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              id='name'
              value={name}
              onChange={(event) => setName(event.target.value)}
            />

            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <label htmlFor='phone'>Phone:</label>
            <input
              type='tel'
              id='phone'
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />

            <label htmlFor='password'>Password:</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <label htmlFor='confirm-password'>Confirm Password:</label>
            <input
              type='password'
              id='confirm-password'
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />

            <label htmlFor='role'>Role:</label>
            <select id='role' value={role} onChange={(event) => setRole(event.target.value)}>
              <option value='Club Member'>Club Member</option>
              <option value='Event Coordinator'>Event Coordinator</option>
              <option value='Marketing Lead'>Marketing Lead</option>
              <option value='Technical Lead'>Technical Lead</option>
              <option value='Mentorship Lead'>Mentorship Lead</option>
              <option value='Design Lead'>Design Lead</option>
              <option value='Outreach Lead'>Outreach Lead</option>
            </select>

            <button type='submit' className='register-btn'>Register</button>
          </form>
          {errorMessage && (
            <div className='error-message'>
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default RegisterPage