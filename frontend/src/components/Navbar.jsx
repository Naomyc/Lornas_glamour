import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Twinkle Salon Logo" />
        <p style={{fontSize:"4"}}>Lorna's Glamour</p>
      </div>
      <ul className="navlinks">
        <li><Link to="/">Home</Link></li>
        <li><a href="#services">Services</a></li>
        <li><Link to="/booking">Booking</Link></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
