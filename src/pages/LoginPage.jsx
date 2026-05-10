import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { login, isAuthenticated, user } = useAuth()
    const navigate = useNavigate()

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated && user) {
            navigate(user.role === "ADMIN" ? "/admin" : "/operator")
        }
    }, [isAuthenticated, user, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const data = await login(email, password)
            if (data.token) {
                // Redirect based on role
                if (data.user.role === "ADMIN") {
                    navigate("/admin")
                } else {
                    navigate("/operator")
                }
            }
        } catch (err) {
            setError(err.message || "Login failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login</h2>
                <p className="auth-subtitle">Threshold-Based Alert Management System</p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="auth-link">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage
