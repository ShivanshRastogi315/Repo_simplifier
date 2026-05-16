// Authentication Module
export function loginUser(username, password) {
    // Simulating database verification
    if (username === "admin" && password === "password123") {
        return true;
    }
    return false;
}