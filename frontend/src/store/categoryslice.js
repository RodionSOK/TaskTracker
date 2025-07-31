import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await api.get('/categories/');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data || "Ошибка загрузки категорий");
        }
    }
);

export const createCategory = createAsyncThunk(
    'categories/createCategory',
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await api.post('/categories/', categoryData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data || "Ошибка создания категории");
        }
    }
);

const initialState = {
    categories: [],
    isLoading: false,
    error: null,
};

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clearCategoryError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload.categories || [];
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(createCategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories.push(action.payload.category);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});


export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;