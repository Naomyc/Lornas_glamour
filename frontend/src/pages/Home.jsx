import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import StaffAvailability from "../components/StaffAvailability";
import SalonServices from "../components/SalonServices";
import "../styles/components.css";

const Home = () => {
  return (
    <div className="home">
      {/* Header Section */}
      <header className="home__header">
        <h1>Welcome to Lorna's Glamour</h1>
        <p>Your beauty, our passion</p>
      </header>

      {/* Intro Section */}
      <section className="home__intro">
        <h2>What We Offer</h2>
        <p>
          From braids to color and everything in between — explore our top-notch
          services.
        </p>
      </section>

      {/* Salon Services Section */}
      <section className="home__services">
        <SalonServices />
        <div className="home__cta">
          <Link to="/booking" className="btn btn--primary">
            Book Now
          </Link>
        </div>
      </section>

      {/* Staff Availability Section */}
      <section className="home__availability">
        <StaffAvailability />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
