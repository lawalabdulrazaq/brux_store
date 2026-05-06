document.getElementById('register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userData = {
        username: document.getElementById('reg-username').value,
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-password').value
    };

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Registration successful! Redirecting to login...');
            window.location.href = 'login.html';
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        alert("Backend server is offline.")
    }
});