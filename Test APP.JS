const express = require("express");
const path = require("path");
const app = express();
const PORT = 3004;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let studyTasks = [
    {
        id: 1,
        subject: "Mathematics",
        topic: "Matrix Algebra",
        studyDate: "2026-07-12",
        duration: 60,
        priority: "High",
        completed: false
    },
    {
        id: 2,
        subject: "JavaScript",
        topic: "Fetch API",
        studyDate: "2026-07-13",
        duration: 45,
        priority: "Medium",
        completed: true
    }
];

let nextTaskId = 3;

function buildStatistics() {
    const totalTasks = studyTasks.length;
    const completedTasks = studyTasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const totalMinutes = studyTasks.reduce((sum, task) => sum + Number(task.duration), 0);

    return {
        totalTasks,
        completedTasks,
        pendingTasks,
        totalMinutes
    };
}

app.get("/api/status", function (request, response) {
    response.json({
        status: "online",
        server: "Express",
        port: PORT,
        timestamp: new Date().toISOString()
    });
});

app.get("/api/statistics", function (request, response) {
    response.json(buildStatistics());
});

app.get("/api/tasks", function (request, response) {
    response.json(studyTasks);
});

app.post("/api/tasks", function (request, response) {
    const { subject, topic, studyDate, duration, priority } = request.body;

    if (!subject || !topic || !studyDate || !duration || !priority) {
        return response.status(400).json({ message: "Every field is required." });
    }

    const numericDuration = Number(duration);
    if (Number.isNaN(numericDuration) || numericDuration <= 0) {
        return response.status(400).json({ message: "Duration must be a positive number." });
    }

    const newTask = {
        id: nextTaskId++,
        subject: subject.trim(),
        topic: topic.trim(),
        studyDate: studyDate,
        duration: numericDuration,
        priority: priority,
        completed: false
    };

    studyTasks.push(newTask);

    response.status(201).json({
        message: "Task created successfully.",
        task: newTask,
        statistics: buildStatistics()
    });
});

app.patch("/api/task/:id", function (request, response) {
    const taskId = Number(request.params.id);
    const task = studyTasks.find(item => item.id === taskId);

    if (!task) {
        return response.status(404).json({ message: "Study task not found." });
    }

    task.completed = !task.completed;

    response.json({
        message: "Task status updated.",
        task: task,
        statistics: buildStatistics()
    });
});

app.delete("/api/task/:id", function (request, response) {
    const taskId = Number(request.params.id);
    const taskExists = studyTasks.some(task => task.id === taskId);

    if (!taskExists) {
        return response.status(404).json({ message: "Study task not found." });
    }

    studyTasks = studyTasks.filter(task => task.id !== taskId);

    response.json({
        message: "Task deleted.",
        statistics: buildStatistics()
    });
});

app.delete("/api/tasks", function (request, response) {
    studyTasks = [];
    response.json({
        message: "All tasks deleted.",
        statistics: buildStatistics()
    });
});

app.use(function (error, request, response, next) {
    console.error(error);
    response.status(500).json({ message: "An unexpected server error occurred." });
});

app.listen(PORT, function () {
    console.log(`Server is running at http://localhost:${PORT}`);
});
