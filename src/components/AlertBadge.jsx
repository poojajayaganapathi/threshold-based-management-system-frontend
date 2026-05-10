// AlertBadge - color-coded status indicator for alerts (no icons, text only)
const AlertBadge = ({ status }) => {
    const getClassName = () => {
        switch (status) {
            case "HIGH_ALERT":
                return "badge badge-danger"
            case "LOW_ALERT":
                return "badge badge-warning"
            case "NORMAL":
                return "badge badge-success"
            default:
                return "badge"
        }
    }

    const getLabel = () => {
        switch (status) {
            case "HIGH_ALERT":
                return "HIGH"
            case "LOW_ALERT":
                return "LOW"
            case "NORMAL":
                return "NORMAL"
            default:
                return status
        }
    }

    return <span className={getClassName()}>{getLabel()}</span>
}

export default AlertBadge
