import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from '../api/axios'
import { decodeJWT, isTokenValid } from "../api/axios"

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await api.post('/token/', { email, password });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Login failed');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/register/', userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Register failed');
        }
    }
)

export const requestPasswordReset = createAsyncThunk(
    'auth/requestPasswordReset',
    async (email, { rejectWithValue }) => {
        try {
            const response = await api.post('/forgot_password/', { email });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'PasswordReset failed');
        }
    }
);

export const completePasswordReset = createAsyncThunk(
    'auth/complete',
    async ({ uid, token, newPassword }, { rejectWithValue }) => {
        try {
            const response = await api.post('/reset-password/', {
                uid: uid,
                token: token,
                newPassword: newPassword
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Completed failed');
        }
    }
);

export const refreshToken = createAsyncThunk(
    'auth/refresh',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const response = await api.post('/token/refresh/', {
                refresh: auth.refreshToken
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Token refresh failed')
        }
    }
);

export const checkAuth = createAsyncThunk(
    'auth/check',
    async (_, { getState, dispatch }) => {
        const { auth } = getState();

        if (auth.accessToken && isTokenValid(auth.accessToken)) {
            return {
                accessToken: auth.accessToken,
                refreshToken: auth.refreshToken,
                user: auth.user
            };
        }

        if (auth.refreshToken && isTokenValid(auth.refreshToken)) {
            try {
                const result = await dispatch(refreshToken()).unwrap();
                return result;
            } catch (error) {
                throw new Error('Session expired');
            }
        }

        throw new Error('No valid tokens');
    }
);

const initialState = {
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    emailSentTo: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            return initialState;
        },
        clearError: (state) => {
            state.error = null;
        },
        setAuthentificated: (state, action) => {
            state.isAuthenticated = action.payload;
        },
        resetRequestState: (state) => {
            state.error = null;
        },
        resetCompleteState: (state) => {
            state.error = null;
        },
        resetPasswordResetState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const { access, refresh } = action.payload;
                const user = decodeJWT(access);

                state.accessToken = access;
                state.refreshToken = refresh;
                state.user = user;
                state.isLoading = false;
                state.error = null;
                state.isAuthenticated = true;

                localStorage.setItem('accessToken', access);
                localStorage.setItem('refreshToken', refresh);
                localStorage.setItem('user', JSON.stringify(user));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
                state.isAuthenticated = false;
            })
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                const { access, refresh } = action.payload;
                const user = decodeJWT(access);

                state.accessToken = access;
                state.refreshToken = refresh;
                state.user = user;
                state.isLoading = false;
                state.error = null;
                state.isAuthenticated = true;

                localStorage.setItem('accessToken', access);
                localStorage.setItem('refreshToken', refresh);
                localStorage.setItem('user', JSON.stringify(user));
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
                state.isAuthenticated = false;
            })
            .addCase(requestPasswordReset.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(requestPasswordReset.fulfilled, (state, action) => {
                state.isLoading = false;
                state.emailSentTo = action.meta.arg;
            })
            .addCase(requestPasswordReset.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(completePasswordReset.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(completePasswordReset.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(completePasswordReset.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(refreshToken.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                const { access } = action.payload;
                const user = decodeJWT(access);

                state.accessToken = access;
                state.user = user;
                state.isLoading = false;
                state.error = null;
                state.isAuthenticated = true;

                localStorage.setItem('accessToken', access);
                localStorage.setItem('user', JSON.stringify(user));
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                state.isAuthenticated = false;
            }) 
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.user = action.payload.user;
                state.isLoading = false;
                state.isAuthenticated = true;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
                state.isAuthenticated = false;
            });
    }
});

export const { 
    logout, 
    clearError, 
    setAuthentificated, 
    resetRequestState,
    resetCompleteState,
    resetPasswordResetState,
} = authSlice.actions;

export default authSlice.reducer; 