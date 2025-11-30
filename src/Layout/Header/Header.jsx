// src/components/Layout/Header.js
import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";

export default function Header() {
  const role = localStorage.getItem("role") || "guest";

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm" fixed="top" style={{ marginLeft: 165 }}>
      <Container fluid>
        <Navbar.Brand className="fw-bold">Task Management</Navbar.Brand>

        <Nav className="ms-auto">
          <span className="me-3 text-muted">Role: {role}</span>
          <Nav.Link onClick={() => {
            localStorage.removeItem("role");
            window.location.reload();
          }}>
            Logout
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
