# Unhoused: Hyderabad Housing Crisis Design Project

An editorial-style, scroll-driven interactive web experience documenting a comprehensive Design Thinking process applied to the housing crisis in Hyderabad, India.

## Overview

This project translates a complex 7-phase design thinking methodology into a highly visual, data-rich digital narrative. By blending modern web design aesthetics with robust interactive charts and fluid animations, this single-page application (SPA) brings ethnographic research, root-cause analysis, and proposed solutions to life.

### The 7 Phases Documented:
1. **Topic Selection:** Introduction to the housing crisis context in Hyderabad.
2. **Research:** Core ethnographic and secondary research metrics.
3. **Personas & Journey Maps:** Detailed profiles (e.g., Stretched Homeowner, Urban Renter, Informal Resident) and emotional journey tracking.
4. **Root Cause Analysis (5 Whys):** Uncovering systemic issues causing housing distress.
5. **How Might We (HMW):** Reframing pain points into actionable design questions.
6. **6-3-5 Brainwriting:** Structured ideation splitting 4x3x5 and 3x3x5 workflows.
7. **Triple-T Synthesis:** Evaluating solutions across Desirability, Feasibility, and Viability to identify "Top Ideas."

## Tech Stack

This project was built with a modern frontend stack focused on performance, modularity, and high-fidelity interactions:

- **Framework:** [React 18](https://react.dev/) built with [Vite](https://vitejs.dev/) for rapid development.
- **Animations:** [Framer Motion](https://www.framer.com/motion/) for fluid, staggered, and scroll-triggered animations.
- **Smooth Scrolling:** [Lenis](https://lenis.studiofreight.com/) for a native-feeling, buttery smooth scroll experience.
- **Data Visualization:** [Recharts](https://recharts.org/) for highly customized, responsive SVG charts (Radar, Area, Bar).
- **WebGL Backgrounds:** [OGL](https://github.com/oframe/ogl) used for the custom, performant `GradientBlinds` background texture.
- **Styling:** Vanilla CSS with custom CSS variables and modern properties (e.g., `backdrop-filter` for glassmorphism).

## Features & Highlights

- **Editorial UI/UX:** A bespoke design system inspired by high-end print magazines featuring elegant typography (Playfair Display & DM Sans/Mono).
- **Dynamic WebGL Background:** A custom WebGL shader (`GradientBlinds`) creating a subtle, animated off-white texture that responds organically without distracting from the content.
- **Glassmorphism:** HMW cards and UI elements utilize frosted-glass aesthetics with `backdrop-filter` to let background textures bleed through.
- **Floating Phase Navbar:** An intelligent, pill-shaped navigation system that tracks scroll progress and updates active phases dynamically.
- **Gradual Fade Transitions:** Custom CSS mask implementations (`GradualBlur`) ensuring smooth transitions between content and footers without harsh gradient lines.

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd unhoused
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Data Architecture

The entire content of the site is managed via a centralized JSON configuration (`src/data/housing-data.json`). This allows the design thinking content, statistics, and chart data to be decoupled from the React components, making future updates seamless.

## Design System

**Primary Colors:**
- `Sage Lighter`: `#C2C094`
- `Sage`: `#A9A587`
- `Amethyst (Dark Purple)`: `#390040`
- `Purple`: `#730071`
- `Rose`: `#DC9596`
- `Off-White`: `#F5F3EE`

**Typography:**
- Headers: *Playfair Display*
- Body: *DM Sans*
- Microcopy & Tags: *DM Mono*

---
*Built as a showcase for advanced front-end development, UX engineering, and structured design-thinking methodologies.*
