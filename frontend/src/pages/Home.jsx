import React from "react";
import { Link } from "react-router-dom";
import StaffAvailability from "../components/StaffAvailability";
import SalonServices from "../components/SalonServices";
import "../styles/components.css";

const Home = () => {
  return (
    <div className="home">
      {/* Header Section */}
      <header className="home__header">
        <h1>LC Glamour</h1>
        <p>Expert services with touch of glamour and professionalism </p>
         <Link to="/booking" className="btn btn--primary">
            Book appointment
          </Link>
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
      <section className="home__services" id="categories">
        <SalonServices />
       
      </section>

      {/* Staff Availability Section */}
      <section className="home__availability">
        <StaffAvailability />
      </section>

     
    </div>
  );
};

export default Home;
