import { createSlice } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";
import createThunk from "../../utils/createThunk";
import handleAsyncCases from "../../utils/handleAsync";

//  thunks for fetching and modifying data

export const fetchTasks = createThunk("data/fetchTasks", (url) => apiClient.get(`/tasks?${url}`));

export const fetchStats = createThunk("data/fetchStats", () => apiClient.get("/tasks/stats"), true);

export const fetchTasksDueToday = createThunk("data/fetchTasksDueToday", () => apiClient.get("/tasks/tasks-due-today"), true);

export const createTask = createThunk("data/createTask", (data) => apiClient.post("/tasks", data));

export const updateTask = createThunk("data/updateTask", ({ taskId, data }) => apiClient.put(`/tasks/${taskId}`, data));
export const deleteTask = createThunk("data/deleteTask", (id) => apiClient.delete(`/tasks/${id}`));
export const pinTask = createThunk("data/pinTask", ({id, isPinned}) => apiClient.put(`/tasks/${id}`, {isPinned}));
export const toggleSubTask = createThunk("tasks/toggleSubTask", ({ taskId, subTaskId }) => apiClient.put(`/tasks/${taskId}/subTasks/${subTaskId}`))
export const fetchCurrentMonthTasks = createThunk("tasks/currentMonthTasks", (url) => apiClient.get(`/tasks${url}`))


// Initial state
const initialState = {
  tasks: [],
  todayTasks: [],
  calendarTasks: [],
  stats: {},
  pagination: {},
  isLoading: false,
  title: "",
  description: "",
  selectedLabels: [],
  priority: "",
  startDate: "",
  dueDate: "",
  subTasks: [],
  mode: 'create', // or 'edit'
  id: null,        // <-- used only in edit
  isTaskModalOpen: false,
  selectedTask: null
};

// Slice definition
const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTitle: (state, action) => { state.title = action.payload },
    setDescription: (state, action) => { state.description = action.payload },
    setSelectedLabels: (state, action) => {
      // Toggle label inclusion in selectedLabels array
      const label = action.payload;
      state.selectedLabels = state.selectedLabels.includes(label)
        ? state.selectedLabels.filter((l) => l !== label)
        : [...state.selectedLabels, label];
    },
    setPriority: (state, action) => { state.priority = action.payload },
    setStartDate: (state, action) => { state.startDate = action.payload },
    setDueDate: (state, action) => { state.dueDate = action.payload },
    setSubTasks: (state, action) => { state.subTasks = action.payload },
    setTaskMode: (state, action) => { state.mode = action.payload },
    setTaskId: (state, action) => { state.id = action.payload },
    clearTaskForm: (state) => {
      state.title = '';            // Clear title
      state.description = '';      // Clear description
      state.selectedLabels = [];   // Clear selected labels
      state.priority = '';   // Reset priority to default
      state.startDate = '';        // Clear start date
      state.dueDate = '';          // Clear due date
      state.subTasks = [];
      state.mode = 'create';       // Reset to 'create' mode
      state.id = null;             // Reset task ID for editing
    },
    updateLabelInTasks: (state, action) => {
      const { _id, label_name } = action.payload;
      state.tasks = state.tasks.map(task => ({
        ...task,
        labels: task.labels.map(label =>
          label._id === _id ? { ...label, label_name } : label
        )
      }));
    },
    addSubTask: (state, action) => {
      state.subTasks.push({ title: "", isCompleted: false });
    },
    setSubTaskTitle: (state, action) => {
      const { title, index } = action.payload;
      state.subTasks[index].title = title
    },
    toggleSubTaskCompletion: (state, action) => {
      const { index } = action.payload;
      state.subTasks[index].isCompleted = !state.subTasks[index].isCompleted;
    },
    removeSubTask: (state, action) => {
      const { index } = action.payload;
      state.subTasks.splice(index, 1);
    },

    openTaskModal: (state, action) => {
      state.isTaskModalOpen = true;
      state.selectedTask = action.payload;
    },
    closeTaskModal: (state, action) => {
      state.isTaskModalOpen = false;
      // only clear selectedTask if explicitly told to do so (payload === true)
      if (action.payload !== false) {
        state.selectedTask = null;
      }
    }
    
  },
  extraReducers: (builder) => {

    handleAsyncCases(builder, fetchTasks, (state, action) => {
      state.tasks = action.payload.tasks;
      state.pagination = action.payload.pagination;
    })

    handleAsyncCases(builder, fetchTasksDueToday, (state, action) => {
      state.todayTasks = action.payload;
    })

    handleAsyncCases(builder, fetchStats, (state, action) => {
      state.stats = action.payload;
    })
    handleAsyncCases(builder, createTask, (state, action) => {
      const newTask = action.payload;
      const oldTasks = [...(state.tasks || [])];
      const oldCalendarTasks = [...(state.calendarTasks || [])]
      
      state.tasks = [...oldTasks, newTask ]
      state.calendarTasks =[...oldCalendarTasks, newTask]
    });
    
    handleAsyncCases(builder, updateTask, (state, action) => {
      const updatedTask = action.payload;
    
      state.tasks = state.tasks.map(task =>
        task._id === updatedTask._id ? updatedTask : task
      );
      state.calendarTasks = state.calendarTasks.map(task =>
        task._id === updatedTask._id ? updatedTask : task
      );
    
      state.selectedTask = updatedTask;
    });
    
    handleAsyncCases(builder, toggleSubTask, (state, action) => {
      const updatedTask = action.payload;
    
      state.tasks = state.tasks.map(task =>
        task._id === updatedTask._id ? updatedTask : task
      );
      state.calendarTasks = state.calendarTasks.map(task =>
        task._id === updatedTask._id ? updatedTask : task
      );
    
      state.selectedTask = updatedTask;
    });
    
    handleAsyncCases(builder, deleteTask, (state, action) => {
      const id = action.meta.arg;
      state.tasks = state.tasks.filter(task => task._id !== id);
      state.calendarTasks = state.calendarTasks.filter(task => task._id !== id);
    });
    
    handleAsyncCases(builder, pinTask, (state, action) => {
      const updatedTask = action.payload;
    
      state.tasks = state.tasks.map(task =>
        task._id === updatedTask._id ? updatedTask : task
      );
      state.calendarTasks = state.calendarTasks.map(task =>
        task._id === updatedTask._id ? updatedTask : task
      );
    
      state.selectedTask = updatedTask;
    });
    

    handleAsyncCases(builder, fetchCurrentMonthTasks, (state, action)=>{
      state.calendarTasks =action.payload
    })
    
  },
});

export const { setTitle, setDescription, setSelectedLabels, setPriority, setStartDate, setDueDate, setTaskMode, setTaskId, clearTaskForm, updateLabelInTasks, addSubTask, toggleSubTaskCompletion, removeSubTask, setSubTaskTitle, openTaskModal, closeTaskModal, setSubTasks } = taskSlice.actions
export default taskSlice.reducer;
