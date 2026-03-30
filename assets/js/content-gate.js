// KetoGuide Content Gating System
// Sperrt Premium-Inhalte für Nicht-Mitglieder

(function() {
    'use strict';

    // Configuration for gated content
    const GATED_SELECTORS = [
        '.premium-content',
        '.recipe-detail',
        '.guide-content',
        '[data-gated="true"]'
    ];

    const FREE_PATHS = [
        '/index.html',
        '/pages/guides/starten.html',
        '/pages/ketopedia/'
    ];

    // Check if current page should be gated
    function shouldGateContent() {
        const path = window.location.pathname;
        const href = window.location.href;

        // Check if user is premium
        if (window.KetoAuth && window.KetoAuth.isPremium()) {
            return false;
        }

        // Check if path is in free paths
        for (const freePath of FREE_PATHS) {
            if (href.includes(freePath)) {
                return false;
            }
        }

        // Check URL patterns for premium content
        const premiumPatterns = [
            '/pages/recipes/details/',
            '/pages/guides/',
            '/pages/health/',
            '/pages/supplements/',
            '/pages/topics/',
            '/pages/members/'
        ];

        for (const pattern of premiumPatterns) {
            if (path.includes(pattern)) {
                return true;
            }
        }

        return false;
    }

    // Apply content gate
    function applyContentGate() {
        if (!shouldGateContent()) {
            return;
        }

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', gateContent);
        } else {
            gateContent();
        }
    }

    function gateContent() {
        // Find main content areas
        const mainContent = document.querySelector('.content-section') ||
                           document.querySelector('.recipe-detail') ||
                           document.querySelector('main') ||
                           document.querySelector('.container');

        if (!mainContent) return;

        // Check if already gated
        if (document.querySelector('.content-gate-overlay')) return;

        // Blur the content
        mainContent.classList.add('blur-preview');

        // Create gate overlay
        const overlay = document.createElement('div');
        overlay.className = 'content-gate-overlay';
        overlay.innerHTML = `
            <div class="gate-content">
                <div class="gate-icon">🔒</div>
                <h2>Premium Inhalt</h2>
                <p>Dieser Inhalt ist nur für Premium-Mitglieder verfügbar.</p>
                <div class="gate-cta">
                    <a href="../auth/register.html" class="btn btn-primary">Jetzt Premium starten</a>
                    <a href="../auth/login.html" class="btn btn-secondary">Einloggen</a>
                </div>
                <div class="gate-benefits">
                    <div class="benefit-item">✓ 120+ Premium Rezepte</div>
                    <div class="benefit-item">✓ Wissenschaftliche Guides</div>
                    <div class="benefit-item">✓ Persönlicher Support</div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .content-gate-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.7);
                backdrop-filter: blur(10px);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }

            .gate-content {
                background: white;
                border-radius: var(--radius-xl);
                padding: 48px;
                max-width: 500px;
                text-align: center;
                margin: 20px;
                animation: slideUp 0.4s ease;
            }

            .gate-icon {
                font-size: 64px;
                margin-bottom: 24px;
            }

            .gate-content h2 {
                font-size: 28px;
                margin-bottom: 12px;
            }

            .gate-content p {
                color: var(--text-secondary);
                margin-bottom: 24px;
            }

            .gate-cta {
                display: flex;
                gap: 12px;
                justify-content: center;
                margin-bottom: 24px;
            }

            .gate-cta .btn {
                padding: 14px 24px;
                border-radius: var(--radius-md);
                font-size: 15px;
                font-weight: 500;
            }

            .gate-benefits {
                background: var(--apple-gray-100);
                padding: 20px;
                border-radius: var(--radius-md);
            }

            .benefit-item {
                padding: 8px 0;
                font-size: 14px;
                color: var(--text-primary);
            }

            .blur-preview {
                filter: blur(8px);
                user-select: none;
                pointer-events: none;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @media (max-width: 480px) {
                .gate-content {
                    padding: 32px 24px;
                }

                .gate-cta {
                    flex-direction: column;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(overlay);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    // Initialize
    if (window.KetoAuth) {
        applyContentGate();
    } else {
        // Wait for auth to load
        window.addEventListener('KetoAuthLoaded', applyContentGate);
        setTimeout(applyContentGate, 100);
    }
})();
