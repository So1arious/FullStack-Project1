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
    const addedClass = RegClasses.filter((t) => t.completed).length; //Change completedTasks to addedClass
    const pendingClass = totalClass - addedClass; //Chnage pendingTasks to pendingClass
    // const totalMinutes = tasks.reduce((sum, task) => sum + task.minutes, 0);

    return {
        totalClass,
        addedClass,
        pendingClass,

    };
}

// Check whether the server is up
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

    tasks.push(newTask);
    response.status(201).json(newTask);
});

// Toggle complete status
app.patch("/api/tasks/:id/toggle", (request, response) => {
    const taskId = Number(request.params.id);
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
        return response.status(404).json({ message: "Task not found." });
    }

    task.completed = !task.completed;
    response.json(task);
});

// Delete a study task
app.delete("/api/tasks/:id", (request, response) => {
    const taskId = Number(request.params.id);
    const initialLength = tasks.length;

    tasks = tasks.filter((t) => t.id !== taskId);

    if (tasks.length === initialLength) {
        return response.status(404).json({ message: "Task not found." });
    }

    response.json({ message: "Task deleted successfully.", id: taskId });
});

// Reset log
app.post("/api/tasks/clear", (request, response) => {
    tasks = [];
    response.json({ message: "All tasks cleared." });
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
    console.log(`lesson 4 dashboard is running at http://localhost:${PORT}`);
});
