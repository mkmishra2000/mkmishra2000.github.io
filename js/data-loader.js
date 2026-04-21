// ====================================
// Data Loader - Fetch and Render JSON
// ====================================

class DataLoader {
    constructor(dataPath = './data/') {
        this.dataPath = dataPath;
        this.cache = {};
    }

    async loadData(filename) {
        // Return cached data if already loaded
        if (this.cache[filename]) {
            return this.cache[filename];
        }

        try {
            const response = await fetch(`${this.dataPath}${filename}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}: ${response.statusText}`);
            }
            const data = await response.json();
            this.cache[filename] = data;
            return data;
        } catch (error) {
            console.error(`Error loading data: ${error.message}`);
            return null;
        }
    }

    async renderPublications(containerId) {
        const data = await this.loadData('publications.json');
        if (!data || !data.publications) return;

        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = data.publications.map(pub => `
            <div class="publication-item fade-in">
                <div class="publication-title">
                    ${pub.link ? `<a href="${pub.link}" target="_blank">${pub.title}</a>` : pub.title}
                </div>
                <div class="publication-meta">
                    <strong>Authors:</strong> ${pub.authors}
                </div>
                <div class="publication-meta">
                    <strong>Year:</strong> ${pub.year}
                </div>
                <div class="publication-meta">
                    <strong>Journal/Conference:</strong> ${pub.journal}
                    ${pub.volume ? ` | Vol. ${pub.volume}` : ''}
                    ${pub.issue ? ` | Issue ${pub.issue}` : ''}
                    ${pub.pages ? ` | pp. ${pub.pages}` : ''}
                </div>
                <div class="publication-meta">
                    ${pub.type ? `<span class="badge">${pub.type}</span>` : ''}
                </div>
            </div>
        `).join('');
    }

    async renderAchievements(containerId) {
        const data = await this.loadData('achievements.json');
        if (!data || !data.achievements) return;

        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = data.achievements.map(achievement => `
            <div class="achievement-item fade-in">
                <div class="achievement-icon">${achievement.icon || '🎯'}</div>
                <div class="achievement-content">
                    <h3>${achievement.title}</h3>
                    <div class="publication-meta"><strong>Date:</strong> ${achievement.date}</div>
                    <div class="publication-meta">${achievement.description}</div>
                    ${achievement.category ? `<span class="badge achievement">${achievement.category}</span>` : ''}
                </div>
            </div>
        `).join('');
    }

    async renderInspirations(containerId) {
        const data = await this.loadData('inspirations.json');
        if (!data || !data.inspirations) return;

        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '<div class="row">' + data.inspirations.map(inspiration => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="inspiration-card fade-in">
                    <div class="inspiration-name">${inspiration.name}</div>
                    <div class="inspiration-field">${inspiration.field}</div>
                    <div class="inspiration-influence">${inspiration.influence}</div>
                    ${inspiration.link ? `<a href="${inspiration.link}" target="_blank" class="btn btn-sm btn-primary mt-3">Learn More</a>` : ''}
                </div>
            </div>
        `).join('') + '</div>';
    }

    async loadAndDisplayProfile(elementIds) {
        const data = await this.loadData('profile.json');
        if (!data) return;

        // Update various elements with profile data
        if (elementIds.name && document.getElementById(elementIds.name)) {
            document.getElementById(elementIds.name).textContent = data.name;
        }
        if (elementIds.title && document.getElementById(elementIds.title)) {
            document.getElementById(elementIds.title).textContent = data.title;
        }
        if (elementIds.bio && document.getElementById(elementIds.bio)) {
            document.getElementById(elementIds.bio).textContent = data.bio;
        }
        if (elementIds.email && document.getElementById(elementIds.email)) {
            document.getElementById(elementIds.email).textContent = data.email;
        }
        if (elementIds.avatar && document.getElementById(elementIds.avatar)) {
            document.getElementById(elementIds.avatar).src = data.avatarUrl;
            document.getElementById(elementIds.avatar).alt = data.name;
        }

        // Update social links
        if (elementIds.social && data.social) {
            const socialContainer = document.getElementById(elementIds.social);
            if (socialContainer) {
                socialContainer.innerHTML = '';
                Object.entries(data.social).forEach(([platform, url]) => {
                    if (url) {
                        const link = document.createElement('a');
                        link.href = url;
                        link.target = '_blank';
                        link.textContent = platform.charAt(0).toUpperCase() + platform.slice(1);
                        link.className = 'btn btn-outline-primary btn-sm me-2';
                        socialContainer.appendChild(link);
                    }
                });
            }
        }
    }

    async filterAndRenderPublications(containerId, year = null, type = null) {
        const data = await this.loadData('publications.json');
        if (!data || !data.publications) return;

        let filtered = data.publications;

        if (year) {
            filtered = filtered.filter(pub => pub.year === year);
        }
        if (type) {
            filtered = filtered.filter(pub => pub.type === type);
        }

        const container = document.getElementById(containerId);
        if (!container) return;

        if (filtered.length === 0) {
            container.innerHTML = '<p class="text-muted">No publications found matching the criteria.</p>';
            return;
        }

        container.innerHTML = filtered.map(pub => `
            <div class="publication-item fade-in">
                <div class="publication-title">
                    ${pub.link ? `<a href="${pub.link}" target="_blank">${pub.title}</a>` : pub.title}
                </div>
                <div class="publication-meta">
                    <strong>Authors:</strong> ${pub.authors}
                </div>
                <div class="publication-meta">
                    <strong>Year:</strong> ${pub.year}
                </div>
                <div class="publication-meta">
                    <strong>Journal/Conference:</strong> ${pub.journal}
                    ${pub.volume ? ` | Vol. ${pub.volume}` : ''}
                    ${pub.issue ? ` | Issue ${pub.issue}` : ''}
                    ${pub.pages ? ` | pp. ${pub.pages}` : ''}
                </div>
                <div class="publication-meta">
                    ${pub.type ? `<span class="badge">${pub.type}</span>` : ''}
                </div>
            </div>
        `).join('');
    }
}

// Initialize data loader globally
const dataLoader = new DataLoader('./data/');
