import { useState, useEffect } from "react"
import api from "../services/api"
import AlertBadge from "../components/AlertBadge"

const SubmitValuePage = () => {
    const [parameterName, setParameterName] = useState("")
    const [value, setValue] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [result, setResult] = useState(null)
    const [myValues, setMyValues] = useState([])
    const [valuesLoading, setValuesLoading] = useState(true)

    useEffect(() => { fetchMyValues() }, [])

    const fetchMyValues = async () => {
        try {
            const res = await api.get("/values/my")
            setMyValues(res.data)
        } catch (err) { console.log(err) }
        finally { setValuesLoading(false) }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(""); setResult(null); setLoading(true)
        try {
            const res = await api.post("/values", { parameterName, value: Number(value) })
            setResult(res.data)
            setParameterName(""); setValue("")
            fetchMyValues()
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit value")
        } finally { setLoading(false) }
    }

    return (
        <div className="page-container">
            <h1>Submit Monitored Value</h1>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="card">
                <h2>Enter Value</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="param-name">Parameter Name</label>
                        <input id="param-name" type="text" value={parameterName} onChange={(e) => setParameterName(e.target.value)} placeholder="e.g., Temperature, Pressure" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="param-value">Value</label>
                        <input id="param-value" type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter numeric value" required step="any" />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Submitting..." : "Submit Value"}</button>
                </form>
            </div>
            {result && (
                <div className="card result-card">
                    <h2>Submission Result</h2>
                    <p><strong>Value:</strong> {result.monitoredValue?.value} | <strong>Parameter:</strong> {result.monitoredValue?.parameterName} | <strong>Alerts:</strong> {result.alertsGenerated}</p>
                    {result.alerts?.length > 0 && (
                        <div className="result-alerts">
                            {result.alerts.map((alert, i) => (
                                <div key={i} className="result-alert-item">
                                    <AlertBadge status={alert.status} />
                                    <span>{alert.message}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {result.alertsGenerated === 0 && <p className="empty-text">No thresholds for this parameter.</p>}
                </div>
            )}
            <div className="section">
                <h2>My Submitted Values</h2>
                {valuesLoading ? <p>Loading...</p> : myValues.length === 0 ? <p className="empty-text">No values submitted yet.</p> : (
                    <table className="data-table">
                        <thead><tr><th>Parameter</th><th>Value</th><th>Submitted At</th></tr></thead>
                        <tbody>{myValues.map(v => (<tr key={v._id}><td>{v.parameterName}</td><td>{v.value}</td><td>{new Date(v.submittedAt).toLocaleString()}</td></tr>))}</tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default SubmitValuePage
