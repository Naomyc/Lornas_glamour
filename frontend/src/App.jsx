import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BookingPage from "./pages/BookingPage";
import Footer from "./components/Footer";
import ContactUs from "./components/Contact";
import AppointmentsTable from "./components/AppointmentTable";
import StaffAvailability from "./components/StaffAvailability";
import InventoryList from "./components/InventoryList";

function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Contact" element={<ContactUs />} />
          <Route path="/booking" element={<BookingPage />} />

          <Route path="/admin" element={<Admin />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="appointment" element={<AppointmentsTable />} />
            <Route path="staff" element={<StaffAvailability />} />
            <Route path="inventory" element={<InventoryList />} />
          </Route>
        </Routes>
      </div>
      {/* Footer */}
      <Footer />
    </Router>
  );
}

export default App;
