import { Component, OnInit, Renderer2 } from "@angular/core";
import { NgIf, NgClass } from "@angular/common";
import { AstralCheckmarkSvgComponent } from "../util/astral-checksvg.component";
import { I18nService } from "../services/i18n.service";

@Component({
  selector: "astral-skip-links",
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
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z"
              stroke="#fff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
            />
            <path
              d="M9 12L11 14L15 10"
              stroke="#fff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>        <div class="state-dots-wrap">
          <span>{{ i18n.getTranslation('skip-links') }}</span>
        </div>
      </div>
    </div>
    <astral-widget-checkmark [isActive]="isActive"></astral-widget-checkmark>
  </button>
  `,
  imports: [NgIf, NgClass, AstralCheckmarkSvgComponent],
})
export class SkipLinksComponent implements OnInit {
  isActive = false;
  private skipLinksContainer?: HTMLElement;

  constructor(
    private renderer: Renderer2,
    public i18n: I18nService
  ) {}

  ngOnInit() {
    // Check if skip links are already enabled
    this.isActive = document.querySelector('.astral-skip-links') !== null;
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

  private addSkipLinks() {
    // Create skip links container
    this.skipLinksContainer = this.renderer.createElement('div');
    this.renderer.addClass(this.skipLinksContainer, 'astral-skip-links');
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
