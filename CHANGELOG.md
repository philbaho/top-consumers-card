# Top Consumers Card

[![Latest Release V1](https://img.shields.io/badge/V1%20(YAML)-v1.0.0-blue)](https://github.com/yourusername/top-consumers-card/releases/tag/v1.0.0)
[![Latest Release V2](https://img.shields.io/badge/V2%20(Editor)-v2.0.0-green)](https://github.com/yourusername/top-consumers-card/releases/tag/v2.0.0)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)
[![License](https://img.shields.io/github/license/yourusername/top-consumers-card.svg)](LICENSE)

A beautiful and modern Home Assistant card to display your top energy consumers with colorful gradients and real-time power monitoring.

![Top Consumers Card](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Top+Consumers+Card+Preview)

## 📦 Available Versions

### Version 1.0 - YAML Configuration (Recommended)
**File:** `top-consumers-card.js`  
**Configuration:** YAML-based  
**Stability:** ✅ Stable and tested  
**HACS:** Yes (default)

Perfect for users who prefer YAML configuration. Simple, stable, and works everywhere.

### Version 2.0 - Visual Editor (New!)
**File:** `top-consumers-card-v2.js`  
**Configuration:** Visual editor with dropdowns  
**Stability:** 🆕 New release  
**HACS:** Manual install

Configure your card using a visual interface - no YAML needed! Add entities, choose icons and colors from dropdown menus.

---

## ✨ Features

- 🎨 **Modern Design** - Beautiful gradient bars with smooth animations
- 📊 **Auto-Sorting** - Automatically sorts by power consumption (highest first)
- ⚡ **Real-time Updates** - Live power monitoring
- 🎭 **28 Icons** - Choose from a variety of emojis for each appliance
- 🌈 **12 Color Gradients** - Customize colors for each consumer
- 📱 **Responsive** - Optimized for desktop and mobile
- 🔢 **Flexible** - Display from 1 to 20 items
- 🖱️ **Interactive** - Click any item to see more details

---

## 📦 Installation

### Via HACS (V1 only)

1. Open HACS in your Home Assistant instance
2. Go to "Frontend"
3. Click the three dots menu (top right) and select "Custom repositories"
4. Add this repository URL: `https://github.com/yourusername/top-consumers-card`
5. Category: `Lovelace`
6. Click "Add"
7. Find "Top Consumers Card" in the list and click "Install"
8. Restart Home Assistant

### Manual Installation

#### For Version 1 (YAML)
1. Download [`top-consumers-card.js`](https://github.com/yourusername/top-consumers-card/releases/latest/download/top-consumers-card.js) from the latest release
2. Copy it to your `config/www/` folder
3. Add the resource in Home Assistant:
   - Go to Settings → Dashboards → Resources
   - Click "Add Resource"
   - URL: `/local/top-consumers-card.js`
   - Type: JavaScript Module
4. Restart Home Assistant

#### For Version 2 (Visual Editor)
1. Download [`top-consumers-card-v2.js`](https://github.com/yourusername/top-consumers-card/releases/tag/v2.0.0) from the v2.0.0 release
2. Copy it to your `config/www/` folder
3. Add the resource in Home Assistant:
   - Go to Settings → Dashboards → Resources
   - Click "Add Resource"
   - URL: `/local/top-consumers-card-v2.js`
   - Type: JavaScript Module
4. Restart Home Assistant

---

## 🚀 Quick Start

### Version 1 - YAML Configuration

Add this to your dashboard in edit mode (Manual card):

```yaml
type: custom:top-consumers-card
title: "⚡ Top 5 Consumers"
max_items: 5
entities:
  - entity: sensor.water_heater_power
    name: Water Heater
    icon: fire
    gradient: red
  - entity: sensor.ac_power
    name: Air Conditioning
    icon: snowflake
    gradient: blue
  - entity: sensor.kitchen_power
    name: Kitchen
    icon: pan
    gradient: orange
  - entity: sensor.living_room_power
    name: Living Room
    icon: tv
    gradient: purple
  - entity: sensor.office_power
    name: Office
    icon: computer
    gradient: green
```

### Version 2 - Visual Editor

1. In edit mode, click **"Add Card"**
2. Search for **"Top Consumers Card V2"**
3. The visual editor opens automatically! 🎉
4. Configure using the interface:
   - Set title and max items
   - Click **"➕ Add Entity"** to add consumers
   - Choose entity from your list
   - Select icon from dropdown (28 choices)
   - Select color from dropdown (12 gradients)
5. Click **"Save"**

No YAML needed! ✨

---

## ⚙️ Configuration Reference

### Card Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | **Required** | `custom:top-consumers-card` or `custom:top-consumers-card-v2` |
| `title` | string | `"⚡ Top 5 Consumers"` | Card title |
| `max_items` | number | `5` | Number of items to display (1-20) |
| `entities` | list | **Required** | List of entities to monitor |

### Entity Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `entity` | string | **Required** | Entity ID (must be a power sensor) |
| `name` | string | Entity name | Display name |
| `icon` | string | `plug` | Icon identifier (see list below) |
| `gradient` | string | `blue` | Gradient color (see list below) |

### Available Icons

**Energy & Electricity:**
`fire` 🔥, `bolt` ⚡, `plug` 🔌, `bulb` 💡, `battery` 🔋, `sun` ☀️

**Climate:**
`snowflake` ❄️, `thermometer` 🌡️, `wind` 💨, `heater` ♨️, `fan` 🌀

**Kitchen:**
`pan` 🍳, `coffee` ☕, `microwave` 🥘, `fridge` 🧊, `dishwasher` 🍽️, `cooking` 👨‍🍳

**Entertainment:**
`tv` 📺, `computer` 🖥️, `gaming` 🎮, `speaker` 🔊, `music` 🎵

**Home:**
`home` 🏠, `shower` 🚿, `laundry` 🧺, `door` 🚪, `window` 🪟, `water` 💧

### Available Gradients

- `red` - Hot red (perfect for heaters)
- `blue` - Cool blue (perfect for AC)
- `green` - Nature green
- `orange` - Sunny orange (perfect for kitchen)
- `purple` - Mystic purple
- `pink` - Tender pink
- `cyan` - Ocean cyan
- `teal` - Turquoise
- `yellow` - Bright yellow
- `indigo` - Deep indigo
- `lime` - Lime green
- `amber` - Amber

---

## 📋 Examples

### Example 1: Top 3 Consumers (V1)

```yaml
type: custom:top-consumers-card
title: "🔥 Top 3 Power Hungry"
max_items: 3
entities:
  - entity: sensor.water_heater_power
    name: Water Heater
    icon: fire
    gradient: red
  - entity: sensor.ac_power
    name: Air Conditioning
    icon: snowflake
    gradient: blue
  - entity: sensor.kitchen_power
    name: Kitchen
    icon: pan
    gradient: orange
```

### Example 2: Kitchen Monitoring (V1)

```yaml
type: custom:top-consumers-card
title: "🍳 Kitchen Power Usage"
max_items: 5
entities:
  - entity: sensor.oven_power
    name: Oven
    icon: cooking
    gradient: amber
  - entity: sensor.microwave_power
    name: Microwave
    icon: microwave
    gradient: orange
  - entity: sensor.dishwasher_power
    name: Dishwasher
    icon: dishwasher
    gradient: cyan
  - entity: sensor.fridge_power
    name: Refrigerator
    icon: fridge
    gradient: blue
  - entity: sensor.coffee_maker_power
    name: Coffee Maker
    icon: coffee
    gradient: yellow
```

### Example 3: Complete Home (V2 - Use Visual Editor)

Just add the card and configure with the visual interface!

---

## 💡 Tips & Tricks

### V1 vs V2 - Which to Choose?

**Choose V1 if:**
- ✅ You prefer YAML configuration
- ✅ You want HACS automatic updates
- ✅ You want maximum stability
- ✅ You're comfortable with config files

**Choose V2 if:**
- ✅ You prefer visual configuration
- ✅ You want dropdown menus for icons/colors
- ✅ You like clicking buttons instead of typing
- ✅ You want to try the latest features

### Auto-Sorting
Both versions automatically sort entities by current power consumption. You can add up to 20 entities, and only the top N (defined by `max_items`) will be displayed.

### Easy Configuration (V1)
To add a new entity, simply copy these 4 lines and modify them:
```yaml
  - entity: sensor.your_entity
    name: Display Name
    icon: plug
    gradient: blue
```

### Easy Configuration (V2)
Just click **"➕ Add Entity"** and fill the form!

### Click for Details
Click on any consumer bar to open the entity details dialog with full history and information.

---

## 🐛 Troubleshooting

### Card not showing up
1. Make sure you've added the resource correctly
2. Clear your browser cache (Ctrl+F5)
3. Check browser console for errors
4. Verify the file is in `/config/www/`

### V2 Editor not appearing
- Make sure you're using `type: custom:top-consumers-card-v2`
- Try clearing browser cache completely
- Check that you downloaded the V2 file, not V1

### "Aucune donnée disponible" message
- Verify your entity IDs are correct
- Check that entities have numeric values
- Ensure entities have a unit of measurement (W, kW, etc.)

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by the need for better energy monitoring in Home Assistant
- Thanks to the Home Assistant community
- Built with ❤️ for smart home enthusiasts

---

## 📬 Support

- 🐛 [Report a Bug](https://github.com/yourusername/top-consumers-card/issues)
- 💡 [Request a Feature](https://github.com/yourusername/top-consumers-card/issues)
- 💬 [Discussion Forum](https://github.com/yourusername/top-consumers-card/discussions)

---

**If you like this card, please ⭐ star the repository!**
