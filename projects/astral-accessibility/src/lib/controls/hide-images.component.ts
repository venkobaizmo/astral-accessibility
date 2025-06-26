import { DOCUMENT, NgIf, NgClass } from "@angular/common";
import { Component, inject, Renderer2 } from "@angular/core";
import { AstralCheckmarkSvgComponent } from "../util/astral-checksvg.component";
import { I18nService } from "../services/i18n.service";

@Component({
  selector: "astral-hide-images",
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
              width="25"
              height="25"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="white"
                d="M9 2H7v2H5v2h2v2h2V6h2V4H9V2zm0 8H7v2H5v2h2v2h2v-2h2v-2H9v-2zm10 0v6c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2v-2H5v-2h2v-2h4c1.1 0 2 .9 2 2v4h6z"
              />
              <path
                fill="white"
                d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
                opacity="0.3"
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

      <astral-widget-checkmark
        [isActive]="currentState !== 0"
      ></astral-widget-checkmark>
    </button>
  `,
  imports: [NgIf, NgClass, AstralCheckmarkSvgComponent],
})
export class HideImagesComponent {
  document = inject(DOCUMENT);
  renderer = inject(Renderer2);
  i18n = inject(I18nService);

  currentState = 0;
  base = this.i18n.getTranslation('hide-images');
  states = [
    this.i18n.getTranslation('hide-images'),
    this.i18n.getTranslation('hide-decorative'),
    this.i18n.getTranslation('hide-all'),
    this.i18n.getTranslation('text-only')
  ];

  private styleElement?: HTMLStyleElement;

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
      return; // Show all images
    }

    // Create new style element
    this.styleElement = this.renderer.createElement('style');
    let css = '';

    if (this.currentState === 1) {
      css = `
        img[alt=""], img:not([alt]), img[alt*="decoration"], img[alt*="spacer"],
        img[src*="decoration"], img[src*="spacer"], img[src*="pixel"],
        .decoration img, .banner img, .hero img,
        [class*="bg-"], [class*="background"] img,
        picture img:not([alt]), figure img:not([alt]) {
          display: none !important;
        }
        
        /* Replace with placeholder text */
        img[alt=""]:after, img:not([alt]):after {
          content: "[Decorative Image Hidden]";
          display: inline-block;
          background: #f0f0f0;
          padding: 5px;
          border: 1px solid #ccc;
          font-size: 12px;
          color: #666;
        }
      `;
    }

    if (this.currentState === 2) {
      css = `
        img, picture, figure img, video, svg:not(.icon), canvas,
        [style*="background-image"], .image, [class*="img-"] {
          display: none !important;
        }
        
        /* Show alt text instead */
        img[alt]:after {
          content: "[Image: " attr(alt) "]";
          display: inline-block;
          background: #e8f4fd;
          padding: 5px 8px;
          border: 1px solid #0066cc;
          border-radius: 3px;
          font-size: 12px;
          color: #0066cc;
          font-weight: normal;
        }
        
        img:not([alt]):after {
          content: "[Image Hidden - No Description]";
          display: inline-block;
          background: #fff3cd;
          padding: 5px 8px;
          border: 1px solid #856404;
          border-radius: 3px;
          font-size: 12px;
          color: #856404;
        }
      `;
    }

    if (this.currentState === 3) {
      css = `
        img, picture, figure, video, svg, canvas, iframe, embed, object,
        [style*="background-image"], [style*="background:"],
        .image, .photo, .picture, .banner, .hero, .carousel,
        [class*="img-"], [class*="bg-"], [class*="background"] {
          display: none !important;
        }
        
        /* Enhanced text visibility */
        body {
          background: white !important;
          color: black !important;
        }
        
        * {
          background-image: none !important;
          border-image: none !important;
        }
        
        /* Show meaningful alt text */
        img[alt]:after {
          content: attr(alt);
          display: block;
          background: #f8f9fa;
          padding: 8px 12px;
          border-left: 4px solid #0066cc;
          margin: 5px 0;
          font-style: italic;
          font-size: 14px;
          color: #495057;
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
