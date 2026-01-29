// Carte principale
class TopConsumersCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._config = null;
        this._hass = null;
    }

    static getConfigElement() {
        return document.createElement("top-consumers-card-editor");
    }

    static getStubConfig() {
        return {
            type: "custom:top-consumers-card",
            title: "⚡ Top 5 Consommateurs",
            max_items: 5,
            entities: [
                {
                    entity: "sensor.chauffe_eau_power_minute_average",
                    name: "Chauffe-eau",
                    icon: "fire",
                    gradient: "red"
                }
            ]
        };
    }

    setConfig(config) {
        this._config = {
            type: "custom:top-consumers-card",
            title: config.title || "⚡ Top 5 Consommateurs",
            max_items: parseInt(config.max_items) || 5,
            entities: Array.isArray(config.entities) ? [...config.entities] : []
        };
        
        if (!this.shadowRoot.innerHTML) {
            this.render();
        } else {
            this.updateTitle();
        }
        
        if (this._hass) {
            setTimeout(() => this.updateContent(), 0);
        }
    }

    set hass(hass) {
        this._hass = hass;
        if (this._config) {
            this.updateContent();
        }
    }

    getGradient(gradientName) {
        const gradients = {
            'red': 'linear-gradient(90deg, #FF6B6B 0%, #C92A2A 100%)',
            'blue': 'linear-gradient(90deg, #4DABF7 0%, #1971C2 100%)',
            'green': 'linear-gradient(90deg, #69DB7C 0%, #2F9E44 100%)',
            'orange': 'linear-gradient(90deg, #FFD43B 0%, #F08C00 100%)',
            'purple': 'linear-gradient(90deg, #DA77F2 0%, #9C36B5 100%)',
            'pink': 'linear-gradient(90deg, #FFC9E6 0%, #E64980 100%)',
            'cyan': 'linear-gradient(90deg, #3BC9DB 0%, #0B7285 100%)',
            'teal': 'linear-gradient(90deg, #38D9A9 0%, #12B886 100%)',
            'yellow': 'linear-gradient(90deg, #FFE066 0%, #FAB005 100%)',
            'indigo': 'linear-gradient(90deg, #B197FC 0%, #7950F2 100%)',
            'lime': 'linear-gradient(90deg, #A9E34B 0%, #5C940D 100%)',
            'amber': 'linear-gradient(90deg, #FFA94D 0%, #E8590C 100%)'
        };
        return gradients[gradientName] || gradients['blue'];
    }

    getIconEmoji(iconName) {
        const icons = {
            'fire': '🔥', 'snowflake': '❄️', 'pan': '🍳', 'home': '🏠', 'tv': '📺',
            'bolt': '⚡', 'plug': '🔌', 'bulb': '💡', 'battery': '🔋', 'sun': '☀️',
            'thermometer': '🌡️', 'wind': '💨', 'coffee': '☕', 'microwave': '🥘',
            'fridge': '🧊', 'dishwasher': '🍽️', 'computer': '🖥️', 'gaming': '🎮',
            'speaker': '🔊', 'music': '🎵', 'shower': '🚿', 'laundry': '🧺',
            'door': '🚪', 'window': '🪟', 'fan': '🌀', 'heater': '♨️',
            'water': '💧', 'cooking': '👨‍🍳'
        };
        return icons[iconName] || '🔌';
    }

    render() {
        const title = this._config ? this._config.title : "⚡ Top 5 Consommateurs";
        
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; }
                ha-card { padding: 16px; }
                .header {
                    font-size: 22px;
                    font-weight: 600;
                    text-align: center;
                    margin-bottom: 20px;
                    color: var(--primary-text-color);
                }
                .consumer-item {
                    margin-bottom: 12px;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    transition: transform 0.2s ease;
                    cursor: pointer;
                }
                .consumer-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
                }
                .gradient-bar {
                    height: 70px;
                    display: flex;
                    align-items: center;
                    padding: 0 20px;
                    color: white;
                }
                .rank {
                    font-size: 24px;
                    font-weight: 700;
                    margin-right: 16px;
                    min-width: 30px;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                .icon {
                    font-size: 28px;
                    margin-right: 16px;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
                }
                .info { flex: 1; }
                .name {
                    font-size: 16px;
                    font-weight: 600;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.3);
                }
                .power {
                    font-size: 24px;
                    font-weight: 700;
                    margin-left: 16px;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.4);
                }
                .loading, .no-data, .info-message {
                    text-align: center;
                    padding: 40px;
                    color: var(--secondary-text-color);
                }
            </style>
            <ha-card>
                <div class="header" id="card-title">${title}</div>
                <div id="content" class="loading">Chargement...</div>
            </ha-card>
        `;
    }

    updateTitle() {
        const titleElement = this.shadowRoot.getElementById('card-title');
        if (titleElement && this._config) {
            titleElement.textContent = this._config.title;
        }
    }

    updateContent() {
        const contentDiv = this.shadowRoot.getElementById('content');
        if (!contentDiv || !this._config || !this._hass) return;
        
        if (!this._config.entities || this._config.entities.length === 0) {
            contentDiv.innerHTML = '<div class="no-data">Aucune entité configurée.<br>Utilisez l\'éditeur de code YAML pour configurer.</div>';
            return;
        }
        
        const consumers = [];
        for (let i = 0; i < this._config.entities.length; i++) {
            const config = this._config.entities[i];
            if (!config || !config.entity) continue;
            
            const state = this._hass.states[config.entity];
            if (!state) continue;
            
            const power = parseFloat(state.state);
            if (isNaN(power)) continue;
            
            consumers.push({
                entity: config.entity,
                name: config.name || config.entity,
                icon: config.icon || 'plug',
                gradient: config.gradient || 'blue',
                power: power,
                unit: state.attributes.unit_of_measurement || 'W'
            });
        }
        
        consumers.sort((a, b) => b.power - a.power);
        const topConsumers = consumers.slice(0, this._config.max_items);
        
        if (topConsumers.length === 0) {
            contentDiv.innerHTML = '<div class="no-data">Aucune donnée disponible.</div>';
            return;
        }
        
        const html = topConsumers.map((consumer, index) => `
            <div class="consumer-item" data-entity="${consumer.entity}">
                <div class="gradient-bar" style="background: ${this.getGradient(consumer.gradient)}">
                    <div class="rank">${index + 1}</div>
                    <div class="icon">${this.getIconEmoji(consumer.icon)}</div>
                    <div class="info"><div class="name">${consumer.name}</div></div>
                    <div class="power">${Math.round(consumer.power)} ${consumer.unit}</div>
                </div>
            </div>
        `).join('');
        
        contentDiv.innerHTML = html;
        
        this.shadowRoot.querySelectorAll('.consumer-item').forEach(item => {
            item.addEventListener('click', () => {
                const event = new Event('hass-more-info', { bubbles: true, composed: true });
                event.detail = { entityId: item.getAttribute('data-entity') };
                this.dispatchEvent(event);
            });
        });
    }

    getCardSize() { return 3; }
}

customElements.define('top-consumers-card', TopConsumersCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: 'top-consumers-card',
    name: 'Top Consommateurs',
    description: 'Affiche les plus gros consommateurs électriques - Configuration en YAML uniquement',
    preview: false
});

console.info('%c TOP-CONSUMERS-CARD %c v5.0 YAML-ONLY ', 'color: white; background: #10b981; font-weight: bold;', 'color: #10b981; background: white; font-weight: bold;');
