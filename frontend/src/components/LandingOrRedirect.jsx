import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import LandingPage from "./LandingPage/LandingPage";

export default function LandingOrRedirect() {
    const user = useSelector(state => state.session.user);
  
    return user ? <Navigate to="/applications" /> : <LandingPage />;
  }