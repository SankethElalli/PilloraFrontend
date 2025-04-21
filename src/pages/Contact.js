import React from 'react';

function Contact() {
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
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h3 className="card-title mb-4">Send us a Message</h3>
                <form id="contactForm">
                  {/* Form fields */}
                </form>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="row g-4">
              {/* Contact info cards */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
