function viewGrades() {
    document.getElementById('grades-section').classList.remove('hidden');
    document.getElementById('attendance-section').classList.add('hidden');
    document.getElementById('review-section').classList.add('hidden');
}

function viewAttendance() {
    document.getElementById('grades-section').classList.add('hidden');
    document.getElementById('attendance-section').classList.remove('hidden');
    document.getElementById('review-section').classList.add('hidden');
}

function giveReview() {
    document.getElementById('grades-section').classList.add('hidden');
    document.getElementById('attendance-section').classList.add('hidden');
    document.getElementById('review-section').classList.remove('hidden');
}