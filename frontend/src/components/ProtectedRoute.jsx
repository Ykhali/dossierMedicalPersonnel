import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Changed to named import

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role; // Adjust based on your JWT structure
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/home" />;
    }
  } catch (error) {
    console.error("Token decoding error:", error);
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
