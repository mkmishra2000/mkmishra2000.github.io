// ====================================
// Dark Mode Theme Toggle
// ====================================

class ThemeManager {
    constructor() {
        this.storageKey = 'theme-preference';
        this.darkModeClass = 'dark-mode';
        this.init();
    }

    init() {
        // Check for saved preference or system preference
        const savedTheme = localStorage.getItem(this.storageKey);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            this.setTheme(savedTheme === 'dark');
        } else if (prefersDark) {
            this.setTheme(true);
        } else {
            this.setTheme(false);
        }

        this.setupToggleBtn();
        this.listenSystemPreference();
    }

    setTheme(isDark) {
        const html = document.documentElement;
        
        if (isDark) {
            html.classList.add(this.darkModeClass);
            localStorage.setItem(this.storageKey, 'dark');
            this.updateToggleButtonState(true);
        } else {
            html.classList.remove(this.darkModeClass);
            localStorage.setItem(this.storageKey, 'light');
            this.updateToggleButtonState(false);
        }
    }

    toggle() {
        const isDark = document.documentElement.classList.contains(this.darkModeClass);
        this.setTheme(!isDark);
    }

    setupToggleBtn() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    }

    updateToggleButtonState(isDark) {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.innerHTML = isDark ? '☀️ Light' : '🌙 Dark';
        }
    }

    listenSystemPreference() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.storageKey)) {
                this.setTheme(e.matches);
            }
        });
    }
}

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});
