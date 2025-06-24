import { DOCUMENT } from "@angular/common";
import { createCustomElement } from "@angular/elements";
import { createApplication } from "@angular/platform-browser";
import { AstralAccessibilityComponent } from "./lib/astral-accessibility.component";
import "zone.js";

(window as any).initializeAstral = async function initializeAstral(
  features?: Record<string, any>,
) {
  try {
    console.log('initializeAstral called with features:', features);// When no options are given by default all widgets are allowed
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
          
          // WCAG 2.1 Text and Reading Features
          "Screen Reader",
          "Bigger Text",
          "Text Spacing",
          "Line Height",
          
          // WCAG 2.1 Motion Features
          "Reduced Motion",
          "Screen Mask",
        ],
        // Default widget height to 75% of screen height
        widgetHeight: "75vh",
        // Default language is browser locale or English
        locale: navigator.language || 'en-US'
      };
    }    // Set default locale if not provided
    features['locale'] ??= navigator.language || 'en-US';    const app = await createApplication();
    const widget = createCustomElement(AstralAccessibilityComponent, {
      injector: app.injector,
    });
    
    // Check if custom element is already defined
    const elementName = "astral-accessibility";
    if (!customElements.get(elementName)) {
      customElements.define(elementName, widget);
    }

    const doc = app.injector.get(DOCUMENT);
    
    // Remove existing astral accessibility element if it exists
    const existingElement = doc.querySelector(elementName);
    if (existingElement) {
      existingElement.remove();
    }
    
    // Create and append new element
    const astralAccessibilityElement = doc.createElement(elementName);
    astralAccessibilityElement.setAttribute(
      "astral-features",
      JSON.stringify(features),
    );    doc.body.appendChild(astralAccessibilityElement);
    
    console.log('Astral Accessibility widget initialized successfully with locale:', features['locale']);
  } catch (err) {
    console.error('Error initializing Astral Accessibility widget:', err);
  }
};
