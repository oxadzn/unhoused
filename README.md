# Unhoused: Hyderabad Housing Crisis Design Project

An editorial-style, scroll-driven interactive web experience documenting a comprehensive Design Thinking process applied to the housing crisis in Hyderabad, India.

## Overview

This project translates a complex 7-phase design thinking methodology into a highly visual, data-rich digital narrative. By blending modern web design aesthetics with robust interactive tools, fluid animations, and immersive data visualization, this single-page application (SPA) brings ethnographic research, root-cause analysis, and proposed solutions to life.

### The Interactive Journey:
1. **The Financial Reality:** Emotional income and expense breakdowns for three distinct personas.
2. **Affordability Calculator:** A live, interactive tool letting users estimate safe rent budgets against actual neighborhood median rents in Hyderabad.
3. **Research & Journey Maps:** Core ethnographic metrics and detailed emotional journey tracking with "Day in the Life" interactive accordions.
4. **Root Cause Analysis (5 Whys):** Uncovering systemic issues causing housing distress.
5. **EMI Stress Estimator:** An interactive simulator testing loan resilience against sudden income drops.
6. **How Might We (HMW):** Reframing pain points into actionable design questions with hover-expand root-cause linkages.
7. **Ideation & Synthesis:** Structured 6-3-5 brainwriting and Triple-T evaluation across Desirability, Feasibility, and Viability to identify "Top Ideas."

## Tech Stack

This project was built with a modern frontend stack focused on performance, modularity, and high-fidelity interactions:

- **Framework:** [React 18](https://react.dev/) built with [Vite](https://vitejs.dev/) for rapid development.
- **Animations:** [Framer Motion](https://www.framer.com/motion/) and custom CSS keyframes for fluid, staggered, and ambient motion.
- **Smooth Scrolling:** [Lenis](https://lenis.studiofreight.com/) for a native-feeling, buttery smooth scroll experience.
- **Data Visualization:** [Recharts](https://recharts.org/) for highly customized, responsive SVG charts (Radar, Area, Bar).
- **WebGL Backgrounds:** [OGL](https://github.com/oframe/ogl) used for the custom, performant `GradientBlinds` background texture.
- **Styling:** Vanilla CSS with custom CSS variables, modern properties (`backdrop-filter`), and mobile-first responsive design.

## Features & Highlights

- **Interactive Product Tools:** Integrated Affordability Calculator and EMI Risk Estimator transform static data into personalized, exploratory tools.
- **Ambient Motion Design:** GPU-accelerated canvas particles, drifting blurred orbs, and subtle scan-line animations create a dynamic, "alive" feel that fully respects `prefers-reduced-motion`.
- **Editorial UI/UX:** A bespoke design system inspired by high-end print magazines featuring elegant typography (Playfair Display & DM Sans/Mono).
- **Glassmorphism:** Cards and UI elements utilize frosted-glass aesthetics with `backdrop-filter` to let background textures bleed through.
- **Floating Phase Navbar:** An intelligent, pill-shaped navigation system that tracks scroll progress and updates active phases dynamically.

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

The core textual content and structural configuration of the site is managed via centralized JSON configurations (`src/data/housing-data.json`). This allows the design thinking content to be cleanly separated from the React components.

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
