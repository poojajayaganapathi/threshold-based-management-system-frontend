import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

// Navbar component - shows navigation based on user role
const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    if (!isAuthenticated) return null

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to={user?.role === "ADMIN" ? "/admin" : "/operator"}>
                    Alert Management System
                </Link>
            </div>
            <div className="navbar-links">
                {user?.role === "ADMIN" && (
                    <>
                        <Link to="/admin">Dashboard</Link>
                        <Link to="/thresholds">Thresholds</Link>
                        <Link to="/alerts">Alerts</Link>
                    </>
                )}
                {user?.role === "OPERATOR" && (
                    <>
                        <Link to="/operator">Dashboard</Link>
                        <Link to="/submit-value">Submit Value</Link>
                        <Link to="/my-alerts">My Alerts</Link>
                    </>
                )}
                <span className="navbar-user">
                    {user?.firstname || user?.email} ({user?.role})
                </span>
                <button className="btn btn-logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default Navbar
