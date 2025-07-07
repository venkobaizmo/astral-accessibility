import { DOCUMENT, NgIf, NgClass } from "@angular/common";
import { Component, inject, Renderer2, Optional, SkipSelf } from "@angular/core";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from "../izmo-accessibility.component";

@Component({
  selector: "izmo-text-align",
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
                d="M3 3h18v2H3V3zm0 4h12v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2zm0 4h18v2H3v-2z"
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
export class TextAlignComponent {
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
    return this.i18n.getTranslation('text-align');
  }
  
  get states() {
    return [
      this.base,
      this.i18n.getTranslation('left-align'),
      this.i18n.getTranslation('center-align'),
      this.i18n.getTranslation('right-align')
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

    if (this.currentState === 0) {
      return; // Default alignment
    }

    // Create new style element
    this.styleElement = this.renderer.createElement('style');
    let css = '';

    if (this.currentState === 1) {
      css = `
        body *:not(.izmo-accessibility *):not(svg):not(path):not(g) {
          text-align: left !important;
        }
      `;
    }

    if (this.currentState === 2) {
      css = `
        body *:not(.izmo-accessibility *):not(svg):not(path):not(g) {
          text-align: center !important;
        }
      `;
    }

    if (this.currentState === 3) {
      css = `
        body *:not(.izmo-accessibility *):not(svg):not(path):not(g) {
          text-align: right !important;
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
