import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (taskData, { rejectWithValue }) => {
        try {
            const response = await api.get('/tasks/');
            return response.data;  
        } catch (error) {
            return rejectWithValue(error.response.data || "Ошибка загрузки задач");
        }
    }
);

export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (taskData, { rejectWithValue }) => {
        try {
            const response = await api.post('/tasks/', taskData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data || "Ошибка создания задачи");
        }
    }
);

const initialState = {
    tasks: [],
    isLoading: false,
    error: null,
};  

const taskSlice = createSlice({
    name: 'tasks',
    initialState,   
    reducers: {
        clearTaskError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tasks = action.payload.tasks || [];
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(createTask.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tasks.push(action.payload);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;