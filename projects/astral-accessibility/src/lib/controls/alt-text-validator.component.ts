import { DOCUMENT, NgIf, NgClass, NgFor } from "@angular/common";
import { Component, inject, Renderer2, OnDestroy, OnInit } from "@angular/core";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

interface ImageIssue {
  element: HTMLImageElement;
  issue: 'missing-alt' | 'empty-alt' | 'decorative' | 'informative';
  suggestion: string;
}

@Component({
  selector: "izmo-alt-text-validator",
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
              <rect x="4" y="8" width="33" height="25" fill="none" stroke="currentColor" stroke-width="2"/>
              <path fill="currentColor" d="M3 8h35v25H3z"/>
              <circle cx="20.5" cy="20.5" r="8" fill="none" stroke="currentColor" stroke-width="2"/>
              <text x="20" y="30" font-family="Arial" font-size="8" fill="currentColor">ALT</text>
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
            </div>
          </div>
        </div>
      </div>

      <izmo-widget-checkmark
        [isActive]="currentState !== 0"
      ></izmo-widget-checkmark>
    </button>

    <div 
      *ngIf="showIssuesPanel" 
      class="alt-text-issues-panel"
      role="dialog"
      aria-labelledby="alt-text-title"
      [style.position]="'fixed'"
      [style.top]="'20px'"
      [style.left]="'20px'"
      [style.width]="'400px'"
      [style.max-height]="'70vh'"
      [style.overflow-y]="'auto'"
      [style.background]="'white'"
      [style.border]="'2px solid #0066cc'"
      [style.border-radius]="'8px'"
      [style.padding]="'20px'"
      [style.z-index]="'999999'"
      [style.box-shadow]="'0 4px 20px rgba(0,0,0,0.3)'"
    >
      <h3 id="alt-text-title" [style.margin]="'0 0 15px 0'" [style.color]="'#333'">
        Image Alt Text Issues ({{ imageIssues.length }})
      </h3>
      
      <div *ngIf="imageIssues.length === 0" [style.color]="'#28a745'">
        ✓ All images have appropriate alt text!
      </div>
      
      <div *ngFor="let issue of imageIssues; index as i" 
           [style.margin-bottom]="'15px'"
           [style.padding]="'10px'"
           [style.border]="'1px solid #ddd'"
           [style.border-radius]="'4px'">
        
        <div [style.font-weight]="'bold'" [style.margin-bottom]="'5px'">
          Image {{ i + 1 }}: {{ getIssueTitle(issue.issue) }}
        </div>
        
        <div [style.margin-bottom]="'8px'" [style.font-size]="'14px'">
          <strong>Image:</strong> {{ getImageDescription(issue.element) }}
        </div>
        
        <div [style.margin-bottom]="'8px'" [style.color]="'#666'" [style.font-size]="'14px'">
          {{ issue.suggestion }}
        </div>
        
        <button 
          (click)="highlightElement(issue.element)"
          [style.padding]="'4px 8px'"
          [style.background]="'#0066cc'"
          [style.color]="'white'"
          [style.border]="'none'"
          [style.border-radius]="'3px'"
          [style.font-size]="'12px'"
          [style.cursor]="'pointer'"
        >
          Highlight Element
        </button>
      </div>
      
      <div [style.text-align]="'right'" [style.margin-top]="'15px'">
        <button 
          (click)="closeIssuesPanel()"
          [style.padding]="'8px 16px'"
          [style.background]="'#0066cc'"
          [style.color]="'white'"
          [style.border]="'none'"
          [style.border-radius]="'4px'"
        >
          Close
        </button>
      </div>
    </div>
  `,
  imports: [NgIf, NgClass, NgFor, IzmoCheckmarkSvgComponent],
})
export class AltTextValidatorComponent implements OnInit, OnDestroy {
  constructor(
    private renderer: Renderer2,
    private i18n: I18nService,
    private parent: IzmoAccessibilityComponent
  ) {}

  document = inject(DOCUMENT);
  currentState = 0;
  
  get base() {
    return this.i18n.getTranslation('alt-text-validator');
  }
  
  get states() {
    return [
      this.i18n.getTranslation('alt-text-validator'),
      this.i18n.getTranslation('validate-alt-text'),
      this.i18n.getTranslation('alt-text-issues-found')
    ];
  }
  
  imageIssues: ImageIssue[] = [];
  showIssuesPanel = false;
  highlightedElements: HTMLElement[] = [];

  ngOnInit() {
    this.parent.resetEvent.subscribe(() => {
      this.currentState = 0;
      this._runStateLogic();
    });
  }

  nextState() {
    this.currentState += 1;
    this.currentState = this.currentState % 3;
    this._runStateLogic();
  }

  private _runStateLogic() {
    // Remove any existing highlights
    this.removeHighlights();

    if (this.currentState === 1) {
      this.scanForAltTextIssues();
      this.showIssuesPanel = true;
    } else if (this.currentState === 2) {
      this.showFixGuidance();
    } else {
      this.showIssuesPanel = false;
      this.imageIssues = [];
    }
  }

  private scanForAltTextIssues() {
    this.imageIssues = [];
    const images = this.document.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
    
    images.forEach(img => {
      // Skip images that are part of the accessibility widget
      if (img.closest('izmo-accessibility')) return;
      
      const alt = img.getAttribute('alt');
      const src = img.src;
      const role = img.getAttribute('role');
      
      // Check for missing alt attribute
      if (alt === null) {
        this.imageIssues.push({
          element: img,
          issue: 'missing-alt',
          suggestion: 'Add an alt attribute. Use alt="" for decorative images or descriptive text for informative images.'
        });
      }
      // Check for empty alt on potentially informative images
      else if (alt === '' && !this.isLikelyDecorative(img)) {
        this.imageIssues.push({
          element: img,
          issue: 'empty-alt',
          suggestion: 'This image appears to be informative but has empty alt text. Consider adding a descriptive alt attribute.'
        });
      }
      // Check for generic or poor alt text
      else if (alt && this.isPoorAltText(alt)) {
        this.imageIssues.push({
          element: img,
          issue: 'informative',
          suggestion: `Alt text "${alt}" is too generic. Provide more specific description of the image content and purpose.`
        });
      }
    });

    this.announceResults();
  }

  private isLikelyDecorative(img: HTMLImageElement): boolean {
    const parent = img.parentElement;    const classes = img.className.toLowerCase();
    const src = img.src.toLowerCase();
    
    // Check for common decorative patterns
    return (
      classes.includes('decoration') ||
      classes.includes('background') ||
      classes.includes('icon') ||
      classes.includes('spacer') ||
      src.includes('spacer') ||
      src.includes('pixel') ||
      (img.width <= 10 && img.height <= 10) ||
      (parent !== null && parent.tagName.toLowerCase() === 'button' && parent.querySelectorAll('img').length > 1)
    );
  }

  private isPoorAltText(alt: string): boolean {
    const poorPatterns = [
      /^image$/i,
      /^picture$/i,
      /^photo$/i,
      /^graphic$/i,
      /^img_?\d*$/i,
      /^dsc_?\d*$/i,
      /^untitled$/i,
      /^\.jpg$/i,
      /^\.png$/i,
      /^\.gif$/i,
      /click here/i,
      /^here$/i
    ];
    
    return poorPatterns.some(pattern => pattern.test(alt.trim())) || alt.trim().length < 3;
  }

  private showFixGuidance() {
    // Highlight all problematic images
    this.imageIssues.forEach(issue => {
      this.highlightElement(issue.element);
    });
  }

  highlightElement(element: HTMLElement) {
    // Remove existing highlights
    this.removeHighlights();
    
    // Add highlight to this element
    const highlight = this.renderer.createElement('div');
    this.renderer.setStyle(highlight, 'position', 'absolute');
    this.renderer.setStyle(highlight, 'border', '3px solid #ff0000');
    this.renderer.setStyle(highlight, 'background', 'rgba(255, 0, 0, 0.1)');
    this.renderer.setStyle(highlight, 'pointer-events', 'none');
    this.renderer.setStyle(highlight, 'z-index', '999998');
    this.renderer.setStyle(highlight, 'border-radius', '4px');
    
    const rect = element.getBoundingClientRect();
    this.renderer.setStyle(highlight, 'top', `${rect.top + window.scrollY - 3}px`);
    this.renderer.setStyle(highlight, 'left', `${rect.left + window.scrollX - 3}px`);
    this.renderer.setStyle(highlight, 'width', `${rect.width + 6}px`);
    this.renderer.setStyle(highlight, 'height', `${rect.height + 6}px`);
    
    this.renderer.appendChild(this.document.body, highlight);
    this.highlightedElements.push(highlight);
    
    // Scroll element into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remove highlight after 5 seconds
    setTimeout(() => {
      if (highlight.parentNode) {
        this.renderer.removeChild(this.document.body, highlight);
        const index = this.highlightedElements.indexOf(highlight);
        if (index > -1) {
          this.highlightedElements.splice(index, 1);
        }
      }
    }, 5000);
  }

  private removeHighlights() {
    this.highlightedElements.forEach(highlight => {
      if (highlight.parentNode) {
        this.renderer.removeChild(this.document.body, highlight);
      }
    });
    this.highlightedElements = [];
  }

  getIssueTitle(issue: string): string {
    switch (issue) {
      case 'missing-alt': return 'Missing Alt Attribute';
      case 'empty-alt': return 'Empty Alt Text';
      case 'decorative': return 'Decorative Image';
      case 'informative': return 'Poor Alt Text';
      default: return 'Unknown Issue';
    }
  }

  getImageDescription(img: HTMLImageElement): string {
    const src = img.src;
    const filename = src.split('/').pop() || 'unknown';
    const dimensions = `${img.naturalWidth || img.width}x${img.naturalHeight || img.height}`;
    return `${filename} (${dimensions})`;
  }

  closeIssuesPanel() {
    this.showIssuesPanel = false;
    this.currentState = 0;
    this.removeHighlights();
  }

  private announceResults() {
    const message = this.imageIssues.length === 0 
      ? 'All images have appropriate alt text'
      : `Found ${this.imageIssues.length} image${this.imageIssues.length === 1 ? '' : 's'} with alt text issues`;
    
    this.announceToScreenReader(message);
  }

  private announceToScreenReader(message: string) {
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
    this.removeHighlights();
    this.showIssuesPanel = false;
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
}
