import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import AdminDashboard from "./pages/AdminDashboard"
import OperatorDashboard from "./pages/OperatorDashboard"
import ThresholdPage from "./pages/ThresholdPage"
import SubmitValuePage from "./pages/SubmitValuePage"
import AlertsPage from "./pages/AlertsPage"
import "./App.css"

// Home redirect based on role
const HomeRedirect = () => {
    const { isAuthenticated, user } = useAuth()
    if (!isAuthenticated) return <Navigate to="/login" />
    if (user?.role === "ADMIN") return <Navigate to="/admin" />
    return <Navigate to="/operator" />
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<HomeRedirect />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/admin" element={<ProtectedRoute roles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
                        <Route path="/operator" element={<ProtectedRoute roles={["OPERATOR"]}><OperatorDashboard /></ProtectedRoute>} />
                        <Route path="/thresholds" element={<ProtectedRoute roles={["ADMIN"]}><ThresholdPage /></ProtectedRoute>} />
                        <Route path="/submit-value" element={<ProtectedRoute roles={["OPERATOR"]}><SubmitValuePage /></ProtectedRoute>} />
                        <Route path="/alerts" element={<ProtectedRoute roles={["ADMIN"]}><AlertsPage /></ProtectedRoute>} />
                        <Route path="/my-alerts" element={<ProtectedRoute roles={["OPERATOR"]}><AlertsPage /></ProtectedRoute>} />
                    </Routes>
                </main>
            </Router>
        </AuthProvider>
    )
}

export default App
