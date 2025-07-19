import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiHelpCircle,
  FiShield,
  FiCheckCircle,
  FiKey,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { FaCookieBite } from "react-icons/fa";
import CookieInfoModal from "../CookieInfoModal/CookieInfoModal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCookieInfo, setShowCookieInfo] = useState(false);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(() => {
        closeModal();
        navigate("/applications");
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const loginAsDemoUser = () => {
    dispatch(
      sessionActions.login({ credential: "Demo-lition", password: "password" })
    ).then(() => {
      closeModal();
      navigate("/applications");
    });
  };

  return (
    <>
      <div className="login-form-container">
        <div className="login-header">
          <h2>Sign in to Codehire</h2>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-wrapper">
            <FiMail className="input-icon" />
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
              placeholder="Username or Email"
            />
          </div>

          <div className="input-wrapper">
            <FiKey className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {errors.credential && (
            <p className="error-message">{errors.credential}</p>
          )}

          <div className="login-actions">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#" className="forgot-link">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className={`login-button ${
              credential.length < 4 || password.length < 6
                ? "disabled-login"
                : ""
            }`}
            disabled={credential.length < 4 || password.length < 6}
          >
            Sign In
          </button>

          <button
            type="button"
            className="demo-button"
            onClick={loginAsDemoUser}
          >
            Demo User
          </button>

          <p className="support-link">
            <FiHelpCircle size={16} /> Need help?{" "}
            <a href="#">Contact Support</a>
          </p>
        </form>

        <div className="login-footer">
          <div>
            <FiShield size={18} />
            <span>SSL Secured</span>
          </div>
          <div>
            <FiCheckCircle size={18} />
            <span>256-bit Encryption</span>
          </div>
          <div>
            <FaCookieBite size={18} />
            <button
              onClick={() => setShowCookieInfo(true)}
              className="cookie-link"
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </div>

      {showCookieInfo && (
        <CookieInfoModal onClose={() => setShowCookieInfo(false)} />
      )}
    </>
  );
}
export default LoginFormModal;
