# Top Consumers Card

A beautiful and modern Home Assistant card to display your top energy consumers with colorful gradients and real-time power monitoring.

## Features

- 🎨 **Modern Design** - Beautiful gradient bars
- 📊 **Auto-Sorting** - Automatically sorts by power consumption
- ⚡ **Real-time Updates** - Live power monitoring
- 🎭 **28 Icons** - Emojis for each appliance
- 🌈 **12 Color Gradients** - Customize colors
- 📱 **Responsive** - Desktop and mobile optimized

## Quick Example

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
```

[Full Documentation →](https://github.com/yourusername/top-consumers-card)
