import React, { useState } from "react";
import useApi from "../../auth/service/useApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./login.scss";
import { fetchCurrentLogin } from "../../Redux/UserSlice";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Form,
  Input,
  Label,
  Button,
  Card,
  CardBody,
  CardTitle,
  FormFeedback,
} from "reactstrap";
import { Eye, EyeOff } from "react-feather";
import { useDispatch } from "react-redux";

const defaultValues = {
  email: "",
  password: "",
  remember: false,
};

const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const api = useApi();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginerror, setloginerror] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(LoginSchema),
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setloginerror("");

      const res = await api.login(formData);

      if (res.status === 201) {
        const user = res.data.data;

        localStorage.setItem("userData", JSON.stringify(user));
        localStorage.setItem("role", user.role);

        await dispatch(fetchCurrentLogin());

        toast.success("Logged in successfully");

        navigate(user.role === "superadmin" ? "/company" : "/", {
          replace: true,
        });
      }
    } catch (err) {
      setloginerror(
        err?.response?.data?.data?.msg ||
          err?.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* <div className="logo-section">
      <img src="/your-logo.png" alt="logo" className="login-logo" />
    </div> */}
        <h4 className="login-title">Welcome Back! 👋</h4>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* EMAIL */}
          <label className="input-label">Email</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                disabled={loading}
                className="custom-input"
                placeholder="john@example.com"
              />
            )}
          />
          {errors.email && (
            <span className="error-text">{errors.email.message}</span>
          )}
          <div className="label-row">
            <label className="input-label">Password</label>
            <a href="#" className="forgot-link">
              Forgot Password?
            </a>
          </div>
          <div className="password-wrapper">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  disabled={loading}
                  type={showPassword ? "text" : "password"}
                  className="custom-input"
                  placeholder="••••••••"
                />
              )}
            />
            <span
              className="toggle-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {errors.password && (
            <span className="error-text">{errors.password.message}</span>
          )}

          {/* REMEMBER ME */}
          <div className="remember-row">
            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <input {...field} type="checkbox" className="checkbox" />
              )}
            />
            <label className="remember-label">Remember Me</label>
          </div>

          {/* BUTTON */}
          <button type="submit" className="custom-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-50"></span>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
          {loginerror && <div className="login-error-box">{loginerror}</div>}
        </Form>
      </div>
    </div>
  );
}
