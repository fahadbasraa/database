// Submit Attendance
function submitAttendance() {
    const date = document.getElementById("date").value;
    const className = document.getElementById("class").value;
    const studentName = document.getElementById("studentName").value;
    const attendanceStatus = document.getElementById("attendanceStatus").value;

    if (date && className && studentName && attendanceStatus) {
        alert(`Attendance Recorded:\nDate: ${date}\nClass: ${className}\nStudent: ${studentName}\nStatus: ${attendanceStatus}`);
        document.getElementById("attendanceForm").reset(); // Clear the form
    } else {
        alert("Please fill out all fields.");
    }
}