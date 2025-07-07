import { DOCUMENT, NgIf, NgClass } from "@angular/common";
import { Component, inject, Renderer2, Optional, SkipSelf } from "@angular/core";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from "../izmo-accessibility.component";

@Component({
  selector: "izmo-invert",
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
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
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
export class InvertComponent {
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
  
  get states() {
    return [
      this.i18n.getTranslation('invert') || 'Invert',
      this.i18n.getTranslation('invert') || 'Invert'
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

  reset() {
    this.currentState = 0;
    this._runStateLogic();
  }

  nextState() {
    this.currentState = this.currentState === 0 ? 1 : 0;
    this._runStateLogic();
  }

  private _runStateLogic() {
    if (this.currentState === 0) {
      this.document.documentElement.classList.remove("izmo_inverted");
    } else {
      this.document.documentElement.classList.add("izmo_inverted");
    }
  }
}
