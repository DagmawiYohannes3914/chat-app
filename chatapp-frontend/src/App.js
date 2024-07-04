import React, { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  return (
    <div>
      {!isLoggedIn ? (
        <div>
          <Register />
          <Login />
        </div>
      ) : (
        <Dashboard username={username} />
      )}
    </div>
  );
};

export default App;
