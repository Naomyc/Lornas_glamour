import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/Navbar.css";
import { HashLink } from "react-router-hash-link";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Twinkle Salon Logo" />
        <p style={{fontSize:"4"}}>Lorna's Glamour</p>
      </div>
      <ul className="navlinks">
        <li><Link to="/">Home</Link></li>
        <li><HashLink smooth to="/#categories">Services</HashLink></li>
        <li><Link to="/booking">Booking</Link></li>
        <li><HashLink smooth to="/#contact">Contact</HashLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
