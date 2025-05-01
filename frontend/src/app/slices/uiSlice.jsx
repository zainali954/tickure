import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    categoryForm: false,
    labelForm: false,
    taskForm: false,
    isMenuOpen: false,
    guide:false
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        openForm: (state, action) => {
            state[action.payload] = true;
        },
        closeForm: (state, action) => {
            state[action.payload] = false;
        },
        toggleForm: (state, action) => {
            state[action.payload] = !state[action.payload];
        },
        closeAllForms: (state) => {
            Object.keys(state).forEach((key) => {
                state[key] = false;
            });
        },
        toggleTaskForm: (state) => {
            state.taskForm = !state.taskForm;
        },
        toggleCategoryForm: (state) => {
            state.categoryForm = !state.categoryForm;
        },
        openMenu: (state)=>{state.isMenuOpen = true},
        closeMenu: (state)=>{state.isMenuOpen = false},
        toggleMenu: (state)=>{state.isMenuOpen = !state.isMenuOpen},
        toggleGuide: (state) =>{state.guide = !state.guide},
        
    },
});

export const { openForm, closeForm, toggleForm, closeAllForms, toggleTaskForm, toggleCategoryForm, openMenu, closeMenu, toggleMenu, toggleGuide } = uiSlice.actions;
export default uiSlice.reducer;
