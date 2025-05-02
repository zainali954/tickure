import express from 'express'
const app = express()
import cookieParser from 'cookie-parser'
import cors from 'cors'
import apiResponse from './utils/apiResponse.js'

import authRoutes from './routes/auth.routes.js'
import categoryRoutes from './routes/category.routes.js'
import labelRoutes from './routes/labels.routes.js'
import taskRoutes from './routes/task.routes.js'
import adminUserRoutes from './routes/user.routes.js'
import statsRoutes from './routes/stats.routes.js'
import { userRouter } from './routes/user.routes.js'

// CORS Configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL, 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  // Handles preflight requests
app.use(express.json());
app.use(cookieParser())

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/labels', labelRoutes)
app.use('/api/v1/tasks', taskRoutes)
app.use('/api/v1/user', userRouter)
app.use("/api/v1/admin/users", adminUserRoutes)
app.use("/api/v1/admin/stats", statsRoutes)
app.post('*', (req, res)=>{
    res.send("url does not exist")
})


// Global error handling midllerware
app.use((err, req, res, _)=>{
    console.error("Error, ", err)
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error"
    apiResponse.error(res, message, {}, statusCode)
})
export default app;