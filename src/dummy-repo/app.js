import { loginUser } from './auth.js';

// Main Application Entry Point
function startApp() {
    console.log("Starting the application...");
    const userStatus = loginUser("admin", "password123");
    if (userStatus) {
        console.log("Welcome to the dashboard!");
    } else {
        console.log("Access denied.");
    }
}

startApp();