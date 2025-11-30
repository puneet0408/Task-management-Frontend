import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./Layout/Layout";
import ProtectedRoute from "./Components/ProtectedRoute";

import Dashboard from "./Pages/Dashboard/dashboard";
import Login from "./Pages/Login/Login";

import menuConfig from "./Navigation/menuConfig";
const routeComponentMap = {
  "/dashboard": <Dashboard />,
  "/company": <div>Company</div>,
  "/users": <div>Users</div>,
  "/projects": <div>Projects</div>,
  "/tasks": <div>Tasks</div>,
  "/sprint": <div>Sprint</div>,
  "/asistance": <div>AI Assistance</div>,
};
export default function App() {
  const stored = localStorage.getItem("userData");
  const userData = stored ? JSON.parse(stored) : {};
  const role = userData.role;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute allowed={["superadmin", "admin", "manager", "employee"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          {menuConfig.map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={
                <ProtectedRoute allowed={item.roles}>
                  {routeComponentMap[item.path]}
                </ProtectedRoute>
              }
            />
          ))}
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
