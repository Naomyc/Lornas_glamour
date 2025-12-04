import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/components.css"; 
import { HashLink } from "react-router-hash-link";
import { useState } from "react";

const Navbar = () => {
  const[menuOpen,setMenuOpen]=useState(false);
  const handleLinkClick = () => {
  setMenuOpen(false); 
};
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Lorna's Glamour Logo" /> 
        <p>LC Glamour</p>
      </div>
      {/*menu for small screens(hambuger menu)*/}
      <button 
      className="navbar-toggle"
      onClick={()=>setMenuOpen(!menuOpen)}>
        ☰
      </button>
      
  <ul className={`nav-links ${menuOpen ? "open"  :" "} `}>
        <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
        <li><HashLink smooth to="/#categories" onClick={handleLinkClick}>Services</HashLink></li>
        <li><Link to="/booking" onClick={handleLinkClick}>Book appointment</Link></li>

        <li><Link to="/Contact" onClick={handleLinkClick}>Contact Us</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
