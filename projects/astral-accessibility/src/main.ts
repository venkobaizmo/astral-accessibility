import { DOCUMENT } from "@angular/common";
import { createCustomElement } from "@angular/elements";
import { createApplication } from "@angular/platform-browser";
import { IzmoAccessibilityComponent } from "./lib/izmo-accessibility.component";
import "zone.js";

export interface IzmoConfiguration {
  enabledFeatures?: string[];
  widgetHeight?: string;
  locale?: string;
  layout?: '1-column' | '2-column' | '3-column' | 'responsive';
  theme?: {
    modalBackgroundColor?: string;
    modalBorderColor?: string;
    actionTextColor?: string;
    actionActiveTextColor?: string;
    actionDisabledTextColor?: string;
    actionBackgroundColor?: string;
    actionActiveBackgroundColor?: string;
    actionDisabledBackgroundColor?: string;
    actionIconActiveBackgroundColor?: string;
    actionIconInactiveBackgroundColor?: string;
    actionIconDisabledBackgroundColor?: string;
  };
}

(window as any).initializeIzmo = async function initializeIzmo(
  features?: IzmoConfiguration,
) {
  try {
    console.log('initializeIzmo called with features:', features);

    // When no options are given by default all widgets are allowed
    if (!features) {
      features = {
        enabledFeatures: [
          // WCAG 2.1 Core Navigation Features
          "Skip Links",
          "Keyboard Navigation", 
          "Focus Enhancement",
          
          // WCAG 2.1 Visual Features
          "Contrast",
          "Color Blind Support",
          "Saturation",
          "Invert",
          "Hide Images",
          "Luminosity",
          "Grayscale",
          "Reading Line",
          "Highlight Titles",
          "Highlight All",
          "Mute Sounds",
          
          // WCAG 2.1 Text and Reading Features
          "Screen Reader",
          "Bigger Text",
          "Text Spacing",
          "Line Height",
          "Text Align",
          "Dyslexia Friendly",
          "Cursor",
          "Highlight Links",
          "Readable Font",
          "Text Magnifier",
          
          // WCAG 2.1 Motion Features
          "Reduced Motion",
          "Screen Mask",
          "Pause Animations"
        ],
        // Default widget height to 75% of screen height
        widgetHeight: "75vh",
        // Default language is browser locale or English
        locale: navigator.language || 'en-US',
        // Default layout is responsive
        layout: 'responsive',
        // Default theme uses built-in colors
        theme: {}
      };
    }

    // Set default values for missing configuration
    features.locale ??= navigator.language || 'en-US';
    features.layout ??= 'responsive';
    features.theme ??= {};

    const app = await createApplication();
    const widget = createCustomElement(IzmoAccessibilityComponent, {
      injector: app.injector,
    });
    
    // Check if custom element is already defined
    const elementName = "izmo-accessibility";
    if (!customElements.get(elementName)) {
      customElements.define(elementName, widget);
    }

    const doc = app.injector.get(DOCUMENT);
    
    // Remove existing izmo accessibility element if it exists
    const existingElement = doc.querySelector(elementName);
    if (existingElement) {
      existingElement.remove();
    }
    
    // Create and append new element
    const izmoAccessibilityElement = doc.createElement(elementName);
    izmoAccessibilityElement.setAttribute(
      "izmo-features",
      JSON.stringify(features),
    );

    doc.body.appendChild(izmoAccessibilityElement);
    
    console.log('Izmo Accessibility widget initialized successfully with configuration:', {
      locale: features.locale,
      layout: features.layout,
      widgetHeight: features.widgetHeight,
      hasCustomTheme: Object.keys(features.theme || {}).length > 0
    });
  } catch (err) {
    console.error('Error initializing Izmo Accessibility widget:', err);
  }
};
