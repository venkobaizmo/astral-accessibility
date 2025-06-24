# Astral Accessibility Widget - Internationalization (i18n) Guide

## Overview

The Astral Accessibility Widget now supports internationalization (i18n) with multiple languages. The widget automatically detects the user's browser language and displays all text content in the appropriate language.

## Supported Languages

- **English (en-US)** - Default language
- **Spanish (es)** - Español
- **French (fr)** - Français  
- **German (de)** - Deutsch

## Features Translated

All user-facing text is translated, including:

### Widget Interface
- Widget panel titles and labels
- Accessibility tool names
- Button labels and tooltips
- ARIA labels for screen readers

### Accessibility Features
- **Contrast Controls**: Invert, High Contrast, Dark High Contrast
- **Text Size**: Medium Text, Large Text, Extra Large Text
- **Screen Reader**: Speed options (Normal, Fast, Slow)
- **Text Spacing**: Light, Moderate, Heavy spacing
- **Screen Mask**: Cursor size options (Small, Medium, Large)
- **Color Blind Support**: Condition names and announcements
- **Skip Links**: Navigation link text

### Screen Reader Announcements
- Status change announcements
- Feature activation/deactivation messages
- Error and success messages

## Usage

### Basic Implementation

```html
<script>
  // Initialize with default browser language
  initializeAstral();
</script>
```

### Specify Language

```html
<script>
  // Initialize with specific language
  initializeAstral({
    locale: 'es', // Spanish
    enabledFeatures: [
      "Contrast",
      "Bigger Text", 
      "Screen Reader",
      "Text Spacing"
    ]
  });
</script>
```

### Dynamic Language Switching

```javascript
// Remove existing widget
const existing = document.querySelector('astral-accessibility');
if (existing) {
  existing.remove();
}

// Reinitialize with new language
initializeAstral({
  locale: 'fr', // French
  enabledFeatures: [
    "Skip Links",
    "Color Blind Support",
    "Contrast",
    "Screen Reader"
  ]
});
```

## Supported Locale Codes

| Language | Locale Code | Notes |
|----------|-------------|--------|
| English (US) | `en-US` | Default fallback language |
| Spanish | `es` | European and Latin American Spanish |
| French | `fr` | European French |
| German | `de` | German |

## Language Detection

The widget automatically detects the user's language preference using:

1. **Explicit locale setting** - If provided in initialization options
2. **Browser language** - `navigator.language` 
3. **Language fallback** - If browser language has partial match (e.g., 'en-GB' → 'en-US')
4. **Default fallback** - English (en-US) if no match found

## Adding New Languages

To add support for additional languages:

1. **Update I18nService**: Add translations to the `translations` object in `i18n.service.ts`

```typescript
'pt': { // Portuguese
  'accessibility-tools': 'Ferramentas de acessibilidade',
  'contrast': 'Contraste',
  'bigger-text': 'Texto Maior',
  // ... add all translation keys
}
```

2. **Complete Translation**: Ensure all translation keys are provided for the new language

3. **Test Implementation**: Use the i18n demo page to verify translations

## Translation Keys Reference

### Main Interface
- `accessibility-tools`
- `open-accessibility-panel`
- `close-accessibility-panel`
- `accessibility-options-panel`
- `accessibility-features`

### Contrast Feature
- `contrast`
- `invert`
- `high-contrast`
- `dark-high-contrast`

### Text Size Feature
- `bigger-text`
- `medium-text`
- `large-text`
- `extra-large-text`

### Screen Reader Feature
- `screen-reader`
- `normal-speed`
- `fast-speed`
- `slow-speed`

### Color Blind Support
- `color-blind-support`
- `enable-color-blind-support`
- `color-blind-support-active`
- `protanopia`
- `deuteranopia`
- `tritanopia`

### Skip Links
- `skip-to-main-content`
- `skip-to-navigation`
- `skip-to-search`
- `skip-to-footer`

## Demo Pages

### Internationalization Demo
Visit `i18n-demo.html` to see the widget in action with:
- Language selector dropdown
- Real-time language switching
- Complete feature showcase in multiple languages

## Technical Implementation

### I18nService
The `I18nService` provides centralized translation management with:
- Automatic language detection
- Fallback mechanism
- Real-time language switching
- Type-safe translation keys

### Component Integration
Each accessibility component integrates with the i18n service:

```typescript
constructor(private i18n: I18nService) {}

getButtonLabel(): string {
  return this.i18n.getTranslation('button-label-key');
}
```

### Accessibility Compliance
- All ARIA labels are translated
- Screen reader announcements respect language settings
- Text direction and formatting follow language conventions

## Best Practices

1. **Language Consistency**: Ensure the page language and widget language match
2. **Testing**: Test all features in each supported language
3. **Fallbacks**: Always provide English fallbacks for new features
4. **Cultural Sensitivity**: Consider cultural contexts when translating
5. **Performance**: Translations are loaded efficiently without impacting performance

## Troubleshooting

### Widget Not Translating
- Check if the locale code is supported
- Verify the locale is being passed correctly to `initializeAstral()`
- Check browser console for any errors

### Missing Translations
- Ensure all translation keys are present in the target language
- Check for typos in translation keys
- Verify the I18nService is properly injected

### Browser Compatibility
- The widget supports all modern browsers
- Language detection works in all supported browsers
- Fallback mechanisms ensure functionality even if language detection fails
