import React, { useState } from 'react';
import { toast } from 'react-toastify';
import '../styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTeleAssist = () => {
    toast.info('🏥 Tele Assistance feature coming soon! Stay tuned for virtual healthcare consultations.', {
      autoClose: 5000
    });
  };

  return (
    <>
      <div className="contact-hero py-5 mb-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">Get in Touch</h1>
          <p className="lead">We're here to help and answer any questions you might have</p>
        </div>
      </div>

      <div className="container mb-5">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card contact-card shadow-sm h-100">
              <div className="card-body">
                <h3 className="card-title mb-4">Send us a Message</h3>
                <form id="contactForm" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      rows="5"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary px-4 py-2">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="row g-4">
              <div className="col-12">
                <div className="card contact-info-card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-envelope-paper contact-icon"></i>
                      <div>
                        <h5 className="mb-1">Email Us</h5>
                        <a 
                          href="mailto:pillorasite@gmail.com"
                          className="contact-email-link"
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
                      <i className="bi bi-telephone contact-icon"></i>
                      <div>
                        <h5 className="mb-1">Call Us</h5>
                        <p className="mb-0">+91 8088972078</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 mt-auto">
                <button 
                  className="btn tele-assist-btn w-100"
                  onClick={handleTeleAssist}
                >
                  <i className="bi bi-phone me-2"></i>
                  Tele Assistance
                  <span className="coming-soon-badge ms-2">Coming Soon</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
