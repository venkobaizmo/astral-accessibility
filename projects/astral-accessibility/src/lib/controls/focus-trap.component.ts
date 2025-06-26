import { DOCUMENT, NgIf, NgClass, NgFor } from "@angular/common";
import { Component, inject, Renderer2, OnDestroy } from "@angular/core";
import { AstralCheckmarkSvgComponent } from "../util/astral-checksvg.component";
import { I18nService } from "../services/i18n.service";

interface FocusTrapInfo {
  element: HTMLElement;
  isActive: boolean;
  type: 'modal' | 'dialog' | 'menu' | 'custom';
  firstFocusable?: HTMLElement;
  lastFocusable?: HTMLElement;
}

@Component({
  selector: "astral-focus-trap",
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
              <rect x="6" y="6" width="29" height="29" fill="none" stroke="#FFF" stroke-width="2"/>
              <rect x="10" y="10" width="21" height="21" fill="none" stroke="#FFF" stroke-width="1" stroke-dasharray="2,2"/>
              <circle cx="20.5" cy="20.5" r="3" fill="#FFF"/>
              <text x="4" y="38" font-family="Arial" font-size="6" fill="#FFF">TRAP</text>
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

    <div 
      *ngIf="showFocusPanel" 
      class="focus-trap-panel"
      role="dialog"
      aria-labelledby="focus-trap-title"
      [style.position]="'fixed'"
      [style.top]="'50%'"
      [style.left]="'50%'"
      [style.transform]="'translate(-50%, -50%)'"
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
      <h3 id="focus-trap-title" [style.margin]="'0 0 15px 0'" [style.color]="'#333'">
        Focus Trap Management
      </h3>
      
      <div [style.margin-bottom]="'20px'">
        <label [style.display]="'flex'" [style.align-items]="'center'" [style.margin-bottom]="'10px'">
          <input 
            type="checkbox" 
            [checked]="autoTrapEnabled"
            (change)="toggleAutoTrap($event)"
            [style.margin-right]="'8px'"
          />
          <strong>Auto-trap modals and dialogs</strong>
        </label>
        <div [style.color]="'#666'" [style.font-size]="'14px'" [style.margin-left]="'24px'">
          Automatically trap focus when modals or dialogs are detected
        </div>
      </div>
      
      <div *ngIf="focusTraps.length === 0" 
           [style.color]="'#28a745'" 
           [style.padding]="'15px'" 
           [style.background]="'#d4edda'" 
           [style.border-radius]="'4px'"
           [style.margin-bottom]="'15px'">
        ✓ No focus traps currently active
      </div>
      
      <div *ngIf="focusTraps.length > 0">
        <h4 [style.margin]="'0 0 10px 0'">
          Active Focus Traps ({{ focusTraps.length }})
        </h4>
        
        <div *ngFor="let trap of focusTraps; index as i" 
             [style.margin-bottom]="'15px'"
             [style.padding]="'12px'"
             [style.border]="'1px solid #ddd'"
             [style.border-radius]="'6px'"
             [style.background]="trap.isActive ? '#fff3cd' : '#f8f9fa'">
          
          <div [style.display]="'flex'" [style.justify-content]="'space-between'" [style.align-items]="'center'" [style.margin-bottom]="'8px'">
            <strong>{{ getTrapTypeDisplay(trap.type) }}</strong>
            <span [style.padding]="'2px 8px'" 
                  [style.border-radius]="'12px'" 
                  [style.font-size]="'12px'"
                  [style.background]="trap.isActive ? '#ffc107' : '#6c757d'"
                  [style.color]="'white'">
              {{ trap.isActive ? 'ACTIVE' : 'INACTIVE' }}
            </span>
          </div>
          
          <div [style.margin-bottom]="'8px'" [style.font-size]="'14px'">
            <strong>Element:</strong> {{ getElementDescription(trap.element) }}
          </div>
          
          <div [style.margin-bottom]="'8px'" [style.font-size]="'14px'">
            <strong>Focusable elements:</strong> {{ getFocusableCount(trap.element) }}
          </div>
          
          <div [style.display]="'flex'" [style.gap]="'8px'">
            <button 
              (click)="toggleTrap(i)"
              [style.padding]="'6px 12px'"
              [style.background]="trap.isActive ? '#dc3545' : '#28a745'"
              [style.color]="'white'"
              [style.border]="'none'"
              [style.border-radius]="'4px'"
              [style.font-size]="'12px'"
              [style.cursor]="'pointer'"
            >
              {{ trap.isActive ? 'Deactivate' : 'Activate' }}
            </button>
            
            <button 
              (click)="highlightTrap(trap.element)"
              [style.padding]="'6px 12px'"
              [style.background]="'#0066cc'"
              [style.color]="'white'"
              [style.border]="'none'"
              [style.border-radius]="'4px'"
              [style.font-size]="'12px'"
              [style.cursor]="'pointer'"
            >
              Highlight
            </button>
            
            <button 
              (click)="testTrap(i)"
              [style.padding]="'6px 12px'"
              [style.background]="'#17a2b8'"
              [style.color]="'white'"
              [style.border]="'none'"
              [style.border-radius]="'4px'"
              [style.font-size]="'12px'"
              [style.cursor]="'pointer'"
            >
              Test
            </button>
          </div>
        </div>
      </div>
      
      <div [style.margin-top]="'20px'" [style.padding]="'15px'" [style.background]="'#e9ecef'" [style.border-radius]="'4px'">
        <strong>Focus Trap Status:</strong>
        <div [style.margin-top]="'10px'" [style.font-size]="'14px'">
          <div>Auto-detection: {{ autoTrapEnabled ? '✅ Enabled' : '❌ Disabled' }}</div>
          <div>Active traps: {{ getActiveTrapCount() }}</div>
          <div>Total managed elements: {{ focusTraps.length }}</div>
        </div>
      </div>
      
      <div [style.text-align]="'right'" [style.margin-top]="'20px'">
        <button 
          (click)="closeFocusPanel()"
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
export class FocusTrapComponent implements OnDestroy {
  constructor(
    private renderer: Renderer2,
    private i18n: I18nService
  ) {}

  document = inject(DOCUMENT);
  currentState = 0;
  base = this.i18n.getTranslation('focus-trap');
  states = [
    this.i18n.getTranslation('focus-trap'),
    this.i18n.getTranslation('enable-focus-trap'),
    this.i18n.getTranslation('focus-trap-enabled'),
    this.i18n.getTranslation('focus-trap-disabled')
  ];
  
  focusTraps: FocusTrapInfo[] = [];
  showFocusPanel = false;
  autoTrapEnabled = false;
  
  private trapObserver?: MutationObserver;
  private activeListeners: Map<HTMLElement, { keydownListener: Function, firstFocus: HTMLElement, lastFocus: HTMLElement }> = new Map();
  private highlightedElements: HTMLElement[] = [];

  nextState() {
    this.currentState += 1;
    this.currentState = this.currentState % 4;
    this._runStateLogic();
  }

  private _runStateLogic() {
    this.removeHighlights();

    if (this.states[this.currentState] === "Scan Focus Traps") {
      this.scanForFocusTraps();
    } else if (this.states[this.currentState] === "Manage Traps") {
      this.showFocusPanel = true;
    } else if (this.states[this.currentState] === "Auto-trap Modals") {
      this.autoTrapEnabled = true;
      this.startAutoTrapObserver();
      this.showFocusPanel = true;
    } else {
      this.deactivateAllTraps();
      this.stopAutoTrapObserver();
      this.autoTrapEnabled = false;
      this.showFocusPanel = false;
      this.focusTraps = [];
    }
  }

  private scanForFocusTraps() {
    this.focusTraps = [];
    
    // Look for modal and dialog elements
    const modalSelectors = [
      '[role="dialog"]',
      '[role="alertdialog"]',
      '[role="modal"]',
      '.modal',
      '.dialog',
      '.popup',
      '[aria-modal="true"]'
    ];

    modalSelectors.forEach(selector => {
      const elements = this.document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
      elements.forEach(element => {
        // Skip elements that are part of the accessibility widget
        if (element.closest('astral-accessibility')) return;
        
        // Check if element is visible
        if (this.isElementVisible(element)) {
          const trapInfo: FocusTrapInfo = {
            element: element,
            isActive: false,
            type: this.determineTrapType(element)
          };
          
          this.setupFocusableElements(trapInfo);
          this.focusTraps.push(trapInfo);
        }
      });
    });

    // Look for elements that might need focus trapping based on CSS or behavior
    this.scanForPotentialTraps();
    
    this.announceResults();
  }

  private scanForPotentialTraps() {
    // Look for elements with high z-index that might be modals
    const allElements = this.document.querySelectorAll('*') as NodeListOf<HTMLElement>;
    
    allElements.forEach(element => {
      // Skip if already found or part of accessibility widget
      if (this.focusTraps.some(trap => trap.element === element) || 
          element.closest('astral-accessibility')) return;
      
      const computedStyle = window.getComputedStyle(element);
      const zIndex = parseInt(computedStyle.zIndex) || 0;
      
      // Check for high z-index elements that might be modals
      if (zIndex > 1000 && 
          computedStyle.position !== 'static' && 
          this.isElementVisible(element) &&
          this.hasInteractiveContent(element)) {
        
        const trapInfo: FocusTrapInfo = {
          element: element,
          isActive: false,
          type: 'custom'
        };
        
        this.setupFocusableElements(trapInfo);
        this.focusTraps.push(trapInfo);
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

  private hasInteractiveContent(element: HTMLElement): boolean {
    const interactiveSelectors = 'button, input, select, textarea, a, [tabindex], [contenteditable]';
    return element.querySelectorAll(interactiveSelectors).length > 0;
  }

  private determineTrapType(element: HTMLElement): 'modal' | 'dialog' | 'menu' | 'custom' {
    const role = element.getAttribute('role');
    const className = element.className.toLowerCase();
    
    if (role === 'dialog' || role === 'alertdialog') return 'dialog';
    if (role === 'modal' || className.includes('modal')) return 'modal';
    if (role === 'menu' || className.includes('menu')) return 'menu';
    
    return 'custom';
  }

  private setupFocusableElements(trapInfo: FocusTrapInfo) {
    const focusableSelector = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"]), [contenteditable]';
    const focusableElements = trapInfo.element.querySelectorAll(focusableSelector) as NodeListOf<HTMLElement>;
    
    const visibleFocusable = Array.from(focusableElements).filter(el => this.isElementVisible(el));
    
    if (visibleFocusable.length > 0) {
      trapInfo.firstFocusable = visibleFocusable[0];
      trapInfo.lastFocusable = visibleFocusable[visibleFocusable.length - 1];
    }
  }

  private startAutoTrapObserver() {
    this.stopAutoTrapObserver();
    
    this.trapObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            
            // Check if this might be a modal that needs trapping
            if (this.shouldAutoTrap(element)) {
              const trapInfo: FocusTrapInfo = {
                element: element,
                isActive: true,
                type: this.determineTrapType(element)
              };
              
              this.setupFocusableElements(trapInfo);
              this.focusTraps.push(trapInfo);
              this.activateTrap(trapInfo);
              
              this.announceToScreenReader(`Auto-trapped ${trapInfo.type} element`);
            }
          }
        });
      });
    });

    this.trapObserver.observe(this.document.body, {
      childList: true,
      subtree: true
    });
  }

  private shouldAutoTrap(element: HTMLElement): boolean {
    const role = element.getAttribute('role');
    const ariaModal = element.getAttribute('aria-modal');
    const className = element.className.toLowerCase();
    
    return (role === 'dialog' || 
            role === 'alertdialog' || 
            role === 'modal' ||
            ariaModal === 'true' ||
            className.includes('modal') ||
            className.includes('dialog')) &&
           this.isElementVisible(element) &&
           this.hasInteractiveContent(element);
  }

  private stopAutoTrapObserver() {
    if (this.trapObserver) {
      this.trapObserver.disconnect();
      this.trapObserver = undefined;
    }
  }

  private activateTrap(trapInfo: FocusTrapInfo) {
    if (!trapInfo.firstFocusable || !trapInfo.lastFocusable) return;
    
    const keydownListener = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === trapInfo.firstFocusable) {
            e.preventDefault();
            trapInfo.lastFocusable?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === trapInfo.lastFocusable) {
            e.preventDefault();
            trapInfo.firstFocusable?.focus();
          }
        }
      }
      
      if (e.key === 'Escape') {
        // Allow escape to close modal
        const closeButton = trapInfo.element.querySelector('[aria-label*="close"], [data-dismiss], .close') as HTMLElement;
        closeButton?.click();
      }
    };

    trapInfo.element.addEventListener('keydown', keydownListener as EventListener);
    this.activeListeners.set(trapInfo.element, {
      keydownListener,
      firstFocus: trapInfo.firstFocusable,
      lastFocus: trapInfo.lastFocusable
    });

    // Focus the first focusable element
    trapInfo.firstFocusable.focus();
    trapInfo.isActive = true;
  }

  private deactivateTrap(trapInfo: FocusTrapInfo) {
    const listenerInfo = this.activeListeners.get(trapInfo.element);
    if (listenerInfo) {
      trapInfo.element.removeEventListener('keydown', listenerInfo.keydownListener as EventListener);
      this.activeListeners.delete(trapInfo.element);
    }
    trapInfo.isActive = false;
  }

  toggleTrap(index: number) {
    const trap = this.focusTraps[index];
    
    if (trap.isActive) {
      this.deactivateTrap(trap);
      this.announceToScreenReader('Focus trap deactivated');
    } else {
      this.activateTrap(trap);
      this.announceToScreenReader('Focus trap activated');
    }
  }

  toggleAutoTrap(event: Event) {
    const target = event.target as HTMLInputElement;
    this.autoTrapEnabled = target.checked;
    
    if (this.autoTrapEnabled) {
      this.startAutoTrapObserver();
      this.announceToScreenReader('Auto-trap enabled for new modals and dialogs');
    } else {
      this.stopAutoTrapObserver();
      this.announceToScreenReader('Auto-trap disabled');
    }
  }

  testTrap(index: number) {
    const trap = this.focusTraps[index];
    
    if (!trap.isActive) {
      this.activateTrap(trap);
    }
    
    // Simulate Tab navigation to test the trap
    if (trap.firstFocusable) {
      trap.firstFocusable.focus();
      this.announceToScreenReader('Testing focus trap - use Tab to navigate');
    }
  }

  highlightTrap(element: HTMLElement) {
    this.removeHighlights();
    
    const highlight = this.renderer.createElement('div');
    this.renderer.setStyle(highlight, 'position', 'absolute');
    this.renderer.setStyle(highlight, 'border', '3px solid #0066cc');
    this.renderer.setStyle(highlight, 'background', 'rgba(0, 102, 204, 0.1)');
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

  private deactivateAllTraps() {
    this.focusTraps.forEach(trap => {
      if (trap.isActive) {
        this.deactivateTrap(trap);
      }
    });
  }

  getTrapTypeDisplay(type: string): string {
    switch (type) {
      case 'modal': return 'Modal Dialog';
      case 'dialog': return 'Dialog Box';
      case 'menu': return 'Menu/Dropdown';
      case 'custom': return 'Custom Element';
      default: return 'Unknown';
    }
  }

  getElementDescription(element: HTMLElement): string {
    const tagName = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const className = element.className ? `.${element.className.split(' ')[0]}` : '';
    const role = element.getAttribute('role') ? `[role="${element.getAttribute('role')}"]` : '';
    
    return `<${tagName}>${id}${className}${role}`;
  }

  getFocusableCount(element: HTMLElement): number {
    const focusableSelector = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"]), [contenteditable]';
    return element.querySelectorAll(focusableSelector).length;
  }

  getActiveTrapCount(): number {
    return this.focusTraps.filter(trap => trap.isActive).length;
  }

  closeFocusPanel() {
    this.showFocusPanel = false;
    this.currentState = 0;
    this.removeHighlights();
  }

  private announceResults() {
    const message = this.focusTraps.length === 0 
      ? 'No potential focus traps detected'
      : `Found ${this.focusTraps.length} element${this.focusTraps.length === 1 ? '' : 's'} that ${this.focusTraps.length === 1 ? 'may benefit' : 'may benefit'} from focus trapping`;
    
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
    this.deactivateAllTraps();
    this.stopAutoTrapObserver();
    this.removeHighlights();
    this.showFocusPanel = false;
  }
}
