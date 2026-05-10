import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"
import AlertBadge from "../components/AlertBadge"

const OperatorDashboard = () => {
    const { user } = useAuth()
    const [values, setValues] = useState([])
    const [alerts, setAlerts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [valuesRes, alertsRes] = await Promise.all([
                api.get("/values/my"),
                api.get("/alerts/my")
            ])
            setValues(valuesRes.data)
            setAlerts(alertsRes.data)
        } catch (err) {
            console.log("Error fetching dashboard data:", err)
        } finally {
            setLoading(false)
        }
    }

    const highAlerts = alerts.filter(a => a.status === "HIGH_ALERT").length
    const lowAlerts = alerts.filter(a => a.status === "LOW_ALERT").length

    if (loading) return <div className="loading">Loading dashboard...</div>

    return (
        <div className="dashboard">
            <h1>Operator Dashboard</h1>
            <p className="welcome-text">Welcome, {user?.firstname || user?.email}</p>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Values Submitted</h3>
                    <p className="stat-number">{values.length}</p>
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
            </div>

            {/* Quick Links */}
            <div className="quick-links">
                <Link to="/submit-value" className="btn btn-primary">Submit New Value</Link>
                <Link to="/my-alerts" className="btn btn-secondary">View My Alerts</Link>
            </div>

            {/* Recent Alerts */}
            <div className="section">
                <h2>My Recent Alerts</h2>
                {alerts.length === 0 ? (
                    <p className="empty-text">No alerts yet. Submit a value to check thresholds.</p>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Parameter</th>
                                <th>Value</th>
                                <th>Range</th>
                                <th>Status</th>
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

export default OperatorDashboard
