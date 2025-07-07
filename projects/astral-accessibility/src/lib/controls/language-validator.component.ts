import { DOCUMENT, NgIf, NgClass, NgFor } from "@angular/common";
import { Component, inject, Renderer2, OnDestroy, Optional, SkipSelf } from "@angular/core";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from "../izmo-accessibility.component";

interface LanguageIssue {
  element: HTMLElement;
  type: 'missing-html-lang' | 'invalid-lang' | 'missing-content-lang' | 'inconsistent-lang';
  current: string;
  suggestion: string;
}

@Component({
  selector: "izmo-language-validator",
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
              <circle cx="20.5" cy="20.5" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
              <text x="11" y="17" font-family="Arial" font-size="10" fill="currentColor">EN</text>
              <text x="6" y="28" font-family="Arial" font-size="8" fill="currentColor">LANG</text>
              <path d="M8 8 L33 8 L33 12 L8 12 Z" fill="currentColor"/>
              <path d="M8 30 L33 30 L33 34 L8 34 Z" fill="currentColor"/>
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
      *ngIf="showLanguagePanel" 
      class="language-validator-panel"
      role="dialog"
      aria-labelledby="language-validator-title"
      [style.position]="'fixed'"
      [style.top]="'20px'"
      [style.left]="'50%'"
      [style.transform]="'translateX(-50%)'"
      [style.width]="'450px'"
      [style.max-height]="'70vh'"
      [style.overflow-y]="'auto'"
      [style.background]="'white'"
      [style.border]="'2px solid #0066cc'"
      [style.border-radius]="'8px'"
      [style.padding]="'20px'"
      [style.z-index]="'999999'"
      [style.box-shadow]="'0 4px 20px rgba(0,0,0,0.3)'"
    >
      <h3 id="language-validator-title" [style.margin]="'0 0 15px 0'" [style.color]="'#333'">
        Language Validation Results
      </h3>
      
      <div [style.margin-bottom]="'20px'">
        <strong>Page Language:</strong>
        <div [style.margin-top]="'5px'" [style.padding]="'8px'" [style.background]="'#f5f5f5'" 
             [style.border-radius]="'4px'">
          {{ getPageLanguageInfo() }}
        </div>
      </div>
      
      <div *ngIf="languageIssues.length === 0" 
           [style.color]="'#28a745'" 
           [style.padding]="'15px'" 
           [style.background]="'#d4edda'" 
           [style.border-radius]="'4px'"
           [style.margin-bottom]="'15px'">
        ✓ All language attributes are properly configured!
      </div>
      
      <div *ngIf="languageIssues.length > 0">
        <h4 [style.color]="'#dc3545'" [style.margin]="'0 0 10px 0'">
          Issues Found ({{ languageIssues.length }})
        </h4>
        
        <div *ngFor="let issue of languageIssues; index as i" 
             [style.margin-bottom]="'15px'"
             [style.padding]="'10px'"
             [style.border-left]="'4px solid #dc3545'"
             [style.background]="'#f8f9fa'"
             [style.border-radius]="'0 4px 4px 0'">
          
          <div [style.font-weight]="'bold'" [style.margin-bottom]="'5px'">
            {{ getIssueTitle(issue.type) }}
          </div>
          
          <div [style.margin-bottom]="'8px'" [style.font-size]="'14px'">
            <strong>Element:</strong> {{ getElementDescription(issue.element) }}
          </div>
          
          <div *ngIf="issue.current" [style.margin-bottom]="'8px'" [style.font-size]="'14px'">
            <strong>Current Value:</strong> "{{ issue.current }}"
          </div>
          
          <div [style.color]="'#666'" [style.font-size]="'14px'" [style.margin-bottom]="'8px'">
            {{ issue.suggestion }}
          </div>
          
          <button 
            (click)="highlightElement(issue.element)"
            [style.padding]="'4px 8px'"
            [style.background]="'#dc3545'"
            [style.color]="'white'"
            [style.border]="'none'"
            [style.border-radius]="'3px'"
            [style.font-size]="'12px'"
            [style.cursor]="'pointer'"
          >
            Highlight Element
          </button>
        </div>
      </div>
      
      <div [style.margin-top]="'20px'" [style.padding]="'15px'" [style.background]="'#e9ecef'" [style.border-radius]="'4px'">
        <strong>Language Best Practices:</strong>
        <ul [style.margin]="'10px 0 0 0'" [style.padding-left]="'20px'" [style.font-size]="'14px'">
          <li>Always set lang attribute on the &lt;html&gt; element</li>
          <li>Use valid ISO 639-1 language codes (e.g., "en", "es", "fr")</li>
          <li>Include region codes when appropriate (e.g., "en-US", "en-GB")</li>
          <li>Set lang attributes on elements with different languages</li>
          <li>Ensure consistent language declarations across the page</li>
        </ul>
      </div>
      
      <div [style.text-align]="'right'" [style.margin-top]="'20px'">
        <button 
          (click)="closeLanguagePanel()"
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
export class LanguageValidatorComponent implements OnDestroy {
  constructor(
    private renderer: Renderer2,
    private i18n: I18nService,
    @Optional() @SkipSelf() private parent?: IzmoAccessibilityComponent
  ) {
    if (this.parent) {
      this.parent.resetEvent.subscribe(() => this.reset());
    }
  }

  document = inject(DOCUMENT);
  currentState = 0;
  
  // Make these reactive to language changes
  get base() {
    return this.i18n.getTranslation('language-validator');
  }
  
  get states() {
    return [
      this.base,
      this.i18n.getTranslation('validate-language'),
      this.i18n.getTranslation('language-valid'),
      this.i18n.getTranslation('language-invalid')
    ];
  }
  
  languageIssues: LanguageIssue[] = [];
  showLanguagePanel = false;
  highlightedElements: HTMLElement[] = [];
  
  // Valid ISO 639-1 language codes with some common variations
  private validLanguageCodes = new Set([
    'aa', 'ab', 'ae', 'af', 'ak', 'am', 'an', 'ar', 'as', 'av', 'ay', 'az',
    'ba', 'be', 'bg', 'bh', 'bi', 'bm', 'bn', 'bo', 'br', 'bs',
    'ca', 'ce', 'ch', 'co', 'cr', 'cs', 'cu', 'cv', 'cy',
    'da', 'de', 'dv', 'dz',
    'ee', 'el', 'en', 'eo', 'es', 'et', 'eu',
    'fa', 'ff', 'fi', 'fj', 'fo', 'fr', 'fy',
    'ga', 'gd', 'gl', 'gn', 'gu', 'gv',
    'ha', 'he', 'hi', 'ho', 'hr', 'ht', 'hu', 'hy', 'hz',
    'ia', 'id', 'ie', 'ig', 'ii', 'ik', 'io', 'is', 'it', 'iu',
    'ja', 'jv',
    'ka', 'kg', 'ki', 'kj', 'kk', 'kl', 'km', 'kn', 'ko', 'kr', 'ks', 'ku', 'kv', 'kw', 'ky',
    'la', 'lb', 'lg', 'li', 'ln', 'lo', 'lt', 'lu', 'lv',
    'mg', 'mh', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my',
    'na', 'nb', 'nd', 'ne', 'ng', 'nl', 'nn', 'no', 'nr', 'nv', 'ny',
    'oc', 'oj', 'om', 'or', 'os',
    'pa', 'pi', 'pl', 'ps', 'pt',
    'qu',
    'rm', 'rn', 'ro', 'ru', 'rw',
    'sa', 'sc', 'sd', 'se', 'sg', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'ss', 'st', 'su', 'sv', 'sw',
    'ta', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tn', 'to', 'tr', 'ts', 'tt', 'tw', 'ty',
    'ug', 'uk', 'ur', 'uz',
    've', 'vi', 'vo',
    'wa', 'wo',
    'xh',
    'yi', 'yo',
    'za', 'zh', 'zu'
  ]);

  nextState() {
    this.currentState += 1;
    this.currentState = this.currentState % 4;
    this._runStateLogic();
  }

  private _runStateLogic() {
    this.removeHighlights();

    if (this.states[this.currentState] === "Scan Languages") {
      this.scanForLanguageIssues();
    } else if (this.states[this.currentState] === "Show Issues") {
      this.showLanguagePanel = true;
      this.highlightAllIssues();
    } else {
      this.showLanguagePanel = false;
      this.languageIssues = [];
    }
  }

  private scanForLanguageIssues() {
    this.languageIssues = [];
    
    // Check HTML element for lang attribute
    const htmlElement = this.document.documentElement;
    const htmlLang = htmlElement.getAttribute('lang');
    
    if (!htmlLang) {
      this.languageIssues.push({
        element: htmlElement,
        type: 'missing-html-lang',
        current: '',
        suggestion: 'Add a lang attribute to the <html> element to specify the primary language of the page. Example: <html lang="en">'
      });
    } else if (!this.isValidLanguageCode(htmlLang)) {
      this.languageIssues.push({
        element: htmlElement,
        type: 'invalid-lang',
        current: htmlLang,
        suggestion: `"${htmlLang}" is not a valid ISO 639-1 language code. Use standard codes like "en", "es", "fr", etc.`
      });
    }

    // Check for elements with lang attributes that might be invalid
    const elementsWithLang = this.document.querySelectorAll('[lang]') as NodeListOf<HTMLElement>;
    elementsWithLang.forEach(element => {
      // Skip elements that are part of the accessibility widget
      if (element.closest('izmo-accessibility')) return;
      
      const lang = element.getAttribute('lang');
      if (lang && !this.isValidLanguageCode(lang)) {
        this.languageIssues.push({
          element: element,
          type: 'invalid-lang',
          current: lang,
          suggestion: `"${lang}" is not a valid language code. Use ISO 639-1 codes like "en", "es", "fr", etc.`
        });
      }
    });

    // Check for content that might be in a different language but lacks lang attribute
    this.checkForMissingLangAttributes();

    this.showLanguagePanel = true;
    this.announceResults();
  }

  private checkForMissingLangAttributes() {
    // Look for text that might indicate different languages
    // This is a simplified check - in practice, language detection would be more sophisticated
    const textElements = this.document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, blockquote, div');
      textElements.forEach((element: Element) => {
      // Skip elements that are part of the accessibility widget
      if (element.closest('izmo-accessibility')) return;
      
      const text = element.textContent?.trim();
      if (!text || text.length < 20) return; // Skip short text
      
      const hasLangAttribute = element.closest('[lang]');
      if (hasLangAttribute) return; // Already has lang specified
      
      // Simple heuristics for detecting potential language issues
      if (this.mightBeNonEnglish(text) && !element.getAttribute('lang')) {
        // This is a basic check - real implementation would use proper language detection
        // For now, we'll be conservative and not flag too aggressively
      }
    });
  }

  private mightBeNonEnglish(text: string): boolean {
    // Very basic heuristics - this would need to be much more sophisticated in production
    const nonEnglishPatterns = [
      /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/i, // Accented characters
      /[αβγδεζηθικλμνξοπρστυφχψω]/i, // Greek
      /[а-я]/i, // Cyrillic
      /[一-龯]/i, // Chinese/Japanese
      /[가-힣]/i, // Korean
      /[أ-ي]/i, // Arabic
    ];
    
    return nonEnglishPatterns.some(pattern => pattern.test(text));
  }

  private isValidLanguageCode(lang: string): boolean {
    // Handle language codes with regions (e.g., en-US, fr-CA)
    const mainLang = lang.toLowerCase().split('-')[0];
    return this.validLanguageCodes.has(mainLang);
  }

  private highlightAllIssues() {
    this.languageIssues.forEach(issue => {
      this.highlightElement(issue.element);
    });
  }

  highlightElement(element: HTMLElement) {
    // Add highlight to this element
    const highlight = this.renderer.createElement('div');
    this.renderer.setStyle(highlight, 'position', 'absolute');
    this.renderer.setStyle(highlight, 'border', '3px solid #ffc107');
    this.renderer.setStyle(highlight, 'background', 'rgba(255, 193, 7, 0.1)');
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

  getPageLanguageInfo(): string {
    const htmlLang = this.document.documentElement.getAttribute('lang');
    if (!htmlLang) {
      return '❌ No language specified';
    }
    
    const isValid = this.isValidLanguageCode(htmlLang);
    return `${isValid ? '✅' : '❌'} "${htmlLang}" ${isValid ? '(Valid)' : '(Invalid)'}`;
  }

  getIssueTitle(type: string): string {
    switch (type) {
      case 'missing-html-lang': return 'Missing Language on HTML Element';
      case 'invalid-lang': return 'Invalid Language Code';
      case 'missing-content-lang': return 'Missing Language for Content';
      case 'inconsistent-lang': return 'Inconsistent Language Declaration';
      default: return 'Unknown Language Issue';
    }
  }

  getElementDescription(element: HTMLElement): string {
    if (element === this.document.documentElement) {
      return '<html> element';
    }
    
    const tagName = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const className = element.className ? `.${element.className.split(' ')[0]}` : '';
    
    return `<${tagName}>${id}${className}`;
  }

  closeLanguagePanel() {
    this.showLanguagePanel = false;
    this.currentState = 0;
    this.removeHighlights();
  }

  private announceResults() {
    const message = this.languageIssues.length === 0 
      ? 'All language attributes are properly configured'
      : `Found ${this.languageIssues.length} language ${this.languageIssues.length === 1 ? 'issue' : 'issues'}`;
    
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
    this.showLanguagePanel = false;
  }

  reset() {
    this.currentState = 0;
    this.showLanguagePanel = false;
    this.removeHighlights();
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
