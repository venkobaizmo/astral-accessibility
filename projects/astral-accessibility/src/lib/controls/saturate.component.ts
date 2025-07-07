import { DOCUMENT, NgIf, NgClass } from "@angular/common";
import { Component, inject, OnInit, OnDestroy, Renderer2 } from "@angular/core";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

@Component({
  selector: "izmo-saturate",
  standalone: true,
  template: `
    <button
      (click)="nextState()"
      [ngClass]="{ 'in-use': currentState !== 0 }"
    >
      <div class="title">
        <div class="icon-state-wrap">
          <div
            class="icon action-icon "
            [ngClass]="{
              inactive: currentState === 0,
              active: currentState !== 0
            }"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <path
                  d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7C21 5.9 20.1 5 19 5H17C15.9 5 15 5.9 15 7V9C15 10.1 15.9 11 17 11H19C20.1 11 21 10.1 21 9ZM7 9V7C7 5.9 6.1 5 5 5H3C1.9 5 1 5.9 1 7V9C1 10.1 1.9 11 3 11H5C6.1 11 7 10.1 7 9ZM12 18C13.1 18 14 18.9 14 20C14 21.1 13.1 22 12 22C10.9 22 10 21.1 10 20C10 18.9 10.9 18 12 18ZM21 16V14C21 12.9 20.1 12 19 12H17C15.9 12 15 12.9 15 14V16C15 17.1 15.9 18 17 18H19C20.1 18 21 17.1 21 16ZM7 16V14C7 12.9 6.1 12 5 12H3C1.9 12 1 12.9 1 14V16C1 17.1 1.9 18 3 18H5C6.1 18 7 17.1 7 16Z"
                  fill="currentColor"
                  fill-rule="nonzero"
                ></path>
              </g>
            </svg>
          </div>
          <div class="state-dots-wrap">
            <span>{{ states[currentState] }}</span>
            <div *ngIf="currentState !== 0" class="dots">              <div
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
export class SaturateComponent implements OnInit, OnDestroy {
  document = inject(DOCUMENT);
  i18n = inject(I18nService);
  parent = inject(IzmoAccessibilityComponent);
  renderer = inject(Renderer2);

  currentState = 0;
  private styleElement?: HTMLStyleElement;
  
  // Make these reactive to language changes
  get base() {
    return this.i18n.getTranslation('saturation');
  }
  
  get states() {
    return [
      this.base, 
      this.i18n.getTranslation('low-saturation'), 
      this.i18n.getTranslation('high-saturation'), 
      this.i18n.getTranslation('desaturated')
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

  ngOnInit() {
    this.parent.resetEvent.subscribe(() => {
      this.currentState = 0;
      this._resetSaturation();
    });
  }

  ngOnDestroy() {
    this._resetSaturation();
  }

  nextState() {
    this.currentState += 1;
    this.currentState = this.currentState % 4;

    this._runStateLogic();
  }

  private _runStateLogic() {
    this._resetSaturation();
    
    if (this.currentState === 0) {
      return; // No filter applied
    }

    // Create style element to apply filters to body content excluding widget
    this.styleElement = this.renderer.createElement('style');
    this.renderer.addClass(this.styleElement, 'izmo-saturation-styles');
    
    let filterCSS = '';
    
    if (this.currentState === 1) {
      filterCSS = `
        /* Apply low saturation to body content excluding widget */
        body > *:not(izmo-accessibility) {
          filter: saturate(0.4) !important;
        }
      `;
    }

    if (this.currentState === 2) {
      filterCSS = `
        /* Apply high saturation to body content excluding widget */
        body > *:not(izmo-accessibility) {
          filter: saturate(2.5) !important;
        }
      `;
    }

    if (this.currentState === 3) {
      filterCSS = `
        /* Apply desaturation to body content excluding widget */
        body > *:not(izmo-accessibility) {
          filter: saturate(0) !important;
        }
      `;
    }

    this.renderer.setProperty(this.styleElement, 'textContent', filterCSS);
    this.renderer.appendChild(document.head, this.styleElement);
  }

  private _resetSaturation() {
    // Remove the style element if it exists
    if (this.styleElement) {
      this.renderer.removeChild(document.head, this.styleElement);
      this.styleElement = undefined;
    }
    
    // Also remove any existing body classes for backward compatibility
    this.document.body.classList.remove("izmo_low_saturation");
    this.document.body.classList.remove("izmo_high_saturation");
    this.document.body.classList.remove("izmo_desaturated");
  }
}
