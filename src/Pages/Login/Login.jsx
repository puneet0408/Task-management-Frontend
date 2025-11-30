import React, { useState } from "react";
import useApi from "../../auth/service/useApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./login.scss";

export default function Login() {
  const api = useApi();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.login({ email, password });

      if (response.status === 201) {
        const user = response.data.data;

        // Save user data
        localStorage.setItem("userData", JSON.stringify(user));
        localStorage.setItem("role", user.role); 

        toast.success("Login successfully");
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Login error:", error);
      toast.error("Error while login");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <form onSubmit={handleLogin}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
