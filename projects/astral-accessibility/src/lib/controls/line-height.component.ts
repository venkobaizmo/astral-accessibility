import { DOCUMENT, NgIf, NgClass } from "@angular/common";
import { Component, Renderer2, inject } from "@angular/core";
import { AstralCheckmarkSvgComponent } from "../util/astral-checksvg.component";
import { I18nService } from "../services/i18n.service";

@Component({
  selector: "astral-line-height",
  standalone: true,
  template: `    <button
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
              width="25px"
              height="25px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 6L21 6.00048M13 12L21 12.0005M13 18L21 18.0005M6 4V20M6 4L3 7M6 4L9 7M6 20L3 17M6 20L9 17"
                stroke="#ffffff"
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
      </div>      <astral-widget-checkmark
        [isActive]="!isBaseState()"
      ></astral-widget-checkmark>
    </button>
  `,
  imports: [NgIf, NgClass, AstralCheckmarkSvgComponent],
})
export class LineHeightComponent {  constructor(
    private readonly renderer: Renderer2,
    public i18n: I18nService
  ) {}
  
  document = inject(DOCUMENT);

  currentState = 0;

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

  lowHeight = `
  *:not(.astral-accessibility *) {
      line-height: 1.5 !important;
    }`;

  moderateHeight = `
  *:not(.astral-accessibility *) {
    line-height: 3 !important;
  }`;

  heavyHeight = `
  *:not(.astral-accessibility *) {
    line-height: 4 !important;
  }`;

  private lowHeightStyleTag: HTMLStyleElement | null = null;
  private moderateHeightStyleTag: HTMLStyleElement | null = null;
  private heavyHeightStyleTag: HTMLStyleElement | null = null;

  _style: HTMLStyleElement;

  nextState() {
    this.currentState += 1;
    this.currentState = this.currentState % 4;

    this._runStateLogic();
  }  private _runStateLogic() {
    this._style?.remove?.();
    this._style = this.document.createElement("style");

    this._handleLightHeight();
    this._handleModerateHeight();
    this._handleHeavyHeight();

    this.document.body.appendChild(this._style);
  }

  private _handleLightHeight() {
    if (this.currentState === 1) { // Light Height
      if (!this.lowHeightStyleTag) {
        this.lowHeightStyleTag = this.renderer.createElement("style");
        this.renderer.appendChild(
          this.lowHeightStyleTag,
          this.renderer.createText(this.lowHeight),
        );
        this.renderer.appendChild(this.document.head, this.lowHeightStyleTag);
      }
    } else if (this.lowHeightStyleTag) {
      this.renderer.removeChild(this.document.head, this.lowHeightStyleTag);
      this.lowHeightStyleTag = null;
    }
  }

  private _handleModerateHeight() {
    if (this.currentState === 2) { // Moderate Height
      if (!this.moderateHeightStyleTag) {
        this.moderateHeightStyleTag = this.renderer.createElement("style");
        this.renderer.appendChild(
          this.moderateHeightStyleTag,
          this.renderer.createText(this.moderateHeight),
        );
        this.renderer.appendChild(
          this.document.head,
          this.moderateHeightStyleTag,
        );
      }
    } else if (this.moderateHeightStyleTag) {
      this.renderer.removeChild(
        this.document.head,
        this.moderateHeightStyleTag,
      );
      this.moderateHeightStyleTag = null;
    }
  }

  private _handleHeavyHeight() {
    if (this.currentState === 3) { // Heavy Height
      if (!this.heavyHeightStyleTag) {
        this.heavyHeightStyleTag = this.renderer.createElement("style");
        this.renderer.appendChild(
          this.heavyHeightStyleTag,
          this.renderer.createText(this.heavyHeight),
        );
        this.renderer.appendChild(this.document.head, this.heavyHeightStyleTag);
      }
    } else if (this.heavyHeightStyleTag) {
      this.renderer.removeChild(this.document.head, this.heavyHeightStyleTag);
      this.heavyHeightStyleTag = null;
    }
  }
}
