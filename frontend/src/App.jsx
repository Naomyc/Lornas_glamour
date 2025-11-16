import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookingPage from './pages/BookingPage'; // <-- You'll need to create this
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Navbar />
      <div >
        <Routes>
          <Route path="/" element={<Home />} />
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
