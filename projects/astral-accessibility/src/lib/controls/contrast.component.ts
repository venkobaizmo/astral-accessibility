import { DOCUMENT, NgIf, NgClass } from "@angular/common";
import { Component, inject, OnInit, OnDestroy, Renderer2 } from "@angular/core";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

@Component({
  selector: "izmo-contrast",
  standalone: true,
  template: `
    <button
      (click)="nextState()"
      [ngClass]="{ 'in-use': currentState !== 0 }"
    >
      <div class="title">
        <div class="icon-state-wrap">
          <!-- <i
            class="pi pi-minus-circle icon action-icon "
            [ngClass]="{
              inactive: currentState == 0,
              active: currentState != 0
            }"
          ></i> -->
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
              viewBox="0 0 41 41"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <clipPath id="j7jc4ss84a">
                  <path d="M1440 0v900H0V0h1440z" />
                </clipPath>
                <clipPath id="t65z0zbfzb">
                  <path
                    d="M20.5 0C31.804 0 41 9.196 41 20.5S31.804 41 20.5 41 0 31.804 0 20.5 9.196 0 20.5 0zm0 2.32c-10.024 0-18.18 8.156-18.18 18.18s8.156 18.18 18.18 18.18z"
                  />
                </clipPath>
              </defs>
              <g clip-path="url(#j7jc4ss84a)" transform="translate(-1084 -366)">
                <g clip-path="url(#t65z0zbfzb)" transform="translate(1084 366)">
                  <path fill="currentColor" d="M0 0h41v41H0V0z" />
                </g>
              </g>
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
export class ContrastComponent implements OnInit, OnDestroy {
  document = inject(DOCUMENT);
  i18n = inject(I18nService);
  parent = inject(IzmoAccessibilityComponent);
  renderer = inject(Renderer2);

  currentState = 0;
  private styleElement?: HTMLStyleElement;
  
  // Make these reactive to language changes
  get base() {
    return this.i18n.getTranslation('contrast');
  }
  
  get states() {
    return [
      this.base, 
      this.i18n.getTranslation('invert'), 
      this.i18n.getTranslation('high-contrast'), 
      this.i18n.getTranslation('dark-high-contrast')
    ];
  }

  ngOnInit() {
    this.parent.resetEvent.subscribe(() => {
      this.currentState = 0;
      this._runStateLogic();
    });
  }

  ngOnDestroy() {
    this._resetContrast();
  }

  nextState() {
    this.currentState += 1;
    this.currentState = this.currentState % 4;

    this._runStateLogic();
  }

  private _runStateLogic() {
    this._resetContrast();
    
    if (this.currentState === 0) {
      return; // No contrast applied
    }

    // Create style element to apply contrast effects to body content excluding widget
    this.styleElement = this.renderer.createElement('style');
    this.renderer.addClass(this.styleElement, 'izmo-contrast-styles');
    
    let contrastCSS = '';
    
    if (this.states[this.currentState] === this.i18n.getTranslation('invert')) {
      contrastCSS = `
        /* Apply invert filter to body content excluding widget */
        body > *:not(izmo-accessibility) {
          filter: invert(1) !important;
        }
      `;
    }

    if (this.states[this.currentState] === this.i18n.getTranslation('high-contrast')) {
      contrastCSS = `
        /* Apply high contrast to body content excluding widget */
        body > *:not(izmo-accessibility) * {
          background: transparent !important;
          color: #000 !important;
        }

        body > *:not(izmo-accessibility) button {
          background-color: #e8e8e8 !important;
        }
      `;
    }
    
    if (this.states[this.currentState] === this.i18n.getTranslation('dark-high-contrast')) {
      contrastCSS = `
        /* Apply dark high contrast to body content excluding widget */
        body > *:not(izmo-accessibility), body > *:not(izmo-accessibility) * {
          background: black !important;
          font-weight: 700;
          color: #fff !important;
        }

        body > *:not(izmo-accessibility) a {
          color: #23ebf7 !important;
        }
      `;
    }

    this.renderer.setProperty(this.styleElement, 'textContent', contrastCSS);
    this.renderer.appendChild(document.head, this.styleElement);
  }

  private _resetContrast() {
    // Remove the style element if it exists
    if (this.styleElement) {
      this.renderer.removeChild(document.head, this.styleElement);
      this.styleElement = undefined;
    }
    
    // Also remove any existing body classes for backward compatibility
    this.document.body.classList.remove("izmo_inverted");
  }
}
