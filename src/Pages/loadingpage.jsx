import React from "react";
import { TbChecks } from "react-icons/tb";

function LoadingScreen() {
  return (
    <div style={styles.page}>
      <div style={styles.logoSpin}>
        <TbChecks size={28} />
      </div>
      <p style={styles.brandName}>Sprintly</p>
      <p style={styles.loadingSub}>
        Loading workspace
        <span style={styles.dots}>
          <span style={{ ...styles.dot, animationDelay: "0s" }} />
          <span style={{ ...styles.dot, animationDelay: "0.2s" }} />
          <span style={{ ...styles.dot, animationDelay: "0.4s" }} />
        </span>
      </p>

      <style>{`
        @keyframes pulseSpin {
          0% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.12) rotate(180deg); opacity: 0.75; }
          100% { transform: scale(1) rotate(360deg); opacity: 1; }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

export default LoadingScreen;

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    minHeight: "100vh",
    width: "100%",
    background: "#fff",
  },
  logoSpin: {
    width: 64,
    height: 64,
    borderRadius: 16,
    background: "#ECEAFD",   // light tint shade of #7367f0
    color: "#7367f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "pulseSpin 1.6s ease-in-out infinite",
  },
  brandName: {
    fontSize: 18,
    fontWeight: 500,
    color: "#1a1a1a",
    margin: 0,
  },
  loadingSub: {
    fontSize: 13,
    color: "#888",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  dots: {
    display: "inline-flex",
  },
  dot: {
    display: "inline-block",
    width: 5,
    height: 5,
    borderRadius: "50%",
    background: "#7367f0",   // dots now match theme color too
    margin: "0 2px",
    animation: "dotPulse 1.4s ease-in-out infinite",
  },
};