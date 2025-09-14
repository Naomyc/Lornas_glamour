import React from "react";
import Footer from "../components/Footer";
import SalonServices from "../components/SalonServices";
const Home=()=>{
    return (
        <div className="home-container">
            <header>
                <h1>Welcome to Our Salon</h1>
                <p>Your beauty,our passion</p>
            </header>
            <section className="intro">
                <h2>What We Offer</h2>
                <p>From braids to color and everything in between — explore our top-notch services.

                </p>
            </section>
            <section id="categories">
                <SalonServices />
            </section>
           
            <footer>
               <Footer />
            </footer>
        </div>
    );
};
export default Home;