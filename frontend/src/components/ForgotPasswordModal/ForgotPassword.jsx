import { useState } from "react";
import { useModal } from "../../context/Modal";
import "./ForgotPasswordModal.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  // const { closeModal } = useModal();
  const closeModal = () => {}; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/users/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setStatus(data.message || data.error);
  };

  return (
    <div className="auth-modal-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <button type="submit">Send Reset Link</button>
        {status && <p className="auth-status">{status}</p>}
      </form>
      <button className="modal-close" onClick={closeModal}>Cancel</button>
    </div>
  );
}
