
const loginForm = document.getElementById("adminLoginForm");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");


const API_URL = "https://medicare-backend-zfwh.onrender.com/api/auth/login";


loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    loginMessage.textContent = "";
    loginButton.disabled = true;
    loginButton.textContent = "Signing in...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Login failed. Please try again."
            );
        }

        // Store token for the current browser tab
        sessionStorage.setItem("medicareAdminToken", data.token);

        loginMessage.style.color = "#0f8b83";
        loginMessage.textContent = "Login successful!";

        // Clear password field
        document.getElementById("password").value = "";

        // Dashboard page will be created in the next step
        setTimeout(() => {
            window.location.href = "./dashboard.html";
        }, 800);

    } catch (error) {
        loginMessage.style.color = "#c24141";
        loginMessage.textContent = error.message;

    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Sign In";
    }
});
