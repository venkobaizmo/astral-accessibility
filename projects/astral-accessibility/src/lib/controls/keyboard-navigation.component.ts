import { Component, OnInit, Renderer2, HostListener, OnDestroy, inject } from "@angular/core";
import { NgIf, NgClass } from "@angular/common";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

@Component({
  selector: "izmo-keyboard-navigation",
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
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
              />
              <path
                d="M8 9h2M12 9h2M16 9h2M8 13h2M12 13h2M16 13h2M8 17h2M12 17h2"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
                fill="none"
              />
            </svg>
          </div>          <div class="state-dots-wrap">
            <span>{{ i18n.getTranslation('keyboard-navigation') }}</span>
          </div>
        </div>
      </div>
      <izmo-widget-checkmark [isActive]="isActive"></izmo-widget-checkmark>
    </button>
  `,
  imports: [NgIf, NgClass, IzmoCheckmarkSvgComponent],
})
export class KeyboardNavigationComponent implements OnInit, OnDestroy {
  isActive = false;
  private styleElement?: HTMLStyleElement;
  private overlayElement?: HTMLElement;
  private currentIndex = 0;
  private focusableElements: HTMLElement[] = [];
  private keyboardListeners: (() => void)[] = [];
  parent = inject(IzmoAccessibilityComponent);

  constructor(
    private renderer: Renderer2,
    public i18n: I18nService
  ) {}
  ngOnInit() {
    this.parent.resetEvent.subscribe(() => {
      this.isActive = false;
      // Add any additional deselect/hide logic here if needed
    });
    this.isActive = document.querySelector('.izmo-keyboard-navigation-styles') !== null;
    this.updateFocusableElements();
  }

  ngOnDestroy() {
    this.removeKeyboardNavigation();
    this.keyboardListeners.forEach(listener => listener());
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    if (!this.isActive) return;

    switch (event.key) {
      case 'Tab':
        // Enhanced tab navigation is handled by CSS
        break;
      case 'F1':
        event.preventDefault();
        this.showKeyboardHelp();
        break;
      case 'F2':
        event.preventDefault();
        this.focusNextHeading();
        break;
      case 'F3':
        event.preventDefault();
        this.focusNextLandmark();
        break;
      case 'Escape':
        if (this.overlayElement) {
          this.hideKeyboardHelp();
        }
        break;
    }
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

  private updateFocusableElements() {
    const selector = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"]), [contenteditable], details, summary';
    this.focusableElements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
  }

  private focusNextHeading() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) {
      this.announceMessage('No headings found on page');
      return;
    }

    const currentFocus = document.activeElement;
    let nextIndex = 0;

    for (let i = 0; i < headings.length; i++) {
      if (headings[i] === currentFocus) {
        nextIndex = (i + 1) % headings.length;
        break;
      }
    }

    const nextHeading = headings[nextIndex] as HTMLElement;
    nextHeading.focus();
    this.announceMessage(`Focused on ${nextHeading.tagName}: ${nextHeading.textContent?.trim()}`);
  }

  private focusNextLandmark() {
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], nav, main, aside, header, footer');
    if (landmarks.length === 0) {
      this.announceMessage('No landmarks found on page');
      return;
    }

    const currentFocus = document.activeElement;
    let nextIndex = 0;

    for (let i = 0; i < landmarks.length; i++) {
      if (landmarks[i] === currentFocus) {
        nextIndex = (i + 1) % landmarks.length;
        break;
      }
    }

    const nextLandmark = landmarks[nextIndex] as HTMLElement;
    nextLandmark.setAttribute('tabindex', '-1');
    nextLandmark.focus();
    this.announceMessage(`Focused on landmark: ${this.getLandmarkName(nextLandmark)}`);
  }

  private getLandmarkName(element: HTMLElement): string {
    const role = element.getAttribute('role') || element.tagName.toLowerCase();
    const label = element.getAttribute('aria-label') || 
                  element.getAttribute('aria-labelledby') ||
                  element.textContent?.trim()?.substring(0, 50) || '';
    return `${role}${label ? ': ' + label : ''}`;
  }

  private showKeyboardHelp() {
    if (this.overlayElement) return;

    this.overlayElement = this.renderer.createElement('div');
    this.renderer.setStyle(this.overlayElement, 'position', 'fixed');
    this.renderer.setStyle(this.overlayElement, 'top', '50%');
    this.renderer.setStyle(this.overlayElement, 'left', '50%');
    this.renderer.setStyle(this.overlayElement, 'transform', 'translate(-50%, -50%)');
    this.renderer.setStyle(this.overlayElement, 'background', 'white');
    this.renderer.setStyle(this.overlayElement, 'border', '2px solid #0066cc');
    this.renderer.setStyle(this.overlayElement, 'border-radius', '8px');
    this.renderer.setStyle(this.overlayElement, 'padding', '20px');
    this.renderer.setStyle(this.overlayElement, 'z-index', '999999');
    this.renderer.setStyle(this.overlayElement, 'max-width', '500px');
    this.renderer.setStyle(this.overlayElement, 'box-shadow', '0 4px 20px rgba(0,0,0,0.3)');
    this.renderer.setAttribute(this.overlayElement, 'role', 'dialog');
    this.renderer.setAttribute(this.overlayElement, 'aria-labelledby', 'keyboard-help-title');
    this.renderer.setAttribute(this.overlayElement, 'aria-modal', 'true');

    const helpContent = `
      <h2 id="keyboard-help-title">Keyboard Navigation Help</h2>
      <ul>
        <li><strong>Tab:</strong> Move to next focusable element</li>
        <li><strong>Shift + Tab:</strong> Move to previous focusable element</li>
        <li><strong>F1:</strong> Show this help (press Escape to close)</li>
        <li><strong>F2:</strong> Jump to next heading</li>
        <li><strong>F3:</strong> Jump to next landmark</li>
        <li><strong>Enter/Space:</strong> Activate buttons and links</li>
        <li><strong>Arrow Keys:</strong> Navigate within components</li>
      </ul>
      <button id="close-help" style="margin-top: 10px; padding: 8px 16px; background: #0066cc; color: white; border: none; border-radius: 4px;">Close (Esc)</button>
    `;

    this.renderer.setProperty(this.overlayElement, 'innerHTML', helpContent);    this.renderer.appendChild(document.body, this.overlayElement);

    const closeButton = this.overlayElement?.querySelector('#close-help') as HTMLElement;
    if (closeButton) {
      closeButton.focus();
      closeButton.addEventListener('click', () => this.hideKeyboardHelp());
    }
  }

  private hideKeyboardHelp() {
    if (this.overlayElement) {
      this.renderer.removeChild(document.body, this.overlayElement);
      this.overlayElement = undefined;
    }
  }

  private announceMessage(message: string) {
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

  private applyKeyboardNavigation() {
    this.styleElement = this.renderer.createElement('style');
    this.renderer.addClass(this.styleElement, 'izmo-keyboard-navigation-styles');
    
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
