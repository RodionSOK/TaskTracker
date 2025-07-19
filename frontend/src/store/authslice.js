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
        }
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

export const { logout, clearError, setAuthentificated } = authSlice.actions;
export default authSlice.reducer; 