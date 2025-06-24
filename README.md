# Astral Accessibility: Open Source Accessibility Widget

![Astral Accessibility](docs/astral.png)

# Astral is in alpha

Astral is currently in an alpha phase. You can use it today with much of its feature set implemented, but it's a few features shy, along with some general polishing away from a 1.x release.

# Overview

Astral Accessibility is an open source accessibility widget that can be easily embedded to any website. It provides a set of
accessibility features that can be used by people with accessibility needs to improve their experience on the web. Read why we
started this project [here](https://blue.verto.health/advancing-accessibility-with-astral/).

[Click here](https://astral-accessibility.pages.dev/) for a demo!

## Features

### 🎯 Core Accessibility Features
- 🌍 **Internationalization (i18n)** - Multi-language support (English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Russian, Portuguese, Italian)
- 🔊 **Screen Reader** - Text-to-speech functionality with ARIA live announcements
- 🎨 **Contrast Control** - Visual contrast adjustments and color enhancement
- 🔗 **Highlight Links** - Enhanced link visibility and identification
- 📏 **Text Size** - Font size scaling options (up to 200%)
- 📝 **Text Spacing** - Letter and word spacing adjustments
- 📐 **Line Height** - Line spacing adjustments for improved readability

### 🆕 WCAG 2.1 Level A/AA Compliance Features
- 🖼️ **Alt Text Validator** - Identifies and suggests fixes for missing image alt text
- 📝 **Page Title Validator** - Ensures pages have descriptive, meaningful titles
- 🌐 **Language Validator** - Validates HTML language attributes and multi-language content
- 🔄 **Auto-refresh Controls** - Manages and controls automatic page refreshes and timers
- 🎯 **Focus Trap Management** - Creates accessible focus containment for modals and dialogs
- 📱 **Touch Target Validator** - Validates minimum 44x44px touch target sizes for mobile
- 📖 **Reading Order Validator** - Checks logical heading hierarchy and page structure
- ⚠️ **Error Identification** - Identifies form validation and accessibility errors with suggestions

### 🛠️ Additional Features
- 🎭 **Screen Mask** - Focus enhancement tool that dims background content
- 🏃 **Reduced Motion** - Animation controls for motion sensitivity
- ⚡ **Enhanced Keyboard Navigation** - Advanced keyboard shortcuts and navigation help (F1)
- More features in development!

| Key                          | Capability                                                                                                                                                                                                                                                                                                 |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Screen Reader`              | Screen reader is a tool that reads out text on screen where user clicks. For any HTML elements, if an aria label is available, the content from aria label would be read out loud, otherwise, it reads the text content of the element. There are 3 different speeds: normal, fast and slow. |
| `Contrast`                   | Contrast is a tool that removes background and replaces it with black or white to increase the difference in colours between text and the background to increase legibility. There are 3 modes: invert colours, high contrast, and dark high contrast.                                                 |
| `Highlight Links`            | Highlight Links enhances the visibility of all links on the page by adding distinctive styling, making them easier to identify and navigate for users with visual impairments.                                                                                                                           |
| `Bigger Text`                | Bigger Text is a tool that increases the size of text on screen up to 200% for improved readability.                                                                                                                                                                                                      |
| `Text Spacing`               | Text Spacing is a tool that increases the spacing between characters and words on the screen to increase legibility and readability.                                                                                                                                                                      |
| `Line Height`                | Line Height is a tool that increases the space between lines for greater readability and reduces visual clutter.                                                                                                                                                                                          |
| `Screen Mask`                | Screen Mask is a tool that dims the background and has a smaller focused area which follows the cursor, helping users focus on specific content.                                                                                                                                                         |
| `Alt Text Validator`         | Validates that all images have appropriate alternative text for screen readers. Identifies missing, empty, or inadequate alt text and provides contextual suggestions for improvement.                                                                                                                   |
| `Page Title Validator`       | Ensures pages have descriptive, meaningful titles that help users understand page content and purpose. Critical for navigation and SEO accessibility.                                                                                                                                                    |
| `Language Validator`         | Checks that HTML language attributes are properly set for the page and individual content sections. Essential for screen readers to use correct pronunciation and language-specific features.                                                                                                            |
| `Auto-refresh Controls`      | Monitors and provides user control over automatic page refreshes, timers, and dynamic content updates. Allows users to pause, stop, or adjust timing according to their needs.                                                                                                                         |
| `Focus Trap Management`      | Creates accessible focus containment for modals, dialogs, and popups. Ensures keyboard navigation stays within the intended component and provides proper escape mechanisms.                                                                                                                             |
| `Touch Target Validator`     | Validates that interactive elements meet minimum size requirements (44x44px) for mobile accessibility. Identifies touch targets that are too small and provides improvement suggestions.                                                                                                                |
| `Reading Order Validator`    | Checks the logical structure of headings (H1-H6) and reading order. Ensures content follows a meaningful sequence and proper heading hierarchy for screen reader navigation.                                                                                                                            |
| `Error Identification`       | Identifies form validation issues, missing labels, and accessibility errors. Provides clear error descriptions and suggestions for fixing common accessibility problems.                                                                                                                                  |

## Usage

Astral is built with Angular Elements. You can use it in your website in under 30 seconds. To add it, simply include the Javascript and initialize it:

Note: By default this function all will add all available features, for enabling only certain features, see the section below on Customizing Widget.

```html
<script src="https://astral-accessibility.pages.dev/main.js"></script>
<script>
  initializeAstral();
</script>
```

## Customizing Widget

Astral-Accessibility allows you to customize the widget to your needs. This mean you can enable the features you want and hide the features you may not need.
You can choose which widgets should appear by passing an object inside of the `inititalizeAstral` function call. Inside the object include a key called `enabledFeatures` with the value of a list containing strings of which features you want enabled.

Here's an example:

```html
<script>
  initializeAstral({
    filterWidget: ["Contrast", "Bigger Text", "Screen Mask"],
  });
</script>
```

Optionally we can choose which widgets should appear by passing an object inside of function call:

```html
<script>
  initializeAstral({
    enabledFeatures: [
      // Core accessibility features
      "Screen Reader",
      "Contrast",
      "Highlight Links",
      "Bigger Text", 
      "Text Spacing",
      "Line Height",
      "Screen Mask",
      
      // WCAG 2.1 compliance features
      "Alt Text Validator",
      "Page Title Validator",
      "Language Validator", 
      "Auto-refresh Controls",
      "Focus Trap",
      "Touch Target Validator",
      "Reading Order Validator",
      "Error Identification"
    ],
  });
</script>
```

### Available Features List

**Core Features:**
- `"Screen Reader"` - Text-to-speech functionality
- `"Contrast"` - Visual contrast adjustments
- `"Highlight Links"` - Enhanced link visibility
- `"Bigger Text"` - Font size scaling
- `"Text Spacing"` - Character and word spacing
- `"Line Height"` - Line spacing adjustments
- `"Screen Mask"` - Focus enhancement tool

**WCAG 2.1 Compliance Features:**
- `"Alt Text Validator"` - Image alt text validation
- `"Page Title Validator"` - Page title validation
- `"Language Validator"` - Language attribute validation
- `"Auto-refresh Controls"` - Timer and refresh management
- `"Focus Trap"` - Modal focus management
- `"Touch Target Validator"` - Touch target size validation
- `"Reading Order Validator"` - Heading structure validation
- `"Error Identification"` - Accessibility error detection

## Internationalization (i18n)

Astral Accessibility now supports multiple languages with automatic browser language detection and dynamic language switching capabilities.

### Supported Languages

- **English (en-US)** - Default language
- **Spanish (es)** - Español
- **French (fr)** - Français 
- **German (de)** - Deutsch
- **Chinese (zh)** - 中文
- **Japanese (ja)** - 日本語
- **Korean (ko)** - 한국어
- **Arabic (ar)** - العربية
- **Russian (ru)** - Русский
- **Portuguese (pt)** - Português
- **Italian (it)** - Italiano

### Usage

The widget automatically detects your browser's language preference and displays in the appropriate language. You can also manually set the language:

```html
<script>
  initializeAstral({
    locale: 'es', // Force Spanish language
    enabledFeatures: ["Screen Reader", "Contrast", "Bigger Text"]
  });
</script>
```

### Features Translated

All user-facing text is translated including:
- Button labels and tooltips
- ARIA labels for screen readers
- Feature names and state descriptions
- Accessibility announcements
- Component status messages

### Demo

Check out the [internationalization demo](projects/demo/i18n-demo.html) to see the multi-language functionality in action.

## Development Setup

1. Clone the repository

```
git clone git@github.com:verto-health/astral-accessibility.git
```

2. Install dependencies

```
$ yarn install
```

3. Run the development server and visit `http://localhost:8000`

```bash
$ yarn run start:demo
```

This will watch for changes and automatically reload when you make changes in both Angular and the demo app under `projects/demo`.

### Running E2E Tests With Cypress

After running the steps above, you will have access to the Cypress test suite. To run Cypress locally, run the following command in your terminal

```
$ yarn cypress open
```

Choose E2E Testing, and select a browser to start running the Specs

## Contributors ✨

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
