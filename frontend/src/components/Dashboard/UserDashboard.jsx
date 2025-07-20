// src/components/Dashboard/UserDashboard.jsx
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaClipboardList,
  FaFileAlt,
  FaBriefcase,
  FaCog,
} from "react-icons/fa";
import "./UserDashboard.css";

const dashboardItems = [
  { to: "/applications", label: "My Applications", icon: <FaClipboardList /> },
  { to: "/resumes", label: "Resume Builder", icon: <FaFileAlt /> },
  { to: "/saved", label: "Saved Jobs", icon: <FaBriefcase /> },
  { to: "/", label: "Account Settings (coming soon)", icon: <FaCog /> },
];

export default function UserDashboard() {
  const user = useSelector((state) => state.session.user);

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user?.firstName || user?.username}!</h1>
      <div className="dashboard-card-grid">
        {dashboardItems.map((item) => (
          <Link to={item.to} key={item.to} className="dashboard-card">
            <div className="dashboard-card-icon">{item.icon}</div>
            <div className="dashboard-card-label">{item.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
