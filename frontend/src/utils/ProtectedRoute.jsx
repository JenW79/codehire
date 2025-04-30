import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.session.user);
  return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
// This component checks if a user is logged in before allowing access to certain routes.