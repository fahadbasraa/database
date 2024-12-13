// Toggle sections
function toggleSection(sectionId) {
    const sections = document.querySelectorAll("section.hidden");
    sections.forEach((section) => (section.style.display = "none"));

    const selectedSection = document.getElementById(sectionId);
    selectedSection.style.display = "block";
}

// View Marks
function viewMarks() {
    toggleSection("marks-section");
    const marksContent = document.getElementById("marks-content");

    // Example: Dynamic content (Replace with actual data from a backend or API)
    marksContent.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Subject</th>
                    <th>Marks Obtained</th>
                    <th>Total Marks</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Mathematics</td>
                    <td>85</td>
                    <td>100</td>
                </tr>
                <tr>
                    <td>English</td>
                    <td>78</td>
                    <td>100</td>
                </tr>
                <tr>
                    <td>Science</td>
                    <td>90</td>
                    <td>100</td>
                </tr>
            </tbody>
        </table>`;
}

// View Attendance
function viewAttendance() {
    toggleSection("attendance-section");
    const attendanceContent = document.getElementById("attendance-content");

    // Example: Dynamic content (Replace with actual data from a backend or API)
    attendanceContent.innerHTML = `
        <p>Total Attendance: <strong>180</strong> days</p>
        <p>Days Present: <strong>170</strong> days</p>
        <p>Attendance Percentage: <strong>94.4%</strong></p>`;
}

// View Annual Result
function viewAnnualResult() {
    toggleSection("result-section");
    const resultContent = document.getElementById("result-content");

    // Example: Dynamic content (Replace with actual data from a backend or API)
    resultContent.innerHTML = `
        <p>Overall Grade: <strong>A</strong></p>
        <p>Remarks: <strong>Excellent performance! Keep up the good work.</strong></p>`;
}