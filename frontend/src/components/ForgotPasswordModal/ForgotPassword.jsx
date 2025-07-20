import { useState } from "react";
import "./ForgotPasswordModal.css";

export default function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/users/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setStatus("✅ Check your email for a reset link.");
    } else {
      setStatus("❌ Error sending reset link.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#333",
          padding: "2rem",
          borderRadius: "1rem",
          width: "100%",
          maxWidth: "400px",
          color: "#fff",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>Forgot Password</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "1rem",
              borderRadius: "0.5rem",
              border: "1px solid #888",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#e46615",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Send Reset Link
          </button>
        </form>
        {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
        <button
          onClick={onClose}
          style={{
            marginTop: "1rem",
            background: "transparent",
            border: "none",
            color: "#aaa",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}
