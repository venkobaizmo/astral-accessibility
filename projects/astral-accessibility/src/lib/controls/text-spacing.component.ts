import { DOCUMENT, NgIf, NgClass } from "@angular/common";
import { Component, inject, OnInit, OnDestroy, Renderer2 } from "@angular/core";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

@Component({
  selector: "izmo-text-spacing",
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
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!-- Bold T for text -->
              <text x="16" y="15" text-anchor="middle" font-size="14" font-family="Arial, Helvetica, sans-serif" font-weight="bold" fill="currentColor">T</text>
              <!-- Double-headed arrow below the T -->
              <path d="M8 24 L24 24" stroke="currentColor" stroke-width="2" stroke-dasharray="3,3"/>
              <path d="M8 24 L11 21" stroke="currentColor" stroke-width="2"/>
              <path d="M8 24 L11 27" stroke="currentColor" stroke-width="2"/>
              <path d="M24 24 L21 21" stroke="currentColor" stroke-width="2"/>
              <path d="M24 24 L21 27" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>

          <div class="state-dots-wrap">
            <span>{{ states[currentState] }}</span>            <div
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
export class TextSpacingComponent implements OnInit, OnDestroy {
  document = inject(DOCUMENT);
  i18n = inject(I18nService);
  parent = inject(IzmoAccessibilityComponent);
  renderer = inject(Renderer2);

  currentState = 0;
  private styleElement?: HTMLStyleElement;
  
  // Make these reactive to language changes
  get base() {
    return this.i18n.getTranslation('text-spacing');
  }
  
  get states() {
    return [
      this.base, 
      this.i18n.getTranslation('light-spacing'), 
      this.i18n.getTranslation('moderate-spacing'), 
      this.i18n.getTranslation('heavy-spacing')
    ];
  }

  ngOnInit() {
    this.parent.resetEvent.subscribe(() => {
      this.currentState = 0;
      this._runStateLogic();
    });
  }

  ngOnDestroy() {
    this._resetSpacing();
  }

  nextState() {
    this.currentState += 1;
    this.currentState = this.currentState % 4;

    this._runStateLogic();
  }

  private _runStateLogic() {
    this._resetSpacing();
    
    if (this.currentState === 0) {
      return; // No spacing applied
    }

    // Create style element to apply spacing to body content excluding widget
    this.styleElement = this.renderer.createElement('style');
    this.renderer.addClass(this.styleElement, 'izmo-text-spacing-styles');
    
    let spacingCSS = '';
    
    if (this.states[this.currentState] === this.i18n.getTranslation('light-spacing')) {
      spacingCSS = `
        /* Apply light spacing to body content excluding widget */
        body > *:not(izmo-accessibility) {
          word-spacing: 0.16em !important;
          letter-spacing: 0.12em !important;
        }
      `;
    }

    if (this.states[this.currentState] === this.i18n.getTranslation('moderate-spacing')) {
      spacingCSS = `
        /* Apply moderate spacing to body content excluding widget */
        body > *:not(izmo-accessibility) {
          word-spacing: 0.32em !important;
          letter-spacing: 0.24em !important;
        }
      `;
    }

    if (this.states[this.currentState] === this.i18n.getTranslation('heavy-spacing')) {
      spacingCSS = `
        /* Apply heavy spacing to body content excluding widget */
        body > *:not(izmo-accessibility) {
          word-spacing: 0.48em !important;
          letter-spacing: 0.36em !important;
        }
      `;
    }

    this.renderer.setProperty(this.styleElement, 'textContent', spacingCSS);
    this.renderer.appendChild(document.head, this.styleElement);
  }

  private _resetSpacing() {
    // Remove the style element if it exists
    if (this.styleElement) {
      this.renderer.removeChild(document.head, this.styleElement);
      this.styleElement = undefined;
    }
    
    // Also remove any existing document element classes for backward compatibility
    this.document.documentElement.classList.remove("izmo_light_spacing");
    this.document.documentElement.classList.remove("izmo_moderate_spacing");
    this.document.documentElement.classList.remove("izmo_heavy_spacing");
  }
}
