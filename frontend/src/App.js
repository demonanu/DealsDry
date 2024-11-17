import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import EmployeeForm from "./EmployeeForm";
import EmployeeList from "./EmployeeList";
import EditEmployeeForm from "./EditEmployeeForm";
import "./Navbar.css";

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      setUsername(localStorage.getItem("username"));
    }
  }, []);

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setUsername(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername("");
  };

  return (
    <Router future={{ v7_startTransition: true }}>
      <div>
        <nav>
          <ul>
            {isAuthenticated ? (
              <>
                <li>Welcome, {username}</li>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/employee-form">Employee Form</Link>
                </li>
                <li>
                  <Link to="/employee-list">Employee List</Link>
                </li>
                <li>
                  <a href="/" onClick={handleLogout}>
                    Logout
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/register">Register</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<Dashboard />} />}
          />
          <Route
            path="/employee-form"
            element={<PrivateRoute element={<EmployeeForm />} />}
          />
          <Route
            path="/employee-list"
            element={<PrivateRoute element={<EmployeeList />} />}
          />
          <Route
            path="/edit-employee/:id"
            element={<PrivateRoute element={<EditEmployeeForm />} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
