import { DOCUMENT, NgIf, NgClass } from "@angular/common";
import { Component, inject, Renderer2, OnDestroy } from "@angular/core";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";

interface ContrastResult {
  ratio: number;
  level: 'AAA' | 'AA' | 'A' | 'Fail';
  passes: boolean;
}

@Component({
  selector: "izmo-contrast-enhanced",
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
            <span>{{ i18n.getTranslation('contrast') }}</span>
            <div *ngIf="showContrastInfo && contrastInfo" class="contrast-info">
              <small>Ratio: {{ contrastInfo.ratio.toFixed(2) }}:1 ({{ contrastInfo.level }})</small>
            </div>
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
              <div
                class="dot"
                [ngClass]="{ active: currentState === 4 }"
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
export class ContrastEnhancedComponent implements OnDestroy {
  document = inject(DOCUMENT);
  currentState = 0;
  states = [
    this.i18n.getTranslation('contrast'), 
    this.i18n.getTranslation('invert'), 
    this.i18n.getTranslation('high-contrast'), 
    this.i18n.getTranslation('dark-high-contrast'),
    'Contrast Check'
  ];

  _style: HTMLStyleElement;
  contrastInfo: ContrastResult | null = null;
  showContrastInfo = false;
  private contrastOverlay?: HTMLElement;

  constructor(
    private renderer: Renderer2,
    public i18n: I18nService
  ) {}

  ngOnDestroy() {
    this.removeContrastOverlay();
  }

  nextState() {
    this.currentState += 1;
    this.currentState = this.currentState % 5;
    this._runStateLogic();
  }

  private _runStateLogic() {
    this._style?.remove?.();
    this._style = this.document.createElement("style");
    this.showContrastInfo = false;
    this.removeContrastOverlay();

    if (this.currentState === 1) {
      this.document.documentElement.classList.add("izmo_inverted");
    } else {
      this.document.documentElement.classList.remove("izmo_inverted");
    }

    if (this.currentState === 2) {
      this._style.textContent = `
            body > :not(izmo-accessibility) * {
                background: transparent !important;
                color: #000 !important;
            }

            html body > :not(izmo-accessibility), html body > :not(izmo-accessibility) a {
              color: #23ebf7 !important;
            }

            html body > :not(izmo-accessibility) button {
              background-color: #e8e8e8 !important;
            }
        `;
    }

    if (this.currentState === 3) {
      this._style.textContent = `
            body > :not(izmo-accessibility), body > :not(izmo-accessibility) * {
              background: black !important;
              font-weight: 700;
              color: #fff !important;
            }

            body > :not(izmo-accessibility), body > :not(izmo-accessibility) a {
              color: #23ebf7 !important;
            }
        `;
    }

    if (this.currentState === 4) {
      this.showContrastChecker();
    }

    this.document.body.appendChild(this._style);
  }

  private showContrastChecker() {
    this.contrastOverlay = this.renderer.createElement('div');
    this.renderer.setStyle(this.contrastOverlay, 'position', 'fixed');
    this.renderer.setStyle(this.contrastOverlay, 'top', '20px');
    this.renderer.setStyle(this.contrastOverlay, 'right', '20px');
    this.renderer.setStyle(this.contrastOverlay, 'width', '350px');
    this.renderer.setStyle(this.contrastOverlay, 'background', 'white');
    this.renderer.setStyle(this.contrastOverlay, 'border', '2px solid #0066cc');
    this.renderer.setStyle(this.contrastOverlay, 'border-radius', '8px');
    this.renderer.setStyle(this.contrastOverlay, 'padding', '20px');
    this.renderer.setStyle(this.contrastOverlay, 'z-index', '999999');
    this.renderer.setStyle(this.contrastOverlay, 'box-shadow', '0 4px 20px rgba(0,0,0,0.3)');
    this.renderer.setAttribute(this.contrastOverlay, 'role', 'dialog');
    this.renderer.setAttribute(this.contrastOverlay, 'aria-labelledby', 'contrast-checker-title');

    const checkerHTML = `
      <h3 id="contrast-checker-title" style="margin: 0 0 15px 0; color: #333;">Contrast Checker</h3>
      <p style="margin-bottom: 15px; font-size: 14px;">Click anywhere on the page to check contrast ratio.</p>
      
      <div id="contrast-results" style="display: none;">
        <div style="margin-bottom: 10px;">
          <strong>Foreground:</strong> <span id="fg-color"></span><br>
          <strong>Background:</strong> <span id="bg-color"></span>
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Contrast Ratio:</strong> <span id="contrast-ratio"></span>
        </div>
        <div style="margin-bottom: 15px;">
          <strong>WCAG Level:</strong> <span id="wcag-level"></span>
        </div>
        <div id="compliance-info"></div>
      </div>
      
      <div style="text-align: right;">
        <button id="close-checker" style="padding: 8px 16px; background: #0066cc; color: white; border: none; border-radius: 4px;">Close</button>
      </div>
    `;

    this.renderer.setProperty(this.contrastOverlay, 'innerHTML', checkerHTML);
    this.renderer.appendChild(document.body, this.contrastOverlay);

    // Add event listeners
    const closeButton = this.contrastOverlay.querySelector('#close-checker') as HTMLElement;
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.currentState = 0;
        this._runStateLogic();
      });
    }

    // Add click handler for contrast checking
    const clickHandler = (e: MouseEvent) => {
      if (this.contrastOverlay?.contains(e.target as Node)) return;
      
      const element = e.target as HTMLElement;
      this.checkElementContrast(element);
    };

    document.addEventListener('click', clickHandler);
    
    // Store reference to remove later
    (this.contrastOverlay as any)._clickHandler = clickHandler;
  }

  private checkElementContrast(element: HTMLElement) {
    const styles = window.getComputedStyle(element);
    const fgColor = this.parseColor(styles.color);
    const bgColor = this.getBackgroundColor(element);
    
    if (fgColor && bgColor) {
      const contrastRatio = this.calculateContrastRatio(fgColor, bgColor);
      const result = this.evaluateContrastRatio(contrastRatio);
      
      this.displayContrastResults(fgColor, bgColor, contrastRatio, result);
      this.contrastInfo = result;
      this.showContrastInfo = true;
    }
  }

  private parseColor(colorStr: string): [number, number, number] | null {
    const rgb = colorStr.match(/rgb\\((\\d+),\\s*(\\d+),\\s*(\\d+)\\)/);
    if (rgb) {
      return [parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3])];
    }
    
    if (colorStr.startsWith('#')) {
      const hex = colorStr.slice(1);
      if (hex.length === 3) {
        return [
          parseInt(hex[0] + hex[0], 16),
          parseInt(hex[1] + hex[1], 16),
          parseInt(hex[2] + hex[2], 16)
        ];
      } else if (hex.length === 6) {
        return [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16)
        ];
      }
    }
    
    return null;
  }

  private getBackgroundColor(element: HTMLElement): [number, number, number] | null {
    let current: HTMLElement | null = element;
    
    while (current) {
      const styles = window.getComputedStyle(current);
      const bgColor = styles.backgroundColor;
      
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        return this.parseColor(bgColor);
      }
      
      current = current.parentElement;
    }
    
    // Default to white if no background found
    return [255, 255, 255];
  }

  private calculateContrastRatio(color1: [number, number, number], color2: [number, number, number]): number {
    const l1 = this.getLuminance(color1);
    const l2 = this.getLuminance(color2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  private getLuminance([r, g, b]: [number, number, number]): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  private evaluateContrastRatio(ratio: number): ContrastResult {
    if (ratio >= 7) {
      return { ratio, level: 'AAA', passes: true };
    } else if (ratio >= 4.5) {
      return { ratio, level: 'AA', passes: true };
    } else if (ratio >= 3) {
      return { ratio, level: 'A', passes: false };
    } else {
      return { ratio, level: 'Fail', passes: false };
    }
  }

  private displayContrastResults(
    fgColor: [number, number, number], 
    bgColor: [number, number, number], 
    ratio: number, 
    result: ContrastResult
  ) {
    if (!this.contrastOverlay) return;

    const resultsDiv = this.contrastOverlay.querySelector('#contrast-results') as HTMLElement;
    const fgSpan = this.contrastOverlay.querySelector('#fg-color') as HTMLElement;
    const bgSpan = this.contrastOverlay.querySelector('#bg-color') as HTMLElement;
    const ratioSpan = this.contrastOverlay.querySelector('#contrast-ratio') as HTMLElement;
    const levelSpan = this.contrastOverlay.querySelector('#wcag-level') as HTMLElement;
    const complianceDiv = this.contrastOverlay.querySelector('#compliance-info') as HTMLElement;

    if (resultsDiv) resultsDiv.style.display = 'block';
    
    if (fgSpan) {
      fgSpan.textContent = `rgb(${fgColor.join(', ')})`;
      fgSpan.style.color = `rgb(${fgColor.join(', ')})`;
    }
    
    if (bgSpan) {
      bgSpan.textContent = `rgb(${bgColor.join(', ')})`;
      bgSpan.style.backgroundColor = `rgb(${bgColor.join(', ')})`;
      bgSpan.style.padding = '2px 4px';
      bgSpan.style.borderRadius = '2px';
    }
    
    if (ratioSpan) {
      ratioSpan.textContent = `${ratio.toFixed(2)}:1`;
      ratioSpan.style.fontWeight = 'bold';
      ratioSpan.style.color = result.passes ? '#28a745' : '#dc3545';
    }
    
    if (levelSpan) {
      levelSpan.textContent = result.level;
      levelSpan.style.fontWeight = 'bold';
      levelSpan.style.color = result.level === 'AAA' ? '#28a745' : 
                               result.level === 'AA' ? '#17a2b8' :
                               result.level === 'A' ? '#ffc107' : '#dc3545';
    }
    
    if (complianceDiv) {
      const complianceInfo = this.getComplianceInfo(result);
      complianceDiv.innerHTML = complianceInfo;
    }
  }

  private getComplianceInfo(result: ContrastResult): string {
    const normalTextPass = result.ratio >= 4.5;
    const largeTextPass = result.ratio >= 3.0;
    
    return `
      <div style="font-size: 12px;">
        <div style="color: ${normalTextPass ? '#28a745' : '#dc3545'};">
          ${normalTextPass ? '✓' : '✗'} Normal text (AA): ${normalTextPass ? 'Pass' : 'Fail'}
        </div>
        <div style="color: ${largeTextPass ? '#28a745' : '#dc3545'};">
          ${largeTextPass ? '✓' : '✗'} Large text (AA): ${largeTextPass ? 'Pass' : 'Fail'}
        </div>
        <div style="color: ${result.ratio >= 7 ? '#28a745' : '#dc3545'};">
          ${result.ratio >= 7 ? '✓' : '✗'} Enhanced (AAA): ${result.ratio >= 7 ? 'Pass' : 'Fail'}
        </div>
      </div>
    `;
  }

  private removeContrastOverlay() {
    if (this.contrastOverlay) {
      // Remove event listener
      const clickHandler = (this.contrastOverlay as any)._clickHandler;
      if (clickHandler) {
        document.removeEventListener('click', clickHandler);
      }
      
      this.renderer.removeChild(document.body, this.contrastOverlay);
      this.contrastOverlay = undefined;
    }
  }
}
