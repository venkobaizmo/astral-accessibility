import { DOCUMENT, NgIf, NgClass, NgFor } from "@angular/common";
import { Component, inject, Renderer2, OnDestroy } from "@angular/core";
import { AstralCheckmarkSvgComponent } from "../util/astral-checksvg.component";
import { I18nService } from "../services/i18n.service";

interface ReadingOrderIssue {
  element: HTMLElement;
  issue: 'logical-order' | 'heading-hierarchy' | 'tab-order' | 'visual-order-mismatch';
  description: string;
  recommendation: string;
  severity: 'high' | 'medium' | 'low';
}

@Component({
  selector: "astral-reading-order-validator",
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
              <path d="M8 10 L33 10" stroke="#FFF" stroke-width="2"/>
              <path d="M8 16 L28 16" stroke="#FFF" stroke-width="2"/>
              <path d="M8 22 L30 22" stroke="#FFF" stroke-width="2"/>
              <path d="M8 28 L25 28" stroke="#FFF" stroke-width="2"/>
              <text x="6" y="8" font-family="Arial" font-size="4" fill="#FFF">1</text>
              <text x="6" y="14" font-family="Arial" font-size="4" fill="#FFF">2</text>
              <text x="6" y="20" font-family="Arial" font-size="4" fill="#FFF">3</text>
              <text x="6" y="26" font-family="Arial" font-size="4" fill="#FFF">4</text>
              <path d="M36 8 L36 32 L32 28 L36 32 L40 28" stroke="#FFF" stroke-width="2" fill="none"/>
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
                [ngClass]="{ active: states[currentState] === 'Analyze Reading Order' }"
              ></div>
              <div
                class="dot"
                [ngClass]="{ active: states[currentState] === 'Show Issues' }"
              ></div>
              <div
                class="dot"
                [ngClass]="{ active: states[currentState] === 'Visualize Order' }"
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
      *ngIf="showOrderPanel" 
      class="reading-order-panel"
      role="dialog"
      aria-labelledby="reading-order-title"
      [style.position]="'fixed'"
      [style.top]="'20px'"
      [style.right]="'20px'"
      [style.width]="'450px'"
      [style.max-height]="'80vh'"
      [style.overflow-y]="'auto'"
      [style.background]="'white'"
      [style.border]="'2px solid #0066cc'"
      [style.border-radius]="'8px'"
      [style.padding]="'20px'"
      [style.z-index]="'999999'"
      [style.box-shadow]="'0 4px 20px rgba(0,0,0,0.3)'"
    >
      <h3 id="reading-order-title" [style.margin]="'0 0 15px 0'" [style.color]="'#333'">
        Reading Order Analysis
      </h3>
      
      <div [style.margin-bottom]="'20px'" [style.padding]="'12px'" [style.background]="'#f8f9fa'" [style.border-radius]="'4px'">
        <div [style.display]="'flex'" [style.justify-content]="'space-between'" [style.margin-bottom]="'8px'">
          <span><strong>Headings Found:</strong></span>
          <span>{{ headingElements.length }}</span>
        </div>
        <div [style.display]="'flex'" [style.justify-content]="'space-between'" [style.margin-bottom]="'8px'">
          <span><strong>Interactive Elements:</strong></span>
          <span>{{ interactiveElements.length }}</span>
        </div>
        <div [style.display]="'flex'" [style.justify-content]="'space-between'">
          <span><strong>Tab Order Issues:</strong></span>
          <span>{{ getTabOrderIssues().length }}</span>
        </div>
      </div>
      
      <div *ngIf="readingOrderIssues.length === 0" 
           [style.color]="'#28a745'" 
           [style.padding]="'15px'" 
           [style.background]="'#d4edda'" 
           [style.border-radius]="'4px'"
           [style.margin-bottom]="'15px'">
        ✓ Reading order appears to be logical and accessible
      </div>
      
      <div *ngIf="readingOrderIssues.length > 0">
        <h4 [style.color]="'#dc3545'" [style.margin]="'0 0 10px 0'">
          Issues Found ({{ readingOrderIssues.length }})
        </h4>
        
        <div *ngFor="let issue of readingOrderIssues; index as i" 
             [style.margin-bottom]="'15px'"
             [style.padding]="'12px'"
             [style.border-left]="'4px solid ' + getSeverityColor(issue.severity)"
             [style.background]="'#f8f9fa'"
             [style.border-radius]="'0 4px 4px 0'">
          
          <div [style.display]="'flex'" [style.justify-content]="'space-between'" [style.align-items]="'center'" [style.margin-bottom]="'8px'">
            <strong>{{ getIssueTitle(issue.issue) }}</strong>
            <span [style.padding]="'2px 8px'" 
                  [style.border-radius]="'12px'" 
                  [style.font-size]="'12px'"
                  [style.background]="getSeverityColor(issue.severity)"
                  [style.color]="'white'">
              {{ issue.severity.toUpperCase() }}
            </span>
          </div>
          
          <div [style.margin-bottom]="'8px'" [style.font-size]="'14px'">
            <strong>Element:</strong> {{ getElementDescription(issue.element) }}
          </div>
          
          <div [style.margin-bottom]="'8px'" [style.font-size]="'14px'">
            {{ issue.description }}
          </div>
          
          <div [style.color]="'#666'" [style.font-size]="'14px'" [style.margin-bottom]="'8px'">
            <strong>Recommendation:</strong> {{ issue.recommendation }}
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
      </div>
      
      <div [style.margin-top]="'20px'" [style.padding]="'15px'" [style.background]="'#e9ecef'" [style.border-radius]="'4px'">
        <strong>Visualization Options:</strong>
        <div [style.margin-top]="'10px'">
          <label [style.display]="'flex'" [style.align-items]="'center'" [style.margin-bottom]="'8px'">
            <input 
              type="checkbox" 
              [checked]="showTabOrder"
              (change)="toggleTabOrderVisualization($event)"
              [style.margin-right]="'8px'"
            />
            Show tab order numbers
          </label>
          
          <label [style.display]="'flex'" [style.align-items]="'center'" [style.margin-bottom]="'8px'">
            <input 
              type="checkbox" 
              [checked]="showHeadingHierarchy"
              (change)="toggleHeadingVisualization($event)"
              [style.margin-right]="'8px'"
            />
            Show heading hierarchy
          </label>
          
          <label [style.display]="'flex'" [style.align-items]="'center'">
            <input 
              type="checkbox" 
              [checked]="showReadingFlow"
              (change)="toggleReadingFlowVisualization($event)"
              [style.margin-right]="'8px'"
            />
            Show reading flow arrows
          </label>
        </div>
      </div>
      
      <div [style.text-align]="'right'" [style.margin-top]="'20px'">
        <button 
          (click)="reanalyzeOrder()"
          [style.padding]="'8px 16px'"
          [style.background]="'#17a2b8'"
          [style.color]="'white'"
          [style.border]="'none'"
          [style.border-radius]="'4px'"
          [style.margin-right]="'8px'"
        >
          Re-analyze
        </button>
        
        <button 
          (click)="closeOrderPanel()"
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
export class ReadingOrderValidatorComponent implements OnDestroy {
  constructor(
    private renderer: Renderer2,
    private i18n: I18nService
  ) {}

  document = inject(DOCUMENT);
  currentState = 0;
  base = "Reading Order Validator";
  states = [this.base, "Analyze Reading Order", "Show Issues", "Visualize Order"];
  
  readingOrderIssues: ReadingOrderIssue[] = [];
  headingElements: HTMLElement[] = [];
  interactiveElements: HTMLElement[] = [];
  showOrderPanel = false;
  showTabOrder = false;
  showHeadingHierarchy = false;
  showReadingFlow = false;
  
  private highlightedElements: HTMLElement[] = [];
  private visualizationElements: HTMLElement[] = [];

  nextState() {
    this.currentState += 1;
    this.currentState = this.currentState % 4;
    this._runStateLogic();
  }

  private _runStateLogic() {
    this.removeHighlights();
    this.removeVisualizations();

    if (this.states[this.currentState] === "Analyze Reading Order") {
      this.analyzeReadingOrder();
    } else if (this.states[this.currentState] === "Show Issues") {
      this.showOrderPanel = true;
    } else if (this.states[this.currentState] === "Visualize Order") {
      this.showOrderPanel = true;
      this.showTabOrder = true;
      this.showHeadingHierarchy = true;
      this.applyAllVisualizations();
    } else {
      this.showOrderPanel = false;
      this.showTabOrder = false;
      this.showHeadingHierarchy = false;
      this.showReadingFlow = false;
      this.readingOrderIssues = [];
      this.headingElements = [];
      this.interactiveElements = [];
    }
  }

  private analyzeReadingOrder() {
    this.readingOrderIssues = [];
    this.headingElements = [];
    this.interactiveElements = [];
    
    // Collect heading elements
    this.collectHeadingElements();
    
    // Collect interactive elements
    this.collectInteractiveElements();
    
    // Analyze heading hierarchy
    this.analyzeHeadingHierarchy();
    
    // Analyze tab order
    this.analyzeTabOrder();
    
    // Analyze visual vs logical order
    this.analyzeVisualOrder();
    
    this.showOrderPanel = true;
    this.announceResults();
  }

  private collectHeadingElements() {
    const headings = this.document.querySelectorAll('h1, h2, h3, h4, h5, h6') as NodeListOf<HTMLElement>;
    headings.forEach(heading => {
      // Skip elements that are part of the accessibility widget
      if (heading.closest('astral-accessibility')) return;
      
      if (this.isElementVisible(heading)) {
        this.headingElements.push(heading);
      }
    });
  }

  private collectInteractiveElements() {
    const interactiveSelectors = [
      'a[href]',
      'button',
      'input:not([type="hidden"])',
      'select',
      'textarea',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]',
      '[role="button"]',
      '[role="link"]',
      '[role="tab"]'
    ];

    interactiveSelectors.forEach(selector => {
      const elements = this.document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
      elements.forEach(element => {
        // Skip elements that are part of the accessibility widget
        if (element.closest('astral-accessibility')) return;
        
        if (this.isElementVisible(element) && !this.interactiveElements.includes(element)) {
          this.interactiveElements.push(element);
        }
      });
    });
  }

  private analyzeHeadingHierarchy() {
    if (this.headingElements.length === 0) return;

    let previousLevel = 0;
    
    this.headingElements.forEach((heading, index) => {
      const tagName = heading.tagName.toLowerCase();
      const currentLevel = parseInt(tagName.charAt(1));
      
      // Check for H1 as first heading
      if (index === 0 && currentLevel !== 1) {
        this.readingOrderIssues.push({
          element: heading,
          issue: 'heading-hierarchy',
          description: `First heading is ${tagName.toUpperCase()}, but should typically be H1.`,
          recommendation: 'Consider using H1 for the main page heading, then H2 for major sections.',
          severity: 'medium'
        });
      }
      
      // Check for skipped heading levels
      if (index > 0 && currentLevel > previousLevel + 1) {
        this.readingOrderIssues.push({
          element: heading,
          issue: 'heading-hierarchy',
          description: `Heading jumps from H${previousLevel} to H${currentLevel}, skipping levels.`,
          recommendation: 'Use heading levels sequentially (H1, H2, H3, etc.) without skipping.',
          severity: 'high'
        });
      }
      
      // Check for empty headings
      const textContent = heading.textContent?.trim();
      if (!textContent || textContent.length === 0) {
        this.readingOrderIssues.push({
          element: heading,
          issue: 'heading-hierarchy',
          description: 'Heading element is empty or contains only whitespace.',
          recommendation: 'Provide descriptive text for all headings or remove empty heading elements.',
          severity: 'high'
        });
      }
      
      previousLevel = currentLevel;
    });
  }

  private analyzeTabOrder() {
    // Get all focusable elements in document order
    const focusableElements = this.interactiveElements.filter(el => {
      const tabIndex = el.getAttribute('tabindex');
      return tabIndex !== '-1';
    });

    // Sort by explicit tabindex, then by document order
    const sortedByTabIndex = [...focusableElements].sort((a, b) => {
      const aTabIndex = parseInt(a.getAttribute('tabindex') || '0');
      const bTabIndex = parseInt(b.getAttribute('tabindex') || '0');
      
      if (aTabIndex !== bTabIndex) {
        // Positive tabindex comes first, then 0/-1
        if (aTabIndex > 0 && bTabIndex <= 0) return -1;
        if (bTabIndex > 0 && aTabIndex <= 0) return 1;
        if (aTabIndex > 0 && bTabIndex > 0) return aTabIndex - bTabIndex;
      }
      
      return 0; // Document order for same tabindex
    });

    // Check for problematic positive tabindex values
    focusableElements.forEach(element => {
      const tabIndex = parseInt(element.getAttribute('tabindex') || '0');
      
      if (tabIndex > 0) {
        this.readingOrderIssues.push({
          element: element,
          issue: 'tab-order',
          description: `Element has positive tabindex (${tabIndex}), which can disrupt natural tab order.`,
          recommendation: 'Avoid positive tabindex values. Use document order or tabindex="0" instead.',
          severity: 'medium'
        });
      }
    });

    // Check for visual vs logical order mismatches
    this.checkTabOrderVsVisualOrder(focusableElements);
  }

  private checkTabOrderVsVisualOrder(elements: HTMLElement[]) {
    if (elements.length < 2) return;

    for (let i = 0; i < elements.length - 1; i++) {
      const current = elements[i];
      const next = elements[i + 1];
      
      const currentRect = current.getBoundingClientRect();
      const nextRect = next.getBoundingClientRect();
      
      // Simple check: if next element is significantly above current element
      // it might indicate a tab order issue
      if (nextRect.bottom < currentRect.top - 20) {
        this.readingOrderIssues.push({
          element: next,
          issue: 'visual-order-mismatch',
          description: 'Tab order may not match visual layout (element appears above previous in tab order).',
          recommendation: 'Ensure tab order follows visual layout. Consider reorganizing HTML structure.',
          severity: 'medium'
        });
      }
    }
  }

  private analyzeVisualOrder() {
    // Check for CSS that might affect reading order
    const elementsWithFloats = this.document.querySelectorAll('*') as NodeListOf<HTMLElement>;
    
    elementsWithFloats.forEach(element => {
      if (element.closest('astral-accessibility')) return;
      
      const style = window.getComputedStyle(element);
      
      // Check for absolute/fixed positioning that might break logical flow
      if (style.position === 'absolute' || style.position === 'fixed') {
        const hasInteractiveContent = element.querySelector('a, button, input, select, textarea, [tabindex]');
        
        if (hasInteractiveContent && this.isElementVisible(element)) {
          this.readingOrderIssues.push({
            element: element,
            issue: 'logical-order',
            description: 'Absolutely positioned element contains interactive content that may disrupt reading order.',
            recommendation: 'Ensure positioned elements with interactive content maintain logical tab order.',
            severity: 'low'
          });
        }
      }
    });
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

  private applyAllVisualizations() {
    if (this.showTabOrder) {
      this.visualizeTabOrder();
    }
    if (this.showHeadingHierarchy) {
      this.visualizeHeadingHierarchy();
    }
    if (this.showReadingFlow) {
      this.visualizeReadingFlow();
    }
  }

  private visualizeTabOrder() {
    this.interactiveElements.forEach((element, index) => {
      const indicator = this.renderer.createElement('div');
      
      this.renderer.setStyle(indicator, 'position', 'absolute');
      this.renderer.setStyle(indicator, 'background', '#0066cc');
      this.renderer.setStyle(indicator, 'color', 'white');
      this.renderer.setStyle(indicator, 'border-radius', '50%');
      this.renderer.setStyle(indicator, 'width', '24px');
      this.renderer.setStyle(indicator, 'height', '24px');
      this.renderer.setStyle(indicator, 'display', 'flex');
      this.renderer.setStyle(indicator, 'align-items', 'center');
      this.renderer.setStyle(indicator, 'justify-content', 'center');
      this.renderer.setStyle(indicator, 'font-size', '12px');
      this.renderer.setStyle(indicator, 'font-weight', 'bold');
      this.renderer.setStyle(indicator, 'z-index', '999999');
      this.renderer.setStyle(indicator, 'pointer-events', 'none');
      
      const rect = element.getBoundingClientRect();
      this.renderer.setStyle(indicator, 'top', `${rect.top + window.scrollY - 12}px`);
      this.renderer.setStyle(indicator, 'left', `${rect.left + window.scrollX - 12}px`);
      
      this.renderer.setProperty(indicator, 'textContent', (index + 1).toString());
      this.renderer.appendChild(this.document.body, indicator);
      this.visualizationElements.push(indicator);
    });
  }

  private visualizeHeadingHierarchy() {
    this.headingElements.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      const indicator = this.renderer.createElement('div');
      
      this.renderer.setStyle(indicator, 'position', 'absolute');
      this.renderer.setStyle(indicator, 'background', this.getHeadingLevelColor(level));
      this.renderer.setStyle(indicator, 'color', 'white');
      this.renderer.setStyle(indicator, 'padding', '2px 6px');
      this.renderer.setStyle(indicator, 'border-radius', '3px');
      this.renderer.setStyle(indicator, 'font-size', '10px');
      this.renderer.setStyle(indicator, 'font-weight', 'bold');
      this.renderer.setStyle(indicator, 'z-index', '999998');
      this.renderer.setStyle(indicator, 'pointer-events', 'none');
      
      const rect = heading.getBoundingClientRect();
      this.renderer.setStyle(indicator, 'top', `${rect.top + window.scrollY}px`);
      this.renderer.setStyle(indicator, 'right', `${window.innerWidth - rect.right - window.scrollX}px`);
      
      this.renderer.setProperty(indicator, 'textContent', `H${level}`);
      this.renderer.appendChild(this.document.body, indicator);
      this.visualizationElements.push(indicator);
    });
  }

  private visualizeReadingFlow() {
    const readableElements = [...this.headingElements, ...this.interactiveElements]
      .filter(el => this.isElementVisible(el))
      .sort((a, b) => {
        const aRect = a.getBoundingClientRect();
        const bRect = b.getBoundingClientRect();
        
        // Sort by Y position first, then X position
        if (Math.abs(aRect.top - bRect.top) > 10) {
          return aRect.top - bRect.top;
        }
        return aRect.left - bRect.left;
      });

    // Draw arrows between consecutive elements
    for (let i = 0; i < readableElements.length - 1; i++) {
      const current = readableElements[i];
      const next = readableElements[i + 1];
      
      this.drawArrowBetweenElements(current, next);
    }
  }

  private drawArrowBetweenElements(from: HTMLElement, to: HTMLElement) {
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    
    const arrow = this.renderer.createElement('div');
    this.renderer.setStyle(arrow, 'position', 'absolute');
    this.renderer.setStyle(arrow, 'border', '2px solid #28a745');
    this.renderer.setStyle(arrow, 'z-index', '999997');
    this.renderer.setStyle(arrow, 'pointer-events', 'none');
    
    const fromX = fromRect.left + fromRect.width / 2;
    const fromY = fromRect.bottom;
    const toX = toRect.left + toRect.width / 2;
    const toY = toRect.top;
    
    const deltaX = toX - fromX;
    const deltaY = toY - fromY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > 50) { // Only draw arrow if elements are reasonably far apart
      const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
      
      this.renderer.setStyle(arrow, 'width', `${distance}px`);
      this.renderer.setStyle(arrow, 'height', '0px');
      this.renderer.setStyle(arrow, 'transform', `rotate(${angle}deg)`);
      this.renderer.setStyle(arrow, 'transform-origin', '0 0');
      this.renderer.setStyle(arrow, 'top', `${fromY + window.scrollY}px`);
      this.renderer.setStyle(arrow, 'left', `${fromX + window.scrollX}px`);
      
      this.renderer.appendChild(this.document.body, arrow);
      this.visualizationElements.push(arrow);
    }
  }

  private getHeadingLevelColor(level: number): string {
    const colors = ['#dc3545', '#fd7e14', '#ffc107', '#28a745', '#17a2b8', '#6f42c1'];
    return colors[level - 1] || '#6c757d';
  }

  toggleTabOrderVisualization(event: Event) {
    const target = event.target as HTMLInputElement;
    this.showTabOrder = target.checked;
    
    this.removeVisualizations();
    this.applyAllVisualizations();
  }

  toggleHeadingVisualization(event: Event) {
    const target = event.target as HTMLInputElement;
    this.showHeadingHierarchy = target.checked;
    
    this.removeVisualizations();
    this.applyAllVisualizations();
  }

  toggleReadingFlowVisualization(event: Event) {
    const target = event.target as HTMLInputElement;
    this.showReadingFlow = target.checked;
    
    this.removeVisualizations();
    this.applyAllVisualizations();
  }

  highlightElement(element: HTMLElement) {
    this.removeHighlights();
    
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
    
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
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

  private removeVisualizations() {
    this.visualizationElements.forEach(element => {
      if (element.parentNode) {
        this.renderer.removeChild(this.document.body, element);
      }
    });
    this.visualizationElements = [];
  }

  reanalyzeOrder() {
    this.analyzeReadingOrder();
    this.announceToScreenReader('Re-analyzed reading order');
  }

  getTabOrderIssues(): ReadingOrderIssue[] {
    return this.readingOrderIssues.filter(issue => issue.issue === 'tab-order');
  }

  getIssueTitle(issue: string): string {
    switch (issue) {
      case 'logical-order': return 'Logical Order Issue';
      case 'heading-hierarchy': return 'Heading Hierarchy Problem';
      case 'tab-order': return 'Tab Order Issue';
      case 'visual-order-mismatch': return 'Visual/Logical Order Mismatch';
      default: return 'Unknown Issue';
    }
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#17a2b8';
      default: return '#6c757d';
    }
  }

  getElementDescription(element: HTMLElement): string {
    const tagName = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const className = element.className ? `.${element.className.split(' ')[0]}` : '';
    const text = element.textContent?.trim().substring(0, 30);
    const textPart = text ? ` "${text}${text.length === 30 ? '...' : ''}"` : '';
    
    return `<${tagName}>${id}${className}${textPart}`;
  }

  closeOrderPanel() {
    this.showOrderPanel = false;
    this.currentState = 0;
    this.removeHighlights();
    this.removeVisualizations();
    this.showTabOrder = false;
    this.showHeadingHierarchy = false;
    this.showReadingFlow = false;
  }

  private announceResults() {
    const issueCount = this.readingOrderIssues.length;
    const headingCount = this.headingElements.length;
    const interactiveCount = this.interactiveElements.length;
    
    const message = issueCount === 0 
      ? `Reading order analysis complete: ${headingCount} headings, ${interactiveCount} interactive elements, no issues found`
      : `Found ${issueCount} reading order issue${issueCount === 1 ? '' : 's'} across ${headingCount} headings and ${interactiveCount} interactive elements`;
    
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
    this.removeVisualizations();
    this.showOrderPanel = false;
  }
}
