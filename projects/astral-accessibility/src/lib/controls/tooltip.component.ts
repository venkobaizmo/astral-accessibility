import { DOCUMENT, NgIf, NgClass } from "@angular/common";
import { Component, inject, Renderer2 } from "@angular/core";
import { AstralCheckmarkSvgComponent } from "../util/astral-checksvg.component";
import { I18nService } from "../services/i18n.service";

@Component({
  selector: "astral-tooltip",
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
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="white"
                d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"
              />
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
  `,
  imports: [NgIf, NgClass, AstralCheckmarkSvgComponent],
})
export class TooltipComponent {
  document = inject(DOCUMENT);
  renderer = inject(Renderer2);
  i18n = inject(I18nService);

  currentState = 0;
  base = this.i18n.getTranslation('tooltip');
  states = [
    this.i18n.getTranslation('tooltip'),
    this.i18n.getTranslation('show-all-titles'),
    this.i18n.getTranslation('enhanced-tooltips'),
    this.i18n.getTranslation('context-helper')
  ];

  private styleElement?: HTMLStyleElement;
  private tooltipElement?: HTMLElement;

  nextState() {
    this.currentState += 1;
    this.currentState = this.currentState % 4;
    this._runStateLogic();
  }

  private _runStateLogic() {
    // Remove existing styles and tooltip
    if (this.styleElement) {
      this.renderer.removeChild(this.document.head, this.styleElement);
      this.styleElement = undefined;
    }

    if (this.tooltipElement) {
      this.renderer.removeChild(this.document.body, this.tooltipElement);
      this.tooltipElement = undefined;
    }

    if (this.currentState === 0) {
      return; // Normal tooltips
    }

    // Create new style element
    this.styleElement = this.renderer.createElement('style');
    let css = '';

    if (this.currentState === 1) {
      css = `
        /* Enhanced tooltip visibility */
        [title]:not([title=""]):after {
          content: " [" attr(title) "]";
          background: #333;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: normal;
          margin-left: 5px;
          white-space: nowrap;
          display: inline-block;
          max-width: 200px;
          word-wrap: break-word;
        }
        
        img[alt]:not([alt=""]):after {
          content: " [Alt: " attr(alt) "]";
          background: #0066cc;
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          margin-left: 3px;
          display: inline-block;
        }
        
        a[href]:after {
          content: " [Link: " attr(href) "]";
          background: #28a745;
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
          margin-left: 3px;
          display: inline-block;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `;
    }

    if (this.currentState === 2) {
      css = `
        /* Create floating tooltip */
        .astral-tooltip {
          position: fixed;
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          max-width: 300px;
          z-index: 999999;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        .astral-tooltip.visible {
          opacity: 1;
        }
        
        .astral-tooltip-arrow {
          position: absolute;
          top: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 5px solid rgba(0, 0, 0, 0.9);
        }
        
        /* Highlight elements with tooltips */
        [title]:not([title=""]), [aria-label]:not([aria-label=""]), 
        [aria-describedby], img[alt]:not([alt=""]) {
          outline: 1px dashed rgba(255, 215, 0, 0.5) !important;
          outline-offset: 1px !important;
        }
      `;
    }

    if (this.currentState === 3) {
      css = `
        /* Context information overlay */
        .astral-context-info {
          position: fixed;
          top: 10px;
          right: 10px;
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid #0066cc;
          border-radius: 8px;
          padding: 12px;
          font-size: 13px;
          max-width: 250px;
          z-index: 999999;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        .astral-context-title {
          font-weight: bold;
          color: #0066cc;
          margin-bottom: 5px;
        }
        
        /* Highlight interactive elements */
        a, button, [role="button"], [role="link"], 
        input, select, textarea, [tabindex] {
          position: relative;
        }
        
        a:hover, button:hover, [role="button"]:hover, 
        [role="link"]:hover, input:hover, select:hover, textarea:hover {
          background-color: rgba(255, 255, 0, 0.2) !important;
          outline: 2px solid #ff6b6b !important;
          outline-offset: 2px !important;
        }
        
        /* Show element type indicators */
        a:hover:before {
          content: "🔗 Link";
          position: absolute;
          bottom: 100%;
          left: 0;
          background: #0066cc;
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          white-space: nowrap;
          z-index: 1000000;
        }
        
        button:hover:before, [role="button"]:hover:before {
          content: "🔘 Button";
          position: absolute;
          bottom: 100%;
          left: 0;
          background: #28a745;
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          white-space: nowrap;
          z-index: 1000000;
        }
        
        input:hover:before, textarea:hover:before, select:hover:before {
          content: "📝 Input";
          position: absolute;
          bottom: 100%;
          left: 0;
          background: #ff6b6b;
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          white-space: nowrap;
          z-index: 1000000;
        }
      `;
    }

    this.renderer.setProperty(this.styleElement, 'textContent', css);
    this.renderer.appendChild(this.document.head, this.styleElement);

    // Add enhanced tooltip functionality
    if (this.currentState === 2) {
      this.addEnhancedTooltips();
    }

    if (this.currentState === 3) {
      this.addContextHelper();
    }
  }

  private addEnhancedTooltips() {
    // Create tooltip element
    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'astral-tooltip');
    this.renderer.appendChild(this.document.body, this.tooltipElement);

    const arrow = this.renderer.createElement('div');
    this.renderer.addClass(arrow, 'astral-tooltip-arrow');
    this.renderer.appendChild(this.tooltipElement, arrow);

    // Add event listeners
    this.document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      const title = target.getAttribute('title') || 
                   target.getAttribute('aria-label') || 
                   target.getAttribute('alt');
      
      if (title && this.tooltipElement) {
        this.tooltipElement.textContent = title;
        this.renderer.addClass(this.tooltipElement, 'visible');
        
        const rect = target.getBoundingClientRect();
        this.tooltipElement.style.left = (rect.left + rect.width / 2) + 'px';
        this.tooltipElement.style.top = (rect.top - 40) + 'px';
      }
    });

    this.document.addEventListener('mouseout', () => {
      if (this.tooltipElement) {
        this.renderer.removeClass(this.tooltipElement, 'visible');
      }
    });
  }

  private addContextHelper() {
    const contextInfo = this.renderer.createElement('div');
    this.renderer.addClass(contextInfo, 'astral-context-info');
    
    const title = this.renderer.createElement('div');
    this.renderer.addClass(title, 'astral-context-title');
    this.renderer.setProperty(title, 'textContent', 'Context Helper');
    this.renderer.appendChild(contextInfo, title);

    const content = this.renderer.createElement('div');
    this.renderer.setProperty(content, 'textContent', 'Hover over elements to see their type and purpose');
    this.renderer.appendChild(contextInfo, content);

    this.renderer.appendChild(this.document.body, contextInfo);

    // Update context info on hover
    this.document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const role = target.getAttribute('role');
      const type = target.getAttribute('type');
      
      let elementType = tagName;
      if (role) elementType = role;
      if (type) elementType = `${tagName}[${type}]`;

      const description = this.getElementDescription(elementType, target);
      content.textContent = description;
    });
  }

  private getElementDescription(elementType: string, element: HTMLElement): string {
    const descriptions: { [key: string]: string } = {
      'a': 'Clickable link that navigates to another page or section',
      'button': 'Interactive button that performs an action when clicked',
      'input': 'Input field for entering text or data',
      'select': 'Dropdown menu for selecting from multiple options',
      'textarea': 'Multi-line text input area',
      'h1': 'Main page heading (most important)',
      'h2': 'Section heading (second level)',
      'h3': 'Subsection heading (third level)',
      'img': 'Image with alternative text for screen readers',
      'nav': 'Navigation menu or links area',
      'main': 'Main content area of the page',
      'form': 'Form for collecting user input',
      'link': 'Clickable link element',
      'checkbox': 'Checkbox for selecting multiple options',
      'radio': 'Radio button for selecting one option',
      'submit': 'Submit button to send form data'
    };

    return descriptions[elementType] || `${elementType.toUpperCase()} element - hover to see more details`;
  }

  ngOnDestroy() {
    if (this.styleElement) {
      this.renderer.removeChild(this.document.head, this.styleElement);
    }
    if (this.tooltipElement) {
      this.renderer.removeChild(this.document.body, this.tooltipElement);
    }
    const contextInfo = this.document.querySelector('.astral-context-info');
    if (contextInfo) {
      this.renderer.removeChild(this.document.body, contextInfo);
    }
  }
}
