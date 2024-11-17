import React from "react";

function Dashboard() {
  const username = localStorage.getItem("username");

  return (
    <div>
      <h2>Welcome, {username}!</h2>
      <p>This is your dashboard.</p>
    </div>
  );
}

export default Dashboard;
