import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/components.css"; 
import { HashLink } from "react-router-hash-link";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Lorna's Glamour Logo" /> 
        <p>LC Glamour</p>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><HashLink smooth to="/#categories">Services</HashLink></li>
        <li><Link to="/booking">Book appointment</Link></li>
        <li><HashLink smooth to="/#contact">Contact</HashLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
