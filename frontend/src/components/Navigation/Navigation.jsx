import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const user = useSelector((state) => state.session.user);

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
        <img src="/logo.png" alt="Logo" /> 
        </li>
      </ul>

      {isLoaded && <ProfileButton user={user} />}
    </nav>
  );
}

export default Navigation;
