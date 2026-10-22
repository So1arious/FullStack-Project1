const express = require("express");
const path = require("path");
const app = express();
const PORT = 3004;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let RegClasses= [
    {
        id: 1,
        semester: "Fall 2026",
        subject: "Mathematics",
        topic: "Algebra",
        date: "Tuesday 11:00-12:50pm & Thursday 11:00-12:50pm",
        completed: true,
    },
    {
        id: 2,
        semester: "Fall 2026",
        subject: "Writing",
        topic: "Creative Writing",
        dates: "Monday 11:00-12:50pm & Wednesday 11:00-12:50pm",
        completed: false,
    }
];
let nextClassesId =3

function buildStatistics() {
    const totalClass = RegClasses.length; //totalTasks to totalClass
    const addedClass = RegClasses.filter((item) => item.completed).length; //Change completedTasks to addedClass
    const pendingClass = totalClass - addedClass; //Change pendingTasks to pendingClass
    // const totalMinutes = tasks.reduce((sum, task) => sum + task.minutes, 0);

    return {
        totalClass,
        addedClass,
        pendingClass,

    };
}

// Check server
app.get("/api/status", (request, response) => {
    response.json({
        status: "online",
        server: "Express Registration API",
        port: PORT,
        timestamp: new Date().toISOString()
    });
});

// Get register statistics
app.get("/api/statistics", (request, response) => {
    response.json(buildStatistics());
});

// Get all register classes
app.get("/api/register", (request, response) => {
    response.json(RegClasses);
});

// Add a new register class
app.post("/api/register", (request, response) => {
    const {
        semester,
        subject,
        topic,
        dates
    } = request.body;

    if (!semester ||
        !subject ||
        !topic ||
        !dates
    ) {
        return response.status(400).json({
            message: "invalid register semester, subject, topic or, dates."
        });
    }
// Create new task
    const newTask = {
        id: nextClassesId++,
        semester: semester.trim(),
        subject: subject.trim(),
        topic: topic.trim(),
        dates: dates,
        completed: false,
    };

    RegClasses.push(newTask);
    response.status(201).json({
        message: "Class Register Successful",
        registers: newTask,
        statistics: buildStatistics()
    });
});

// Toggle complete status
app.patch("/api/register/:id/toggle", (request, response) => {
    const classId = Number(request.params.id);
    const targetClass = RegClasses.find((item) => item.id === classId);

    if (!targetClass) {
        return response.status(404).json({ message: "Class not found." });
    }

    targetClass.completed = !targetClass.completed;
    response.json(register);
});

// Delete a register class
app.delete("/api/register/:id", (request, response) => {
    const classId = Number(request.params.id);
    const initialLength = RegClasses.length;

    RegClasses = RegClasses.filter((item) => item.id !== classId);

    if (RegClasses.length === initialLength) {
        return response.status(404).json({ message: "Class not found." });
    }

    response.json({ message: "Task deleted successfully.", id: taskId });
});

// Reset log
app.post("/api/register/clear", (request, response) => {
    RegClasses = [];
    response.json({ message: "All cleared." });
});

// 404 handler for unknown API routes
app.use("/api/*", (request, response) => {
    response.status(404).json({ message: "API endpoint not found." });
});

// Global error handling middleware
app.use((error, request, response, next) => {
    console.error("Unhandled error:", error);
    response.status(500).json({ message: "Internal server error." });
});

app.listen(PORT, () => {
    console.log(`registration dashboard is running at http://localhost:${PORT}`);
});
