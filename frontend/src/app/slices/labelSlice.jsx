import { createSlice } from "@reduxjs/toolkit";
import createThunk from "../../utils/createThunk";
import apiClient from "../../services/apiClient";
import handleAsyncCases from "../../utils/handleAsync";

const initialState = {
    labels: [],
    name: '',
    mode: 'create', // or 'edit'
    id: null,        // <-- used only in edit
    isLoading:false,
}

export const fetchLabels = createThunk("data/fetchLabels",  (id) => apiClient.get(`/labels/${id}`), true);
export const createLabel = createThunk("data/createLabel",  (data) => apiClient.post("/labels", data));

export const updateLabel = createThunk("data/updateLabel", ({ labelId, label_name }) => apiClient.put(`/labels/${labelId}`, {label_name}));
export const deleteLabel = createThunk("data/deleteLabel", (labelId) => apiClient.delete(`/labels/${labelId}`));

const labelSlice = createSlice({
    name: "label",
    initialState,
    reducers: {
        setLabelName: (state, action) => { state.name = action.payload },
        setLabelMode: (state, action) => { state.mode = action.payload },
        setLabelId: (state, action) => { state.id = action.payload },
        clearLabelForm: (state) => {
            state.name = ''
            state.mode = 'create'
            state.id = null
        },
        pushTaskToLabels: (state, action) => {
          const { taskId, labels } = action.payload;
        
          labels.forEach((label) => {
            const labelId = label._id;
            const existingLabel = state.labels.find((l) => l._id === labelId);
            
            if (existingLabel && !existingLabel.tasks.includes(taskId)) {
              existingLabel.tasks.push(taskId);
            }
          });
        },
        removeTaskFromLabels: (state, action) => {
          const { taskId } = action.payload;
        
          state.labels.forEach((label) => {
            label.tasks = label.tasks.filter((id) => id !== taskId);
          });
        }
        
        
    }, extraReducers: (builder) => {
        handleAsyncCases(builder, fetchLabels, (state, action)=>{
            state.labels = action.payload;
          })

          handleAsyncCases(builder, createLabel, (state, action)=>{
            state.labels = [...(state.labels || []), action.payload];
          })

        handleAsyncCases(builder, updateLabel, (state, action) => {
           const index = state.labels.findIndex(item => item._id === action.payload._id);
           if(index !== -1){
            state.labels[index]= action.payload
           }
        })

        handleAsyncCases(builder, deleteLabel, (state, action) => {
            state.labels = state.labels.filter(lbl => lbl._id !== action.meta.arg)
         })
    }
})

export const { setLabelName, setColor, clearLabelForm, setLabelMode, setLabelId, pushTaskToLabels, removeTaskFromLabels } = labelSlice.actions
export default labelSlice.reducer
