import React from 'react';
import './Homepage.css';
import { Link } from 'react-router-dom';

const HomePage = () => {

  return (
    <>
      <div>
        <main>
          <h5>Welcome to the DSC UCU COMMUNITY</h5>
          <p>We are a community of developers in Uganda Christian University who share knowledge, ideas, and experiences.</p>
          <ul>
            <li>Learn new technologies and frameworks</li>
            <li>Participate in coding challenges and hackathons</li>
            <li>Network with other developers</li>
          </ul>
          <Link to='/login'>
            <button className='join-btn'>Join</button>
          </Link>
        </main>
      </div>
      <p className='text-design'>What are Google Developers Clubs?</p>
      <iframe title="YouTube video player" width="560" height="315" src="https://www.youtube.com/embed/earTjC0iSjg" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </>
  );
}

export default HomePage;
