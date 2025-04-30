import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="login-form-container">
      <h2>Sign in</h2>

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
          placeholder="Username or Email"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
        />

        {errors.credential && (
          <p className="error-message">{errors.credential}</p>
        )}

        <div className="login-buttons-wrapper">
          <button
            type="submit"
            className={`login-button ${
              credential.length < 4 || password.length < 6
                ? "disabled-login"
                : ""
            }`}
            disabled={credential.length < 4 || password.length < 6}
          >
            Login
          </button>

          <button
            type="button"
            className="demo-button"
            onClick={loginAsDemoUser}
          >
            Demo
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
