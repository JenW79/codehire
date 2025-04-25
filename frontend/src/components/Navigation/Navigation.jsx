import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import logo from '../../../../images/logo.png';

function Navigation({ isLoaded }) {
  const user = useSelector(state => state.session.user);

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
        <NavLink to="/">
        <img src={logo} alt="App Logo" className="logo" />
        </NavLink>
        </li>
      </ul>

      {user && (
  <NavLink to="/spots/new" className="create-spot-link">
    Create a New Spot
  </NavLink>
   )}

     
      {isLoaded && <ProfileButton user={user} />}
    </nav>
  );
}

export default Navigation;