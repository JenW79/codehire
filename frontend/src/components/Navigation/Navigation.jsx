import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const user = useSelector((state) => state.session.user);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (user) navigate("/applications");
    else navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src="/logo.png"
          alt="Codehire Logo"
          className="logo"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        />
      </div>

      <div className="navbar-right">
        {isLoaded && <ProfileButton user={user} />}
      </div>
    </nav>
  );
}

export default Navigation;
