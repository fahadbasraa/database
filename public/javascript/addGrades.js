function submitGrades() {
    const studentName = document.getElementById('studentName').value;
    const studentID = document.getElementById('studentID').value;
    const subject = document.getElementById('subject').value;
    const grade = document.getElementById('grade').value;

    if (!studentName || !studentID || !subject || !grade) {
        alert('Please fill in all fields before submitting!');
        return;
    }

    // You can replace this with actual backend logic
    alert(`Grade submitted successfully!\n\nStudent: ${studentName}\nID: ${studentID}\nSubject: ${subject}\nGrade: ${grade}`);
    
    // Clear form fields after submission
    document.getElementById('gradesForm').reset();
}