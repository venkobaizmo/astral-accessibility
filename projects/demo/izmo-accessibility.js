// Izmo Accessibility Widget Pixel Wrapper
(function() {
  // 1. Default minimal features if enabledFeatures is empty or missing
  var defaultFeatures = [
    // WCAG 2.1 Core Navigation Features
    "Skip Links", "Keyboard Navigation",
    // "Focus Enhancement",
    
    // WCAG 2.1 Visual Features
    "Contrast", "Color Blind Support", "Saturation", "Invert", "Hide Images", "Luminosity", "Grayscale",
    
    // WCAG 2.1 Text and Reading Features
    "Screen Reader", "Bigger Text", "Text Spacing", "Line Height", "Text Align", "Dyslexia Friendly", "Cursor", "Highlight Links", "Readable Font",
    // "Text Magnifier",
    
    // WCAG 2.1 Motion Features
    "Reduced Motion", "Screen Mask", "Pause Animations",
    
    // Additional Navigation Features
    //"Reading Line",
     "Highlight Titles", "Highlight All", "Mute Sounds"
  ];

  function ensureFeatures(config) {
    if (!Array.isArray(config.enabledFeatures) || config.enabledFeatures.length === 0) {
      config.enabledFeatures = defaultFeatures;
    }
  }

  // 2. Get script src to determine main.js path
  var currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
  var basePath = currentScript.src.substring(0, currentScript.src.lastIndexOf('/') + 1);
  var mainJsPath = basePath + 'main.js';

  // 3. Load main.js and initialize widget
  function loadWidget() {
    // Add mount div if not present (now inside DOMContentLoaded)
    var mountId = 'widget-mount';
    if (!document.getElementById(mountId)) {
      var mountDiv = document.createElement('div');
      mountDiv.id = mountId;
      document.body.appendChild(mountDiv);
    }

    var config = window.izmoWidgetConfig || {};
    ensureFeatures(config);
    window.izmoWidgetConfig = config;
    if (typeof initializeIzmo === 'function') {
      initializeIzmo(window.izmoWidgetConfig);
    } else {
      var script = document.createElement('script');
      script.src = mainJsPath;
      script.onload = function() {
        if (typeof initializeIzmo === 'function') {
          initializeIzmo(window.izmoWidgetConfig);
        } else {
          console.warn('Izmo Accessibility Widget not loaded');
        }
      };
      document.head.appendChild(script);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWidget);
  } else {
    loadWidget();
  }
})(); 