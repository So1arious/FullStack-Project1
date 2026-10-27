const express = require("express");
const path = require("path");

const app = express();
const PORT = 3004;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let courses = [
    {
        code: "CS 101",
        title: "Introduction to Computer Science",
        credits: 3
    },
    {
        code: "CS 298",
        title: "Introduction to Full Stack",
        credits: 3
    },
    {
        code: "CS 300",
        title: "Intensive Programming",
        credits: 3
    },
    {
        code: "MATH 101",
        title: "Calculus I",
        credits: 4
    },
    {
        code: "MATH 201",
        title: "Calculus II",
        credits: 4
    },
    {
        code: "MATH 301",
        title: "Calculus III",
        credits: 4
    },
    {
        code: "ENG 110",
        title: "Writing and Rhetoric",
        credits: 3
    },
    {
        code: "BIO 150",
        title: "Principles of Biology",
        credits: 4
    },
    {
        code: "HIST 220",
        title: "World History",
        credits: 3
    },
    {
        code: "PSY 101",
        title: "Introduction to Psychology",
        credits: 3
    },
    {
        code: "ART 105",
        title: "Foundations of Design",
        credits: 2
    },
    {
        code: "ECON 202",
        title: "Principles of Economics",
        credits: 3
    },
    {
        code: "MUS 101",
        title: "Music Theory I",
        credits: 3
    },
    {
        code: "MUS 201",
        title: "Music Theory II",
        credits: 3
    }
];

let registeredCourses = [];

app.get("/api/courses", (req, res) => {
    res.json(courses);
});

app.get("/api/schedule", (req, res) => {
    res.json(registeredCourses);
});

//app.post("/api/schedule", (req, res) => {
//    const {
//        code,
//        title,
//        credits
//    } = req.body;
//});

app.delete("/api/schedule/:code", (req,res) => {
    const classId =req.params;
    registeredCourses = registeredCourses.filter((item) => item.id !== classId);

    res.json({message: "Class deleted successfully,",id: item});
});

// Reset log
app.post("/api/register/clear", (req, res) => {
    courses = [];
    res.json({ message: "All cleared." });
});

// 404 handler
app.use("/api/*", (req, res) => {
    res.status(404).json({ message: "API endpoint not found."});
})
// Global error
app.use((error, req, res, next) => {
    console.error("Unhandled error:", error);
    res.status(500).json({ message: "Internal server error."});
});
app.listen(PORT, () => {
    console.log(`registration dashboard is running at http://localhost:${PORT}`);
})
