import { DOCUMENT, NgIf, NgClass } from "@angular/common";
import { Component, Renderer2, OnDestroy, inject } from "@angular/core";
import { AstralCheckmarkSvgComponent } from "../util/astral-checksvg.component";
import { I18nService } from "../services/i18n.service";

@Component({
  selector: "astral-dyslexia-friendly",
  standalone: true,  template: `
    <button      (click)="nextState()"
      [ngClass]="{ 'in-use': !isBaseState() }"
      [attr.aria-label]="getAriaLabel()"
      [attr.aria-pressed]="!isBaseState()"
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
              width="25"
              height="25"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="white"
                d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"
              />
            </svg>
          </div>

          <div class="state-dots-wrap">
            <span>{{ getDisplayText() }}</span>
            <div
              class="dots"
              [ngClass]="{ inactive: isBaseState() }"
            >
              <div
                class="dot"
                [ngClass]="{ active: isOpenDyslexicActive() }"
              ></div>
              <div
                class="dot"
                [ngClass]="{ active: isHighReadabilityActive() }"
              ></div>
              <div
                class="dot"
                [ngClass]="{ active: isReadingGuideActive() }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <astral-widget-checkmark
        [isActive]="!isBaseState()"
      ></astral-widget-checkmark>
    </button>
  `,
  imports: [NgIf, NgClass, AstralCheckmarkSvgComponent],
})
export class DyslexiaFriendlyComponent implements OnDestroy {
  document = inject(DOCUMENT);
  
  currentState = 0;
  private styleElement?: HTMLStyleElement;
  private fontLoaded = false;
  private scrollHandler?: () => void;

  constructor(private readonly renderer: Renderer2, public readonly i18n: I18nService) {}  get baseText() {
    return this.i18n.getTranslation('dyslexia-friendly' as any);
  }

  get openDyslexicFontText() {
    return this.i18n.getTranslation('dyslexia-opendyslexic-font' as any);
  }

  get highReadabilityText() {
    return this.i18n.getTranslation('dyslexia-high-readability' as any);
  }

  get readingGuideText() {
    return this.i18n.getTranslation('dyslexia-reading-guide' as any);
  }

  getDisplayText(): string {
    switch (this.currentState) {
      case 0:
        return this.baseText;
      case 1:
        return this.openDyslexicFontText;
      case 2:
        return this.highReadabilityText;
      case 3:
        return this.readingGuideText;
      default:
        return this.baseText;
    }
  }

  isBaseState(): boolean {
    return this.currentState === 0;
  }

  isOpenDyslexicActive(): boolean {
    return this.currentState === 1;
  }

  isHighReadabilityActive(): boolean {
    return this.currentState === 2;
  }
  isReadingGuideActive(): boolean {
    return this.currentState === 3;
  }

  nextState() {
    this.currentState += 1;
    this.currentState = this.currentState % 4;
    this._runStateLogic();
    this.announceChange();
  }
  private _runStateLogic() {
    // Remove existing styles
    if (this.styleElement) {
      this.renderer.removeChild(this.document.head, this.styleElement);
      this.styleElement = undefined;
    }

    if (this.isBaseState()) {
      return; // Normal text
    }

    // Load OpenDyslexic font if not already loaded
    if (!this.fontLoaded) {
      this.loadDyslexicFont();
    }

    // Create new style element
    this.styleElement = this.renderer.createElement('style');
    let css = '';

    if (this.isOpenDyslexicActive()) {
      css = `
        body > :not(astral-accessibility) * {
          font-family: 'OpenDyslexic', 'Comic Sans MS', 'Verdana', sans-serif !important;
        }
        
        body > :not(astral-accessibility) p, 
        body > :not(astral-accessibility) span, 
        body > :not(astral-accessibility) div, 
        body > :not(astral-accessibility) li, 
        body > :not(astral-accessibility) td, 
        body > :not(astral-accessibility) th, 
        body > :not(astral-accessibility) h1, 
        body > :not(astral-accessibility) h2, 
        body > :not(astral-accessibility) h3, 
        body > :not(astral-accessibility) h4, 
        body > :not(astral-accessibility) h5, 
        body > :not(astral-accessibility) h6 {
          line-height: 1.8 !important;
          word-spacing: 0.1em !important;
          letter-spacing: 0.05em !important;
        }
      `;
    }

    if (this.isHighReadabilityActive()) {
      css = `
        body > :not(astral-accessibility) * {
          font-family: 'OpenDyslexic', 'Verdana', 'Arial', sans-serif !important;
          font-weight: 400 !important;
        }
        
        body > :not(astral-accessibility) {
          background-color: #fefefe !important;
          color: #1a1a1a !important;
        }
        
        body > :not(astral-accessibility) p, 
        body > :not(astral-accessibility) span, 
        body > :not(astral-accessibility) div, 
        body > :not(astral-accessibility) li, 
        body > :not(astral-accessibility) td, 
        body > :not(astral-accessibility) th, 
        body > :not(astral-accessibility) h1, 
        body > :not(astral-accessibility) h2, 
        body > :not(astral-accessibility) h3, 
        body > :not(astral-accessibility) h4, 
        body > :not(astral-accessibility) h5, 
        body > :not(astral-accessibility) h6 {
          line-height: 2.0 !important;
          word-spacing: 0.15em !important;
          letter-spacing: 0.1em !important;
          text-align: left !important;
          text-justify: none !important;
          hyphens: none !important;
        }
        
        /* Reduce visual clutter */
        body > :not(astral-accessibility) * {
          text-decoration: none !important;
          text-shadow: none !important;
        }
        
        /* Better contrast */
        body > :not(astral-accessibility) a {
          color: #0066cc !important;
          background-color: rgba(0, 102, 204, 0.1) !important;
          padding: 1px 2px !important;
          border-radius: 2px !important;
        }
        
        /* Paragraph spacing */
        body > :not(astral-accessibility) p {
          margin-bottom: 1.5em !important;
        }
      `;
    }

    if (this.isReadingGuideActive()) {
      css = `
        body > :not(astral-accessibility) * {
          font-family: 'OpenDyslexic', 'Verdana', 'Arial', sans-serif !important;
        }
        
        body > :not(astral-accessibility) {
          background-color: #f9f7f4 !important;
          color: #2c2c2c !important;
        }
        
        body > :not(astral-accessibility) p, 
        body > :not(astral-accessibility) span, 
        body > :not(astral-accessibility) div, 
        body > :not(astral-accessibility) li, 
        body > :not(astral-accessibility) td, 
        body > :not(astral-accessibility) th, 
        body > :not(astral-accessibility) h1, 
        body > :not(astral-accessibility) h2, 
        body > :not(astral-accessibility) h3, 
        body > :not(astral-accessibility) h4, 
        body > :not(astral-accessibility) h5, 
        body > :not(astral-accessibility) h6 {
          line-height: 2.2 !important;
          word-spacing: 0.2em !important;
          letter-spacing: 0.12em !important;
          max-width: 70ch !important;
        }
        
        /* Reading ruler/guide */
        .astral-reading-guide {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1);
          z-index: 999999;
          pointer-events: none;
        }
        
        /* Focus paragraph highlighting */
        body > :not(astral-accessibility) p:hover, 
        body > :not(astral-accessibility) li:hover {
          background-color: rgba(255, 255, 0, 0.2) !important;
          border-left: 4px solid #ff6b6b !important;
          padding-left: 8px !important;
        }
        
        /* Column layout for better reading */
        body > :not(astral-accessibility) .content, 
        body > :not(astral-accessibility) .main, 
        body > :not(astral-accessibility) article, 
        body > :not(astral-accessibility) .post {
          column-width: 35em !important;
          column-gap: 2em !important;
          column-rule: 1px solid #ddd !important;
        }
      `;
    }

    this.renderer.setProperty(this.styleElement, 'textContent', css);
    this.renderer.appendChild(this.document.head, this.styleElement);

    // Add reading guide if needed
    if (this.isReadingGuideActive()) {
      this.addReadingGuide();
    }
  }

  private loadDyslexicFont() {
    if (this.fontLoaded) return;
    
    const fontLink = this.renderer.createElement('link');
    this.renderer.setAttribute(fontLink, 'rel', 'stylesheet');
    this.renderer.setAttribute(fontLink, 'href', 'https://cdn.jsdelivr.net/npm/opendyslexic@1.0.3/opendyslexic.css');
    this.renderer.appendChild(this.document.head, fontLink);
    this.fontLoaded = true;
  }
  private addReadingGuide() {
    const existingGuide = this.document.querySelector('.astral-reading-guide');
    if (existingGuide) return;

    const guide = this.renderer.createElement('div');
    this.renderer.addClass(guide, 'astral-reading-guide');
    this.renderer.appendChild(this.document.body, guide);

    // Follow scroll position
    const scrollHandler = () => {
      const scrollPercent = (window.scrollY / (this.document.body.scrollHeight - window.innerHeight)) * 100;
      guide.style.background = `linear-gradient(90deg, 
        #ff6b6b 0%, 
        #ff6b6b ${scrollPercent}%, 
        rgba(255, 107, 107, 0.3) ${scrollPercent}%, 
        rgba(255, 107, 107, 0.3) 100%)`;
    };

    window.addEventListener('scroll', scrollHandler);
      // Store the handler for cleanup
    this.scrollHandler = scrollHandler;
  }
  getAriaLabel(): string {
    if (this.isBaseState()) {
      return this.i18n.getTranslation('enable-dyslexia-friendly' as any);
    }
    return `${this.i18n.getTranslation('dyslexia-friendly-active' as any)}: ${this.getDisplayText()}. Click to change mode.`;
  }

  private announceChange() {
    let message = '';
    if (this.isBaseState()) {
      message = this.i18n.getTranslation('dyslexia-friendly-disabled' as any);
    } else {
      switch (this.currentState) {
        case 1:
          message = this.i18n.getTranslation('dyslexia-friendly-opendyslexic' as any);
          break;
        case 2:
          message = this.i18n.getTranslation('dyslexia-friendly-high-readability' as any);
          break;
        case 3:
          message = this.i18n.getTranslation('dyslexia-friendly-reading-guide' as any);
          break;
      }
    }
    
    const announcement = this.renderer.createElement('div');
    this.renderer.setAttribute(announcement, 'aria-live', 'polite');
    this.renderer.setAttribute(announcement, 'aria-atomic', 'true');
    this.renderer.setStyle(announcement, 'position', 'absolute');
    this.renderer.setStyle(announcement, 'left', '-10000px');
    this.renderer.setProperty(announcement, 'textContent', message);
    this.renderer.appendChild(this.document.body, announcement);
    
    setTimeout(() => {
      this.renderer.removeChild(this.document.body, announcement);
    }, 1000);
  }

  ngOnDestroy() {
    if (this.styleElement) {
      this.renderer.removeChild(this.document.head, this.styleElement);
    }
    const guide = this.document.querySelector('.astral-reading-guide');
    if (guide) {
      this.renderer.removeChild(this.document.body, guide);
    }
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }
}
