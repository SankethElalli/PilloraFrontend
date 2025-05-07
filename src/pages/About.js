import React from 'react';
import '../styles/About.css';

function About() {
  return (
    <div className="container py-5 about-page">
      <div className="about-hero mb-5">
        <h1 className="about-title">Know Us</h1>
        <p className="about-lead">
          <span className="about-highlight">Pillora</span> is your trusted online pharmacy, dedicated to making healthcare accessible, affordable, and reliable for everyone.
        </p>
      </div>

      <div className="about-mission-vision-values">
        <div className="about-mvv-card">
          <div className="about-mvv-header">
            <i className="bi bi-bullseye icon-mission"></i>
            <span>Our Mission</span>
          </div>
          <div className="about-mvv-body">
            To make healthcare accessible and affordable for everyone through a seamless online experience.
          </div>
        </div>
        <div className="about-mvv-card">
          <div className="about-mvv-header">
            <i className="bi bi-eye icon-vision"></i>
            <span>Our Vision</span>
          </div>
          <div className="about-mvv-body">
            To be the most trusted digital pharmacy, empowering people to manage their health with confidence.
          </div>
        </div>
        <div className="about-mvv-card">
          <div className="about-mvv-header">
            <i className="bi bi-heart-pulse icon-values"></i>
            <span>Our Values</span>
          </div>
          <div className="about-mvv-body">
            <ul className="about-values-list">
              <li>Integrity &amp; Trust</li>
              <li>Customer-Centricity</li>
              <li>Innovation</li>
              <li>Quality Assurance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
