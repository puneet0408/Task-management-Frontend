// src/components/Layout/Header.js
import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { FiLogOut } from "react-icons/fi";
import AuthService from "../../auth/service/authService";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "Guest";
  const userName = localStorage.getItem("name") || "User";

  const handleLogout = async () => {
    const api = new AuthService();
    const res = await api.logout();
    if (res.status === 500) {
      navigate("./login");
    }
    if (res.status === 201) {
      navigate("./login");
    }
    localStorage.clear();
    window.location.reload();
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 190,
        right: 0,
        zIndex: 1000,
        padding: "16px 24px",
        backgroundColor: "#f8fafc",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <Navbar
        expand="lg"
        style={{
          borderRadius: "12px",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          height: "68px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
          border: "1px solid rgba(255, 255, 255, 0.8)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "0 12px",
            height: "68px",
          }}
        >
          <div>
            <h5
              style={{
                color: "#7367F0",
                fontSize: "1.25rem",
              }}
            >
              Task Master
            </h5>
          </div>
          <Nav
            className="d-flex"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "20px",
              padding: 0,
              margin: 0,
              height: "100%",
            }}
          >
            <span
              style={{
                fontWeight: "500",
                fontSize: "14px",
                color: "#4b5563",
                display: "flex",
                alignItems: "center",
              }}
            >
              {role}
            </span>

            <button
              onClick={handleLogout}
              style={{
                border: "none",
                outline: "none",
                cursor: "pointer",
                borderRadius: "8px",
                padding: "8px 14px",
                fontSize: "14px",
                color: "#dc2626",
                fontWeight: "500",
                backgroundColor: "transparent",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#fef2f2")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </Nav>
        </div>
      </Navbar>
    </header>
  );
}
