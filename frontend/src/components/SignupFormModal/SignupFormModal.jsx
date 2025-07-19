import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiUser,
  FiKey,
  FiEye,
  FiEyeOff,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";
import { FaCookieBite } from "react-icons/fa";
import CookieInfoModal from "../CookieInfoModal/CookieInfoModal";
import "./SignupForm.css";

function SignupFormModal({ embedded = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCookieInfo, setShowCookieInfo] = useState(false);
  const [errors, setErrors] = useState({});
  const { closeModal, setModalContent } = useModal();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setErrors({});
    return dispatch(
      sessionActions.signup({
        email,
        username,
        firstName: name,
        lastName: name,
        password,
      })
    )
      .then(() => {
        closeModal();
        navigate("/applications");
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) setErrors(data.errors);
      });
  };

  const isFormValid =
    isValidEmail &&
    name.length > 0 &&
    username.length >= 4 &&
    password.length >= 6 &&
    password === confirmPassword;

  const switchToLogin = async () => {
    const module = await import("../LoginFormModal/LoginFormModal");
    setModalContent(() => module.default);
  };

 return (
  <>
    <div className={`signup-form-container ${embedded ? "embedded" : ""}`}>
      <div className="login-header">
        <h2>Sign Up for Codehire</h2>
      </div>

      <form onSubmit={handleSubmit} className="signup-form">
        <div className="input-wrapper2">
          <FiMail className="input-icon" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className={!isValidEmail && email.length > 0 ? "invalid-input" : ""}
          />
        </div>
        {!isValidEmail && email.length > 0 && (
          <p className="error-message">Please enter a valid email address</p>
        )}
        {errors.email && <p className="error-message">{errors.email}</p>}

        <div className="input-wrapper2">
          <FiUser className="input-icon" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Username (4-30 characters)"
          />
        </div>
        {username.length < 4 && username.length > 0 && (
          <p className="error-message">
            Username must be at least 4 characters
          </p>
        )}
        {errors.username && <p className="error-message">{errors.username}</p>}

        <div className="input-wrapper2">
          <FiUser className="input-icon" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Name"
          />
        </div>
        {errors.firstName && (
          <p className="error-message">{errors.firstName}</p>
        )}

        <div className="input-wrapper2">
          <FiKey className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password (min. 6 characters)"
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
        {password.length < 6 && password.length > 0 && (
          <p className="error-message">
            Password must be at least 6 characters
          </p>
        )}
        {errors.password && <p className="error-message">{errors.password}</p>}

        <div className="input-wrapper2">
          <FiKey className="input-icon" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm Password"
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {password !== confirmPassword && confirmPassword.length > 0 && (
          <p className="error-message">Passwords do not match</p>
        )}
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword}</p>
        )}

        <button type="submit" className="signup-button" disabled={!isFormValid}>
          Sign Up
        </button>
      </form>

      <p className="switch-auth-link">
        Already have an account?{" "}
        <button onClick={switchToLogin}>Log in instead</button>
      </p>

      {/* Footer Security Info */}
      <div className="signup-footer">
        <div>
          <FiShield size={18} />
          <span> SSL Secured </span>
        </div>
        <div>
          <FiCheckCircle size={18} />
          <span> 256-bit Encryption </span>
        </div>
        <div>
        <FaCookieBite size={18} />
        <button onClick={() => setShowCookieInfo(true)} className="cookie-link">
          Cookie Settings
        </button>
      </div>
      </div>
    </div>
     {showCookieInfo && <CookieInfoModal onClose={() => setShowCookieInfo(false)} />}
     </>
  );
}

export default SignupFormModal; 



