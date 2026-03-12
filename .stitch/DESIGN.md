# Design System: MANAGYM Ecosystem
**Project ID:** LOCAL_BASE_V1

## 1. Visual Theme & Atmosphere
The current theme is a "Hi-Tech Neon Dark Mode." It leans heavily on glassmorphism (transparency + blur) and vibrant accent colors to create an energetic, modern atmosphere suitable for a gym.

## 2. Color Palette & Roles
* **Deep Space Navy (#0a0e17):** Primary background for both applications.
* **Neon Green (#00ff88):** Primary accent for health, success, and active states.
* **Neon Blue (#00d2ff):** Secondary accent for information and secondary actions.
* **Neon Orange (#ff5e00):** Warning/Highlight color for Personal Training and alerts.
* **Glass White (rgba(255, 255, 255, 0.04)):** Surface color for cards and panels.
* **Border White (rgba(255, 255, 255, 0.08)):** Subtle border for structure.

## 3. Typography Rules
* **Font Family:** 'Inter', sans-serif.
* **Headers:** Semibold/Bold weight (600-700), tight letter-spacing.
* **Body:** Regular weight (400), readable line-height (1.5).

## 4. Component Stylings
* **Buttons:** 
    * Back Office: Generously rounded (var(--radius-md) = 12px), background based on role.
    * Member App: Pill-shaped icons or subtly rounded squares (10px).
* **Cards/Containers:** 
    * Back Office: Large rounded corners (20px), glassmorphism background (blur 16px).
    * Member App: Soft rounded corners (16px), subtle border and low opacity background.
* **Inputs/Forms:** 
    * Dark translucent background with subtle borders that light up on focus.

## 5. Layout Principles
Both apps follow a structured grid system:
* **Back Office:** Fixed sidebar navigation (260px) + fluid main content area.
* **Member App:** Mobile-first, single-column vertical stack with a fixed bottom navigation bar.
