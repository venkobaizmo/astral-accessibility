import { DOCUMENT, NgIf, NgClass } from "@angular/common";
import { Component, inject, Renderer2, OnInit } from "@angular/core";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

@Component({
  selector: "izmo-cursor",
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
                d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z"
              />
              <circle cx="8" cy="8" r="2" fill="currentColor"/>
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
export class CursorComponent implements OnInit {
  document = inject(DOCUMENT);
  renderer = inject(Renderer2);
  i18n = inject(I18nService);
  parent = inject(IzmoAccessibilityComponent);

  currentState = 0;
  
  // Make these reactive to language changes
  get base() {
    return this.i18n.getTranslation('cursor');
  }
  
  get states() {
    return [
      this.base,
      this.i18n.getTranslation('large-cursor'),
      this.i18n.getTranslation('high-contrast-cursor'),
      this.i18n.getTranslation('reading-cursor')
    ];
  }

  get isActive(): boolean {
    return this.currentState !== 0;
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
      return; // Normal cursor
    }

    // Create new style element
    this.styleElement = this.renderer.createElement('style');
    let css = '';

    if (this.currentState === 1) {
      css = `
        * {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="white" stroke="black" stroke-width="1" d="M8.5 2.1l1.9 12.2 4.8-4.8 3.6 3.6-4.8 4.8L26.2 19.9z"/></svg>') 16 16, auto !important;
        }
        
        a, button, [role="button"], [role="link"], input, select, textarea {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="yellow" stroke="black" stroke-width="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>') 16 16, pointer !important;
        }
      `;
    }

    if (this.currentState === 2) {
      css = `
        * {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="white" stroke="black" stroke-width="3" d="M8.5 2.1l1.9 12.2 4.8-4.8 3.6 3.6-4.8 4.8L26.2 19.9z"/></svg>') 12 12, auto !important;
        }
        
        a, button, [role="button"], [role="link"] {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="white" stroke="black" stroke-width="3"/><path fill="black" d="M9 12l2 2 4-4"/></svg>') 12 12, pointer !important;
        }
        
        input, textarea, select {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="10" y="2" width="4" height="20" fill="white" stroke="black" stroke-width="2"/><rect x="6" y="2" width="12" height="4" fill="white" stroke="black" stroke-width="2"/><rect x="6" y="18" width="12" height="4" fill="white" stroke="black" stroke-width="2"/></svg>') 12 12, text !important;
        }
      `;
    }

    if (this.currentState === 3) {
      css = `
        * {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="10" y="2" width="4" height="20" fill="yellow" stroke="black" stroke-width="2"/><rect x="6" y="2" width="12" height="4" fill="yellow" stroke="black" stroke-width="2"/><rect x="6" y="18" width="12" height="4" fill="yellow" stroke="black" stroke-width="2"/></svg>') 12 12, auto !important;
        }
      `;
    }
    this.renderer.setProperty(this.styleElement, 'textContent', css);
    this.renderer.appendChild(this.document.head, this.styleElement);
  }

  toggleFromProfile(desiredState: boolean) {
    if (desiredState && this.currentState === 0) {
      this.currentState = 1;
      this._runStateLogic();
    } else if (!desiredState && this.currentState !== 0) {
      this.currentState = 0;
      this._runStateLogic();
    }
  }
}