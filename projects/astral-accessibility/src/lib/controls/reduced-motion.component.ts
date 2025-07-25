import { Component, OnInit, Renderer2, inject } from "@angular/core";
import { NgIf, NgClass } from "@angular/common";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

@Component({
  selector: "izmo-reduced-motion",
  standalone: true,
  template: `    <button
      (click)="toggle()"
      [ngClass]="{ 'in-use': isActive }"
      [attr.aria-label]="isActive ? 'Disable ' + i18n.getTranslation('reduced-motion') : 'Enable ' + i18n.getTranslation('reduced-motion')"
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
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
            />
            <path
              d="M12 6v6l4 2"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
            />
          </svg>
        </div>        <div class="state-dots-wrap">
          <span>{{ i18n.getTranslation('reduced-motion') }}</span>
        </div>
      </div>
    </div>
    <izmo-widget-checkmark [isActive]="isActive"></izmo-widget-checkmark>
  </button>
  `,
  imports: [NgIf, NgClass, IzmoCheckmarkSvgComponent],
})
export class ReducedMotionComponent implements OnInit {
  isActive = false;
  private styleElement?: HTMLStyleElement;
  parent = inject(IzmoAccessibilityComponent);
  constructor(
    private renderer: Renderer2,
    public i18n: I18nService
  ) {}

  ngOnInit() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.isActive = true;
      this.applyReducedMotion();
    }
    
    // Check if reduced motion is already applied
    this.isActive = this.isActive || document.querySelector('.izmo-reduced-motion-styles') !== null;

    this.parent.resetEvent.subscribe(() => {
      this.isActive = false;
      this.removeReducedMotion();
    });
  }

  toggle() {
    if (this.isActive) {
      this.removeReducedMotion();
    } else {
      this.applyReducedMotion();
    }
    this.isActive = !this.isActive;
    this.announceChange();
  }

  toggleFromProfile(desiredState: boolean) {
    if (this.isActive !== desiredState) {
      this.toggle();
    }
  }

  private applyReducedMotion() {
    this.styleElement = this.renderer.createElement('style');
    this.renderer.addClass(this.styleElement, 'izmo-reduced-motion-styles');
    this.renderer.setProperty(this.styleElement, 'textContent', `
      /* Izmo Reduced Motion Styles */
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
      
      /* Disable auto-playing videos */
      video {
        animation-play-state: paused !important;
      }
      
      /* Disable parallax scrolling */
      [style*="transform: translate3d"],
      [style*="transform: translateZ"] {
        transform: none !important;
      }
      
      /* Disable CSS animations */
      @keyframes none {
        0%, 100% {
          opacity: 1;
          transform: none;
        }
      }
      
      /* Override common animation classes */
      .animate, .animated, .fade, .slide, .bounce, .zoom {
        animation: none !important;
        transition: none !important;
      }
      
      /* Disable marquee */
      marquee {
        animation: none !important;
        transform: none !important;
      }
      
      /* Disable CSS transforms that cause motion */
      .carousel, .slider, .rotating, .spinning {
        animation: none !important;
        transform: none !important;
      }
    `);
    this.renderer.appendChild(document.head, this.styleElement);
    
    // Pause all videos
    const videos = document.querySelectorAll('video[autoplay]');
    videos.forEach(video => {
      (video as HTMLVideoElement).pause();
      this.renderer.removeAttribute(video, 'autoplay');
    });
    
    // Stop CSS animations
    document.documentElement.style.setProperty('--animation-duration', '0s');
    document.documentElement.style.setProperty('--transition-duration', '0s');
  }

  private removeReducedMotion() {
    if (this.styleElement) {
      this.renderer.removeChild(document.head, this.styleElement);
      this.styleElement = undefined;
    }
    
    // Restore CSS custom properties
    document.documentElement.style.removeProperty('--animation-duration');
    document.documentElement.style.removeProperty('--transition-duration');
  }
  private announceChange() {
    const message = this.isActive 
      ? this.i18n.getTranslation('reduced-motion-enabled') 
      : this.i18n.getTranslation('reduced-motion-disabled');
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
