import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"
import AlertBadge from "../components/AlertBadge"

const AdminDashboard = () => {
    const { user } = useAuth()
    const [thresholds, setThresholds] = useState([])
    const [alerts, setAlerts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [thresholdRes, alertRes] = await Promise.all([
                api.get("/thresholds"),
                api.get("/alerts")
            ])
            setThresholds(thresholdRes.data)
            setAlerts(alertRes.data)
        } catch (err) {
            console.log("Error fetching dashboard data:", err)
        } finally {
            setLoading(false)
        }
    }

    // Count alerts by status
    const highAlerts = alerts.filter(a => a.status === "HIGH_ALERT").length
    const lowAlerts = alerts.filter(a => a.status === "LOW_ALERT").length
    const normalAlerts = alerts.filter(a => a.status === "NORMAL").length

    if (loading) return <div className="loading">Loading dashboard...</div>

    return (
        <div className="dashboard">
            <h1>Admin Dashboard</h1>
            <p className="welcome-text">Welcome, {user?.firstname || user?.email}</p>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Thresholds</h3>
                    <p className="stat-number">{thresholds.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Alerts</h3>
                    <p className="stat-number">{alerts.length}</p>
                </div>
                <div className="stat-card stat-danger">
                    <h3>High Alerts</h3>
                    <p className="stat-number">{highAlerts}</p>
                </div>
                <div className="stat-card stat-warning">
                    <h3>Low Alerts</h3>
                    <p className="stat-number">{lowAlerts}</p>
                </div>
                <div className="stat-card stat-success">
                    <h3>Normal</h3>
                    <p className="stat-number">{normalAlerts}</p>
                </div>
            </div>

            {/* Quick Links */}
            <div className="quick-links">
                <Link to="/thresholds" className="btn btn-primary">Manage Thresholds</Link>
                <Link to="/alerts" className="btn btn-secondary">View All Alerts</Link>
            </div>

            {/* Recent Alerts */}
            <div className="section">
                <h2>Recent Alerts</h2>
                {alerts.length === 0 ? (
                    <p className="empty-text">No alerts generated yet.</p>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Parameter</th>
                                <th>Value</th>
                                <th>Range</th>
                                <th>Status</th>
                                <th>Message</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alerts.slice(0, 5).map(alert => (
                                <tr key={alert._id}>
                                    <td>{alert.parameterName}</td>
                                    <td>{alert.submittedValue}</td>
                                    <td>{alert.thresholdMin} - {alert.thresholdMax}</td>
                                    <td><AlertBadge status={alert.status} /></td>
                                    <td>{alert.message}</td>
                                    <td>{new Date(alert.generatedAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard
