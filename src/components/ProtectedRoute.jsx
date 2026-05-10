import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

// ProtectedRoute - checks authentication and role before rendering
const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, user } = useAuth()

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    // Role check - redirect to appropriate dashboard if wrong role
    if (roles && !roles.includes(user?.role)) {
        if (user?.role === "ADMIN") {
            return <Navigate to="/admin" />
        }
        return <Navigate to="/operator" />
    }

    return children
}

export default ProtectedRoute
