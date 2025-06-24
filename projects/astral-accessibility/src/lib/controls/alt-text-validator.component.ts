import { DOCUMENT, NgIf, NgClass, NgFor } from "@angular/common";
import { Component, inject, Renderer2, OnDestroy } from "@angular/core";
import { AstralCheckmarkSvgComponent } from "../util/astral-checksvg.component";
import { I18nService } from "../services/i18n.service";

interface ImageIssue {
  element: HTMLImageElement;
  issue: 'missing-alt' | 'empty-alt' | 'decorative' | 'informative';
  suggestion: string;
}

@Component({
  selector: "astral-alt-text-validator",
  standalone: true,
  template: `
    <button
      (click)="nextState()"
      [ngClass]="{ 'in-use': states[currentState] !== base }"
    >
      <div class="title">
        <div class="icon-state-wrap">
          <div
            class="icon action-icon"
            [ngClass]="{
              inactive: states[currentState] == base,
              active: states[currentState] != base
            }"
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 41 41"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="#FFF" d="M3 8h35v25H3z"/>
              <path fill="#000" d="M8 12h8v8h-8z"/>
              <circle fill="#000" cx="12" cy="16" r="2"/>
              <path fill="#000" d="M18 20l3-3 5 5H18z"/>
              <text x="20" y="30" font-family="Arial" font-size="8" fill="#FFF">ALT</text>
            </svg>
          </div>

          <div class="state-dots-wrap">
            <span>{{ states[currentState] }}</span>
            <div
              class="dots"
              [ngClass]="{ inactive: states[currentState] === base }"
            >
              <div
                class="dot"
                [ngClass]="{ active: states[currentState] === 'Scan Images' }"
              ></div>
              <div
                class="dot"
                [ngClass]="{ active: states[currentState] === 'Fix Issues' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <astral-widget-checkmark
        [isActive]="states[currentState] !== base"
      ></astral-widget-checkmark>
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
  imports: [NgIf, NgClass, NgFor, AstralCheckmarkSvgComponent],
})
export class AltTextValidatorComponent implements OnDestroy {
  constructor(
    private renderer: Renderer2,
    private i18n: I18nService
  ) {}

  document = inject(DOCUMENT);
  currentState = 0;
  base = "Alt Text Validator";
  states = [this.base, "Scan Images", "Fix Issues"];
  
  imageIssues: ImageIssue[] = [];
  showIssuesPanel = false;
  highlightedElements: HTMLElement[] = [];

  nextState() {
    this.currentState += 1;
    this.currentState = this.currentState % 3;
    this._runStateLogic();
  }

  private _runStateLogic() {
    // Remove any existing highlights
    this.removeHighlights();

    if (this.states[this.currentState] === "Scan Images") {
      this.scanForAltTextIssues();
      this.showIssuesPanel = true;
    } else if (this.states[this.currentState] === "Fix Issues") {
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
      if (img.closest('astral-accessibility')) return;
      
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
}
