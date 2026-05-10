// Auth reducer - manages authentication state
export const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    error: null
}

export const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return { ...state, loading: true, error: null }

        case "LOGIN_SUCCESS":
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                loading: false,
                error: null
            }

        case "LOGIN_FAILURE":
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false,
                error: action.payload
            }

        case "LOGOUT":
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false,
                error: null
            }

        case "CLEAR_ERROR":
            return { ...state, error: null }

        default:
            return state
    }
}
