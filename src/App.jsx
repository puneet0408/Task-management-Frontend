import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "flatpickr/dist/themes/material_blue.css";
import RootIndexRedirect from "./rootIndex";

import Layout from "./Layout/Layout";
import ProtectedRoute from "./Components/ProtectedRoute";

import Login from "./Pages/Login/Login";
import PasswordCreation from "./Pages/passwordCreation/passwordCreation";

import Dashboard from "./Pages/Dashboard/dashboard";
import Company from "./Pages/Company/Company";
import UserPage from "./Pages/Users/users";
import Project from "./Pages/Project/Project";
import SprintPage from "./Pages/Sprint/sprint";
export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/createpassword/:token" element={<PasswordCreation />} />
        <Route
          element={
            <ProtectedRoute
              allowed={["superadmin", "admin", "manager", "employee"]}
            />
          }
        >
          <Route element={<Layout />}>
            <Route index element={<RootIndexRedirect />} />

            <Route path="company" element={<Company />} />
            <Route path="users" element={<UserPage />} />
            <Route path="projects" element={<Project />} />
          </Route>

          <Route path=":companySlug/:projectId" element={<Layout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tasks" element={"task"} />
            <Route path="sprint" element={<SprintPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
