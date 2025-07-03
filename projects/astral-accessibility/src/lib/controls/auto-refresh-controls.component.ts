import { DOCUMENT, NgIf, NgClass, NgFor } from "@angular/common";
import { Component, inject, Renderer2, OnDestroy, Optional, SkipSelf } from "@angular/core";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from "../izmo-accessibility.component";

interface AutoRefreshInfo {
  type: 'meta-refresh' | 'javascript-timer' | 'auto-redirect';
  element?: HTMLElement;
  interval: number;
  destination?: string;
  isActive: boolean;
}

@Component({
  selector: "izmo-auto-refresh-controls",
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
              <circle cx="20.5" cy="20.5" r="16" fill="none" stroke="currentColor" stroke-width="2"/>
              <path d="M20.5 8 L20.5 20.5 L28 20.5" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M8 12 L12 8 L8 4" stroke="currentColor" stroke-width="2" fill="none"/>
              <text x="4" y="38" font-family="Arial" font-size="6" fill="currentColor">AUTO</text>
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
      *ngIf="showControlPanel" 
      class="auto-refresh-control-panel"
      role="dialog"
      aria-labelledby="auto-refresh-title"
      [style.position]="'fixed'"
      [style.bottom]="'20px'"
      [style.right]="'20px'"
      [style.width]="'380px'"
      [style.max-height]="'60vh'"
      [style.overflow-y]="'auto'"
      [style.background]="'white'"
      [style.border]="'2px solid #0066cc'"
      [style.border-radius]="'8px'"
      [style.padding]="'20px'"
      [style.z-index]="'999999'"
      [style.box-shadow]="'0 4px 20px rgba(0,0,0,0.3)'"
    >
      <h3 id="auto-refresh-title" [style.margin]="'0 0 15px 0'" [style.color]="'#333'">
        Auto-refresh Controls
      </h3>
      
      <div *ngIf="autoRefreshItems.length === 0" 
           [style.color]="'#28a745'" 
           [style.padding]="'15px'" 
           [style.background]="'#d4edda'" 
           [style.border-radius]="'4px'"
           [style.margin-bottom]="'15px'">
        ✓ No automatic page refreshes detected
      </div>
      
      <div *ngIf="autoRefreshItems.length > 0">
        <div [style.margin-bottom]="'15px'">
          <strong>Detected Auto-refresh Activities ({{ autoRefreshItems.length }}):</strong>
        </div>
        
        <div *ngFor="let item of autoRefreshItems; index as i" 
             [style.margin-bottom]="'15px'"
             [style.padding]="'12px'"
             [style.border]="'1px solid #ddd'"
             [style.border-radius]="'6px'"
             [style.background]="item.isActive ? '#fff3cd' : '#d4edda'">
          
          <div [style.display]="'flex'" [style.justify-content]="'space-between'" [style.align-items]="'center'" [style.margin-bottom]="'8px'">
            <strong>{{ getRefreshTypeDisplay(item.type) }}</strong>
            <span [style.padding]="'2px 8px'" 
                  [style.border-radius]="'12px'" 
                  [style.font-size]="'12px'"
                  [style.background]="item.isActive ? '#ffc107' : '#28a745'"
                  [style.color]="'white'">
              {{ item.isActive ? 'ACTIVE' : 'PAUSED' }}
            </span>
          </div>
          
          <div [style.margin-bottom]="'8px'" [style.font-size]="'14px'">
            <strong>Interval:</strong> {{ formatInterval(item.interval) }}
          </div>
          
          <div *ngIf="item.destination" [style.margin-bottom]="'8px'" [style.font-size]="'14px'">
            <strong>Destination:</strong> {{ item.destination }}
          </div>
          
          <div [style.display]="'flex'" [style.gap]="'8px'">
            <button 
              (click)="toggleRefresh(i)"
              [style.padding]="'6px 12px'"
              [style.background]="item.isActive ? '#dc3545' : '#28a745'"
              [style.color]="'white'"
              [style.border]="'none'"
              [style.border-radius]="'4px'"
              [style.font-size]="'12px'"
              [style.cursor]="'pointer'"
            >
              {{ item.isActive ? 'Pause' : 'Resume' }}
            </button>
            
            <button 
              (click)="configureRefresh(i)"
              [style.padding]="'6px 12px'"
              [style.background]="'#0066cc'"
              [style.color]="'white'"
              [style.border]="'none'"
              [style.border-radius]="'4px'"
              [style.font-size]="'12px'"
              [style.cursor]="'pointer'"
            >
              Configure
            </button>
          </div>
        </div>
      </div>
      
      <div [style.margin-top]="'20px'" [style.padding]="'15px'" [style.background]="'#e9ecef'" [style.border-radius]="'4px'">
        <strong>User Controls:</strong>
        <div [style.margin-top]="'10px'">
          <label [style.display]="'flex'" [style.align-items]="'center'" [style.margin-bottom]="'8px'">
            <input 
              type="checkbox" 
              [checked]="globalPauseEnabled"
              (change)="toggleGlobalPause($event)"
              [style.margin-right]="'8px'"
            />
            Pause all automatic refreshes
          </label>
          
          <label [style.display]="'flex'" [style.align-items]="'center'" [style.margin-bottom]="'8px'">
            <input 
              type="checkbox" 
              [checked]="showWarnings"
              (change)="toggleWarnings($event)"
              [style.margin-right]="'8px'"
            />
            Show warnings before auto-refresh
          </label>
          
          <div [style.margin-top]="'10px'">
            <label [style.display]="'block'" [style.margin-bottom]="'4px'">
              Minimum refresh interval (seconds):
            </label>
            <input 
              type="number" 
              [value]="minRefreshInterval"
              (input)="updateMinInterval($event)"
              min="5"
              max="3600"
              [style.width]="'100px'"
              [style.padding]="'4px'"
              [style.border]="'1px solid #ccc'"
              [style.border-radius]="'3px'"
            />
          </div>
        </div>
      </div>
      
      <div [style.text-align]="'right'" [style.margin-top]="'20px'">
        <button 
          (click)="closeControlPanel()"
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
export class AutoRefreshControlsComponent implements OnDestroy {
  reset() {
    this.currentState = 0;
    this.showControlPanel = false;
    this.resumeAllAutoRefresh();
    this.globalPauseEnabled = false;
  }

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
    return this.i18n.getTranslation('auto-refresh-controls');
  }
  
  get states() {
    return [
      this.base,
      this.i18n.getTranslation('auto-refresh-detected'),
      this.i18n.getTranslation('pause-auto-refresh'),
      this.i18n.getTranslation('resume-auto-refresh')
    ];
  }
  
  autoRefreshItems: AutoRefreshInfo[] = [];
  showControlPanel = false;
  globalPauseEnabled = false;
  showWarnings = true;
  minRefreshInterval = 30; // seconds
  
  private originalSetTimeout: typeof setTimeout;
  private originalSetInterval: typeof setInterval;
  private pausedTimeouts: Map<number, any> = new Map();
  private pausedIntervals: Map<number, any> = new Map();
  private interceptedCalls: number[] = [];

  ngOnInit() {
    // Store original functions
    this.originalSetTimeout = window.setTimeout;
    this.originalSetInterval = window.setInterval;
  }

  nextState() {
    this.currentState += 1;
    this.currentState = this.currentState % 4;
    this._runStateLogic();
  }

  private _runStateLogic() {
    if (this.states[this.currentState] === "Detect Auto-refresh") {
      this.detectAutoRefresh();
    } else if (this.states[this.currentState] === "Pause Auto-refresh") {
      this.pauseAllAutoRefresh();
    } else if (this.states[this.currentState] === "Control Panel") {
      this.showControlPanel = true;
    } else {
      this.resumeAllAutoRefresh();
      this.showControlPanel = false;
      this.autoRefreshItems = [];
    }
  }

  private detectAutoRefresh() {
    this.autoRefreshItems = [];
    
    // 1. Check for meta refresh tags
    const metaRefreshTags = this.document.querySelectorAll('meta[http-equiv="refresh"]') as NodeListOf<HTMLMetaElement>;
    metaRefreshTags.forEach(meta => {
      const content = meta.getAttribute('content');
      if (content) {
        const match = content.match(/(\d+)(?:;\s*url=(.+))?/i);
        if (match) {
          const interval = parseInt(match[1], 10);
          const destination = match[2] || window.location.href;
          
          this.autoRefreshItems.push({
            type: 'meta-refresh',
            element: meta,
            interval: interval * 1000, // Convert to milliseconds
            destination: destination,
            isActive: true
          });
        }
      }
    });

    // 2. Intercept setTimeout and setInterval for potential auto-refresh detection
    this.interceptTimerFunctions();
    
    this.announceResults();
  }  private interceptTimerFunctions() {
    const self = this;
    
    // Store original functions
    const originalSetTimeout = window.setTimeout.bind(window);
    const originalSetInterval = window.setInterval.bind(window);
    
    // Intercept setTimeout
    (window as any).setTimeout = function(callback: any, delay?: number, ...args: any[]): any {
      const actualDelay = delay || 0;
      // Check if this might be an auto-refresh call
      if (actualDelay >= 5000 && typeof callback === 'function' && self.mightBeAutoRefresh(callback.toString())) {
        const callInfo = {
          type: 'javascript-timer' as const,
          interval: actualDelay,
          isActive: true
        };
        
        self.autoRefreshItems.push(callInfo);
        
        if (self.globalPauseEnabled) {
          // Store the paused call
          const id = Math.random();
          self.pausedTimeouts.set(id, { callback, delay: actualDelay, args });
          return id;
        }
      }
      
      return originalSetTimeout(callback, actualDelay);
    };

    // Intercept setInterval
    (window as any).setInterval = function(callback: any, delay?: number, ...args: any[]): any {
      const actualDelay = delay || 0;
      // Check if this might be an auto-refresh call
      if (actualDelay >= 5000 && typeof callback === 'function' && self.mightBeAutoRefresh(callback.toString())) {
        const callInfo = {
          type: 'javascript-timer' as const,
          interval: actualDelay,
          isActive: true
        };
        
        self.autoRefreshItems.push(callInfo);
        
        if (self.globalPauseEnabled) {
          // Store the paused call
          const id = Math.random();
          self.pausedIntervals.set(id, { callback, delay: actualDelay, args });
          return id;
        }
      }
      
      return originalSetInterval(callback, actualDelay);
    };
  }

  private mightBeAutoRefresh(callbackString: string): boolean {
    const refreshPatterns = [
      /location\.reload/i,
      /location\.href/i,
      /window\.location/i,
      /document\.location/i,
      /location\.replace/i,
      /location\.assign/i
    ];
    
    return refreshPatterns.some(pattern => pattern.test(callbackString));
  }

  private pauseAllAutoRefresh() {
    this.globalPauseEnabled = true;
    
    // Disable meta refresh tags
    this.autoRefreshItems.forEach(item => {
      if (item.type === 'meta-refresh' && item.element) {
        const meta = item.element as HTMLMetaElement;
        const originalContent = meta.getAttribute('content');
        if (originalContent) {
          meta.setAttribute('data-original-content', originalContent);
          meta.removeAttribute('content');
          item.isActive = false;
        }
      } else if (item.type === 'javascript-timer') {
        item.isActive = false;
      }
    });

    this.announceToScreenReader('All automatic page refreshes have been paused');
  }

  private resumeAllAutoRefresh() {
    this.globalPauseEnabled = false;
    
    // Re-enable meta refresh tags
    this.autoRefreshItems.forEach(item => {
      if (item.type === 'meta-refresh' && item.element) {
        const meta = item.element as HTMLMetaElement;
        const originalContent = meta.getAttribute('data-original-content');
        if (originalContent) {
          meta.setAttribute('content', originalContent);
          meta.removeAttribute('data-original-content');
          item.isActive = true;
        }
      } else if (item.type === 'javascript-timer') {
        item.isActive = true;
      }
    });

    // Restore original timer functions
    window.setTimeout = this.originalSetTimeout;
    window.setInterval = this.originalSetInterval;

    this.announceToScreenReader('Automatic page refreshes have been resumed');
  }

  toggleRefresh(index: number) {
    const item = this.autoRefreshItems[index];
    
    if (item.type === 'meta-refresh' && item.element) {
      const meta = item.element as HTMLMetaElement;
      
      if (item.isActive) {
        // Pause this specific refresh
        const content = meta.getAttribute('content');
        if (content) {
          meta.setAttribute('data-original-content', content);
          meta.removeAttribute('content');
          item.isActive = false;
        }
      } else {
        // Resume this specific refresh
        const originalContent = meta.getAttribute('data-original-content');
        if (originalContent) {
          meta.setAttribute('content', originalContent);
          meta.removeAttribute('data-original-content');
          item.isActive = true;
        }
      }
    } else {
      item.isActive = !item.isActive;
    }

    const action = item.isActive ? 'resumed' : 'paused';
    this.announceToScreenReader(`Auto-refresh ${action}`);
  }

  configureRefresh(index: number) {
    const item = this.autoRefreshItems[index];
    const newInterval = prompt(
      `Enter new refresh interval in seconds (current: ${item.interval / 1000}s):`,
      (item.interval / 1000).toString()
    );
    
    if (newInterval && !isNaN(parseInt(newInterval))) {
      const seconds = Math.max(parseInt(newInterval), this.minRefreshInterval);
      item.interval = seconds * 1000;
      
      if (item.type === 'meta-refresh' && item.element) {
        const meta = item.element as HTMLMetaElement;
        const destination = item.destination || window.location.href;
        meta.setAttribute('content', `${seconds}; url=${destination}`);
      }
      
      this.announceToScreenReader(`Refresh interval updated to ${seconds} seconds`);
    }
  }

  toggleGlobalPause(event: Event) {
    const target = event.target as HTMLInputElement;
    this.globalPauseEnabled = target.checked;
    
    if (this.globalPauseEnabled) {
      this.pauseAllAutoRefresh();
    } else {
      this.resumeAllAutoRefresh();
    }
  }

  toggleWarnings(event: Event) {
    const target = event.target as HTMLInputElement;
    this.showWarnings = target.checked;
    
    this.announceToScreenReader(
      this.showWarnings ? 'Auto-refresh warnings enabled' : 'Auto-refresh warnings disabled'
    );
  }

  updateMinInterval(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value);
    if (!isNaN(value) && value >= 5) {
      this.minRefreshInterval = value;
    }
  }

  getRefreshTypeDisplay(type: string): string {
    switch (type) {
      case 'meta-refresh': return 'Meta Refresh Tag';
      case 'javascript-timer': return 'JavaScript Timer';
      case 'auto-redirect': return 'Automatic Redirect';
      default: return 'Unknown';
    }
  }

  formatInterval(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  closeControlPanel() {
    this.showControlPanel = false;
    this.currentState = 0;
  }

  private announceResults() {
    const message = this.autoRefreshItems.length === 0 
      ? 'No automatic page refreshes detected'
      : `Found ${this.autoRefreshItems.length} automatic refresh ${this.autoRefreshItems.length === 1 ? 'mechanism' : 'mechanisms'}`;
    
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
    // Restore original timer functions
    if (this.originalSetTimeout) {
      window.setTimeout = this.originalSetTimeout;
    }
    if (this.originalSetInterval) {
      window.setInterval = this.originalSetInterval;
    }
    
    this.resumeAllAutoRefresh();
    this.showControlPanel = false;
  }
}
