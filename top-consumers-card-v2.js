console.info(
  '%c TOP-CONSUMERS-CARD-V2 %c v2.0.0 WITH VISUAL EDITOR ',
  'color: white; background: #10b981; font-weight: bold;',
  'color: #10b981; background: white; font-weight: bold;'
);

class TopConsumersCardV2 extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static getConfigElement() {
        return document.createElement("top-consumers-card-v2-editor");
    }

    static getStubConfig() {
        return {
            type: "custom:top-consumers-card-v2",
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
        if (!config) throw new Error("Invalid configuration");
        
        this._config = {
            type: config.type || "custom:top-consumers-card-v2",
            title: config.title || "⚡ Top 5 Consommateurs",
            max_items: parseInt(config.max_items) || 5,
            entities: Array.isArray(config.entities) ? config.entities : []
        };
        
        if (!this.shadowRoot.innerHTML) this.render();
        else this.updateTitle();
        
        if (this._hass) this.updateContent();
    }

    set hass(hass) {
        this._hass = hass;
        if (this._config) this.updateContent();
    }

    getGradient(name) {
        const g = {
            red: 'linear-gradient(90deg, #FF6B6B 0%, #C92A2A 100%)',
            blue: 'linear-gradient(90deg, #4DABF7 0%, #1971C2 100%)',
            green: 'linear-gradient(90deg, #69DB7C 0%, #2F9E44 100%)',
            orange: 'linear-gradient(90deg, #FFD43B 0%, #F08C00 100%)',
            purple: 'linear-gradient(90deg, #DA77F2 0%, #9C36B5 100%)',
            pink: 'linear-gradient(90deg, #FFC9E6 0%, #E64980 100%)',
            cyan: 'linear-gradient(90deg, #3BC9DB 0%, #0B7285 100%)',
            teal: 'linear-gradient(90deg, #38D9A9 0%, #12B886 100%)',
            yellow: 'linear-gradient(90deg, #FFE066 0%, #FAB005 100%)',
            indigo: 'linear-gradient(90deg, #B197FC 0%, #7950F2 100%)',
            lime: 'linear-gradient(90deg, #A9E34B 0%, #5C940D 100%)',
            amber: 'linear-gradient(90deg, #FFA94D 0%, #E8590C 100%)'
        };
        return g[name] || g.blue;
    }

    getIcon(name) {
        const i = {
            fire: '🔥', snowflake: '❄️', pan: '🍳', home: '🏠', tv: '📺',
            bolt: '⚡', plug: '🔌', bulb: '💡', battery: '🔋', sun: '☀️',
            thermometer: '🌡️', wind: '💨', coffee: '☕', microwave: '🥘',
            fridge: '🧊', dishwasher: '🍽️', computer: '🖥️', gaming: '🎮',
            speaker: '🔊', music: '🎵', shower: '🚿', laundry: '🧺',
            door: '🚪', window: '🪟', fan: '🌀', heater: '♨️',
            water: '💧', cooking: '👨‍🍳'
        };
        return i[name] || '🔌';
    }

    render() {
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
                    transition: transform 0.2s;
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
                .message {
                    text-align: center;
                    padding: 40px;
                    color: var(--secondary-text-color);
                }
            </style>
            <ha-card>
                <div class="header" id="title">${this._config.title}</div>
                <div id="content" class="message">Chargement...</div>
            </ha-card>
        `;
    }

    updateTitle() {
        const el = this.shadowRoot.getElementById('title');
        if (el && this._config) el.textContent = this._config.title;
    }

    updateContent() {
        const content = this.shadowRoot.getElementById('content');
        if (!content || !this._config || !this._hass) return;
        
        if (!this._config.entities?.length) {
            content.innerHTML = '<div class="message">Aucune entité configurée</div>';
            return;
        }
        
        const consumers = this._config.entities
            .map(c => {
                const s = this._hass.states[c.entity];
                if (!s) return null;
                const p = parseFloat(s.state);
                if (isNaN(p)) return null;
                return {
                    ...c,
                    power: p,
                    unit: s.attributes.unit_of_measurement || 'W'
                };
            })
            .filter(c => c)
            .sort((a, b) => b.power - a.power)
            .slice(0, this._config.max_items);
        
        if (!consumers.length) {
            content.innerHTML = '<div class="message">Aucune donnée disponible</div>';
            return;
        }
        
        content.innerHTML = consumers.map((c, i) => `
            <div class="consumer-item" data-entity="${c.entity}">
                <div class="gradient-bar" style="background: ${this.getGradient(c.gradient)}">
                    <div class="rank">${i + 1}</div>
                    <div class="icon">${this.getIcon(c.icon)}</div>
                    <div class="info"><div class="name">${c.name}</div></div>
                    <div class="power">${Math.round(c.power)} ${c.unit}</div>
                </div>
            </div>
        `).join('');
        
        this.shadowRoot.querySelectorAll('.consumer-item').forEach(item => {
            item.addEventListener('click', () => {
                const e = new Event('hass-more-info', { bubbles: true, composed: true });
                e.detail = { entityId: item.dataset.entity };
                this.dispatchEvent(e);
            });
        });
    }

    getCardSize() { return 3; }
}

// ÉDITEUR V2
class TopConsumersCardV2Editor extends HTMLElement {
    constructor() {
        super();
        this._config = null;
        this._listeners = [];
    }

    setConfig(config) {
        this._config = {
            type: config.type || "custom:top-consumers-card-v2",
            title: config.title || "⚡ Top 5 Consommateurs",
            max_items: parseInt(config.max_items) || 5,
            entities: Array.isArray(config.entities) ? JSON.parse(JSON.stringify(config.entities)) : []
        };
        
        if (!this._rendered) {
            this._rendered = true;
            setTimeout(() => this._render(), 0);
        }
    }

    set hass(hass) {
        this._hass = hass;
    }

    disconnectedCallback() {
        this._listeners.forEach(l => l.remove());
    }

    _render() {
        if (!this._config) return;
        
        this.innerHTML = `
            <style>
                .editor { padding: 16px; font-family: var(--paper-font-body1_-_font-family); }
                .section { margin-bottom: 20px; }
                .section-title {
                    font-size: 16px;
                    font-weight: 500;
                    margin-bottom: 12px;
                    color: var(--primary-text-color);
                }
                .row { margin-bottom: 16px; }
                label {
                    display: block;
                    margin-bottom: 4px;
                    font-size: 14px;
                    color: var(--secondary-text-color);
                }
                input, select {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid var(--divider-color);
                    border-radius: 4px;
                    background: var(--card-background-color);
                    color: var(--primary-text-color);
                    font-size: 14px;
                    box-sizing: border-box;
                }
                .entity-card {
                    background: var(--card-background-color);
                    border: 1px solid var(--divider-color);
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 12px;
                }
                .entity-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }
                .entity-title {
                    font-weight: 500;
                    color: var(--primary-text-color);
                }
                .btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: opacity 0.2s;
                }
                .btn:hover { opacity: 0.8; }
                .btn-primary {
                    background: var(--primary-color);
                    color: white;
                    width: 100%;
                    padding: 12px;
                }
                .btn-danger {
                    background: #f44336;
                    color: white;
                    padding: 6px 12px;
                    font-size: 12px;
                }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                .empty {
                    text-align: center;
                    padding: 20px;
                    color: var(--secondary-text-color);
                }
            </style>
            <div class="editor">
                <div class="section">
                    <div class="section-title">Paramètres généraux</div>
                    <div class="row">
                        <label>Titre</label>
                        <input type="text" id="title" value="${this._config.title}">
                    </div>
                    <div class="row">
                        <label>Nombre max d'items (1-20)</label>
                        <input type="number" id="max_items" min="1" max="20" value="${this._config.max_items}">
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Entités</div>
                    <div id="entities-container"></div>
                    <button class="btn btn-primary" id="add-btn">➕ Ajouter une entité</button>
                </div>
            </div>
        `;

        this._renderEntities();
        this._attachListeners();
    }

    _renderEntities() {
        const container = this.querySelector('#entities-container');
        if (!container) return;

        if (!this._config.entities.length) {
            container.innerHTML = '<div class="empty">Aucune entité. Cliquez sur "Ajouter" ci-dessous.</div>';
            return;
        }

        container.innerHTML = this._config.entities.map((e, i) => `
            <div class="entity-card">
                <div class="entity-header">
                    <span class="entity-title">Entité ${i + 1}</span>
                    <button class="btn btn-danger delete-btn" data-index="${i}">Supprimer</button>
                </div>
                <div class="row">
                    <label>Entity ID</label>
                    <input type="text" class="entity-input" data-index="${i}" value="${e.entity || ''}" placeholder="sensor.exemple">
                </div>
                <div class="row">
                    <label>Nom affiché</label>
                    <input type="text" class="name-input" data-index="${i}" value="${e.name || ''}" placeholder="Nom">
                </div>
                <div class="grid">
                    <div class="row">
                        <label>Icône</label>
                        <select class="icon-input" data-index="${i}">
                            ${this._getIconOptions(e.icon)}
                        </select>
                    </div>
                    <div class="row">
                        <label>Couleur</label>
                        <select class="gradient-input" data-index="${i}">
                            ${this._getGradientOptions(e.gradient)}
                        </select>
                    </div>
                </div>
            </div>
        `).join('');

        this._attachEntityListeners();
    }

    _getIconOptions(selected) {
        const icons = [
            ['fire', '🔥 Feu'], ['snowflake', '❄️ Flocon'], ['pan', '🍳 Casserole'],
            ['home', '🏠 Maison'], ['tv', '📺 TV'], ['bolt', '⚡ Éclair'],
            ['plug', '🔌 Prise'], ['bulb', '💡 Ampoule'], ['battery', '🔋 Batterie'],
            ['sun', '☀️ Soleil'], ['thermometer', '🌡️ Thermomètre'], ['wind', '💨 Vent'],
            ['coffee', '☕ Café'], ['microwave', '🥘 Micro-ondes'], ['fridge', '🧊 Frigo'],
            ['dishwasher', '🍽️ Lave-vaisselle'], ['computer', '🖥️ Ordinateur'],
            ['gaming', '🎮 Jeux'], ['speaker', '🔊 Haut-parleur'], ['music', '🎵 Musique'],
            ['shower', '🚿 Douche'], ['laundry', '🧺 Linge'], ['door', '🚪 Porte'],
            ['window', '🪟 Fenêtre'], ['fan', '🌀 Ventilateur'], ['heater', '♨️ Radiateur'],
            ['water', '💧 Eau'], ['cooking', '👨‍🍳 Cuisine']
        ];
        return icons.map(([v, l]) => `<option value="${v}" ${v === selected ? 'selected' : ''}>${l}</option>`).join('');
    }

    _getGradientOptions(selected) {
        const gradients = [
            ['red', 'Rouge'], ['blue', 'Bleu'], ['green', 'Vert'],
            ['orange', 'Orange'], ['purple', 'Violet'], ['pink', 'Rose'],
            ['cyan', 'Cyan'], ['teal', 'Turquoise'], ['yellow', 'Jaune'],
            ['indigo', 'Indigo'], ['lime', 'Citron vert'], ['amber', 'Ambre']
        ];
        return gradients.map(([v, l]) => `<option value="${v}" ${v === selected ? 'selected' : ''}>${l}</option>`).join('');
    }

    _attachListeners() {
        const title = this.querySelector('#title');
        if (title) {
            const handler = (e) => {
                this._config.title = e.target.value;
                this._fire();
            };
            title.addEventListener('input', handler);
            this._listeners.push({ remove: () => title.removeEventListener('input', handler) });
        }

        const maxItems = this.querySelector('#max_items');
        if (maxItems) {
            const handler = (e) => {
                this._config.max_items = parseInt(e.target.value) || 5;
                this._fire();
            };
            maxItems.addEventListener('input', handler);
            this._listeners.push({ remove: () => maxItems.removeEventListener('input', handler) });
        }

        const addBtn = this.querySelector('#add-btn');
        if (addBtn) {
            const handler = () => {
                this._config.entities.push({ entity: '', name: '', icon: 'plug', gradient: 'blue' });
                this._renderEntities();
                this._fire();
            };
            addBtn.addEventListener('click', handler);
            this._listeners.push({ remove: () => addBtn.removeEventListener('click', handler) });
        }
    }

    _attachEntityListeners() {
        this.querySelectorAll('.entity-input').forEach(input => {
            const handler = (e) => {
                this._config.entities[parseInt(e.target.dataset.index)].entity = e.target.value;
                this._fire();
            };
            input.addEventListener('input', handler);
            this._listeners.push({ remove: () => input.removeEventListener('input', handler) });
        });

        this.querySelectorAll('.name-input').forEach(input => {
            const handler = (e) => {
                this._config.entities[parseInt(e.target.dataset.index)].name = e.target.value;
                this._fire();
            };
            input.addEventListener('input', handler);
            this._listeners.push({ remove: () => input.removeEventListener('input', handler) });
        });

        this.querySelectorAll('.icon-input').forEach(select => {
            const handler = (e) => {
                this._config.entities[parseInt(e.target.dataset.index)].icon = e.target.value;
                this._fire();
            };
            select.addEventListener('change', handler);
            this._listeners.push({ remove: () => select.removeEventListener('change', handler) });
        });

        this.querySelectorAll('.gradient-input').forEach(select => {
            const handler = (e) => {
                this._config.entities[parseInt(e.target.dataset.index)].gradient = e.target.value;
                this._fire();
            };
            select.addEventListener('change', handler);
            this._listeners.push({ remove: () => select.removeEventListener('change', handler) });
        });

        this.querySelectorAll('.delete-btn').forEach(btn => {
            const handler = (e) => {
                this._config.entities.splice(parseInt(e.target.dataset.index), 1);
                this._renderEntities();
                this._fire();
            };
            btn.addEventListener('click', handler);
            this._listeners.push({ remove: () => btn.removeEventListener('click', handler) });
        });
    }

    _fire() {
        this.dispatchEvent(new CustomEvent('config-changed', {
            detail: { config: this._config },
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('top-consumers-card-v2', TopConsumersCardV2);
customElements.define('top-consumers-card-v2-editor', TopConsumersCardV2Editor);

window.customCards = window.customCards || [];
window.customCards.push({
    type: 'top-consumers-card-v2',
    name: 'Top Consumers Card V2 (Visual Editor)',
    description: 'Top energy consumers with visual editor',
    preview: true
});
