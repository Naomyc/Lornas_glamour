import React from "react";
import "../styles/Footer.css"
import {FaInstagram} from "react-icons/fa";

const Footer=()=>{
  const currentYear= new Date().getFullYear();

  return(
    <footer className="footer">
      <p>
        Contact us: <a href="tel:0414723651">0414 723 651</a> |{" "}
        <a href="mailto:lornajep12@gmail.com">lornajep12@gmail.com</a>
      </p>
      <p>© {currentYear} Lorna's Glamour.All rights reserved</p>
      <a 
        href="https://www.instagram.com/naomychep/?hl=en"
        target="_blank"
        rel="noopener noreferrer"
        className="social-link"
        aria-label="Instagram"
        > <FaInstagram size={18} /> {/* Instagram icon */}</a>
    </footer>
  );
};
export default Footer;