import { Component, OnInit, Renderer2, inject } from "@angular/core";
import { NgIf, NgClass } from "@angular/common";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

@Component({
  selector: "izmo-focus-enhancement",
  standalone: true,  template: `
    <button
      (click)="toggle()"
      [ngClass]="{ 'in-use': isActive }"
      [attr.aria-label]="isActive ? 'Disable ' + i18n.getTranslation('focus-enhancement') : 'Enable ' + i18n.getTranslation('focus-enhancement')"
      [attr.aria-pressed]="isActive"
    >
      <div class="title">
        <div class="icon-state-wrap">
          <div class="icon action-icon" [ngClass]="{ inactive: !isActive, active: isActive }">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8Z"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
              />
              <path
                d="M12 4V2M12 22V20M20 12H22M2 12H4M17.6569 6.34314L19.0711 4.92893M4.92893 19.0711L6.34314 17.6569M17.6569 17.6569L19.0711 19.0711M4.92893 4.92893L6.34314 6.34314"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>          <div class="state-dots-wrap">
            <span>{{ i18n.getTranslation('focus-enhancement') }}</span>
          </div>
        </div>
      </div>
      <izmo-widget-checkmark [isActive]="isActive"></izmo-widget-checkmark>
    </button>
  `,
  imports: [NgIf, NgClass, IzmoCheckmarkSvgComponent],
})
export class FocusEnhancementComponent implements OnInit {
  isActive = false;
  private styleElement?: HTMLStyleElement;
  parent = inject(IzmoAccessibilityComponent);

  constructor(
    private renderer: Renderer2,
    public i18n: I18nService
  ) {}

  ngOnInit() {
    // Check if enhanced focus is already applied
    this.isActive = document.querySelector('.izmo-focus-enhancement-styles') !== null;
    this.parent.resetEvent.subscribe(() => {
      this.isActive = false;
      this.removeFocusEnhancement();
    });
  }

  toggle() {
    if (this.isActive) {
      this.removeFocusEnhancement();
    } else {
      this.applyFocusEnhancement();
    }
    this.isActive = !this.isActive;
    this.announceChange();
  }

  private applyFocusEnhancement() {
    // Add data attribute to body for scoping
    this.renderer.setAttribute(document.body, 'data-izmo-focus-enhanced', 'true');
    
    this.styleElement = this.renderer.createElement('style');
    this.renderer.addClass(this.styleElement, 'izmo-focus-enhancement-styles');
    this.renderer.setProperty(this.styleElement, 'textContent', `
      /* Izmo Enhanced Focus Styles - Scoped to body with data attribute */
      
      /* Reset all focus styles first */
      *:focus {
        outline: none !important;
        box-shadow: none !important;
        background-color: transparent !important;
        border: none !important;
      }
      
      /* Apply enhanced focus only when body has the data attribute AND element is not in widget */
      body[data-izmo-focus-enhanced="true"] *:focus:not(.izmo-accessibility *):not(.izmo-accessibility) {
        outline: 3px solid #0066cc !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 5px rgba(0, 102, 204, 0.3) !important;
      }
      
      /* Enhanced focus for interactive elements */
      body[data-izmo-focus-enhanced="true"] a:focus:not(.izmo-accessibility *):not(.izmo-accessibility),
      body[data-izmo-focus-enhanced="true"] button:focus:not(.izmo-accessibility *):not(.izmo-accessibility),
      body[data-izmo-focus-enhanced="true"] input:focus:not(.izmo-accessibility *):not(.izmo-accessibility),
      body[data-izmo-focus-enhanced="true"] textarea:focus:not(.izmo-accessibility *):not(.izmo-accessibility),
      body[data-izmo-focus-enhanced="true"] select:focus:not(.izmo-accessibility *):not(.izmo-accessibility),
      body[data-izmo-focus-enhanced="true"] [tabindex]:focus:not(.izmo-accessibility *):not(.izmo-accessibility),
      body[data-izmo-focus-enhanced="true"] [role="button"]:focus:not(.izmo-accessibility *):not(.izmo-accessibility),
      body[data-izmo-focus-enhanced="true"] [role="link"]:focus:not(.izmo-accessibility *):not(.izmo-accessibility),
      body[data-izmo-focus-enhanced="true"] [role="menuitem"]:focus:not(.izmo-accessibility *):not(.izmo-accessibility),
      body[data-izmo-focus-enhanced="true"] [role="option"]:focus:not(.izmo-accessibility *):not(.izmo-accessibility),
      body[data-izmo-focus-enhanced="true"] [role="tab"]:focus:not(.izmo-accessibility *):not(.izmo-accessibility),
      body[data-izmo-focus-enhanced="true"] [onclick]:focus:not(.izmo-accessibility *):not(.izmo-accessibility),
      body[data-izmo-focus-enhanced="true"] .clickable:focus:not(.izmo-accessibility *):not(.izmo-accessibility) {
        outline: 3px solid #0066cc !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 5px rgba(0, 102, 204, 0.3) !important;
        background-color: rgba(0, 102, 204, 0.1) !important;
      }
      
      /* Special focus for form controls */
      body[data-izmo-focus-enhanced="true"] input:focus:not(.izmo-accessibility *):not(.izmo-accessibility),
      body[data-izmo-focus-enhanced="true"] textarea:focus:not(.izmo-accessibility *):not(.izmo-accessibility),
      body[data-izmo-focus-enhanced="true"] select:focus:not(.izmo-accessibility *):not(.izmo-accessibility) {
        border: 2px solid #0066cc !important;
      }
      
      /* Skip link focus */
      body[data-izmo-focus-enhanced="true"] .izmo-skip-links a:focus:not(.izmo-accessibility *):not(.izmo-accessibility) {
        outline: 3px solid #ffffff !important;
        background-color: #0066cc !important;
        color: #ffffff !important;
      }
      
      /* Ensure focus ring is not cut off */
      body[data-izmo-focus-enhanced="true"] *:focus:not(.izmo-accessibility *):not(.izmo-accessibility) {
        position: relative;
        z-index: 1;
      }
      
      /* High contrast focus for better visibility */
      @media (prefers-contrast: high) {
        body[data-izmo-focus-enhanced="true"] *:focus:not(.izmo-accessibility *):not(.izmo-accessibility) {
          outline: 4px solid #000000 !important;
          box-shadow: 0 0 0 6px #ffffff, 0 0 0 8px #000000 !important;
        }
      }
      
      /* Explicitly protect widget elements with maximum specificity */
      .izmo-accessibility,
      .izmo-accessibility *,
      .izmo-accessibility::before,
      .izmo-accessibility::after,
      .izmo-accessibility *::before,
      .izmo-accessibility *::after {
        outline: none !important;
        box-shadow: none !important;
        background-color: transparent !important;
        border: none !important;
        position: static !important;
        z-index: auto !important;
      }
      
      /* Additional protection for widget focus states */
      .izmo-accessibility:focus,
      .izmo-accessibility *:focus,
      .izmo-accessibility button:focus,
      .izmo-accessibility input:focus,
      .izmo-accessibility select:focus,
      .izmo-accessibility a:focus,
      .izmo-accessibility [tabindex]:focus,
      .izmo-accessibility [role="button"]:focus,
      .izmo-accessibility [role="link"]:focus,
      .izmo-accessibility [role="menuitem"]:focus,
      .izmo-accessibility [role="option"]:focus,
      .izmo-accessibility [role="tab"]:focus,
      .izmo-accessibility [onclick]:focus,
      .izmo-accessibility .clickable:focus {
        outline: none !important;
        box-shadow: none !important;
        background-color: transparent !important;
        border: none !important;
        position: static !important;
        z-index: auto !important;
      }
    `);
    this.renderer.appendChild(document.head, this.styleElement);
  }

  private removeFocusEnhancement() {
    if (this.styleElement) {
      this.renderer.removeChild(document.head, this.styleElement);
      this.styleElement = undefined;
    }
    // Remove the data attribute from body
    this.renderer.removeAttribute(document.body, 'data-izmo-focus-enhanced');
  }
  private announceChange() {
    const message = this.isActive 
      ? this.i18n.getTranslation('focus-enhancement-enabled') 
      : this.i18n.getTranslation('focus-enhancement-disabled');
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
}
