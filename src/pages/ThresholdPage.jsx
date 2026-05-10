import { useState, useEffect } from "react"
import api from "../services/api"

const ThresholdPage = () => {
    const [thresholds, setThresholds] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // Form state
    const [formData, setFormData] = useState({
        parameterName: "",
        minValue: "",
        maxValue: ""
    })
    const [editingId, setEditingId] = useState(null)
    const [formLoading, setFormLoading] = useState(false)

    useEffect(() => {
        fetchThresholds()
    }, [])

    const fetchThresholds = async () => {
        try {
            const res = await api.get("/thresholds")
            setThresholds(res.data)
        } catch (err) {
            setError("Failed to fetch thresholds")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const resetForm = () => {
        setFormData({ parameterName: "", minValue: "", maxValue: "" })
        setEditingId(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        setFormLoading(true)

        try {
            const payload = {
                parameterName: formData.parameterName,
                minValue: Number(formData.minValue),
                maxValue: Number(formData.maxValue)
            }

            if (editingId) {
                await api.put(`/thresholds/${editingId}`, payload)
                setSuccess("Threshold updated successfully")
            } else {
                await api.post("/thresholds", payload)
                setSuccess("Threshold created successfully")
            }
            resetForm()
            fetchThresholds()
        } catch (err) {
            setError(err.response?.data?.message || "Operation failed")
        } finally {
            setFormLoading(false)
        }
    }

    const handleEdit = (threshold) => {
        setFormData({
            parameterName: threshold.parameterName,
            minValue: threshold.minValue,
            maxValue: threshold.maxValue
        })
        setEditingId(threshold._id)
        setError("")
        setSuccess("")
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this threshold?")) return

        try {
            await api.delete(`/thresholds/${id}`)
            setSuccess("Threshold deleted successfully")
            fetchThresholds()
        } catch (err) {
            setError("Failed to delete threshold")
        }
    }

    if (loading) return <div className="loading">Loading thresholds...</div>

    return (
        <div className="page-container">
            <h1>Threshold Management</h1>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Create/Edit Form */}
            <div className="card">
                <h2>{editingId ? "Edit Threshold" : "Create New Threshold"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="parameterName">Parameter Name</label>
                        <input
                            id="parameterName"
                            type="text"
                            name="parameterName"
                            value={formData.parameterName}
                            onChange={handleChange}
                            placeholder="e.g., Temperature, Pressure, Humidity"
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="minValue">Minimum Value</label>
                            <input
                                id="minValue"
                                type="number"
                                name="minValue"
                                value={formData.minValue}
                                onChange={handleChange}
                                placeholder="Min value"
                                required
                                step="any"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="maxValue">Maximum Value</label>
                            <input
                                id="maxValue"
                                type="number"
                                name="maxValue"
                                value={formData.maxValue}
                                onChange={handleChange}
                                placeholder="Max value"
                                required
                                step="any"
                            />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={formLoading}>
                            {formLoading ? "Saving..." : editingId ? "Update Threshold" : "Create Threshold"}
                        </button>
                        {editingId && (
                            <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Thresholds Table */}
            <div className="section">
                <h2>All Thresholds</h2>
                {thresholds.length === 0 ? (
                    <p className="empty-text">No thresholds defined yet. Create one above.</p>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Parameter Name</th>
                                <th>Min Value</th>
                                <th>Max Value</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {thresholds.map(t => (
                                <tr key={t._id}>
                                    <td>{t.parameterName}</td>
                                    <td>{t.minValue}</td>
                                    <td>{t.maxValue}</td>
                                    <td>
                                        <span className={`badge ${t.isActive ? "badge-success" : "badge-secondary"}`}>
                                            {t.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>{new Date(t.createdAt).toLocaleString()}</td>
                                    <td>
                                        <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(t)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t._id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default ThresholdPage
