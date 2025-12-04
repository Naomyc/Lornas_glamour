import React from "react";
import {Link} from "react-router-dom";
import  "../styles/components.css";
const ContactUs=()=>{
  return(
    <div className="contact">
    <section>
      <h1>Contact information</h1>
      <p>LC Glamour  is located in Järvensivu,Tampere, just a stone's throw from
        the Ratina shopping mall (1.6km).</p>
    </section>
    <section>
      <h2>Our opening hours</h2>
      <p>We are open by appointment,including evenings and weekends.</p>
      
    </section>
    <section>
      <h2>Email</h2>
      <a href="mailto:lornajep12@gmail.com" aria-label="Email us at lornajep12@gmail.com">lornajep12@gmail.com</a>
      <h2>Telephone</h2>
      <a href="tel:0414723651" aria-label="Call +358 41 4723651" >+358 41 4723651</a>
    </section>
    <section>
      <h2>Address</h2>
      <p>Järvensivuntie 13A <br />33100 Tampere </p>
    </section>
    <section>
      <h2>Parking</h2>
      <p>Free 8-hour parking along Järvensivuntie street.</p>
    </section>
    <Link to="/booking">
    <button className="btn btn--primary">Book Now</button>
    </Link>
    </div>
  )
}

export default ContactUs;