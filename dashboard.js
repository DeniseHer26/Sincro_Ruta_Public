document.addEventListener('DOMContentLoaded', function() {
    const storedUsername = localStorage.getItem('username');

    if (storedUsername) {
        document.getElementById('user-name').textContent = storedUsername;
    } else {
        window.location.href = 'index.html';
    }
});