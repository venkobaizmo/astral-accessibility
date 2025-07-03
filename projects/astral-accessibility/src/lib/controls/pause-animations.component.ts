import { DOCUMENT, NgIf, NgClass } from "@angular/common";
import { Component, inject, Renderer2, Optional, SkipSelf } from "@angular/core";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from "../izmo-accessibility.component";

@Component({
  selector: "izmo-pause-animations",
  standalone: true,
  template: `
    <button
      (click)="nextState()"
      [ngClass]="{ 'in-use': currentState !== 0 }"
    >
      <div class="title">
        <div class="icon-state-wrap">
          <div
            class="icon action-icon"
            [ngClass]="{
              inactive: currentState === 0,
              active: currentState !== 0
            }"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 41 41"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20.5" cy="20.5" r="16" fill="none" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="12" width="3" height="17" fill="currentColor"/>
              <rect x="24" y="12" width="3" height="17" fill="currentColor"/>
              <path d="M8 8 L33 8" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>
              <path d="M8 33 L33 33" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>
            </svg>
          </div>

          <div class="state-dots-wrap">
            <span>{{ states[currentState] }}</span>
            <div
              class="dots"
              [ngClass]="{ inactive: currentState === 0 }"
            >
              <div
                class="dot"
                [ngClass]="{ active: currentState === 1 }"
              ></div>
              <div
                class="dot"
                [ngClass]="{ active: currentState === 2 }"
              ></div>
              <div
                class="dot"
                [ngClass]="{ active: currentState === 3 }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <izmo-widget-checkmark
        [isActive]="currentState !== 0"
      ></izmo-widget-checkmark>
    </button>
  `,
  imports: [NgIf, NgClass, IzmoCheckmarkSvgComponent],
})
export class PauseAnimationsComponent {
  document = inject(DOCUMENT);
  renderer = inject(Renderer2);
  i18n = inject(I18nService);

  constructor(
    @Optional() @SkipSelf() private parent?: IzmoAccessibilityComponent
  ) {
    if (this.parent) {
      this.parent.resetEvent.subscribe(() => this.reset());
    }
  }

  currentState = 0;
  
  // Make these reactive to language changes
  get base() {
    return this.i18n.getTranslation('pause-animations');
  }
  
  get states() {
    return [
      this.base,
      this.i18n.getTranslation('pause-all'),
      this.i18n.getTranslation('slow-motion'),
      this.i18n.getTranslation('essential-only')
    ];
  }

  private styleElement?: HTMLStyleElement;

  reset() {
    this.currentState = 0;
    this._runStateLogic();
  }

  nextState() {
    this.currentState += 1;
    this.currentState = this.currentState % 4;
    this._runStateLogic();
  }

  private _runStateLogic() {
    // Remove existing styles
    if (this.styleElement) {
      this.renderer.removeChild(this.document.head, this.styleElement);
      this.styleElement = undefined;
    }

    if (this.states[this.currentState] === this.base) {
      return; // Normal animations
    }

    // Create new style element
    this.styleElement = this.renderer.createElement('style');
    let css = '';

    if (this.states[this.currentState] === this.i18n.getTranslation('pause-all')) {
      css = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          transition-delay: 0.01ms !important;
        }
        
        video, [autoplay] {
          animation-play-state: paused !important;
        }
        
        marquee {
          animation: none !important;
        }
      `;
    }

    if (this.states[this.currentState] === this.i18n.getTranslation('slow-motion')) {
      css = `
        *, *::before, *::after {
          animation-duration: 10s !important;
          transition-duration: 2s !important;
        }
        
        video {
          playback-rate: 0.5 !important;
        }
      `;
    }

    if (this.states[this.currentState] === this.i18n.getTranslation('essential-only')) {
      css = `
        .decoration, .banner, .hero, .carousel, .slider, .spinner,
        [class*="animate"], [class*="fade"], [class*="slide"],
        [class*="bounce"], [class*="rotate"], [class*="pulse"] {
          animation: none !important;
          transition: none !important;
        }
        
        /* Keep essential animations like loading indicators */
        .loading, .progress, [role="progressbar"], [aria-live] {
          animation-duration: inherit !important;
          transition-duration: inherit !important;
        }
      `;
    }

    this.renderer.setProperty(this.styleElement, 'textContent', css);
    this.renderer.appendChild(this.document.head, this.styleElement);
  }

  ngOnDestroy() {
    if (this.styleElement) {
      this.renderer.removeChild(this.document.head, this.styleElement);
    }
  }
}
