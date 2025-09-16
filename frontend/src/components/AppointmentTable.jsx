import React from "react";

const API_BASE = "http://localhost:3000"

export default function AppointmentsTable({ bookings, onUpdate }) {
  // Handle no-show
  async function markNoShow(id) {
    if (!window.confirm("Mark this appointment as no-show?")) return;
    try {
      const res = await fetch(`${API_BASE}/bookings/${id}/no-show`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to mark no-show");
      alert("Appointment marked as no-show");
      onUpdate();
    } catch (err) {
      alert(err.message);
    }
  }

  // Handle cancellation
  async function cancelBooking(id) {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to cancel appointment");
      alert("Appointment cancelled");
      onUpdate();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Customer</th>
          <th>Service</th>
          <th>Supply Option</th>
          <th>Staff</th>
          <th>Date & Time</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {bookings.length === 0 && (
          <tr>
            <td colSpan="7" style={{ textAlign: "center" }}>
              No upcoming appointments.
            </td>
          </tr>
        )}
        {bookings.map((b) => (
          <tr key={b._id}>
            <td>{b.customer?.name || "N/A"}</td>
            <td>{b.serviceSelection}</td>
            <td>{b.supplyOption}</td>
            <td>{b.staffSelection || "Unassigned"}</td>
            <td>{new Date(b.appointmentAt).toLocaleString()}</td>
            <td>{b.status}</td>
            <td>
              {b.status !== "cancelled" && b.status !== "no-show" && (
                <>
                  <button onClick={() => markNoShow(b._id)} style={{ marginRight: "8px" }}>
                    Mark No-Show
                  </button>
                  <button onClick={() => cancelBooking(b._id)}>Cancel</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
