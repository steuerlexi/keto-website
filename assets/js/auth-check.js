// KetoGuide Early Auth Check
// MUST be included in <head> before any content renders
// This script blocks rendering until auth is verified

(function() {
    'use strict';

    // Pages that are FREE (no auth required)
    const FREE_PATHS = [
        '/index.html',
        '/pages/auth/login.html',
        '/pages/auth/register.html',
        '/pages/auth/forgot-password.html',
        '/pages/auth/redirect.html',
        '/pages/legal/impressum.html',
        '/pages/legal/datenschutz.html',
        '/pages/legal/agb.html',
        '/pages/ketopedia/001-was-ist-keto.html',
        '/pages/ketopedia/002-keto-flu.html'
    ];

    // Patterns that are always FREE
    const FREE_PATTERNS = [
        // No specific free patterns - all content is gated except explicit paths
    ];

    // Patterns that require PREMIUM
    const PREMIUM_PATTERNS = [
        '/pages/recipes/details/',
        '/pages/guides/',
        '/pages/health/',
        '/pages/supplements/',
        '/pages/topics/',
        '/pages/members/',
        '/pages/lifestyle/',
        '/pages/science/',
        '/pages/faq/'
    ];

    // Category pages that are FREE but content is gated
    const CATEGORY_PAGES = [
        '/pages/recipes/fruehstueck.html',
        '/pages/recipes/mittagessen.html',
        '/pages/recipes/abendessen.html',
        '/pages/recipes/snacks.html',
        '/pages/recipes/desserts.html',
        '/pages/recipes/vegetarisch.html',
        '/pages/recipes/brot-gebaeck.html',
        '/pages/recipes/getraenke.html',
        '/pages/recipes/mealprep.html',
        '/pages/recipes/feiertage.html'
    ];

    function getCurrentPath() {
        return window.location.pathname;
    }

    function isFreePath(path) {
        // Check exact matches
        if (FREE_PATHS.includes(path) || FREE_PATHS.includes(path.replace(/\/$/, ''))) {
            return true;
        }

        // Check free patterns
        for (const pattern of FREE_PATTERNS) {
            if (path.includes(pattern)) return true;
        }

        // Check category pages (free to browse, but details are gated)
        if (CATEGORY_PAGES.includes(path) || CATEGORY_PAGES.includes(path.replace(/\/$/, ''))) {
            return true;
        }

        return false;
    }

    function isPremiumPath(path) {
        for (const pattern of PREMIUM_PATTERNS) {
            if (path.includes(pattern)) return true;
        }
        return false;
    }

    function checkAuth() {
        const path = getCurrentPath();

        // Free paths don't need auth check
        if (isFreePath(path)) {
            return { allowed: true };
        }

        // Check if user is logged in
        const auth = localStorage.getItem('ketoguide_auth');
        if (!auth) {
            return { allowed: false, reason: 'login_required' };
        }

        try {
            const user = JSON.parse(auth);

            // Members area requires login (already checked above)
            if (path.includes('/pages/members/')) {
                return { allowed: true };
            }

            // Premium content requires premium subscription
            if (isPremiumPath(path)) {
                if (!user.isPremium) {
                    return { allowed: false, reason: 'premium_required' };
                }
            }

            return { allowed: true };
        } catch (e) {
            return { allowed: false, reason: 'login_required' };
        }
    }

    function redirect(reason) {
        const currentPath = encodeURIComponent(window.location.pathname);

        if (reason === 'premium_required') {
            // Premium user - redirect to upgrade
            window.location.replace(`/pages/members/upgrade.html?redirect=${currentPath}`);
        } else {
            // Not logged in - redirect to login
            window.location.replace(`/pages/auth/login.html?redirect=${currentPath}`);
        }
    }

    // Run check immediately
    const result = checkAuth();

    if (!result.allowed) {
        // Block rendering
        document.open();
        document.write('<!DOCTYPE html><html><head><title>Bitte warten...</title></head><body></body></html>');
        document.close();

        // Redirect
        setTimeout(() => redirect(result.reason), 0);
    }
})();
