import React from "react";
import Sidebar from "./SideBar/Sidebar";
import Header from "./Header/Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
     <Header />
      <Sidebar />
      
      <div
        style={{
          marginLeft: 190,
          marginTop: 90,
          padding: 20
        }}
      >
        <Outlet />   {/* CHILD ROUTES SHOW HERE */}
      </div>
    </>
  );
}
