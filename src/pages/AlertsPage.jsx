import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"
import AlertBadge from "../components/AlertBadge"

const AlertsPage = () => {
    const { user } = useAuth()
    const [alerts, setAlerts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => { fetchAlerts() }, [])

    const fetchAlerts = async () => {
        try {
            const endpoint = user?.role === "ADMIN" ? "/alerts" : "/alerts/my"
            const res = await api.get(endpoint)
            setAlerts(res.data)
        } catch (err) {
            setError("Failed to fetch alerts")
        } finally { setLoading(false) }
    }

    if (loading) return <div className="loading">Loading alerts...</div>

    return (
        <div className="page-container">
            <h1>{user?.role === "ADMIN" ? "All Alerts" : "My Alerts"}</h1>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="stats-grid">
                <div className="stat-card">{alerts.length} Total</div>
                <div className="stat-card stat-danger">{alerts.filter(a => a.status === "HIGH_ALERT").length} High</div>
                <div className="stat-card stat-warning">{alerts.filter(a => a.status === "LOW_ALERT").length} Low</div>
                <div className="stat-card stat-success">{alerts.filter(a => a.status === "NORMAL").length} Normal</div>
            </div>
            {alerts.length === 0 ? (
                <p className="empty-text">No alerts found.</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Parameter</th>
                            <th>Submitted Value</th>
                            <th>Min</th>
                            <th>Max</th>
                            <th>Status</th>
                            <th>Message</th>
                            <th>Generated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alerts.map(alert => (
                            <tr key={alert._id}>
                                <td>{alert.parameterName}</td>
                                <td>{alert.submittedValue}</td>
                                <td>{alert.thresholdMin}</td>
                                <td>{alert.thresholdMax}</td>
                                <td><AlertBadge status={alert.status} /></td>
                                <td>{alert.message}</td>
                                <td>{new Date(alert.generatedAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default AlertsPage
