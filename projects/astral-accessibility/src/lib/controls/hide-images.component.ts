import { DOCUMENT, NgIf, NgClass } from "@angular/common";
import { Component, inject, Renderer2, OnDestroy, OnInit } from "@angular/core";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

@Component({
  selector: "izmo-hide-images",
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
                d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
              />
              <path
                d="M8 8L16 16M16 8L8 16"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                fill="none"
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
export class HideImagesComponent implements OnInit, OnDestroy {
  constructor(
    private renderer: Renderer2,
    private i18n: I18nService
  ) {}

  document = inject(DOCUMENT);
  
  get base() {
    return this.i18n.getTranslation('hide-images');
  }
  
  get states() {
    return [
      this.i18n.getTranslation('hide-images'),
      this.i18n.getTranslation('hide-decorative'),
      this.i18n.getTranslation('hide-all'),
      this.i18n.getTranslation('text-only')
    ];
  }

  currentState = 0;
  private styleElement?: HTMLStyleElement;
  parent = inject(IzmoAccessibilityComponent);

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
      return; // Show all images
    }

    // Create new style element
    this.styleElement = this.renderer.createElement('style');
    let css = '';

    if (this.currentState === 1) {
      css = `
        /* Hide decorative images everywhere except the widget */
        img[alt=""], img:not([alt]), img[alt*="decoration"], img[alt*="spacer"],
        img[src*="decoration"], img[src*="spacer"], img[src*="pixel"],
        .decoration img, .banner img, .hero img,
        [class*="bg-"] img, [class*="background"] img,
        picture img:not([alt]), figure img:not([alt]) {
          display: none !important;
        }
        
        /* Force show widget images */
        izmo-accessibility img,
        izmo-accessibility * img {
          display: inline-block !important;
          visibility: visible !important;
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
        
        /* Don't show placeholder for widget images */
        izmo-accessibility img:after,
        izmo-accessibility * img:after {
          content: none !important;
          display: none !important;
        }
      `;
    }

    if (this.currentState === 2) {
      css = `
        /* Hide all images everywhere except the widget */
        body img:not(izmo-accessibility img):not(izmo-accessibility * img),
        body picture:not(izmo-accessibility picture):not(izmo-accessibility * picture),
        body figure img:not(izmo-accessibility img):not(izmo-accessibility * img),
        body video:not(izmo-accessibility video):not(izmo-accessibility * video),
        body svg:not(.icon):not(izmo-accessibility svg):not(izmo-accessibility * svg),
        body canvas:not(izmo-accessibility canvas):not(izmo-accessibility * canvas),
        body [style*="background-image"]:not(izmo-accessibility *),
        body .image:not(izmo-accessibility *),
        body [class*="img-"]:not(izmo-accessibility *) {
          display: none !important;
        }
        
        /* Show alt text instead */
        img[alt]:not(izmo-accessibility img):not(izmo-accessibility * img):after {
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
        
        img:not([alt]):not(izmo-accessibility img):not(izmo-accessibility * img):after {
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
        /* Hide all visual elements everywhere except the widget */
        img, picture, figure, video, svg, canvas, iframe, embed, object,
        [style*="background-image"], [style*="background:"],
        .image, .photo, .picture, .banner, .hero, .carousel,
        [class*="img-"], [class*="bg-"], [class*="background"] {
          display: none !important;
        }
        
        /* Force show all widget elements */
        izmo-accessibility img,
        izmo-accessibility * img,
        izmo-accessibility svg,
        izmo-accessibility * svg,
        izmo-accessibility picture,
        izmo-accessibility * picture,
        izmo-accessibility video,
        izmo-accessibility * video,
        izmo-accessibility canvas,
        izmo-accessibility * canvas,
        izmo-accessibility iframe,
        izmo-accessibility * iframe,
        izmo-accessibility embed,
        izmo-accessibility * embed,
        izmo-accessibility object,
        izmo-accessibility * object {
          display: inline-block !important;
          visibility: visible !important;
        }
        
        /* Enhanced text visibility for content outside widget */
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
        
        /* Don't show placeholder for widget images */
        izmo-accessibility img:after,
        izmo-accessibility * img:after {
          content: none !important;
          display: none !important;
        }
      `;
    }

    this.renderer.setProperty(this.styleElement, 'textContent', css);
    this.renderer.appendChild(this.document.head, this.styleElement);
  }

  ngOnDestroy() {
    if (this.styleElement) {
      this.renderer.removeChild(this.document.head, this.styleElement);
      this.styleElement = undefined;
    }
  }
} 