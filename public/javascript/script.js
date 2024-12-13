const button = document.getElementById('btn-forget');
button.addEventListener('click', () => {
    window.open('newpassword.html', '_blank'); // URL and target
});

function showMainPage(role) {
    if (role === 'admin') {
        window.location.href = '/admin/login';  
    } else if (role === 'faculty') {
        window.location.href = '/faculty/login';  
    } else if (role === 'student') {
        window.location.href = '/student/login';
    } else if (role === 'parent') {
        window.location.href = '/parent/login';
    }
}
