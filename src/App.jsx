import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/user/auth/Login";
import Dashboard from "./pages/user/dashboard/Dashboard";

const App = () => {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App;