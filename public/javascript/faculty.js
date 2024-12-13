// Function to View Student Grades
function viewGrades() {
    alert("View Student Grades functionality will be implemented later.");
}

// Function to Add Student Grades
function addGrades() {
    // Redirect to the Add Grades page
    window.location.href = "addGrades.html";
}

// Function to View Student Progress
function viewStudentProgress() {
    alert("View Student Progress functionality will be implemented later.");
}

// Function to View Class Schedules
function viewSchedules() {
    alert("View Class Schedules functionality will be implemented later.");
}

// Toggle Attendance Form
function toggleAttendanceForm() {
    const form = document.getElementById("attendance-form");
    if (form.style.display === "none" || form.style.display === "") {
        form.style.display = "block";
    } else {
        form.style.display = "none";
    }
}

// Submit Attendance
function submitAttendance() {
    const date = document.getElementById("date").value;
    const className = document.getElementById("class").value;
    const studentName = document.getElementById("studentName").value;
    const attendanceStatus = document.getElementById("attendanceStatus").value;

    if (date && className && studentName && attendanceStatus) {
        alert(`Attendance Recorded:\nDate: ${date}\nClass: ${className}\nStudent: ${studentName}\nStatus: ${attendanceStatus}`);
        document.getElementById("attendanceForm").reset(); // Clear the form
        toggleAttendanceForm(); // Hide the form
    } else {
        alert("Please fill out all fields.");
    }
}