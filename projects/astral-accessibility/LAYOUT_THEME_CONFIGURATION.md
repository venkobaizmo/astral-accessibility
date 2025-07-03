# Izmo Accessibility Widget - Layout & Theme Configuration

## 🎨 Overview

The Izmo Accessibility Widget now supports configurable layouts and custom themes, allowing you to customize the appearance and layout to match your website's design and user needs.

## 🏗️ Layout Configuration

### Available Layout Options

1. **1-Column Layout** (`'1-column'`)
   - Traditional single column layout
   - Perfect for mobile devices and compact displays
   - Widget width: 400px

2. **2-Column Layout** (`'2-column'`)
   - Two column grid layout
   - Optimal for medium screen sizes
   - Widget width: 600px
   - Automatically falls back to 1-column on mobile

3. **3-Column Layout** (`'3-column'`)
   - Three column grid layout
   - Great for wide screens and desktops
   - Widget width: 800px
   - Responsive breakpoints: 2-column on tablet, 1-column on mobile

4. **Responsive Layout** (`'responsive'`) - **Default**
   - Adaptive grid layout that adjusts based on screen size
   - Widget width: clamp(400px, 50vw, 800px)
   - Automatically adjusts columns based on available space

### Layout Configuration Example

```javascript
initializeIzmo({
  layout: '2-column',
  locale: 'en-US',
  widgetHeight: '75vh',
  enabledFeatures: [
    "Skip Links",
    "Focus Enhancement", 
    "Contrast",
    "Color Blind Support",
    "Screen Reader",
    "Bigger Text"
  ]
});
```

## 🎨 Theme Configuration

### Theme Properties

You can customize the following theme properties:

```typescript
interface IzmoTheme {
  modalBackgroundColor?: string;        // Main widget background
  modalBorderColor?: string;            // Widget border color
  actionTextColor?: string;             // Text color for buttons
  actionActiveTextColor?: string;       // Text color for active buttons
  actionDisabledTextColor?: string;     // Text color for disabled buttons
  actionBackgroundColor?: string;       // Background color for buttons
  actionActiveBackgroundColor?: string; // Background color for active buttons
  actionDisabledBackgroundColor?: string; // Background color for disabled buttons
  actionIconActiveBackgroundColor?: string;   // Active icon background
  actionIconInactiveBackgroundColor?: string; // Inactive icon background
  actionIconDisabledBackgroundColor?: string; // Disabled icon background
}
```

### Pre-built Theme Examples

#### Dark Theme
```javascript
initializeIzmo({
  theme: {
    modalBackgroundColor: '#2c3e50',
    actionBackgroundColor: '#34495e',
    actionActiveBackgroundColor: '#e74c3c',
    actionIconActiveBackgroundColor: '#c0392b'
  }
});
```

#### Ocean Blue Theme
```javascript
initializeIzmo({
  theme: {
    modalBackgroundColor: '#1e3a8a',
    actionBackgroundColor: '#3b82f6',
    actionActiveBackgroundColor: '#06b6d4',
    actionIconActiveBackgroundColor: '#0891b2'
  }
});
```

#### High Contrast Theme
```javascript
initializeIzmo({
  theme: {
    modalBackgroundColor: '#000000',
    actionBackgroundColor: '#333333',
    actionActiveBackgroundColor: '#ffff00',
    actionIconActiveBackgroundColor: '#ffff00',
    actionTextColor: '#ffffff',
    actionActiveTextColor: '#000000'
  }
});
```

## 🔧 Complete Configuration Example

```javascript
// Full configuration with layout, theme, and other options
initializeIzmo({
  // Layout configuration
  layout: 'responsive',
  
  // Theme customization
  theme: {
    modalBackgroundColor: '#2c3e50',
    actionBackgroundColor: '#34495e',
    actionActiveBackgroundColor: '#3498db',
    actionIconActiveBackgroundColor: '#2980b9',
    actionTextColor: '#ffffff',
    actionActiveTextColor: '#ffffff'
  },
  
  // Widget settings
  widgetHeight: '80vh',
  locale: 'en-US',
  
  // Enabled features
  enabledFeatures: [
    "Skip Links",
    "Keyboard Navigation", 
    "Focus Enhancement",
    "Contrast",
    "Color Blind Support",
    "Saturation",
    "Screen Reader",
    "Bigger Text",
    "Text Spacing",
    "Line Height",
    "Reduced Motion",
    "Dyslexia Friendly",
    "Highlight Links",
    "Alt Text Validator",
    "Page Structure",
    "Form Enhancement"
  ]
});
```

## 📱 Responsive Behavior

### Mobile Optimization
- All layouts automatically collapse to single column on mobile devices (< 768px width)
- Widget width adjusts to 90vw for better mobile viewing
- Touch-friendly button sizing maintained across all layouts

### Tablet Behavior
- 3-column layout becomes 2-column on tablets (< 1024px width)
- 2-column and responsive layouts remain unchanged
- Optimal spacing and sizing for touch interaction

## 🎯 Use Cases

### Corporate Websites
```javascript
// Professional, branded appearance
initializeIzmo({
  layout: '2-column',
  theme: {
    modalBackgroundColor: '#1a365d',
    actionActiveBackgroundColor: '#3182ce'
  }
});
```

### Educational Sites
```javascript
// High contrast for better readability
initializeIzmo({
  layout: '1-column',
  theme: {
    modalBackgroundColor: '#000000',
    actionActiveBackgroundColor: '#ffff00',
    actionTextColor: '#ffffff',
    actionActiveTextColor: '#000000'
  }
});
```

### E-commerce Platforms
```javascript
// Modern, responsive design
initializeIzmo({
  layout: 'responsive',
  theme: {
    modalBackgroundColor: '#1f2937',
    actionActiveBackgroundColor: '#10b981'
  }
});
```

## 🧪 Testing Your Configuration

1. **Visual Testing**: Use the layout-theme-demo.html file to test different configurations
2. **Accessibility Testing**: Ensure your color choices meet WCAG contrast requirements
3. **Responsive Testing**: Test on different screen sizes to verify layout behavior
4. **User Testing**: Get feedback from users with disabilities

## 🔧 Default Values

If no configuration is provided, the widget uses these defaults:

```javascript
{
  layout: 'responsive',
  theme: {}, // Uses built-in default colors
  widgetHeight: '75vh',
  locale: navigator.language || 'en-US'
}
```

## 🎨 Color Accessibility Guidelines

When customizing themes, ensure:

1. **Contrast Ratios**: Meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
2. **Color Blindness**: Test with color blind simulators
3. **Focus Indicators**: Maintain clear focus indication for keyboard navigation
4. **Brand Consistency**: Match your website's color scheme while maintaining accessibility

## 🚀 Migration from Previous Versions

If upgrading from an older version:

1. **No Breaking Changes**: Existing code will continue to work
2. **Optional Features**: Layout and theme are optional configurations
3. **Backward Compatibility**: All previous configuration options remain supported

## 📊 Browser Support

- **Modern Browsers**: Full support for all layout and theme features
- **Internet Explorer**: Basic functionality with graceful degradation
- **Mobile Browsers**: Optimized responsive behavior

## 🐛 Troubleshooting

### Common Issues

1. **Layout Not Applying**: Check that layout value is one of: '1-column', '2-column', '3-column', 'responsive'
2. **Colors Not Showing**: Ensure hex color codes are properly formatted (e.g., '#ffffff')
3. **Mobile Layout Issues**: Check CSS media query conflicts in your existing stylesheets

### Debug Mode

Enable debug logging to troubleshoot configuration issues:

```javascript
initializeIzmo({
  layout: '2-column',
  debug: true // Enables console logging
});
```

## 📞 Support

For questions or issues with layout and theme configuration:

1. Check the demo file: `projects/demo/layout-theme-demo.html`
2. Review this documentation
3. Test with default configuration first
4. Submit issues with specific configuration examples 