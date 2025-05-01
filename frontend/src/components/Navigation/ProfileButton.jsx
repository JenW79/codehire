import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import { useNavigate, NavLink } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import './ProfileButton.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(prev => !prev);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = async (e) => {
    e.preventDefault();
    await dispatch(sessionActions.logout());
    closeMenu();
    navigate('/');
  };

  const ulClassName = `profile-dropdown ${showMenu ? '' : 'hidden'}`;

  return (
    <div className="profile-container">
      <button onClick={toggleMenu} className="profile-icon">
        <FiMenu size={24} className="menu-icon" />
        <FaUserCircle size={24} className="profile-icon" />
      </button>
      {showMenu && (
        <ul className={ulClassName} ref={ulRef}>
          {user ? (
            <>
              <li className="dropdown-welcome">Hello, {user.username}</li>
              <li><NavLink to="/applications" onClick={closeMenu}>View Applications</NavLink></li>
              <li><button className="logout-button" onClick={logout}>Logout</button></li>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;

