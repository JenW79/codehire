import { useSelector } from "react-redux";
import LandingPage from "../components/LandingPage/LandingPage";
import UserDashboard from "../components/Dashboard/UserDashboard";

export default function LandingOrRedirect() {
  const user = useSelector(state => state.session.user);

  return user ? <UserDashboard /> : <LandingPage />;
}