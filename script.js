const courses = [
    { code: "CS 101", title: "Introduction to Computer Science", credits: 3 },
    { code: "CS 298", title: "Intro to Full Stack", credits: 3},
    { code : "CS 300", title: "Intensive Programming", credits: 3},
    { code : "MATH 101",title: "Calculus I", credits: 4 },
    { code: "MATH 201", title: "Calculus II", credits: 4 },
    { code: "MATH 301", title: "Calculus III", credits: 4},
    { code: "ENG 110", title: "Writing and Rhetoric", credits: 3 },
    { code: "BIO 150", title: "Principles of Biology", credits: 4 },
    { code: "HIST 220", title: "World History", credits: 3 },
    { code: "PSY 101", title: "Introduction to Psychology", credits: 3 },
    { code: "ART 105", title: "Foundations of Design", credits: 2 },
    { code: "ECON 202", title: "Principles of Economics", credits: 3 },
    { code: "MUS 101", title: "Music Theory I", credits: 3},
    { code: "MUS 201", title: "Music Theory II", credits: 3}
];

const maxCourses = 5;
const selectedCourses = [];
const form = document.querySelector("#course-form");
const courseSelect = document.querySelector("#course-select");
const addButton = document.querySelector("#add-course");
const selectedList = document.querySelector("#selected-courses");
const counter = document.querySelector("#course-counter");
const progressFill = document.querySelector("#progress-fill");
const summary = document.querySelector("#schedule-summary");
const statusMessage = document.querySelector("#status-message");
const emptyState = document.querySelector("#empty-state");
const totalCredits = document.querySelector("#total-credits");

function render() {
    const selectedCodes = new Set(selectedCourses.map((course) => course.code));
    const availableCourses = courses.filter((course) => !selectedCodes.has(course.code));
    const count = selectedCourses.length;
    const atCapacity = count >= maxCourses;

    courseSelect.replaceChildren(new Option("Choose a course", ""));
    availableCourses.forEach((course) => {
        courseSelect.add(new Option(`${course.code} — ${course.title} (${course.credits} credits)`, course.code));
    });

    courseSelect.disabled = atCapacity || availableCourses.length === 0;
    addButton.disabled = courseSelect.disabled;
    counter.textContent = `${count} / ${maxCourses}`;
    progressFill.style.width = `${(count / maxCourses) * 100}%`;
    progressFill.parentElement.setAttribute("aria-label", `${count} of ${maxCourses} courses selected`);
    summary.textContent = atCapacity
        ? "Your schedule has reached the five-course limit."
        : `${maxCourses - count} ${maxCourses - count === 1 ? "course" : "courses"} remaining`;
    emptyState.hidden = count > 0;
    selectedList.replaceChildren();

    selectedCourses.forEach((course) => {
        const item = document.createElement("li");
        item.className = "selected-course";

        const details = document.createElement("div");
        details.className = "selected-course-details";
        const code = document.createElement("span");
        code.className = "course-code";
        code.textContent = course.code;
        const title = document.createElement("span");
        title.className = "selected-course-title";
        title.textContent = course.title;
        details.append(code, title);

        const credits = document.createElement("span");
        credits.className = "selected-course-credits";
        credits.textContent = `${course.credits} credits`;

        const removeButton = document.createElement("button");
        removeButton.className = "remove-button";
        removeButton.type = "button";
        removeButton.textContent = "Remove";
        removeButton.setAttribute("aria-label", `Remove ${course.code}`);
        removeButton.addEventListener("click", () => removeCourse(course.code));

        item.append(details, credits, removeButton);
        selectedList.append(item);
    });

    const credits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);
    totalCredits.textContent = `${credits} ${credits === 1 ? "credit" : "credits"}`;
}

function removeCourse(code) {
    const index = selectedCourses.findIndex((course) => course.code === code);
    if (index !== -1) {
        selectedCourses.splice(index, 1);
        statusMessage.textContent = `${code} removed from your schedule.`;
        render();
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const course = courses.find((item) => item.code === courseSelect.value);
    if (!course || selectedCourses.some((item) => item.code === course.code)) {
        statusMessage.textContent = "Choose an available course before adding it.";
        return;
    }

    if (selectedCourses.length >= maxCourses) {
        statusMessage.textContent = "You can register for no more than five courses.";
        render();
        return;
    }

    selectedCourses.push(course);
    statusMessage.textContent = `${course.code} added to your schedule.`;
    render();
});

render();
