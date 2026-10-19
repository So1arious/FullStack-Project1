const classForm = document.getElementById("class-form");
const taskList = document.getElementById("task-List");
const message = document.getElementById("message");
const clearButton = document.getElementById("clear-button");
const refreshButton = document.getElementById("refresh-button");
const clearLogButton = document.getElementById("clear-log-button");
const apiLog = document.getElementById("api-log");

const totalTask = document.getElementById("Total-Register");
const completedTasks = document.getElementById("completed-Register");
const pendingTasks = document.getElementById("pending-tasks");

const serverStatus = document.getElementById("server-label");
const serverDetails = document.getElementById("server-details");
const statusDot = document.getElementById("status-dot");

classForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const newTask = {
        subject: document.getElementById("subject").value.trim(),
        topic: document.getElementById("topic").value.trim(),
        Date: document.getElementById("date").value.trim(),
        duration: Number(document.getElementById("duration").value.trim()),
        priority: document.getElementById("priority").value.trim(),
    };
    const result = await apiRequest(
        "/api/tasks",
        {method: "POST",
        headers: {
            "Content-Type": "application/json" },
        body: JSON.stringify(newTask)}
    );

    if (!result.ok) {
        showMessage(result.data.message || "Unable to create task.", "error");
        return;
    }
    classForm.reset();
    showMessage(result.data.message, "success");

    await refreshDashboard();
});
clearButton.addEventListener("click", async function () {
    const result = await apiRequest("/api/tasks", {
        method: "DELETE"
    });
    if (!result.ok) {
        showMessage(result.data.message || "Unable to delete task.", "error");
        return;
    }
    showMessage(result.data.message, "success");
    await refreshDashboard();
});

refreshButton.addEventListener("click", refreshDashboard);
clearLogButton.addEventListener("click", function () {
    apiLog.innerHTML = "";
});
async function apiRequest(url, options = {}) {
    const method = options.method || "GET";
    const startedAt = performance.now();
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        const duration = Math.round(performance.now() - startedAt);

        addLogEntry(
            method,
            url,
            response.status,
            duration,
            response.ok
        );
        return {
            ok: response.ok,
            status: response.status,
            data
        };
    } catch (error) {
        const duration = Math.round(performance.now() - startedAt);
        addLogEntry(
            method,
            url,
            "OFFLINE",
            duration,
            false);
        return {
            ok: false,
            status: 0,
            data: {
                message: "The Express backend is not reachable."
            }
        };
    }
}
async function checkServerStatus() {
    const result = await apiRequest("/api/status");
    if (!result.ok) {
        serverStatus.textContent = "Server Offline";
        serverDetails.textContent = "Start the Express server with npm start.";
        statusDot.className = "status-dot offline";
        return false;
    }

    if (serverStatus) serverStatus.textContent = "Express Server Online";
    if (serverDetails) {
        serverDetails.textContent =
            `${result.data.server} on port ${result.data.port} ` +
            new Date(result.data.timestamp).toLocaleTimeString();
    }
    if (statusDot) statusDot.className = "status-dot online";
    return true;
}

async function loadStatistics() {//NO of request and the responses that go  between the server and the host
    const result = await apiRequest("/api/statistics");//
    if (!result.ok) {
        return;
    }
    totalTask.textContent = result.data.totalTasks;
    completedTasks.textContent = result.data.completedTasks;
    pendingTasks.textContent = result.data.pendingTasks;
}
async function loadTasks() {
    const result = await apiRequest("/api/tasks");

    if (!result.ok) {
        taskList.innerHTML = `
        <div class = "empty-state">
            Backend unavailable. Start the server and refresh.
        </div>
        `;
        return;
    }

    displayTasks(result.data);
}

function displayTasks(tasks) {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                No tasks are currently stored on the server.
            </div>
        `;
        return;
    }
    tasks.forEach(function (task) {
        const article = document.createElement("article");
        article.className = task.completed
            ? "task-card completed"
            : "task-card";
        article.innerHTML = `
            <h4>${escapeHtml(task.subject)}</h4>
            <p><strong>Topic:</strong> ${escapeHtml(task.topic)}</p>
            <p><strong>Date:</strong> ${formatDate(task.Date)}</p>
            <p><strong>Duration:</strong> ${task.duration} minutes</p>
            <p><strong>Priority:</strong> ${escapeHtml(task.priority)}</p>
            <p><strong>Status:</strong> ${task.completed ? "Completed" : "Pending"}</p>
            
            <div class="task-actions">
                <button 
                    class="task-button complete-button" 
                    onclick="toggleTask(${task.id})"
                >
                    ${task.completed ? "Mark Pending" : "Mark Complete"}
                </button>
                
                <button 
                    class="task-button delete-button" 
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>
            </div>
        `;
        taskList.appendChild(article);
    });
}
async function toggleTask(taskId) {
    const result = await apiRequest(
        `/api/task/${taskId}`,
        {
            method: "PATCH"
            }
        );
    if (!result.ok) {
        showMessage(result.data.message || "Unable to update task.", "error");
        return;
    }
    showMessage(result.data.message, "success");
    await refreshDashboard();
}

async function deleteTask(taskId) {
    const result = await apiRequest(
        `/api/task/${taskId}`,
        {
            method: "DELETE"
            }
        );

        if (!result.ok) {
            showMessage(result.data.message || "Unable to delete task.", "error");
            return;
    }
    showMessage(result.data.message, "success");
    await refreshDashboard();
}

async function refreshDashboard() {
    const isOnline = await checkServerStatus();


    if (!isOnline) {
        return;
    }

    await Promise.all([
        loadStatistics(),
        loadTasks()
    ]);
}
function addLogEntry(method, url, status, duration, success) { //
    if (!apiLog) return;
    const entry = document.createElement("div");
    entry.className = "log-entry";

    const time = new Date().toLocaleTimeString();
    entry.innerHTML = `
        <span class="log-time">${time}</span>
        <strong>${method}</strong>
        <span>${url}</span>
        <span class="log-status ${success ? "success" : "error"}">
            ${status} * ${duration}ms
        </span>
    `;
    apiLog.prepend(entry);
}

function showMessage(text, type) {
    if (!message) return;
    message.textContent = text;
    message.className = `message ${type}`;

    setTimeout(function () {
        message.textContent = "";
        message.className = "message";
    }, 3000);
}

function formatDate(dateText) {
    if (!dateText) return "";
    const date = new Date(`${dateText}T00:00:00`);
    return date.toLocaleDateString();
}

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

refreshDashboard()
