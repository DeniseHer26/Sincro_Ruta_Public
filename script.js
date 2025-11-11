document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    if (username === 'admin' && password === '1234') {
        localStorage.setItem('username', username);
        window.location.href = 'dashboard.html';
    } else {
        errorMessage.textContent = 'Usuario o contraseña incorrectos.';
    }
});