import { Navigate } from "react-router-dom";
import { clearAuth, hasValidAuthSession } from "../services/auth";

function ProtectedRoute({ children }) {
    if (!hasValidAuthSession()) {
        clearAuth();
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
