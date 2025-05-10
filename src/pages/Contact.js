import React, { useState } from 'react';
import '../styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Modal state
  const [showTeleAssistModal, setShowTeleAssistModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTeleAssist = () => {
    setShowTeleAssistModal(true);
  };

  const closeTeleAssistModal = () => {
    setShowTeleAssistModal(false);
  };

  return (
    <>
      {/* Tele Assistance Modal */}
      {showTeleAssistModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tele Assistance</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeTeleAssistModal}></button>
              </div>
              <div className="modal-body">
                <p>Tele Assistance feature coming soon! Stay tuned for virtual healthcare consultations.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeTeleAssistModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="contact-hero py-5 mb-4">
        <div className="container text-center">
          <h1 className="display-5 fw-bold">Get in Touch</h1>
          <p className="lead">We're here to help and answer any questions you might have</p>
        </div>
      </div>

      <div className="container mb-5">
        <div className="row g-4 flex-column-reverse flex-md-row">
          {/* Info Section */}
          <div className="col-12 col-md-6 mb-4 mb-md-0">
            <div className="row g-3 flex-md-column h-100">
              <div className="col-12">
                <div className="card contact-info-card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-envelope-paper contact-icon" aria-label="Email icon"></i>
                      <div>
                        <h5 className="mb-1">Email Us</h5>
                        <a 
                          href="mailto:pillorasite@gmail.com"
                          className="contact-email-link"
                          aria-label="Send email to pillorasite@gmail.com"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = "mailto:pillorasite@gmail.com";
                          }}
                        >
                          pillorasite@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="card contact-info-card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-telephone contact-icon" aria-label="Phone icon"></i>
                      <div>
                        <h5 className="mb-1">Call Us</h5>
                        <a
                          href="tel:+918088972078"
                          className="contact-email-link"
                          aria-label="Call +91 8088972078"
                        >
                          +91 8088972078
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 mt-auto">
                <button 
                  className="btn tele-assist-btn w-100"
                  onClick={handleTeleAssist}
                  aria-label="Tele Assistance Coming Soon"
                >
                  <i className="bi bi-camera-video-fill me-2"></i>
                  Tele Assistance
                  <span className="coming-soon-badge ms-2">Coming Soon</span>
                </button>
              </div>
            </div>
          </div>
          {/* Form Section */}
          <div className="col-12 col-md-6">
            <div className="card contact-card shadow-sm h-100">
              <div className="card-body">
                <h3 className="card-title mb-4 text-center text-md-start">Send us a Message</h3>
                <form id="contactForm" onSubmit={handleSubmit} autoComplete="off">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="contact-name">Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      aria-label="Your Name"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="contact-email">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      aria-label="Your Email"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="contact-subject">Subject</label>
                    <input
                      id="contact-subject"
                      type="text"
                      className="form-control"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      aria-label="Subject"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label" htmlFor="contact-message">Message</label>
                    <textarea
                      id="contact-message"
                      className="form-control"
                      rows="5"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      aria-label="Your Message"
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary px-4 py-2 w-100">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
