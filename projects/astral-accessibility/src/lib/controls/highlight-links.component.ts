import { DOCUMENT, NgIf, NgClass } from "@angular/common";
import { Component, inject, Renderer2, OnInit } from "@angular/core";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

@Component({
  selector: "izmo-highlight-links",
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
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
              />
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
export class HighlightLinksComponent implements OnInit {
  document = inject(DOCUMENT);
  renderer = inject(Renderer2);
  i18n = inject(I18nService);
  parent = inject(IzmoAccessibilityComponent);

  currentState = 0;
  
  // Make these reactive to language changes
  get base() {
    return this.i18n.getTranslation('highlight-links');
  }
  
  get states() {
    return [
      this.base,
      this.i18n.getTranslation('subtle-highlight'),
      this.i18n.getTranslation('strong-highlight'),
      this.i18n.getTranslation('underline-all')
    ];
  }

  get isActive(): boolean {
    return this.currentState !== 0;
  }

  /**
   * Programmatically activate/deactivate from profile selection
   */
  toggleFromProfile(desiredState: boolean) {
    if (desiredState && this.currentState === 0) {
      this.currentState = 1;
      this._runStateLogic();
    } else if (!desiredState && this.currentState !== 0) {
      this.currentState = 0;
      this._runStateLogic();
    }
  }

  private styleElement?: HTMLStyleElement;

  ngOnInit() {
    this.parent.resetEvent.subscribe(() => {
      this.currentState = 0;
      this._runStateLogic();
    });
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

    if (this.currentState === 0) {
      return; // No highlighting
    }

    // Create new style element
    this.styleElement = this.renderer.createElement('style');
    let css = '';

    if (this.currentState === 1) {
      css = `
        a, [role="link"] {
          background-color: rgba(255, 255, 0, 0.3) !important;
          border: 1px solid #ffcc00 !important;
          border-radius: 2px !important;
          padding: 1px 2px !important;
        }
      `;
    }

    if (this.currentState === 2) {
      css = `
        a, [role="link"] {
          background-color: #ffff00 !important;
          color: #000000 !important;
          border: 2px solid #ff6600 !important;
          border-radius: 4px !important;
          padding: 2px 4px !important;
          font-weight: bold !important;
        }
      `;
    }

    if (this.currentState === 3) {
      css = `
        a, [role="link"] {
          text-decoration: underline !important;
          text-decoration-color: #0066cc !important;
          text-decoration-thickness: 3px !important;
          text-underline-offset: 2px !important;
          color: #0066cc !important;
          font-weight: bold !important;
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
