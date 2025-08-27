import React from "react";
import ContactBgImg from "../assets/images/static/contact.jpg"; // Import the image
import BgBannerContactImg from "../assets/images/static/contact.jpg"; // Import the image
import "../assets/css/ContactUs.css";

const ContactUs = () => {
  return (
    <div className="gpp-container">
      <div className="gpp-top-header">
        <div className="l-top-header">
          <div>
            <i className="fa-solid fa-location-pin pr-1"></i> 423B, Road WorldWide
            Country, USA
          </div>
          <div>
            <i className="fa-regular fa-envelope pr-1"></i> abyridellc@gmail.com
          </div>
        </div>
        <div className="r-top-header">
          <div>
            <i className="fa-solid fa-phone pr-1"></i> | + (250) 792 054 84
          </div>
          <div className="gppIcons">
            <a href="#instagram">
              <i className="fa-brands fa-instagram gpp-icon"></i>
            </a>
            <a href="#twitter">
              <i className="fa-brands fa-twitter gpp-icon"></i>
            </a>
            <a href="#whatsapp">
              <i className="fa-brands fa-whatsapp gpp-icon"></i>
            </a>
            <a href="#facebook">
              <i className="fa-brands fa-facebook gpp-icon"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="gpp-header"></div>
      <div className="welcomeBox">
        <div className="l-welcome-content">
          <h1>Contact Us</h1>

          <div className="breadcrumb">
            <div className="iconHolder">
              <i className="fa-solid fa-home"></i>
            </div>
            <div>
              <a href="/">Home</a> / Contact Us
            </div>
          </div>
        </div>

        <div className="r-welcome-content">
          <img src={BgBannerContactImg} alt="Abyride Contact Us" />
        </div>
      </div>

      <div className="contactB-container">
        <div className="flex-c-content">
          <div className="l-contact-container">
            <div className="titleTxt">Contact Us</div>
            <h1 className="HeaderTxt">Contact us for more Details</h1>

            <div className="contactImg">
              <img src={ContactBgImg} alt="Contact represent image" />
            </div>
          </div>

          <div className="r-contact-container">
            <div className="re-box">
              <div className="circle-icon">
                <i className="fa-solid fa-envelope"></i>
              </div>

              <div className="re-content">
                <h3>Email Address</h3>
                <p>
                  <a href="#verified" className="email-txt">
                    abyridellc@gmail.com
                  </a>
                </p>
                <p>
                  <a href="#verified" className="email-txt">
                    ganzaparfait7@gmail.com
                  </a>
                </p>
              </div>
            </div>
            <div className="re-box">
              <div className="circle-icon">
                <i className="fa-solid fa-phone"></i>
              </div>

              <div className="re-content">
                <h3>Call Now</h3>
                <p>+91-123-456-789</p>
                <p>+91-123-456-789</p>
              </div>
            </div>
            <div className="re-box">
              <div className="circle-icon">
                <i className="fa-solid fa-location-pin"></i>
              </div>

              <div className="re-content">
                <h3>Address</h3>
                <p>423B, Road Peace</p>
                <p>
                  <a href="#verified" className="email-txt">
                    nelsonprince6002@gmail.com
                  </a>
                </p>
              </div>
            </div>
            <div className="re-box">
              <div className="circle-icon">
                <i className="fa-regular fa-message"></i>
              </div>

              <div className="re-content">
                <h3>Have Questions?</h3>
                <p>Discover more by visiting us or joining our community.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contactF-form">
          <div className="form-content">
            <form action="#saved" method="post">
              <h2 className="FormHeader">Get Free Consulting</h2>

              <div className="flex-field">
                <div className="field">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    aria-label="name"
                  />
                  <div className="error">Please fill out this field.</div>
                </div>
                <div className="field">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    aria-label="email"
                  />
                </div>
              </div>

              <div className="flex-field">
                <div className="field">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Your Phone Number"
                    aria-label="phone"
                  />
                </div>
                <div className="field">
                  <select name="service" aria-label="service">
                    <option value="" selected>
                      Select Services
                    </option>
                    <option value="Portifolio Manage">Portifolio Manage</option>
                    <option value="Employee Training">Employee Training</option>
                    <option value="Financial Insurance">
                      Financial Insurance
                    </option>
                    <option value="Market Research">Market Research</option>
                    <option value="Strategy & Planning">
                      Strategy & Planning
                    </option>
                    <option value="Strategic Planning">
                      Strategic Planning
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex-field">
                <div className="field">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    aria-label="name"
                  />
                </div>
                <div className="field">
                  <p className="notifyTxt">
                    Submit this information and we will send you the cost for
                    the service.
                  </p>
                </div>
              </div>

              <button type="button" className="formBtn">
                SEND MESSAGE <i className="fa-solid fa-arrow-right ml-1"></i>
              </button>
            </form>
          </div>
          <div className="form-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.4761743510844!2d30.135017900000005!3d-1.9633119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca796f9417ad5%3A0x45ebba72296bfee2!2sKigali%20International%20Airport!5e0!3m2!1sen!2srw!4v1736266175265!5m2!1sen!2srw"
              width="100%"
              height="100%"
              style={{ border: "0" }} // Corrected style object
              allowfullscreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
