require('dns').setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();
const express = require('express');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 4000;

const path = require('path')

require('./conn');
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: [
        "http://localhost:5173",
        "http://localhost:5179",
        process.env.FRONTEND_URL
    ].filter(Boolean)
}))

const UserRoutes = require('./Routes/user');
const ResumeRoutes = require('./Routes/resume');

app.use('/api/user',UserRoutes)
app.use('/api/resume',ResumeRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Express Error:", err.message);
    res.status(err.status || 400).json({ error: err.message || "Something went wrong" });
});

app.listen(PORT,()=>{
    console.log("backend is running on port",PORT)
})