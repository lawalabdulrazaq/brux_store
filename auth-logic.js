// Helper function to validate email structure
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // STOPS THE PAGE FROM WIPING DATA

        const userData = {
            username: document.getElementById('reg-username').value,
            email: document.getElementById('reg-email').value,
            password: document.getElementById('reg-password').value
        };
        
        // Validation Rules & Instructive Responses
        if (username.length < 3) {
            alert("Registration Hint: Please enter your full name (minimum 3 characters).");
            return;
        }

        if (!isValidEmail(email)) {
            alert("Registration Hint: Please enter a valid email address (e.g., name@example.com).");
            return;
        }

        if (password.length < 6) {
            alert("Registration Hint: For security, your password must be at least 6 characters long.");
            return;
        }

        console.log("Sending registration data...", userData);

        try {
            const response = await fetch('http://127.0.0.1:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });


            const data = await response.json();

            if (response.ok) {
                alert("Account created successfully! Redirecting to login...");
                window.location.href = 'login.html';
            } else {
                alert("Registration Failed: " + (data.error || "Unknown Error"));
            }
        } catch (err) {
            console.error("Network Error Details:", err);
            alert("Frontend cannot connect to the backend server. Check the console.");
        }
    });
}

// Login Handler
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // STOPS THE LOGIN FORM FROM REFRESHING

        const credentials = {
            email: document.getElementById('login-email').value,
            password: document.getElementById('login-password').value
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('brux_token', data.token);
                localStorage.setItem('brux_role', data.role); 
                localStorage.setItem('brux_user', data.username);

                alert(`Welcome, ${data.username}!`);

                if (data.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                alert("Login Failed: " + data.error);
            }
        } catch (err) {
            console.error("Network Error Details:", err);
            alert("Backend server connection failed.");
        }
    });
}
