import { useState } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import { useNavigate } from "react-router-dom";
import "../LandingPage/LandingPage.css";

function LandingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

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
        navigate("/applications"); // or your dashboard
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className="landing-page">
      <div className="left-side">
        <h1>Join now</h1>
        <p className="login-link">
          Already Registered? <span className="link-span">Login</span>
        </p>
        <div className="divider"></div>
        <p className="info-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean semper
          mauris in magna venenatis suscipit.
        </p>
      </div>

      <div className="right-side">
        <div className="signup-form-container">
          <h2>Sign up for free</h2>
          <form className="signup-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.firstName && (
              <p className="error-message">{errors.firstName}</p>
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p className="error-message">{errors.email}</p>}

            <input
              type="text"
              placeholder="Username (4-30 characters)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {errors.username && (
              <p className="error-message">{errors.username}</p>
            )}

            <input
              type="password"
              placeholder="Password (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
            )}

            <button
              type="submit"
              className="submit-button"
              disabled={
                !email.length ||
                !username.length ||
                !name.length ||
                password.length < 6 ||
                password !== confirmPassword
              }
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
