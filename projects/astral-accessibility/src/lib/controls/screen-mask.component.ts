import { DOCUMENT, NgIf, NgClass } from "@angular/common";
import { Component, Renderer2, inject, OnDestroy, OnInit } from "@angular/core";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

@Component({
  selector: "izmo-screen-mask",
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
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                fill="currentColor"
              />
              <path
                d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
                fill="currentColor"
              />
            </svg>
          </div>

          <div class="state-dots-wrap">
            <span>{{ states[currentState] }}</span>
            <div
              class="dots"
              [ngClass]="{ inactive: currentState === 0 }"
            >              <div
                class="dot"
                [ngClass]="{ active: currentState === 1 }"
              ></div>
              <div
                class="dot"
                [ngClass]="{ active: currentState === 2 }"
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
export class ScreenMaskComponent implements OnInit, OnDestroy {
  constructor(
    private renderer: Renderer2,
    private i18n: I18nService,
    private parent: IzmoAccessibilityComponent
  ) {}

  document = inject(DOCUMENT);
  currentState = 0;
  
  get base() {
    return this.i18n.getTranslation('screen-mask');
  }
  
  get states() {
    return [this.base, this.i18n.getTranslation('large-cursor'), this.i18n.getTranslation('reading-mask')];
  }

  cursorY = 0;
  screenHeight: number = window.innerHeight;
  height = this.screenHeight - this.cursorY;
  listenersActive: boolean = false;

  screenMaskContainerStyle = `
  .screen-mask-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999; 
  }
  `;

  maskTopStyle = `
  .mask-top {
    position: absolute;
    top: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.55);
    pointer-events: none;
    border-bottom: 8px solid #654AFF;
    height: ${this.height - 115}px;
  }
  `;

  maskBottomStyle = `
  .mask-bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.55);
    pointer-events: none;
    border-top: 8px solid #FFCB00;
    height: ${this.cursorY}px;
  }
  `;

  toggleListeners(active: boolean) {
    this.listenersActive = active;

    if (this.listenersActive) {
      this.addEventListeners();
      this.updateMaskStyles();
    } else {
      this.removeEventListeners();
    }
  }

  // Method to add the event listeners
  private addEventListeners() {
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("resize", this.onResize);
  }

  // Method to remove the event listeners
  private removeEventListeners() {
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("resize", this.onResize);
  }

  private onMouseMove = (event: MouseEvent) => {
    if (!this.listenersActive) return; // Don't proceed if listeners are paused

    this.cursorY = event.clientY;
    this.height = this.screenHeight - this.cursorY;
    this.updateMaskStyles();
  };

  // Event listener method for resize
  private onResize = (event: any) => {
    if (!this.listenersActive) return; // Don't proceed if listeners are paused

    this.screenHeight = event.target.innerHeight;
    this.height = this.screenHeight - this.cursorY;
    this.updateMaskStyles();
  };

  updateMaskStyles() {
    const maskTop = document.querySelector(".mask-top");
    const maskBottom = document.querySelector(".mask-bottom");

    if (maskTop) {
      this.renderer.setStyle(maskTop, "height", `${this.cursorY - 57}px`);
    }
    if (maskBottom) {
      this.renderer.setStyle(maskBottom, "height", `${this.height - 57}px`);
    }
  }

  _style: HTMLStyleElement;

  nextState() {
    this.currentState += 1;
    this.currentState = this.currentState % 3;

    this._runStateLogic();
  }

  private _runStateLogic() {
    this._style?.remove?.();
    this._style = this.document.createElement("style");

    if (this.currentState === 1) {
      this._style.textContent = `
        body, *{
          cursor: url('data:image/png;base64,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'), auto;
        }
        `;
    }

    if (this.currentState === 2) {
      const screenMaskContainer = this.renderer.createElement("div");
      const maskTop = this.renderer.createElement("div");
      const maskBottom = this.renderer.createElement("div");

      this.renderer.addClass(screenMaskContainer, "screen-mask-container");
      this.renderer.addClass(maskTop, "mask-top");
      this.renderer.addClass(maskBottom, "mask-bottom");

      const maskBottomCss = this.renderer.createElement("style");
      this.renderer.appendChild(
        maskBottomCss,
        this.renderer.createText(this.maskBottomStyle),
      );
      this.renderer.appendChild(this.document.head, maskBottomCss);

      const maskTopCss = this.renderer.createElement("style");
      this.renderer.appendChild(
        maskTopCss,
        this.renderer.createText(this.maskTopStyle),
      );
      this.renderer.appendChild(this.document.head, maskTopCss);

      const screenMaskContainerCss = this.renderer.createElement("style");
      this.renderer.appendChild(
        screenMaskContainerCss,
        this.renderer.createText(this.screenMaskContainerStyle),
      );
      this.renderer.appendChild(this.document.head, screenMaskContainerCss);

      screenMaskContainer.appendChild(maskTop);
      screenMaskContainer.appendChild(maskBottom);
      this.document.body.appendChild(screenMaskContainer);

      this.toggleListeners(true);
    } else {
      const removeMaskContainer = document.querySelector(
        ".screen-mask-container",
      );
      if (removeMaskContainer) {
        this.renderer.removeChild(document.body, removeMaskContainer);
      }
      this.toggleListeners(false);
    }

    this.document.body.appendChild(this._style);
  }

  ngOnInit() {
    this.parent.resetEvent.subscribe(() => {
      this.currentState = 0;
      this._runStateLogic();
    });
  }

  ngOnDestroy() {
    this.removeEventListeners();
  }
}
