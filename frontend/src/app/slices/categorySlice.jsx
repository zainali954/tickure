import { createSlice } from "@reduxjs/toolkit";
import createThunk from "../../utils/createThunk";
import apiClient from "../../services/apiClient";
import handleAsyncCases from "../../utils/handleAsync";

const initialState = {
    categories: [],
    name: '',
    color: '',
    mode: 'create', // or 'edit'
    id: null,        // <-- used only in edit
    isLoading:false,
}

export const fetchCategories = createThunk("data/fetchCategories", () => apiClient.get("/categories"), true);
export const createCategory = createThunk("data/createCategory", (data) => apiClient.post("/categories", data));
export const updateCategory = createThunk("data/updateCategory", ({ id, name }) => apiClient.put(`/categories/${id}`, { name }));
export const deleteCategory = createThunk("data/deleteCategory", (id) => apiClient.delete(`/categories/${id}`));

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        setCategoryName: (state, action) => { state.name = action.payload },
        setColor: (state, action) => { state.color = action.payload },
        setCategoryMode: (state, action) => { state.mode = action.payload },
        setCategoryId: (state, action) => { state.id = action.payload },
        clearCategoryForm: (state) => {
            state.name = ''
            state.color = ''
            state.mode = 'create'
            state.id = null
        },
    }, extraReducers: (builder) => {
        handleAsyncCases(builder, fetchCategories, (state, action) => {
            state.categories = action.payload;
        })

        handleAsyncCases(builder, createCategory, (state, action) => {
            state.categories = [...(state.categories || []), action.payload];
        })

        handleAsyncCases(builder, updateCategory, (state, action) => {
           const index = state.categories.findIndex(cat => cat._id === action.payload._id);
           if(index !== -1){
            state.categories[index]= action.payload
           }
        })

        handleAsyncCases(builder, deleteCategory, (state, action) => {
            state.categories = state.categories.filter(cat => cat._id !== action.meta.arg);
        
         })
    }
})

export const { setCategoryName, setColor, clearCategoryForm, setCategoryMode, setCategoryId } = categorySlice.actions
export default categorySlice.reducer
