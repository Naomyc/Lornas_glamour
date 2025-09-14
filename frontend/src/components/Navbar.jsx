import React from 'react';
import logo from "../assets/logo.png";
import "../styles/Navbar.css"
const Navbar=()=>{
    return(
        <nav className="navbar">
            <div className="logo">
                <img src={logo} alt="Twinkle Salon Logo"/>
            </div>
            <ul className="navlinks">
                <li><a href="#Home">Home</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#booking">Booking</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    
    );
};
export default Navbar;