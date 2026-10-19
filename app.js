const express = require("express");
const path = require("path");
const app = express();
//PORT number for the server
const PORT = 3004;
// Allows Express to read JSON data
app.use(express.json());
// Starting study tacks
app.use(express.static(path.join(__dirname, "public")));

let studyTasks = [
    {
        id: 1,
        subject: "Mathematics",
        topic: "Matrix Algebra",
        duration: 60,
        priority: "High",
        completed: false
    },
    {
        id: 2,
        subject: "JavaScript",
        topic: "Fetch API",
        duration: 45,
        priority: "Medium",
        completed: true
    }
];

let nextTaskId=3;

// This function calculates statistics about the study tasks
function buildStatistics() {
    const totalTasks =studyTasks.length;
    const completedTask =studyTasks.filter(
        task => task.completed
    ).length;
    const pendingTasks = totalTasks - completedTask;
    ;
    return {
        totalTasks,
        completedTask,
        pendingTasks,
    };}
// Check whether the server is running
app.get("/api/status", function (request, response) {
    response.json({
        status: "online",
        server: "Express",
        port: PORT,
        timestamp: new Date().toISOString() //International Standard organization for data and time formatting
    });
});

// Get study statistics
app.get("/api/statistics", function (request, response) {
    response.json(buildStatistics())
});
// Get all study tasks
app.get("/api/tasks", function (request, response) {
    response.json(studyTasks);
})
// Add a new study task
app.post("/api/tasks", function (request, response) {
    const {
        subject,
        topic,
        duration,
        priority
    } = request.body;
// Make sure all fields have been entered
    if (
        ! subject ||
        ! topic ||
        ! duration ||
        ! priority
    ) {
        return response.status(400).json({
            message: "Every field is required."
        });
    }
// Convert duration to a number
    const numericDuration = Number(duration);
// Check that duration is valid
    if (
        Number.isNaN(numericDuration) ||
        numericDuration <= 0
    ) {
        return response.status(400).json({
            message: "Duration must be a positive number."
        });}
// Create the newTask = {
    const newTask = {
        id: nextTaskId++,
        subject: subject.trim(),
        topic: topic.trim(),
        duration: numericDuration,
        priority: priority,
        completed: false };
// Add the task to the array
    studyTasks.push(newTask);
    response.status(201).json({
        message: "Task created successfully.",
        task: newTask,
        statistics: buildStatistics()});
});
// Change a task from pending to completed
// or from completed back to pending
app.patch("/api/tasks/:id", function (request, response){
    const taskId = Number(request.params.id);
    const task = studyTasks.find(
        item => item.id === taskId);
    if(!task) {
        return response.status(404).json({
            message: "Study task not found."
        });}
    task.completed = !task.completed;
    response.json({
        message: "Task status updated.",
        task: task,
        statistics: buildStatistics()
    });
});
// Delete one task
app.delete("/api/tasks/:id", function (request, response) {
    const taskId = Number(request.params.id);
    const taskExists = studyTasks.some(
        task => task.id === taskId
    );
    if (!taskExists) {
        return response.status(404).json({
            message: "Study task not found."
        });
    }

    //studyTasks = studyTasks.filter(
    //    task => task.id !== taskId
    //);
    response.json({
        message: "Task deleted.",
        statistics: buildStatistics()
    });
});
// Delete all tasks
app.delete("/api/tasks", function (request, response) {
    studyTasks = [];
    response.json({
        message: "All tasks deleted.",
        statistics: buildStatistics()
    });
});
// Handles unexpected server errors
app.use(function (error, request, response, next) {
    console.error(error);
    response.status(500).json({
        message: "An unexpected server error occurred."});
});
// Start the server
app.listen(PORT, function () {
    console.log(
        `Class Register is running at http://localhost:${PORT}`
    );
});
