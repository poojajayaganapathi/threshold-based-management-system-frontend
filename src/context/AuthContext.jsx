import { createContext, useReducer, useContext } from "react"
import { authReducer, initialState } from "../reducers/authReducer"
import api from "../services/api"

// Create auth context
const AuthContext = createContext()

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState)

    // Login function
    const login = async (email, password) => {
        dispatch({ type: "LOGIN_START" })
        try {
            const res = await api.post("/auth/login", { email, password })
            if (res.data.token) {
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("user", JSON.stringify(res.data.user))
                dispatch({
                    type: "LOGIN_SUCCESS",
                    payload: { user: res.data.user, token: res.data.token }
                })
                return res.data
            } else {
                dispatch({ type: "LOGIN_FAILURE", payload: res.data.message })
                return res.data
            }
        } catch (err) {
            const message = err.response?.data?.message || "Login failed"
            dispatch({ type: "LOGIN_FAILURE", payload: message })
            throw new Error(message)
        }
    }

    // Register function
    const register = async (userData) => {
        try {
            const res = await api.post("/auth/register", userData)
            return res.data
        } catch (err) {
            const message = err.response?.data?.message || "Registration failed"
            throw new Error(message)
        }
    }

    // Logout function
    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        dispatch({ type: "LOGOUT" })
    }

    // Clear error
    const clearError = () => {
        dispatch({ type: "CLEAR_ERROR" })
    }

    return (
        <AuthContext.Provider value={{
            user: state.user,
            token: state.token,
            isAuthenticated: state.isAuthenticated,
            loading: state.loading,
            error: state.error,
            login,
            register,
            logout,
            clearError
        }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook for using auth context
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
