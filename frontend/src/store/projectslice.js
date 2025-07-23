import { createSlice, createAsyncThunk, isRejected } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async (projectData, { rejectWithValue }) => {
        try {
            const response = await api.get('/projects/');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Ошибка загрузки проектов');
        }
    }
);

export const createProject = createAsyncThunk(
    'projects/createProject',
    async (projectData, { rejectWithValue }) => {
        try { 
            const response = await api.post('/projects/', projectData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Ошибка создания проекта');
        }
    }
);

const initialState = {
    projects: [],
    isLoading: false,
    error: null,
}

const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        clearProjectsError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchProjects.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(fetchProjects.fulfilled, (state, action) => {
            state.isLoading = false;
            state.projects = action.payload;
        })
        .addCase(fetchProjects.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || action.error.message;
        })
        .addCase(createProject.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(createProject.fulfilled,(state, action) => {
            state.isLoading = false;
            state.projects.push(action.payload);
        })
        .addCase(createProject.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || action.error.message;
        });
    }
});

export const { clearProjectsError } = projectSlice.actions;
export default projectSlice.reducer;