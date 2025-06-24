import { Component, OnInit, Renderer2 } from "@angular/core";
import { NgIf, NgClass } from "@angular/common";
import { AstralCheckmarkSvgComponent } from "../util/astral-checksvg.component";
import { I18nService } from "../services/i18n.service";

@Component({
  selector: "astral-focus-enhancement",
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
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8Z"
                stroke="#fff"
                stroke-width="2"
                fill="none"
              />
              <path
                d="M12 4V2M12 22V20M20 12H22M2 12H4M17.6569 6.34314L19.0711 4.92893M4.92893 19.0711L6.34314 17.6569M17.6569 17.6569L19.0711 19.0711M4.92893 4.92893L6.34314 6.34314"
                stroke="#fff"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>          <div class="state-dots-wrap">
            <span>{{ i18n.getTranslation('focus-enhancement') }}</span>
          </div>
        </div>
      </div>
      <astral-widget-checkmark [isActive]="isActive"></astral-widget-checkmark>
    </button>
  `,
  imports: [NgIf, NgClass, AstralCheckmarkSvgComponent],
})
export class FocusEnhancementComponent implements OnInit {
  isActive = false;
  private styleElement?: HTMLStyleElement;
    constructor(
    private renderer: Renderer2,
    public i18n: I18nService
  ) {}

  ngOnInit() {
    // Check if enhanced focus is already applied
    this.isActive = document.querySelector('.astral-focus-enhancement-styles') !== null;
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
    this.styleElement = this.renderer.createElement('style');
    this.renderer.addClass(this.styleElement, 'astral-focus-enhancement-styles');
    this.renderer.setProperty(this.styleElement, 'textContent', `
      /* Astral Enhanced Focus Styles */
      *:focus {
        outline: 3px solid #0066cc !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 5px rgba(0, 102, 204, 0.3) !important;
      }
      
      /* Enhanced focus for interactive elements */
      a:focus, button:focus, input:focus, textarea:focus, select:focus, 
      [tabindex]:focus, [role="button"]:focus, [role="link"]:focus,
      [role="menuitem"]:focus, [role="option"]:focus {
        outline: 3px solid #0066cc !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 5px rgba(0, 102, 204, 0.3) !important;
        background-color: rgba(0, 102, 204, 0.1) !important;
      }
      
      /* Special focus for form controls */
      input:focus, textarea:focus, select:focus {
        border: 2px solid #0066cc !important;
      }
      
      /* Skip link focus */
      .astral-skip-links a:focus {
        outline: 3px solid #ffffff !important;
        background-color: #0066cc !important;
        color: #ffffff !important;
      }
      
      /* Ensure focus is visible on all clickable elements */
      [onclick]:focus, .clickable:focus {
        outline: 3px solid #0066cc !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 5px rgba(0, 102, 204, 0.3) !important;
      }
      
      /* Focus indicators for custom controls */
      [role="button"]:focus, [role="tab"]:focus, [role="menuitem"]:focus {
        outline: 3px solid #0066cc !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 5px rgba(0, 102, 204, 0.3) !important;
      }
      
      /* Ensure focus ring is not cut off */
      *:focus {
        position: relative;
        z-index: 1;
      }
      
      /* High contrast focus for better visibility */
      @media (prefers-contrast: high) {
        *:focus {
          outline: 4px solid #000000 !important;
          box-shadow: 0 0 0 6px #ffffff, 0 0 0 8px #000000 !important;
        }
      }
    `);
    this.renderer.appendChild(document.head, this.styleElement);
  }

  private removeFocusEnhancement() {
    if (this.styleElement) {
      this.renderer.removeChild(document.head, this.styleElement);
      this.styleElement = undefined;
    }
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
