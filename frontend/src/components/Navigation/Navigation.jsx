import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const user = useSelector((state) => state.session.user);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/logo.png" alt="Logo" className="logo" />
      </div>

      <div className="navbar-right">
        {isLoaded && <ProfileButton user={user} />}
      </div>
    </nav>
  );
}

export default Navigation;

