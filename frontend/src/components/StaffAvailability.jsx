import React from "react";

export default function StaffAvailability({ staff }) {
  if (!staff.length) return <p>No staff found.</p>;

  return (
    <ul>
      {staff.map((s) => (
        <li key={s._id} style={{ marginBottom: "10px" }}>
          <strong>{s.name}</strong> (Active: {s.active ? "Yes" : "No"})<br />
          Working Days: {s.availability?.workingDays?.join(", ") || "N/A"}<br />
          Working Hours: {s.availability?.workingHours?.start || "N/A"} - {s.availability?.workingHours?.end || "N/A"}<br />
          Leaves:{" "}
          {s.availability?.leaves?.length ? (
            <ul>
              {s.availability.leaves.map((leave, i) => (
                <li key={i}>
                  {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()} ({leave.type})
                  {leave.notes ? ` - ${leave.notes}` : ""}
                </li>
              ))}
            </ul>
          ) : (
            "None"
          )}
        </li>
      ))}
    </ul>
  );
}
