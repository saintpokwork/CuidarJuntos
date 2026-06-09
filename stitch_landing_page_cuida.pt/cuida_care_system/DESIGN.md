---
name: Cuida Care System
colors:
  surface: '#f5faff'
  surface-dim: '#cddce7'
  surface-bright: '#f5faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e9f5ff'
  surface-container: '#e1f0fb'
  surface-container-high: '#dbeaf5'
  surface-container-highest: '#d6e5ef'
  on-surface: '#0f1d25'
  on-surface-variant: '#414752'
  inverse-surface: '#24323a'
  inverse-on-surface: '#e4f3fe'
  outline: '#717783'
  outline-variant: '#c1c6d4'
  surface-tint: '#005faf'
  primary: '#005dac'
  on-primary: '#ffffff'
  primary-container: '#1976d2'
  on-primary-container: '#fffdff'
  inverse-primary: '#a5c8ff'
  secondary: '#286b33'
  on-secondary: '#ffffff'
  secondary-container: '#abf4ac'
  on-secondary-container: '#2e7238'
  tertiary: '#615c51'
  on-tertiary: '#ffffff'
  tertiary-container: '#7a7569'
  on-tertiary-container: '#fffdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#a5c8ff'
  on-primary-fixed: '#001c3a'
  on-primary-fixed-variant: '#004786'
  secondary-fixed: '#abf4ac'
  secondary-fixed-dim: '#90d792'
  on-secondary-fixed: '#002107'
  on-secondary-fixed-variant: '#07521d'
  tertiary-fixed: '#e9e2d3'
  tertiary-fixed-dim: '#cdc6b8'
  on-tertiary-fixed: '#1e1b13'
  on-tertiary-fixed-variant: '#4b463c'
  background: '#f5faff'
  on-background: '#0f1d25'
  surface-variant: '#d6e5ef'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-mobile: 1.25rem
  container-padding-desktop: 2.5rem
  gutter: 1.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The design system is anchored in the concept of "The Supportive Hearth"—a digital space that feels as safe and organized as a well-kept home. The brand personality is human-centric, reliable, and optimistic, specifically designed to reduce the cognitive load of family caregivers.

The visual style is **Modern/Lifestyle**, blending the efficiency of professional SaaS with the warmth of a consumer wellness app. It avoids "clinical" coldness by utilizing high-quality whitespace, organic shapes, and a palette that evokes comfort. The emotional goal is to move the user from a state of overwhelm to a state of calm control.

## Colors

The palette is designed to be soothing yet functional. 

*   **Primary Blue (#1976D2):** Used for core actions, navigation, and brand presence. It represents trust and stability.
*   **Muted Green (#81C784):** Reserved for growth-oriented or positive states, such as completed tasks, health logs, or "all clear" statuses.
*   **Warm Beige (#FDF5E6):** Used as a secondary surface color to break the starkness of pure white, adding a "paper-like" warmth to dashboard sections.
*   **Soft Blue (#E3F2FD):** The primary background tint for containers and subtle UI separators, ensuring the interface feels light and airy.
*   **Text Main:** A deep indigo-tinted navy is used instead of pure black to maintain softness while ensuring AAA accessibility.

## Typography

This design system utilizes **Plus Jakarta Sans** for its friendly, modern, and highly legible characteristics. The typography strategy prioritizes readability for users who may be multi-tasking or under stress.

Headlines use a tighter letter-spacing and heavier weights to feel grounded. Body text is set with generous line heights (1.5x minimum) to ensure long-form notes about care plans are easy to scan. Large "Display" sizes are encouraged for primary dashboard greetings to create a welcoming, human atmosphere.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop (centered 1200px max-width) and a **Fluid Grid** for mobile. 

A 12-column grid is used for desktop dashboards, while mobile uses a single-column stack with 20px (1.25rem) side margins. The spacing rhythm is based on an 8px scale. To maintain the "Calm" aesthetic, vertical spacing between sections (stacks) should be generous—favoring `stack-lg` for top-level content blocks to prevent a cluttered, "busy" feeling.

## Elevation & Depth

Depth in this design system is achieved through **Tonal Layers** combined with **Ambient Shadows**. 

1.  **Level 0 (Background):** Pure white or Soft Blue (#E3F2FD).
2.  **Level 1 (Cards/Surface):** White cards with a very soft, diffused shadow (Blur: 24px, Y: 8px, Color: Primary Blue at 4% opacity).
3.  **Level 2 (Floating/Interactions):** Used for active elements or modals. Shadows become slightly more pronounced (Blur: 32px, Y: 12px, Color: Primary Blue at 8% opacity).

Avoid hard borders; use subtle shifts in background color (e.g., a Warm Beige section within a Soft Blue page) to define areas without creating visual "noise."

## Shapes

The shape language is defined by **High Circularity**. This softens the interface and removes the "institutional" feel.

*   **Standard Components:** Buttons and Input fields use a 12px radius.
*   **Container Cards:** Use a 16px radius for smaller cards and a 24px radius for main dashboard modules.
*   **Selection Elements:** Chips and badges use a fully "Pill" shape (999px) to contrast against the more structured rectangular cards.

## Components

### Buttons
Buttons are prominently rounded and use large internal padding (16px 32px for Primary). The Primary button uses a subtle gradient of the brand blue to add "squishiness" and tactile appeal. Secondary buttons should use the Soft Blue background with Primary Blue text—no border.

### Cards
The workhorse of the system. Every care task, family member, or event is housed in a card with a 24px radius. Cards should use `headline-md` for titles and include illustrative icons in the top right to help with visual categorization.

### Input Fields
Inputs are large (minimum 48px height) with a 12px radius. Use the Warm Beige (#FDF5E6) as a focus state background to make the act of "filling out forms" feel less like a chore and more like writing in a journal.

### Illustrative Icons
Icons should be "Duo-tone" or "Hand-drawn style," utilizing the Muted Green and Primary Blue. They should not be overly abstract; they must clearly represent "Family," "Medicine," "Food," or "Home."

### Family Chips
Specific components for family members should include a circular avatar and a label. These are used for filtering the dashboard or assigning tasks.