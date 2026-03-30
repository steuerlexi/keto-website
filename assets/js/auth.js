// KetoGuide Authentication System
// Simple localStorage-based auth for static site

(function() {
    'use strict';

    const AUTH_KEY = 'ketoguide_auth';
    const USERS_KEY = 'ketoguide_users';
    const SUBSCRIPTION_KEY = 'ketoguide_subscription';

    // Default admin user for demo purposes
    const DEFAULT_USER = {
        email: 'admin@ketoguide.com',
        password: 'admin123',
        name: 'Admin User',
        isPremium: true,
        createdAt: new Date().toISOString()
    };

    // Initialize default user if no users exist
    function initAuth() {
        const users = getUsers();
        if (users.length === 0) {
            users.push(DEFAULT_USER);
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
    }

    // Get all users
    function getUsers() {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    }

    // Save users
    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    // Get current logged in user
    function getCurrentUser() {
        const auth = localStorage.getItem(AUTH_KEY);
        return auth ? JSON.parse(auth) : null;
    }

    // Check if user is logged in
    function isLoggedIn() {
        return getCurrentUser() !== null;
    }

    // Check if user has premium subscription
    function isPremium() {
        const user = getCurrentUser();
        return user && user.isPremium;
    }

    // Login function
    function login(email, password) {
        const users = getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return { success: false, message: 'Kein Konto mit dieser E-Mail gefunden.' };
        }

        if (user.password !== password) {
            return { success: false, message: 'Falsches Passwort.' };
        }

        // Store current user
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));

        return { success: true, message: 'Willkommen zurück!' };
    }

    // Register function
    function register(name, email, password) {
        const users = getUsers();

        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, message: 'Diese E-Mail ist bereits registriert.' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Passwort muss mindestens 6 Zeichen lang sein.' };
        }

        const newUser = {
            name,
            email,
            password,
            isPremium: false,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        // Auto-login after registration
        const { password: _, ...userWithoutPassword } = newUser;
        localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));

        return { success: true, message: 'Konto erstellt!' };
    }

    // Logout function
    function logout() {
        localStorage.removeItem(AUTH_KEY);
        window.location.href = 'login.html';
    }

    // Update user profile
    function updateProfile(updates) {
        const user = getCurrentUser();
        if (!user) return { success: false, message: 'Nicht eingeloggt.' };

        const users = getUsers();
        const index = users.findIndex(u => u.email === user.email);

        if (index === -1) return { success: false, message: 'User nicht gefunden.' };

        users[index] = { ...users[index], ...updates };
        saveUsers(users);

        // Update current session
        const { password: _, ...userWithoutPassword } = users[index];
        localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));

        return { success: true, message: 'Profil aktualisiert.' };
    }

    // Change password
    function changePassword(currentPassword, newPassword) {
        const user = getCurrentUser();
        if (!user) return { success: false, message: 'Nicht eingeloggt.' };

        const users = getUsers();
        const index = users.findIndex(u => u.email === user.email);

        if (index === -1) return { success: false, message: 'User nicht gefunden.' };

        if (users[index].password !== currentPassword) {
            return { success: false, message: 'Aktuelles Passwort falsch.' };
        }

        if (newPassword.length < 6) {
            return { success: false, message: 'Neues Passwort muss mindestens 6 Zeichen lang sein.' };
        }

        users[index].password = newPassword;
        saveUsers(users);

        return { success: true, message: 'Passwort geändert.' };
    }

    // Subscribe to premium
    function subscribe() {
        const user = getCurrentUser();
        if (!user) return { success: false, message: 'Nicht eingeloggt.' };

        const users = getUsers();
        const index = users.findIndex(u => u.email === user.email);

        if (index === -1) return { success: false, message: 'User nicht gefunden.' };

        users[index].isPremium = true;
        users[index].subscribedAt = new Date().toISOString();
        saveUsers(users);

        // Update current session
        const { password: _, ...userWithoutPassword } = users[index];
        localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));

        return { success: true, message: 'Premium-Mitgliedschaft aktiviert!' };
    }

    // Cancel subscription
    function cancelSubscription() {
        const user = getCurrentUser();
        if (!user) return { success: false, message: 'Nicht eingeloggt.' };

        const users = getUsers();
        const index = users.findIndex(u => u.email === user.email);

        if (index === -1) return { success: false, message: 'User nicht gefunden.' };

        users[index].isPremium = false;
        delete users[index].subscribedAt;
        saveUsers(users);

        // Update current session
        const { password: _, ...userWithoutPassword } = users[index];
        localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));

        return { success: true, message: 'Mitgliedschaft gekündigt.' };
    }

    // Reset password (simple implementation)
    function resetPassword(email) {
        const users = getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return { success: false, message: 'Kein Konto mit dieser E-Mail gefunden.' };
        }

        // Generate temporary password
        const tempPassword = 'keto' + Math.floor(1000 + Math.random() * 9000);
        user.password = tempPassword;
        saveUsers(users);

        return { success: true, message: 'Temporäres Passwort: ' + tempPassword, tempPassword };
    }

    // Check auth state and redirect if needed
    function requireAuth(redirectUrl = 'login.html') {
        if (!isLoggedIn()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    // Require premium subscription
    function requirePremium(redirectUrl = 'pricing.html') {
        if (!isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        if (!isPremium()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    // Update UI based on auth state
    function updateAuthUI() {
        const user = getCurrentUser();
        const loginLinks = document.querySelectorAll('.auth-login-link');
        const logoutLinks = document.querySelectorAll('.auth-logout-link');
        const userNames = document.querySelectorAll('.auth-user-name');
        const premiumBadges = document.querySelectorAll('.auth-premium-badge');

        if (user) {
            loginLinks.forEach(el => el.style.display = 'none');
            logoutLinks.forEach(el => el.style.display = '');
            userNames.forEach(el => el.textContent = user.name);
            premiumBadges.forEach(el => {
                el.style.display = user.isPremium ? '' : 'none';
            });
        } else {
            loginLinks.forEach(el => el.style.display = '');
            logoutLinks.forEach(el => el.style.display = 'none');
            userNames.forEach(el => el.textContent = '');
            premiumBadges.forEach(el => el.style.display = 'none');
        }
    }

    // Expose API globally
    window.KetoAuth = {
        init: initAuth,
        login,
        logout,
        register,
        isLoggedIn,
        isPremium,
        getCurrentUser,
        updateProfile,
        changePassword,
        subscribe,
        cancelSubscription,
        resetPassword,
        requireAuth,
        requirePremium,
        updateAuthUI
    };

    // Auto-init on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuth);
    } else {
        initAuth();
    }
})();
