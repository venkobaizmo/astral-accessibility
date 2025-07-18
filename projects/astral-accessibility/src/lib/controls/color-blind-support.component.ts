import { Component, OnInit, Renderer2, Optional, SkipSelf } from "@angular/core";
import { NgIf, NgClass } from "@angular/common";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from "../izmo-accessibility.component";

@Component({
  selector: "izmo-color-blind-support",
  standalone: true,  template: `
    <button
      (click)="toggle()"
      [ngClass]="{ 'in-use': isActive }"
      [attr.aria-label]="getAriaLabel()"
      [attr.aria-pressed]="isActive"
    >
      <div class="title">        <div class="icon-state-wrap">
          <div class="icon action-icon" [ngClass]="{ inactive: !isActive, active: isActive }">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5Z"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
              />
              <path
                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
              />
              <path
                d="M9 9L15 15"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                *ngIf="currentMode !== 'none'"
              />
            </svg>
          </div>
          <div class="state-dots-wrap">
            <span>{{ i18n.getTranslation('color-blind-support') }}</span>
            <div class="dots" [ngClass]="{ inactive: !isActive }">
              <div class="dot" [ngClass]="{ active: currentMode === 'protanopia' }"></div>
              <div class="dot" [ngClass]="{ active: currentMode === 'deuteranopia' }"></div>
              <div class="dot" [ngClass]="{ active: currentMode === 'tritanopia' }"></div>
            </div>
          </div>
        </div>
      </div>
      <izmo-widget-checkmark [isActive]="isActive"></izmo-widget-checkmark>
    </button>
  `,
  imports: [NgIf, NgClass, IzmoCheckmarkSvgComponent],
})
export class ColorBlindSupportComponent implements OnInit {
  isActive = false;
  currentMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' = 'none';
  private styleElement?: HTMLStyleElement;

  constructor(
    private renderer: Renderer2, 
    public i18n: I18nService,
    @Optional() @SkipSelf() private parent?: IzmoAccessibilityComponent
  ) {
    if (this.parent) {
      this.parent.resetEvent.subscribe(() => this.reset());
    }
  }

  ngOnInit() {
    // Check if color blind support is already applied
    this.isActive = document.querySelector('.izmo-color-blind-styles') !== null;
  }

  toggle() {
    if (this.isActive && this.currentMode === 'tritanopia') {
      this.removeColorBlindSupport();
      this.currentMode = 'none';
      this.isActive = false;
    } else {
      this.nextMode();
    }
    this.announceChange();
  }

  private nextMode() {
    switch (this.currentMode) {
      case 'none':
        this.currentMode = 'protanopia';
        break;
      case 'protanopia':
        this.currentMode = 'deuteranopia';
        break;
      case 'deuteranopia':
        this.currentMode = 'tritanopia';
        break;
      default:
        this.currentMode = 'protanopia';
    }
    this.applyColorBlindSupport();
    this.isActive = true;
  }

  private applyColorBlindSupport() {
    this.removeColorBlindSupport();
    
    this.styleElement = this.renderer.createElement('style');
    this.renderer.addClass(this.styleElement, 'izmo-color-blind-styles');
    
    let filterCSS = '';
    let additionalCSS = '';
    
    switch (this.currentMode) {
      case 'protanopia':
        // Red-blind (missing L cones)
        filterCSS = `
          /* Apply protanopia filter to body content excluding widget */
          body > *:not(izmo-accessibility) {
            filter: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><defs><filter id='protanopia'><feColorMatrix type='matrix' values='0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0'/></filter></defs></svg>#protanopia") !important;
          }
        `;
        additionalCSS = `
          /* Enhanced patterns and textures for red-green distinction */
          body > *:not(izmo-accessibility) .error, 
          body > *:not(izmo-accessibility) .danger, 
          body > *:not(izmo-accessibility) [style*="color: red"], 
          body > *:not(izmo-accessibility) [style*="background: red"], 
          body > *:not(izmo-accessibility) [style*="background-color: red"] {
            background-image: repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px) !important;
            border: 2px solid #000 !important;
          }
          body > *:not(izmo-accessibility) .success, 
          body > *:not(izmo-accessibility) [style*="color: green"], 
          body > *:not(izmo-accessibility) [style*="background: green"], 
          body > *:not(izmo-accessibility) [style*="background-color: green"] {
            background-image: repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px) !important;
            border: 2px dashed #000 !important;
          }
        `;
        break;
      case 'deuteranopia':
        // Green-blind (missing M cones)
        filterCSS = `
          /* Apply deuteranopia filter to body content excluding widget */
          body > *:not(izmo-accessibility) {
            filter: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><defs><filter id='deuteranopia'><feColorMatrix type='matrix' values='0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0'/></filter></defs></svg>#deuteranopia") !important;
          }
        `;
        additionalCSS = `
          /* Enhanced patterns for deuteranopia */
          body > *:not(izmo-accessibility) .error, 
          body > *:not(izmo-accessibility) .danger, 
          body > *:not(izmo-accessibility) [style*="color: red"], 
          body > *:not(izmo-accessibility) [style*="background: red"], 
          body > *:not(izmo-accessibility) [style*="background-color: red"] {
            background-image: repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 6px) !important;
            border: 3px solid #000 !important;
          }
          body > *:not(izmo-accessibility) .success, 
          body > *:not(izmo-accessibility) [style*="color: green"], 
          body > *:not(izmo-accessibility) [style*="background: green"], 
          body > *:not(izmo-accessibility) [style*="background-color: green"] {
            background-image: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 6px) !important;
            border: 3px dotted #000 !important;
          }
        `;
        break;
      case 'tritanopia':
        // Blue-blind (missing S cones)
        filterCSS = `
          /* Apply tritanopia filter to body content excluding widget */
          body > *:not(izmo-accessibility) {
            filter: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><defs><filter id='tritanopia'><feColorMatrix type='matrix' values='0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0'/></filter></defs></svg>#tritanopia") !important;
          }
        `;
        additionalCSS = `
          /* Enhanced patterns for tritanopia */
          body > *:not(izmo-accessibility) .info, 
          body > *:not(izmo-accessibility) [style*="color: blue"], 
          body > *:not(izmo-accessibility) [style*="background: blue"], 
          body > *:not(izmo-accessibility) [style*="background-color: blue"] {
            background-image: repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 4px) !important;
            border: 2px solid #000 !important;
          }
          body > *:not(izmo-accessibility) .warning, 
          body > *:not(izmo-accessibility) [style*="color: yellow"], 
          body > *:not(izmo-accessibility) [style*="background: yellow"], 
          body > *:not(izmo-accessibility) [style*="background-color: yellow"] {
            background-image: repeating-linear-gradient(-135deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px) !important;
            border: 2px double #000 !important;
          }
        `;
        break;
    }

    const fullCSS = `
      /* Izmo Color Blind Support - ${this.currentMode} */
      ${filterCSS}
      
      ${additionalCSS}
      
      /* General improvements for color accessibility */
      body > *:not(izmo-accessibility) a:not([href]) {
        text-decoration: underline !important;
      }
      
      /* Add symbols to common UI elements */
      body > *:not(izmo-accessibility) .required::after, 
      body > *:not(izmo-accessibility) [required]::after {
        content: " *" !important;
        color: #000 !important;
        font-weight: bold !important;
      }
      
      /* Pattern overlays for charts and graphs */
      body > *:not(izmo-accessibility) .chart, 
      body > *:not(izmo-accessibility) .graph, 
      body > *:not(izmo-accessibility) .progress {
        position: relative !important;
      }
      
      /* High contrast borders for better separation */
      body > *:not(izmo-accessibility) button, 
      body > *:not(izmo-accessibility) input, 
      body > *:not(izmo-accessibility) select, 
      body > *:not(izmo-accessibility) textarea {
        border: 2px solid #000 !important;
      }
      
      /* Enhanced focus indicators */
      body > *:not(izmo-accessibility) *:focus {
        outline: 3px solid #000 !important;
        outline-offset: 2px !important;
      }
    `;
    
    this.renderer.setProperty(this.styleElement, 'textContent', fullCSS);
    this.renderer.appendChild(document.head, this.styleElement);
  }

  private removeColorBlindSupport() {
    if (this.styleElement) {
      this.renderer.removeChild(document.head, this.styleElement);
      this.styleElement = undefined;
    }
  }

  getAriaLabel(): string {
    if (!this.isActive) {
      return this.i18n.getTranslation('enable-color-blind-support');
    }
    return `${this.i18n.getTranslation('color-blind-support-active')}: ${this.currentMode}. Click to change mode.`;
  }

  private announceChange() {
    let message = '';
    if (!this.isActive) {
      message = this.i18n.getTranslation('color-blind-support-disabled');
    } else {
      switch (this.currentMode) {
        case 'protanopia':
          message = this.i18n.getTranslation('color-blind-support-protanopia');
          break;
        case 'deuteranopia':
          message = this.i18n.getTranslation('color-blind-support-deuteranopia');
          break;
        case 'tritanopia':
          message = this.i18n.getTranslation('color-blind-support-tritanopia');
          break;
      }
    }
    
    const announcement = this.renderer.createElement('div');
    this.renderer.setAttribute(announcement, 'aria-live', 'polite');
    this.renderer.setAttribute(announcement, 'aria-atomic', 'true');
    this.renderer.setStyle(announcement, 'position', 'absolute');
    this.renderer.setStyle(announcement, 'left', '-10000px');
    this.renderer.setProperty(announcement, 'textContent', message);
    this.renderer.appendChild(document.body, announcement);
    
    setTimeout(() => {
      this.renderer.removeChild(document.body, announcement);
    }, 1000);
  }

  reset() {
    this.removeColorBlindSupport();
    this.currentMode = 'none';
    this.isActive = false;
  }
}
