import React, { useState } from "react";
import useApi from "../../auth/service/useApi";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";


function PasswordCreation() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const api = useApi();

  const { token } = useParams(); 

  const PasswordCreationSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or expired link");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and confirm password must be same");
      return;
    }

    try {
      const res = await api.setuserPassword(password, token);
      if(res.status==200){
       toast.success("password created Sucessfully")
      }
      console.log("Password set successfully", res);
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <form
        onSubmit={PasswordCreationSubmit}
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
          Create Password
        </h2>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", fontWeight: "500" }}>
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", fontWeight: "500" }}>
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
        </div>

        {error && (
          <p style={{ color: "red", fontSize: "13px", textAlign: "center" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          style={{
            marginTop: "10px",
            padding: "12px",
            borderRadius: "6px",
            border: "none",
            background: "#7c4dff",
            color: "#fff",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default PasswordCreation;
