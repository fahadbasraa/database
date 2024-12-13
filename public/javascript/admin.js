// Simulated data
const students = [
    { id: 1, name: "Ali Raza" },
    { id: 2, name: "Fatima Zahra" },
    { id: 3, name: "Ahmed Khan" },
];
const teachers = [
    { id: 1, name: "Mr. Aslam" },
    { id: 2, name: "Ms. Sana" },
];

// Load total numbers
document.getElementById("total-students").textContent = students.length;
document.getElementById("total-teachers").textContent = teachers.length;

// Search student
function searchStudent() {
    const query = document.getElementById("search-student").value.toLowerCase();
    const result = students.find(student => 
        student.name.toLowerCase().includes(query) || student.id.toString() === query
    );
    document.getElementById("student-result").textContent = result
        ? `Student Found: ${result.name} (ID: ${result.id})`
        : "Student not found.";
}

// Search teacher
function searchTeacher() {
    const query = document.getElementById("search-teacher").value.toLowerCase();
    const result = teachers.find(teacher => 
        teacher.name.toLowerCase().includes(query) || teacher.id.toString() === query
    );
    document.getElementById("teacher-result").textContent = result
        ? `Teacher Found: ${result.name} (ID: ${result.id})`
        : "Teacher not found.";
}