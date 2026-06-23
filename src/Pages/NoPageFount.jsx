import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "react-feather";

const NoPageFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          background: "#fff",
          borderRadius: "16px",
          padding: "40px",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: "#fef2f2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AlertTriangle size={40} color="#dc2626" />
        </div>

        <h1
          style={{
            fontSize: "72px",
            fontWeight: "700",
            color: "#111827",
            margin: 0,
          }}
        >
          404
        </h1>

        <h3
          style={{
            marginTop: "10px",
            color: "#111827",
            fontWeight: "600",
          }}
        >
          Page Not Found
        </h3>
      </div>
    </div>
  );
};

export default NoPageFound;