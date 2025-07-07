import { Component, OnInit, Renderer2, Optional, SkipSelf } from "@angular/core";
import { NgIf, NgClass } from "@angular/common";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from "../izmo-accessibility.component";

@Component({
  selector: "izmo-skip-links",
  standalone: true,
  template: `    <button
      (click)="toggle()"
      [ngClass]="{ 'in-use': isActive }"
      [attr.aria-label]="isActive ? 'Disable ' + i18n.getTranslation('skip-links') : 'Enable ' + i18n.getTranslation('skip-links')"
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
              d="M3 3h18v2H3V3zm0 4h12v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2z"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
            />
            <path
              d="M12 15l3-3 3 3"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
            />
          </svg>
        </div>        <div class="state-dots-wrap">
          <span>{{ i18n.getTranslation('skip-links') }}</span>
        </div>
      </div>
    </div>
    <izmo-widget-checkmark [isActive]="isActive"></izmo-widget-checkmark>
  </button>
  `,
  imports: [NgIf, NgClass, IzmoCheckmarkSvgComponent],
})
export class SkipLinksComponent implements OnInit {
  isActive = false;
  private skipLinksContainer?: HTMLElement;

  constructor(
    private renderer: Renderer2,
    public i18n: I18nService,
    @Optional() @SkipSelf() private parent?: IzmoAccessibilityComponent
  ) {}

  ngOnInit() {
    // Check if skip links are already enabled
    this.isActive = document.querySelector('.izmo-skip-links') !== null;
    if (this.parent) {
      this.parent.resetEvent.subscribe(() => this.reset());
    }
  }

  reset() {
    if (this.isActive) {
      this.removeSkipLinks();
      this.isActive = false;
    }
  }

  toggle() {
    if (this.isActive) {
      this.removeSkipLinks();
    } else {
      this.addSkipLinks();
    }
    this.isActive = !this.isActive;
    this.announceChange();
  }

  toggleFromProfile(desiredState: boolean) {
    if (this.isActive !== desiredState) {
      this.toggle();
    }
  }

  private addSkipLinks() {
    // Create skip links container
    this.skipLinksContainer = this.renderer.createElement('div');
    this.renderer.addClass(this.skipLinksContainer, 'izmo-skip-links');
    this.renderer.setStyle(this.skipLinksContainer, 'position', 'fixed');
    this.renderer.setStyle(this.skipLinksContainer, 'top', '0');
    this.renderer.setStyle(this.skipLinksContainer, 'left', '0');
    this.renderer.setStyle(this.skipLinksContainer, 'z-index', '9999');
    this.renderer.setStyle(this.skipLinksContainer, 'background', '#000');
    this.renderer.setStyle(this.skipLinksContainer, 'padding', '10px');
    this.renderer.setStyle(this.skipLinksContainer, 'transform', 'translateY(-100%)');
    this.renderer.setStyle(this.skipLinksContainer, 'transition', 'transform 0.3s ease');    // Create skip links
    const skipLinks = [
      { text: this.i18n.getTranslation('skip-to-main-content'), target: 'main, [role="main"], .main-content, #main-content' },
      { text: this.i18n.getTranslation('skip-to-navigation'), target: 'nav, [role="navigation"], .navigation, #navigation' },
      { text: this.i18n.getTranslation('skip-to-search'), target: '[role="search"], .search, #search, input[type="search"]' },
      { text: this.i18n.getTranslation('skip-to-footer'), target: 'footer, [role="contentinfo"], .footer, #footer' }
    ];

    skipLinks.forEach(link => {
      const target = document.querySelector(link.target);
      if (target) {
        const skipLink = this.renderer.createElement('a');
        this.renderer.setAttribute(skipLink, 'href', '#');
        this.renderer.setAttribute(skipLink, 'tabindex', '0');
        this.renderer.setProperty(skipLink, 'textContent', link.text);
        this.renderer.setStyle(skipLink, 'color', '#fff');
        this.renderer.setStyle(skipLink, 'text-decoration', 'underline');
        this.renderer.setStyle(skipLink, 'margin-right', '15px');
        this.renderer.setStyle(skipLink, 'display', 'inline-block');

        this.renderer.listen(skipLink, 'click', (e) => {
          e.preventDefault();
          this.skipToElement(target as HTMLElement);
        });

        this.renderer.listen(skipLink, 'focus', () => {
          this.renderer.setStyle(this.skipLinksContainer, 'transform', 'translateY(0)');
        });

        this.renderer.listen(skipLink, 'blur', () => {
          setTimeout(() => {
            if (!this.skipLinksContainer?.contains(document.activeElement)) {
              this.renderer.setStyle(this.skipLinksContainer, 'transform', 'translateY(-100%)');
            }
          }, 100);
        });

        this.renderer.appendChild(this.skipLinksContainer, skipLink);
      }
    });

    this.renderer.appendChild(document.body, this.skipLinksContainer);
  }

  private removeSkipLinks() {
    if (this.skipLinksContainer) {
      this.renderer.removeChild(document.body, this.skipLinksContainer);
      this.skipLinksContainer = undefined;
    }
  }

  private skipToElement(element: HTMLElement) {
    // Make element focusable if it's not already
    if (!element.hasAttribute('tabindex')) {
      this.renderer.setAttribute(element, 'tabindex', '-1');
    }
    
    // Focus and scroll to element
    element.focus();
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Hide skip links
    if (this.skipLinksContainer) {
      this.renderer.setStyle(this.skipLinksContainer, 'transform', 'translateY(-100%)');
    }
  }
  private announceChange() {
    const message = this.isActive 
      ? this.i18n.getTranslation('skip-links-enabled') 
      : this.i18n.getTranslation('skip-links-disabled');
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
