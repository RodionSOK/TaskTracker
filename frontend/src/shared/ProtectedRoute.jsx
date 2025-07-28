import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const token = useSelector(state => state.auth.accessToken) || localStorage.getItem("accessToken");
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;