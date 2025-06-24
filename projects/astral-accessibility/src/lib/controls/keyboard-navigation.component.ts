import { Component, OnInit, Renderer2 } from "@angular/core";
import { NgIf, NgClass } from "@angular/common";
import { AstralCheckmarkSvgComponent } from "../util/astral-checksvg.component";

@Component({
  selector: "astral-keyboard-navigation",
  standalone: true,
  template: `
    <button
      (click)="toggle()"
      [ngClass]="{ 'in-use': isActive }"
      [attr.aria-label]="isActive ? 'Disable enhanced keyboard navigation' : 'Enable enhanced keyboard navigation'"
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
              <rect
                x="2"
                y="5"
                width="20"
                height="14"
                rx="2"
                stroke="#fff"
                stroke-width="2"
                fill="none"
              />
              <path
                d="M6 15H8M10 15H14M16 15H18M6 11H8M10 11H14M16 11H18M6 7H18"
                stroke="#fff"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <div class="state-dots-wrap">
            <span>Keyboard Navigation</span>
          </div>
        </div>
      </div>
      <astral-widget-checkmark [isActive]="isActive"></astral-widget-checkmark>
    </button>
  `,
  imports: [NgIf, NgClass, AstralCheckmarkSvgComponent],
})
export class KeyboardNavigationComponent implements OnInit {
  isActive = false;
  private styleElement?: HTMLStyleElement;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.isActive = document.querySelector('.astral-keyboard-navigation-styles') !== null;
  }

  toggle() {
    if (this.isActive) {
      this.removeKeyboardNavigation();
    } else {
      this.applyKeyboardNavigation();
    }
    this.isActive = !this.isActive;
    this.announceChange();
  }

  private applyKeyboardNavigation() {
    this.styleElement = this.renderer.createElement('style');
    this.renderer.addClass(this.styleElement, 'astral-keyboard-navigation-styles');
    
    const css = `
      /* Enhanced keyboard navigation styles */
      *:focus {
        outline: 3px solid #0066cc !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 5px rgba(0, 102, 204, 0.3) !important;
      }
      
      /* Enhanced focus for interactive elements */
      a:focus, button:focus, input:focus, textarea:focus, select:focus,
      [tabindex]:focus, [role="button"]:focus, [role="link"]:focus {
        outline: 3px solid #0066cc !important;
        outline-offset: 2px !important;
        background-color: rgba(0, 102, 204, 0.1) !important;
      }
    `;
    
    this.renderer.setProperty(this.styleElement, 'textContent', css);
    this.renderer.appendChild(document.head, this.styleElement);
  }

  private removeKeyboardNavigation() {
    if (this.styleElement) {
      this.renderer.removeChild(document.head, this.styleElement);
      this.styleElement = undefined;
    }
  }

  private announceChange() {
    const message = this.isActive ? 'Enhanced keyboard navigation enabled' : 'Enhanced keyboard navigation disabled';
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
