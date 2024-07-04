import React from "react";

const Dashboard = ({ username }) => {
  return (
    <div>
      <h2>Hello {username}</h2>
      <button>Create Chat</button>
    </div>
  );
};

export default Dashboard;
