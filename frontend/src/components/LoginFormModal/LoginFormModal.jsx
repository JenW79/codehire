import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import "./LoginForm.css"; 

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const loginAsDemoUser = () => {
    dispatch(sessionActions.login({ credential: "Demo-lition", password: "password" }))
      .then(closeModal);
  };

  return (
    <div className="login-form-container">
      <h1>Log In</h1>
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

        {errors.credential && <p className="error-message">{errors.credential}</p>}

        <button 
  type="submit" 
  className={`login-button ${credential.length < 4 || password.length < 6 ? "disabled-login" : ""}`} 
  disabled={credential.length < 4 || password.length < 6}
>
  Log In
</button>

      </form>

     
      <p className="demo-user-text" onClick={loginAsDemoUser}>
       Log in as Demo User
      </p>
    </div>
  );
}

export default LoginFormModal;

