import { DOCUMENT, NgIf, NgClass } from "@angular/common";
import { Component, inject, Renderer2, OnDestroy } from "@angular/core";
import { AstralCheckmarkSvgComponent } from "../util/astral-checksvg.component";
import { I18nService } from "../services/i18n.service";

interface TitleIssue {
  type: 'missing' | 'empty' | 'generic' | 'too-long' | 'duplicate' | 'good';
  current: string;
  suggestion: string;
}

@Component({
  selector: "astral-page-title-validator",
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
              viewBox="0 0 41 41"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="4" y="8" width="33" height="25" fill="none" stroke="#FFF" stroke-width="2"/>
              <rect x="8" y="12" width="25" height="3" fill="#FFF"/>
              <rect x="8" y="18" width="20" height="2" fill="#FFF"/>
              <rect x="8" y="22" width="18" height="2" fill="#FFF"/>
              <rect x="8" y="26" width="22" height="2" fill="#FFF"/>
              <text x="6" y="6" font-family="Arial" font-size="4" fill="#FFF">TITLE</text>
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

      <astral-widget-checkmark
        [isActive]="currentState !== 0"
      ></astral-widget-checkmark>
    </button>

    <div 
      *ngIf="showTitlePanel" 
      class="title-validator-panel"
      role="dialog"
      aria-labelledby="title-validator-title"
      [style.position]="'fixed'"
      [style.top]="'20px'"
      [style.right]="'20px'"
      [style.width]="'400px'"
      [style.background]="'white'"
      [style.border]="'2px solid #0066cc'"
      [style.border-radius]="'8px'"
      [style.padding]="'20px'"
      [style.z-index]="'999999'"
      [style.box-shadow]="'0 4px 20px rgba(0,0,0,0.3)'"
    >
      <h3 id="title-validator-title" [style.margin]="'0 0 15px 0'" [style.color]="'#333'">
        Page Title Validation
      </h3>
      
      <div [style.margin-bottom]="'15px'">
        <strong>Current Title:</strong>
        <div [style.margin-top]="'5px'" [style.padding]="'8px'" [style.background]="'#f5f5f5'" 
             [style.border-radius]="'4px'" [style.font-family]="'monospace'">
          "{{ currentTitle || '(No title)' }}"
        </div>
      </div>
      
      <div [style.margin-bottom]="'15px'">
        <strong>Status:</strong>
        <div [style.margin-top]="'5px'" [style.padding]="'8px'" [style.border-radius]="'4px'"
             [style.background]="titleIssue.type === 'good' ? '#d4edda' : '#f8d7da'"
             [style.color]="titleIssue.type === 'good' ? '#155724' : '#721c24'">
          {{ getTitleStatusMessage() }}
        </div>
      </div>
      
      <div *ngIf="titleIssue.type !== 'good'" [style.margin-bottom]="'15px'">
        <strong>Recommendation:</strong>
        <div [style.margin-top]="'5px'" [style.color]="'#666'">
          {{ titleIssue.suggestion }}
        </div>
      </div>
      
      <div [style.margin-bottom]="'15px'">
        <strong>Best Practices:</strong>
        <ul [style.margin]="'5px 0'" [style.padding-left]="'20px'" [style.font-size]="'14px'">
          <li>Keep titles under 60 characters for search engines</li>
          <li>Make titles descriptive and unique for each page</li>
          <li>Include the most important information first</li>
          <li>Consider including your site name at the end</li>
        </ul>
      </div>
      
      <div [style.text-align]="'right'">
        <button 
          (click)="closeTitlePanel()"
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
  imports: [NgIf, NgClass, AstralCheckmarkSvgComponent],
})
export class PageTitleValidatorComponent implements OnDestroy {
  constructor(
    private renderer: Renderer2,
    private i18n: I18nService
  ) {}

  document = inject(DOCUMENT);
  currentState = 0;
  base = this.i18n.getTranslation('page-title-validator');
  states = [
    this.i18n.getTranslation('page-title-validator'),
    this.i18n.getTranslation('validate-page-title'),
    this.i18n.getTranslation('page-title-valid'),
    this.i18n.getTranslation('page-title-invalid')
  ];
  
  currentTitle = "";
  titleIssue: TitleIssue = { type: 'good', current: '', suggestion: '' };
  showTitlePanel = false;
  titleObserver?: MutationObserver;

  // Common generic titles to flag
  private genericTitles = [
    'untitled document',
    'new document',
    'document',
    'page',
    'home',
    'welcome',
    'index',
    'default',
    'test',
    'lorem ipsum',
    'placeholder'
  ];

  nextState() {
    this.currentState += 1;
    this.currentState = this.currentState % 3;
    this._runStateLogic();
  }

  private _runStateLogic() {
    if (this.states[this.currentState] === "Check Title") {
      this.checkPageTitle();
      this.showTitlePanel = true;
    } else if (this.states[this.currentState] === "Monitor Changes") {
      this.startTitleMonitoring();
      this.showTitlePanel = true;
    } else {
      this.stopTitleMonitoring();
      this.showTitlePanel = false;
    }
  }

  private checkPageTitle() {
    const titleElement = this.document.querySelector('title');
    this.currentTitle = titleElement?.textContent?.trim() || '';
    
    this.titleIssue = this.validateTitle(this.currentTitle);
    this.announceResults();
  }

  private validateTitle(title: string): TitleIssue {
    // Missing title element
    if (!this.document.querySelector('title')) {
      return {
        type: 'missing',
        current: title,
        suggestion: 'Add a <title> element to the <head> section of your page. The title should briefly describe the page content.'
      };
    }

    // Empty title
    if (!title || title.length === 0) {
      return {
        type: 'empty',
        current: title,
        suggestion: 'Provide a descriptive title that explains what this page is about. Example: "Contact Us - Your Company Name"'
      };
    }

    // Too long (over 60 characters may be truncated in search results)
    if (title.length > 60) {
      return {
        type: 'too-long',
        current: title,
        suggestion: `Title is ${title.length} characters. Consider shortening to under 60 characters for better search engine display.`
      };
    }

    // Generic or non-descriptive titles
    const lowerTitle = title.toLowerCase();
    if (this.genericTitles.some(generic => lowerTitle.includes(generic))) {
      return {
        type: 'generic',
        current: title,
        suggestion: 'Title appears to be generic. Make it more specific and descriptive of the page content.'
      };
    }

    // Check if title is just a single word (usually not descriptive enough)
    if (title.split(/\s+/).length === 1 && title.length < 15) {
      return {
        type: 'generic',
        current: title,
        suggestion: 'Single-word titles are rarely descriptive enough. Consider adding more context about the page content.'
      };
    }

    // Good title
    return {
      type: 'good',
      current: title,
      suggestion: 'Title looks good! It\'s descriptive and an appropriate length.'
    };
  }

  private startTitleMonitoring() {
    this.stopTitleMonitoring(); // Clean up any existing observer
    
    const titleElement = this.document.querySelector('title');
    if (titleElement) {
      this.titleObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            this.checkPageTitle();
          }
        });
      });

      this.titleObserver.observe(titleElement, {
        childList: true,
        characterData: true,
        subtree: true
      });
    }

    // Also monitor for title element changes in the head
    this.titleObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName === 'TITLE') {
              this.checkPageTitle();
            }
          }
        });
      });
    });

    const head = this.document.querySelector('head');
    if (head) {
      this.titleObserver.observe(head, { childList: true });
    }

    this.announceToScreenReader('Page title monitoring started');
  }

  private stopTitleMonitoring() {
    if (this.titleObserver) {
      this.titleObserver.disconnect();
      this.titleObserver = undefined;
    }
  }

  getTitleStatusMessage(): string {
    switch (this.titleIssue.type) {
      case 'missing':
        return '❌ Missing Title Element';
      case 'empty':
        return '⚠️ Empty Title';
      case 'generic':
        return '⚠️ Generic/Non-descriptive Title';
      case 'too-long':
        return `⚠️ Title Too Long (${this.currentTitle.length} chars)`;
      case 'duplicate':
        return '⚠️ Duplicate Title';
      case 'good':
        return '✅ Good Title';
      default:
        return 'Unknown Status';
    }
  }

  closeTitlePanel() {
    this.showTitlePanel = false;
    this.currentState = 0;
    this.stopTitleMonitoring();
  }

  private announceResults() {
    const message = this.titleIssue.type === 'good' 
      ? 'Page title is appropriate'
      : `Page title issue detected: ${this.getTitleStatusMessage()}`;
    
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
    this.stopTitleMonitoring();
    this.showTitlePanel = false;
  }
}
