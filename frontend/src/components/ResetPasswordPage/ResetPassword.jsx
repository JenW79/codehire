import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ResetPasswordPage.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`/api/users/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus(data.message);
      setTimeout(() => navigate("/login"), 2500);
    } else {
      setStatus(data.message || "Something went wrong.");
    }
  };

  return (
    <div className="auth-page">
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <label>New Password</label>
        <input
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
        />
        <button type="submit">Reset Password</button>
        {status && <p className="auth-status">{status}</p>}
      </form>
    </div>
  );
}
