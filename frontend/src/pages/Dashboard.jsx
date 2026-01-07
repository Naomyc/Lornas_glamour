import React, {useEffect,useState} from "react";
import AppointmentsTable from "../components/AppointmentTable";
import StaffAvailability from "../components/StaffAvailability";
import InventoryList from "../components/InventoryList";

const API_BASE= "http://localhost:3000";

export default function Dashboard() {
  const [bookings,setBookings]=useState([]);
  const [staff,setStaff]=useState([]);
  const [inventory,setInventory]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);

  //fetch data
  useEffect(()=>{
    async function fetchData() {
    try{
      setLoading(true);
      const [bookingsRes,staffRes,inventoryRes]= await Promise.all([
        fetch(`${API_BASE}/bookings`),
        fetch(`${API_BASE}/staff`),
        fetch(`${API_BASE}/inventory`),

      ]);
      if(!bookingsRes.ok || !staffRes.ok || !inventoryRes.ok){
        throw new Error("Failed to fetch data");
      }

      const bookingsData=await bookingsRes.json();
      const staffData= await staffRes.json();
      const inventoryData= await inventoryRes.json();

      setBookings(bookingsData);
      setStaff(staffData);
      setInventory(inventoryData);
      setError(null);

    } catch(err){
      setError(err.message);
    } finally{
      setLoading(false);
    }}
    fetchData();
  },[]);

  //refreshing bookings

  const refreshBookings=async ()=>{
    try{
      const res=await fetch(`${API_BASE}/bookings`);
      const data=await res.json();
      setBookings(data);
    } catch(err){
      setError("Failed to refresh bookings");
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if(error) return <p style={{color:"red"}}>Error: {error}</p>;

  return (
    <div style={{padding: "20px"}}>
      <h1>Salon Admin Dashboard</h1>

      <section>
        <h2>Upcoming Appointments</h2>
        <AppointmentsTable bookings={bookings} onUpdate={refreshBookings} />
      </section>
      <section>
        <h2>Staff Availability</h2>
        <staffAvalability staff={staff} />
      </section>
      <section>
        <h2>Inventory</h2>
        <InventoryList items={inventory} />
      </section>
    </div>
  );


}