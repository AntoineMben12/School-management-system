import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import markRoutes from "./routes/markRoutes.js";
import reportCardRoutes from "./routes/reportCardRoutes.js";
import parentRoutes from "./routes/parentRoutes.js";
import parentStudentRoutes from "./routes/parentStudentRoutes.js";
import parentQuestionsRoutes from "./routes/parentQuestionsRoutes.js";
import parentAnswersRoutes from "./routes/parentAnswersRoutes.js";
import parentReportCardRoutes from "./routes/parentReportCardRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";

// Request logging middleware
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    });
    next();
};

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/teacher", teacherRoutes);
app.use("/student", studentRoutes);
app.use("/course", courseRoutes);
app.use("/mark", markRoutes);
app.use("/reportCard", reportCardRoutes);
app.use("/parent", parentRoutes);
app.use("/parentStudent", parentStudentRoutes);
app.use("/parentQuestions", parentQuestionsRoutes);
app.use("/parentAnswers", parentAnswersRoutes);
app.use("/parentReportCard", parentReportCardRoutes);
app.use("/subject", subjectRoutes);
app.use("/class", classRoutes);
app.use("/exam", examRoutes);
app.use("/question", questionRoutes);
app.use("/answer", answerRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`,
        timestamp: new Date().toISOString()
    });
});

// Global error handler middleware (MUST be last)
app.use((error, req, res, next) => {
    console.error('Error Details:', {
        message: error.message,
        status: error.status || 500,
        stack: error.stack,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Determine status code
    let statusCode = error.status || error.statusCode || 500;
    let message = error.message || 'Internal Server Error';
    
    // Handle specific error types
    if (error.code === 'ER_NO_DB_ERROR') {
        statusCode = 503;
        message = 'Database connection failed';
    } else if (error.code === 'ER_DUP_ENTRY') {
        statusCode = 409;
        message = 'Record already exists';
    } else if (error.message.includes('Missing required fields')) {
        statusCode = 400;
    } else if (error.message.includes('Invalid')) {
        statusCode = 400;
    }

    res.status(statusCode).json({
        error: {
            message,
            status: statusCode,
            timestamp: new Date().toISOString(),
            path: req.path
        }
    });
});

export default app;