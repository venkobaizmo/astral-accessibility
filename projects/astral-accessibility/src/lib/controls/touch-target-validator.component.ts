import { DOCUMENT, NgIf, NgClass, NgFor } from "@angular/common";
import { Component, inject, Renderer2, OnDestroy, Optional, SkipSelf } from "@angular/core";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from "../izmo-accessibility.component";

interface TouchTargetIssue {
  element: HTMLElement;
  issue: 'too-small' | 'too-close' | 'overlapping' | 'good';
  currentSize: { width: number, height: number };
  recommendation: string;
  wcagLevel: 'AA' | 'AAA';
}

@Component({
  selector: "izmo-touch-target-validator",
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
              <rect x="8" y="8" width="25" height="25" fill="none" stroke="currentColor" stroke-width="2"/>
              <circle cx="20.5" cy="20.5" r="6" fill="none" stroke="currentColor" stroke-width="2"/>
              <circle cx="20.5" cy="20.5" r="2" fill="currentColor"/>
              <text x="4" y="38" font-family="Arial" font-size="6" fill="currentColor">TOUCH</text>
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

    <div 
      *ngIf="showTouchPanel" 
      class="touch-target-panel"
      role="dialog"
      aria-labelledby="touch-target-title"
      [style.position]="'fixed'"
      [style.top]="'20px'"
      [style.left]="'20px'"
      [style.width]="'420px'"
      [style.max-height]="'70vh'"
      [style.overflow-y]="'auto'"
      [style.background]="'white'"
      [style.border]="'2px solid #0066cc'"
      [style.border-radius]="'8px'"
      [style.padding]="'20px'"
      [style.z-index]="'999999'"
      [style.box-shadow]="'0 4px 20px rgba(0,0,0,0.3)'"
    >
      <h3 id="touch-target-title" [style.margin]="'0 0 15px 0'" [style.color]="'#333'">
        Touch Target Validation
      </h3>
      
      <div [style.margin-bottom]="'20px'" [style.padding]="'12px'" [style.background]="'#f8f9fa'" [style.border-radius]="'4px'">
        <div [style.display]="'flex'" [style.justify-content]="'space-between'" [style.margin-bottom]="'8px'">
          <span><strong>WCAG AA Standard:</strong></span>
          <span>44×44 CSS pixels</span>
        </div>
        <div [style.display]="'flex'" [style.justify-content]="'space-between'" [style.margin-bottom]="'8px'">
          <span><strong>WCAG AAA Enhanced:</strong></span>
          <span>44×44 CSS pixels</span>
        </div>
        <div [style.display]="'flex'" [style.justify-content]="'space-between'">
          <span><strong>Tested Elements:</strong></span>
          <span>{{ touchTargetIssues.length }}</span>
        </div>
      </div>
      
      <div *ngIf="getGoodTargetsCount() > 0" 
           [style.color]="'#28a745'" 
           [style.padding]="'10px'" 
           [style.background]="'#d4edda'" 
           [style.border-radius]="'4px'"
           [style.margin-bottom]="'15px'">
        ✓ {{ getGoodTargetsCount() }} touch target{{ getGoodTargetsCount() === 1 ? '' : 's' }} meet WCAG standards
      </div>
      
      <div *ngIf="getIssueCount() > 0">
        <h4 [style.color]="'#dc3545'" [style.margin]="'0 0 10px 0'">
          Issues Found ({{ getIssueCount() }})
        </h4>
        
        <div *ngFor="let issue of getIssuesOnly(); index as i" 
             [style.margin-bottom]="'15px'"
             [style.padding]="'12px'"
             [style.border-left]="'4px solid ' + getIssueColor(issue.issue)"
             [style.background]="'#f8f9fa'"
             [style.border-radius]="'0 4px 4px 0'">
          
          <div [style.display]="'flex'" [style.justify-content]="'space-between'" [style.align-items]="'center'" [style.margin-bottom]="'8px'">
            <strong>{{ getIssueTitle(issue.issue) }}</strong>
            <span [style.padding]="'2px 8px'" 
                  [style.border-radius]="'12px'" 
                  [style.font-size]="'12px'"
                  [style.background]="getWcagLevelColor(issue.wcagLevel)"
                  [style.color]="'white'">
              WCAG {{ issue.wcagLevel }}
            </span>
          </div>
          
          <div [style.margin-bottom]="'8px'" [style.font-size]="'14px'">
            <strong>Element:</strong> {{ getElementDescription(issue.element) }}
          </div>
          
          <div [style.margin-bottom]="'8px'" [style.font-size]="'14px'">
            <strong>Current Size:</strong> {{ issue.currentSize.width }}×{{ issue.currentSize.height }} px
          </div>
          
          <div [style.color]="'#666'" [style.font-size]="'14px'" [style.margin-bottom]="'8px'">
            {{ issue.recommendation }}
          </div>
          
          <div [style.display]="'flex'" [style.gap]="'8px'">
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
              Highlight
            </button>
            
            <button 
              (click)="fixTouchTarget(issue.element)"
              [style.padding]="'4px 8px'"
              [style.background]="'#28a745'"
              [style.color]="'white'"
              [style.border]="'none'"
              [style.border-radius]="'3px'"
              [style.font-size]="'12px'"
              [style.cursor]="'pointer'"
            >
              Auto-fix
            </button>
          </div>
        </div>
      </div>
      
      <div [style.margin-top]="'20px'" [style.padding]="'15px'" [style.background]="'#e9ecef'" [style.border-radius]="'4px'">
        <strong>Auto-fix Options:</strong>
        <div [style.margin-top]="'10px'">
          <label [style.display]="'flex'" [style.align-items]="'center'" [style.margin-bottom]="'8px'">
            <input 
              type="checkbox" 
              [checked]="autoFixEnabled"
              (change)="toggleAutoFix($event)"
              [style.margin-right]="'8px'"
            />
            Enable automatic touch target improvements
          </label>
          
          <div [style.margin-left]="'24px'" [style.font-size]="'14px'" [style.color]="'#666'">
            Automatically increase padding and size for small touch targets
          </div>
          
          <div [style.margin-top]="'10px'">
            <label [style.display]="'block'" [style.margin-bottom]="'4px'">
              Minimum target size:
            </label>
            <select 
              [value]="minTargetSize"
              (change)="updateMinTargetSize($event)"
              [style.padding]="'4px'"
              [style.border]="'1px solid #ccc'"
              [style.border-radius]="'3px'"
            >
              <option value="44">44×44 px (WCAG AA/AAA)</option>
              <option value="48">48×48 px (Enhanced)</option>
              <option value="56">56×56 px (Large)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div [style.text-align]="'right'" [style.margin-top]="'20px'">
        <button 
          (click)="rescanTargets()"
          [style.padding]="'8px 16px'"
          [style.background]="'#17a2b8'"
          [style.color]="'white'"
          [style.border]="'none'"
          [style.border-radius]="'4px'"
          [style.margin-right]="'8px'"
        >
          Re-scan
        </button>
        
        <button 
          (click)="closeTouchPanel()"
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
export class TouchTargetValidatorComponent implements OnDestroy {
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
  
  get base() {
    return this.i18n.getTranslation('touch-target-validator');
  }
  
  get states() {
    return [
      this.i18n.getTranslation('touch-target-validator'),
      this.i18n.getTranslation('validate-touch-targets'),
      this.i18n.getTranslation('touch-targets-valid'),
      this.i18n.getTranslation('touch-targets-invalid')
    ];
  }
  
  touchTargetIssues: TouchTargetIssue[] = [];
  showTouchPanel = false;
  autoFixEnabled = false;
  minTargetSize = 44; // WCAG AA/AAA requirement
  
  private highlightedElements: HTMLElement[] = [];
  private appliedFixes: Map<HTMLElement, { originalPadding: string, originalMinWidth: string, originalMinHeight: string }> = new Map();

  // WCAG 2.1 requirements
  private readonly WCAG_AA_MIN_SIZE = 44; // 44x44 CSS pixels
  private readonly WCAG_AAA_MIN_SIZE = 44; // Same as AA for touch targets
  private readonly MIN_SPACING = 8; // Minimum spacing between targets

  nextState() {
    this.currentState += 1;
    this.currentState = this.currentState % 4;
    this._runStateLogic();
  }

  private _runStateLogic() {
    this.removeHighlights();

    if (this.states[this.currentState] === "Scan Touch Targets") {
      this.scanTouchTargets();
    } else if (this.states[this.currentState] === "Show Issues") {
      this.showTouchPanel = true;
    } else if (this.states[this.currentState] === "Auto-fix") {
      this.autoFixEnabled = true;
      this.applyAllFixes();
      this.showTouchPanel = true;
    } else {
      this.revertAllFixes();
      this.autoFixEnabled = false;
      this.showTouchPanel = false;
      this.touchTargetIssues = [];
    }
  }

  private scanTouchTargets() {
    this.touchTargetIssues = [];
    
    // Define interactive elements that should be touch targets
    const touchTargetSelectors = [
      'button',
      'input[type="button"]',
      'input[type="submit"]',
      'input[type="reset"]',
      'input[type="checkbox"]',
      'input[type="radio"]',
      'a[href]',
      '[role="button"]',
      '[role="link"]',
      '[role="tab"]',
      '[role="menuitem"]',
      '[onclick]',
      '[ontouch]',
      '.btn',
      '.button',
      '.clickable'
    ];

    touchTargetSelectors.forEach(selector => {
      const elements = this.document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
      elements.forEach(element => {
        // Skip elements that are part of the accessibility widget
        if (element.closest('izmo-accessibility')) return;
        
        // Skip hidden elements
        if (!this.isElementVisible(element)) return;
        
        const issue = this.evaluateTouchTarget(element);
        this.touchTargetIssues.push(issue);
      });
    });

    this.showTouchPanel = true;
    this.announceResults();
  }

  private evaluateTouchTarget(element: HTMLElement): TouchTargetIssue {
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    
    // Get effective touch area including padding
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
    
    const effectiveWidth = rect.width;
    const effectiveHeight = rect.height;
    
    const currentSize = {
      width: Math.round(effectiveWidth),
      height: Math.round(effectiveHeight)
    };

    // Check if target meets WCAG requirements
    const meetsAA = effectiveWidth >= this.WCAG_AA_MIN_SIZE && effectiveHeight >= this.WCAG_AA_MIN_SIZE;
    const meetsAAA = effectiveWidth >= this.WCAG_AAA_MIN_SIZE && effectiveHeight >= this.WCAG_AAA_MIN_SIZE;
    
    if (meetsAA) {
      return {
        element,
        issue: 'good',
        currentSize,
        recommendation: 'Touch target meets WCAG requirements.',
        wcagLevel: meetsAAA ? 'AAA' : 'AA'
      };
    }

    // Determine the specific issue
    let issue: 'too-small' | 'too-close' | 'overlapping' = 'too-small';
    let recommendation = '';
    
    if (effectiveWidth < this.WCAG_AA_MIN_SIZE || effectiveHeight < this.WCAG_AA_MIN_SIZE) {
      const widthDeficit = Math.max(0, this.WCAG_AA_MIN_SIZE - effectiveWidth);
      const heightDeficit = Math.max(0, this.WCAG_AA_MIN_SIZE - effectiveHeight);
      
      recommendation = `Increase size to meet 44×44px minimum. `;
      if (widthDeficit > 0) recommendation += `Add ${Math.ceil(widthDeficit)}px width. `;
      if (heightDeficit > 0) recommendation += `Add ${Math.ceil(heightDeficit)}px height. `;
      recommendation += 'Consider adding padding or increasing font-size.';
    }

    // Check for overlapping or too-close targets
    if (this.hasNearbyTargets(element)) {
      issue = 'too-close';
      recommendation += ' Ensure at least 8px spacing between touch targets.';
    }

    return {
      element,
      issue,
      currentSize,
      recommendation: recommendation.trim(),
      wcagLevel: 'AA'
    };
  }

  private hasNearbyTargets(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    const allTargets = Array.from(this.document.querySelectorAll('button, a[href], input[type="button"], input[type="submit"], [role="button"]')) as HTMLElement[];
    
    for (const target of allTargets) {
      if (target === element || target.closest('izmo-accessibility')) continue;
      if (!this.isElementVisible(target)) continue;
      
      const targetRect = target.getBoundingClientRect();
      const distance = this.getMinDistance(rect, targetRect);
      
      if (distance < this.MIN_SPACING) {
        return true;
      }
    }
    
    return false;
  }

  private getMinDistance(rect1: DOMRect, rect2: DOMRect): number {
    const dx = Math.max(0, Math.max(rect1.left - rect2.right, rect2.left - rect1.right));
    const dy = Math.max(0, Math.max(rect1.top - rect2.bottom, rect2.top - rect1.bottom));
    return Math.sqrt(dx * dx + dy * dy);
  }

  private isElementVisible(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    
    return rect.width > 0 && 
           rect.height > 0 && 
           style.display !== 'none' && 
           style.visibility !== 'hidden' &&
           style.opacity !== '0';
  }

  fixTouchTarget(element: HTMLElement) {
    if (this.appliedFixes.has(element)) {
      return; // Already fixed
    }

    const currentStyle = window.getComputedStyle(element);
    const originalPadding = element.style.padding || '';
    const originalMinWidth = element.style.minWidth || '';
    const originalMinHeight = element.style.minHeight || '';
    
    // Store original values for potential revert
    this.appliedFixes.set(element, {
      originalPadding,
      originalMinWidth,
      originalMinHeight
    });

    const rect = element.getBoundingClientRect();
    const currentWidth = rect.width;
    const currentHeight = rect.height;
    
    // Calculate needed improvements
    const widthDeficit = Math.max(0, this.minTargetSize - currentWidth);
    const heightDeficit = Math.max(0, this.minTargetSize - currentHeight);
    
    if (widthDeficit > 0 || heightDeficit > 0) {
      // Try to fix with padding first (less intrusive)
      const paddingX = Math.ceil(widthDeficit / 2);
      const paddingY = Math.ceil(heightDeficit / 2);
      
      const currentPaddingTop = parseFloat(currentStyle.paddingTop) || 0;
      const currentPaddingRight = parseFloat(currentStyle.paddingRight) || 0;
      const currentPaddingBottom = parseFloat(currentStyle.paddingBottom) || 0;
      const currentPaddingLeft = parseFloat(currentStyle.paddingLeft) || 0;
      
      const newPaddingTop = Math.max(currentPaddingTop, paddingY);
      const newPaddingRight = Math.max(currentPaddingRight, paddingX);
      const newPaddingBottom = Math.max(currentPaddingBottom, paddingY);
      const newPaddingLeft = Math.max(currentPaddingLeft, paddingX);
      
      // Apply the fix
      this.renderer.setStyle(element, 'padding', 
        `${newPaddingTop}px ${newPaddingRight}px ${newPaddingBottom}px ${newPaddingLeft}px`);
      
      // Ensure minimum dimensions as backup
      this.renderer.setStyle(element, 'min-width', `${this.minTargetSize}px`);
      this.renderer.setStyle(element, 'min-height', `${this.minTargetSize}px`);
      
      // Ensure the element remains clickable
      this.renderer.setStyle(element, 'box-sizing', 'border-box');
    }

    this.announceToScreenReader(`Touch target improved for ${this.getElementDescription(element)}`);
    
    // Re-evaluate the element
    setTimeout(() => {
      const updatedIssue = this.evaluateTouchTarget(element);
      const index = this.touchTargetIssues.findIndex(issue => issue.element === element);
      if (index !== -1) {
        this.touchTargetIssues[index] = updatedIssue;
      }
    }, 100);
  }

  private applyAllFixes() {
    const issuesOnly = this.getIssuesOnly();
    let fixedCount = 0;
    
    issuesOnly.forEach(issue => {
      if (issue.issue !== 'good') {
        this.fixTouchTarget(issue.element);
        fixedCount++;
      }
    });

    if (fixedCount > 0) {
      this.announceToScreenReader(`Applied automatic fixes to ${fixedCount} touch target${fixedCount === 1 ? '' : 's'}`);
    }
  }

  private revertAllFixes() {
    this.appliedFixes.forEach((originalStyles, element) => {
      this.renderer.setStyle(element, 'padding', originalStyles.originalPadding);
      this.renderer.setStyle(element, 'min-width', originalStyles.originalMinWidth);
      this.renderer.setStyle(element, 'min-height', originalStyles.originalMinHeight);
    });
    
    this.appliedFixes.clear();
    
    if (this.appliedFixes.size > 0) {
      this.announceToScreenReader('Reverted all touch target fixes');
    }
  }

  highlightElement(element: HTMLElement) {
    this.removeHighlights();
    
    const highlight = this.renderer.createElement('div');
    this.renderer.setStyle(highlight, 'position', 'absolute');
    this.renderer.setStyle(highlight, 'border', '3px solid #ff6b6b');
    this.renderer.setStyle(highlight, 'background', 'rgba(255, 107, 107, 0.1)');
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
    
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Add size indicator
    const sizeIndicator = this.renderer.createElement('div');
    this.renderer.setStyle(sizeIndicator, 'position', 'absolute');
    this.renderer.setStyle(sizeIndicator, 'top', `${rect.top + window.scrollY - 25}px`);
    this.renderer.setStyle(sizeIndicator, 'left', `${rect.left + window.scrollX}px`);
    this.renderer.setStyle(sizeIndicator, 'background', '#ff6b6b');
    this.renderer.setStyle(sizeIndicator, 'color', 'white');
    this.renderer.setStyle(sizeIndicator, 'padding', '2px 6px');
    this.renderer.setStyle(sizeIndicator, 'font-size', '12px');
    this.renderer.setStyle(sizeIndicator, 'border-radius', '3px');
    this.renderer.setStyle(sizeIndicator, 'z-index', '999999');
    this.renderer.setProperty(sizeIndicator, 'textContent', `${Math.round(rect.width)}×${Math.round(rect.height)}px`);
    
    this.renderer.appendChild(this.document.body, sizeIndicator);
    this.highlightedElements.push(sizeIndicator);
    
    // Remove highlight after 5 seconds
    setTimeout(() => {
      this.removeHighlights();
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

  toggleAutoFix(event: Event) {
    const target = event.target as HTMLInputElement;
    this.autoFixEnabled = target.checked;
    
    if (this.autoFixEnabled) {
      this.applyAllFixes();
      this.announceToScreenReader('Auto-fix enabled for touch targets');
    } else {
      this.revertAllFixes();
      this.announceToScreenReader('Auto-fix disabled, reverted changes');
    }
  }

  updateMinTargetSize(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.minTargetSize = parseInt(target.value);
  }

  rescanTargets() {
    this.scanTouchTargets();
    this.announceToScreenReader('Re-scanned all touch targets');
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

  getIssuesOnly(): TouchTargetIssue[] {
    return this.touchTargetIssues.filter(issue => issue.issue !== 'good');
  }

  getIssueCount(): number {
    return this.getIssuesOnly().length;
  }

  getGoodTargetsCount(): number {
    return this.touchTargetIssues.filter(issue => issue.issue === 'good').length;
  }

  getIssueTitle(issue: string): string {
    switch (issue) {
      case 'too-small': return 'Target Too Small';
      case 'too-close': return 'Targets Too Close';
      case 'overlapping': return 'Overlapping Targets';
      case 'good': return 'Meets Standards';
      default: return 'Unknown Issue';
    }
  }

  getIssueColor(issue: string): string {
    switch (issue) {
      case 'too-small': return '#dc3545';
      case 'too-close': return '#ffc107';
      case 'overlapping': return '#fd7e14';
      case 'good': return '#28a745';
      default: return '#6c757d';
    }
  }

  getWcagLevelColor(level: string): string {
    return level === 'AAA' ? '#28a745' : '#17a2b8';
  }

  getElementDescription(element: HTMLElement): string {
    const tagName = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const className = element.className ? `.${element.className.split(' ')[0]}` : '';
    const text = element.textContent?.trim().substring(0, 20);
    const textPart = text ? ` "${text}${text.length === 20 ? '...' : ''}"` : '';
    
    return `<${tagName}>${id}${className}${textPart}`;
  }

  closeTouchPanel() {
    this.showTouchPanel = false;
    this.currentState = 0;
    this.removeHighlights();
  }

  private announceResults() {
    const issueCount = this.getIssueCount();
    const goodCount = this.getGoodTargetsCount();
    
    const message = issueCount === 0 
      ? `All ${goodCount} touch targets meet WCAG requirements`
      : `Found ${issueCount} touch target issue${issueCount === 1 ? '' : 's'} out of ${this.touchTargetIssues.length} tested`;
    
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
    this.revertAllFixes();
    this.removeHighlights();
    this.showTouchPanel = false;
  }

  reset() {
    this.currentState = 0;
    this.showTouchPanel = false;
    this.removeHighlights();
    this.revertAllFixes();
  }
}
