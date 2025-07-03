import { DOCUMENT, NgIf, NgClass } from "@angular/common";
import { Component, inject, OnInit, OnDestroy, Renderer2 } from "@angular/core";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

@Component({
  selector: "izmo-line-height",
  standalone: true,
  template: `
    <button
      (click)="nextState()"
      [ngClass]="{ 'in-use': !isBaseState() }"
    >
      <div class="title">
        <div class="icon-state-wrap">
          <div
            class="icon action-icon"
            [ngClass]="{
              inactive: isBaseState(),
              active: !isBaseState()
            }"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 6L21 6.00048M13 12L21 12.0005M13 18L21 18.0005M6 4V20M6 4L3 7M6 4L9 7M6 20L3 17M6 20L9 17"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>          <div class="state-dots-wrap">
            <span>{{ getDisplayText() }}</span>
            <div
              class="dots"
              [ngClass]="{ inactive: isBaseState() }"
            >
              <div
                class="dot"
                [ngClass]="{ active: isLightHeightActive() }"
              ></div>
              <div
                class="dot"
                [ngClass]="{ active: isModerateHeightActive() }"
              ></div>
              <div
                class="dot"
                [ngClass]="{ active: isHeavyHeightActive() }"
              ></div>
            </div>
          </div>
        </div>
      </div>      <izmo-widget-checkmark
        [isActive]="!isBaseState()"
      ></izmo-widget-checkmark>
    </button>
  `,
  imports: [NgIf, NgClass, IzmoCheckmarkSvgComponent],
})
export class LineHeightComponent implements OnInit, OnDestroy {
  constructor(
    private readonly renderer: Renderer2,
    public i18n: I18nService,
    private parent: IzmoAccessibilityComponent
  ) {}
  
  document = inject(DOCUMENT);

  currentState = 0;
  private styleElement?: HTMLStyleElement;

  get baseText() {
    return this.i18n.getTranslation('line-height');
  }

  get lightHeightText() {
    return this.i18n.getTranslation('light-line-height');
  }

  get moderateHeightText() {
    return this.i18n.getTranslation('moderate-line-height');
  }

  get heavyHeightText() {
    return this.i18n.getTranslation('heavy-line-height');
  }

  getDisplayText(): string {
    switch (this.currentState) {
      case 0:
        return this.baseText;
      case 1:
        return this.lightHeightText;
      case 2:
        return this.moderateHeightText;
      case 3:
        return this.heavyHeightText;
      default:
        return this.baseText;
    }
  }

  isBaseState(): boolean {
    return this.currentState === 0;
  }

  isLightHeightActive(): boolean {
    return this.currentState === 1;
  }

  isModerateHeightActive(): boolean {
    return this.currentState === 2;
  }

  isHeavyHeightActive(): boolean {
    return this.currentState === 3;
  }

  ngOnInit() {
    this.parent.resetEvent.subscribe(() => {
      this.currentState = 0;
      this._runStateLogic();
    });
  }

  ngOnDestroy() {
    this._resetLineHeight();
  }

  nextState() {
    this.currentState += 1;
    this.currentState = this.currentState % 4;

    this._runStateLogic();
  }

  private _runStateLogic() {
    this._resetLineHeight();
    
    if (this.currentState === 0) {
      return; // No line height applied
    }

    // Create style element to apply line height to body content excluding widget
    this.styleElement = this.renderer.createElement('style');
    this.renderer.addClass(this.styleElement, 'izmo-line-height-styles');
    
    let lineHeightCSS = '';
    
    if (this.currentState === 1) { // Light Height
      lineHeightCSS = `
        /* Apply light line height to body content excluding widget */
        body > *:not(izmo-accessibility) {
          line-height: 1.5 !important;
        }
      `;
    }

    if (this.currentState === 2) { // Moderate Height
      lineHeightCSS = `
        /* Apply moderate line height to body content excluding widget */
        body > *:not(izmo-accessibility) {
          line-height: 3 !important;
        }
      `;
    }

    if (this.currentState === 3) { // Heavy Height
      lineHeightCSS = `
        /* Apply heavy line height to body content excluding widget */
        body > *:not(izmo-accessibility) {
          line-height: 4 !important;
        }
      `;
    }

    this.renderer.setProperty(this.styleElement, 'textContent', lineHeightCSS);
    this.renderer.appendChild(document.head, this.styleElement);
  }

  private _resetLineHeight() {
    // Remove the style element if it exists
    if (this.styleElement) {
      this.renderer.removeChild(document.head, this.styleElement);
      this.styleElement = undefined;
    }
  }
}
