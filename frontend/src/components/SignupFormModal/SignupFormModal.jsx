import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

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
        firstName,
        lastName,
        password,
      })
    )
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors);
        }
      });
  };

  const isFormValid =
    isValidEmail &&
    username.length >= 4 &&
    firstName &&
    lastName &&
    password.length >= 6 &&
    password === confirmPassword;

  return (
    <div className="signup-form-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        
      <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          placeholder="Email" 
          className={!isValidEmail && email.length > 0 ? "invalid-input" : ""}
        />
        {!isValidEmail && email.length > 0 && <p className="error-message">Please enter a valid email address</p>}
        {errors.email && <p className="error-message">{errors.email}</p>}

        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Username (min. 4 characters)" />
        {username.length < 4 && username.length > 0 && <p className="error-message">Username must be at least 4 characters</p>}
        {errors.username && <p className="error-message">{errors.username}</p>}

        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="First Name"/>
        {errors.firstName && <p className="error-message">{errors.firstName}</p>}

        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder= "Last Name" />
        {errors.lastName && <p className="error-message">{errors.lastName}</p>}

        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password (min. 6 characters)" />
        {password.length < 6 && password.length > 0 && <p className="error-message">Password must be at least 6 characters</p>}
        {errors.password && <p className="error-message">{errors.password}</p>}

        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Confirm Password" />
        {password !== confirmPassword && confirmPassword.length > 0 && <p className="error-message">Passwords do not match</p>}
        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

        <button type="submit" className="signup-button" disabled={!isFormValid}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
