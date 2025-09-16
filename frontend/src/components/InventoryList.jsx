import React from "react";

export default function InventoryList({ items }) {
  if (!items.length) return <p>No inventory items found.</p>;

  return (
    <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Stock</th>
          <th>Reorder Level</th>
          <th>Reordering?</th>
          <th>Order Status</th>
          <th>Expected Arrival</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item._id}>
            <td>{item.name}</td>
            <td>{item.stock}</td>
            <td>{item.reorderLevel}</td>
            <td>{item.isReordering ? "Yes" : "No"}</td>
            <td>{item.orderStatus}</td>
            <td>{item.expectedArrival ? new Date(item.expectedArrival).toLocaleDateString() : "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
