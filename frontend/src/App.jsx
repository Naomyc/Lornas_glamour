import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookingPage from './pages/BookingPage'; 
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';
import ContactUs from './components/Contact';

function App() {
  return (
    <Router>
      <Navbar />
      <div >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Contact" element={<ContactUs />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/admin" element={<Dashboard/>}/>
        </Routes>

      </div>
       {/* Footer */}
      <Footer />
    </Router>
  );
}

export default App;
