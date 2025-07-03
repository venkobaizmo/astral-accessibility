import { Component, OnInit, Renderer2, OnDestroy, inject } from "@angular/core";
import { NgIf, NgClass } from "@angular/common";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

interface StructureItem {
  element: HTMLElement;
  level: number;
  text: string;
  type: 'heading' | 'landmark' | 'region';
}

@Component({
  selector: "izmo-page-structure",
  standalone: true,
  template: `
    <button
      (click)="toggle()"
      [ngClass]="{ 'in-use': isActive }"
      [attr.aria-label]="isActive ? 'Hide page structure navigation' : 'Show page structure navigation'"
      [attr.aria-pressed]="isActive"
    >
      <div class="title">
        <div class="icon-state-wrap">
          <div class="icon action-icon" [ngClass]="{ inactive: !isActive, active: isActive }">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
              />
              <circle cx="7" cy="5" r="1" fill="currentColor"/>
              <circle cx="7" cy="12" r="1" fill="currentColor"/>
              <circle cx="7" cy="19" r="1" fill="currentColor"/>
            </svg>
          </div>
          <div class="state-dots-wrap">
            <span>{{ i18n.getTranslation('page-structure') }}</span>
          </div>
        </div>
      </div>
      <izmo-widget-checkmark [isActive]="isActive"></izmo-widget-checkmark>
    </button>
  `,
  imports: [NgIf, NgClass, IzmoCheckmarkSvgComponent],
})
export class PageStructureComponent implements OnInit, OnDestroy {
  isActive = false;
  private overlayElement?: HTMLElement;
  private structureItems: StructureItem[] = [];
  parent = inject(IzmoAccessibilityComponent);

  constructor(
    private renderer: Renderer2,
    public i18n: I18nService
  ) {}

  ngOnInit() {
    this.parent.resetEvent.subscribe(() => {
      this.isActive = false;
      this.hideStructureNavigation();
    });
    this.scanPageStructure();
  }

  ngOnDestroy() {
    if (this.overlayElement) {
      this.renderer.removeChild(document.body, this.overlayElement);
    }
  }

  toggle() {
    if (this.isActive) {
      this.hideStructureNavigation();
    } else {
      this.showStructureNavigation();
    }
    this.isActive = !this.isActive;
    this.announceChange();
  }

  private scanPageStructure() {
    this.structureItems = [];

    // Scan headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      this.structureItems.push({
        element: heading as HTMLElement,
        level,
        text: heading.textContent?.trim() || '',
        type: 'heading'
      });
    });

    // Scan landmarks
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], nav, main, aside, header, footer');
    landmarks.forEach(landmark => {
      const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
      const label = landmark.getAttribute('aria-label') || 
                    landmark.getAttribute('aria-labelledby') ||
                    this.getElementText(landmark as HTMLElement);
      
      this.structureItems.push({
        element: landmark as HTMLElement,
        level: 0,
        text: `${role}: ${label}`,
        type: 'landmark'
      });
    });

    // Sort by document order
    this.structureItems.sort((a, b) => {
      const aPos = a.element.compareDocumentPosition(b.element);
      return aPos & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
  }

  private getElementText(element: HTMLElement): string {
    const text = element.textContent?.trim() || '';
    return text.length > 50 ? text.substring(0, 47) + '...' : text;
  }

  private showStructureNavigation() {
    this.scanPageStructure(); // Refresh structure

    this.overlayElement = this.renderer.createElement('div');
    this.renderer.setStyle(this.overlayElement, 'position', 'fixed');
    this.renderer.setStyle(this.overlayElement, 'top', '20px');
    this.renderer.setStyle(this.overlayElement, 'left', '20px');
    this.renderer.setStyle(this.overlayElement, 'width', '400px');
    this.renderer.setStyle(this.overlayElement, 'max-height', '70vh');
    this.renderer.setStyle(this.overlayElement, 'background', 'white');
    this.renderer.setStyle(this.overlayElement, 'border', '2px solid #0066cc');
    this.renderer.setStyle(this.overlayElement, 'border-radius', '8px');
    this.renderer.setStyle(this.overlayElement, 'padding', '20px');
    this.renderer.setStyle(this.overlayElement, 'z-index', '999999');
    this.renderer.setStyle(this.overlayElement, 'box-shadow', '0 4px 20px rgba(0,0,0,0.3)');
    this.renderer.setStyle(this.overlayElement, 'overflow-y', 'auto');
    this.renderer.setAttribute(this.overlayElement, 'role', 'dialog');
    this.renderer.setAttribute(this.overlayElement, 'aria-labelledby', 'structure-title');
    this.renderer.setAttribute(this.overlayElement, 'aria-modal', 'true');

    const header = this.renderer.createElement('div');
    header.innerHTML = `
      <h2 id="structure-title" style="margin: 0 0 15px 0; color: #333;">Page Structure</h2>
      <div style="margin-bottom: 15px;">
        <button id="close-structure" style="padding: 8px 16px; background: #0066cc; color: white; border: none; border-radius: 4px; margin-right: 10px;">Close</button>
        <button id="refresh-structure" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px;">Refresh</button>
      </div>
    `;

    const structureList = this.renderer.createElement('div');
    this.renderer.setStyle(structureList, 'max-height', '50vh');
    this.renderer.setStyle(structureList, 'overflow-y', 'auto');

    if (this.structureItems.length === 0) {
      structureList.innerHTML = '<p>No headings or landmarks found on this page.</p>';
    } else {
      const listHTML = this.structureItems.map((item, index) => {
        const indent = item.type === 'heading' ? (item.level - 1) * 20 : 0;
        const icon = item.type === 'heading' ? '📝' : '🏷️';
        return `
          <button 
            class="structure-item" 
            data-index="${index}"
            style="
              display: block; 
              width: 100%; 
              text-align: left; 
              padding: 8px; 
              margin: 2px 0; 
              border: 1px solid #ddd; 
              background: #f8f9fa; 
              border-radius: 4px;
              margin-left: ${indent}px;
              cursor: pointer;
            "
            onmouseover="this.style.background='#e9ecef'"
            onmouseout="this.style.background='#f8f9fa'"
          >
            ${icon} ${item.text || 'Unnamed element'}
          </button>
        `;
      }).join('');
      structureList.innerHTML = listHTML;
    }

    this.renderer.appendChild(this.overlayElement, header);
    this.renderer.appendChild(this.overlayElement, structureList);
    this.renderer.appendChild(document.body, this.overlayElement);

    // Add event listeners
    if (this.overlayElement) {
      const closeButton = this.overlayElement.querySelector('#close-structure') as HTMLElement;
      const refreshButton = this.overlayElement.querySelector('#refresh-structure') as HTMLElement;
      
      if (closeButton) {
        closeButton.addEventListener('click', () => this.hideStructureNavigation());
        closeButton.focus();
      }
      
      if (refreshButton) {
        refreshButton.addEventListener('click', () => {
          this.hideStructureNavigation();
          setTimeout(() => this.showStructureNavigation(), 100);
        });
      }

      // Add navigation functionality
      const structureButtons = this.overlayElement.querySelectorAll('.structure-item');
      structureButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const index = parseInt((e.target as HTMLElement).getAttribute('data-index') || '0');
          this.navigateToStructureItem(index);
        });
      });
    }

    // Escape key handler
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.hideStructureNavigation();
        document.removeEventListener('keydown', keyHandler);
      }
    };
    document.addEventListener('keydown', keyHandler);
  }

  private navigateToStructureItem(index: number) {
    const item = this.structureItems[index];
    if (item) {
      item.element.setAttribute('tabindex', '-1');
      item.element.focus();
      item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      this.announceMessage(`Navigated to: ${item.text}`);
      this.hideStructureNavigation();
    }
  }

  private hideStructureNavigation() {
    if (this.overlayElement) {
      this.renderer.removeChild(document.body, this.overlayElement);
      this.overlayElement = undefined;
    }
    this.isActive = false;
  }

  private announceChange() {
    const message = this.isActive ? 'Page structure navigation opened' : 'Page structure navigation closed';
    this.announceMessage(message);
  }

  private announceMessage(message: string) {
    const announcement = this.renderer.createElement('div');
    this.renderer.setAttribute(announcement, 'aria-live', 'polite');
    this.renderer.setAttribute(announcement, 'aria-atomic', 'true');
    this.renderer.setStyle(announcement, 'position', 'absolute');
    this.renderer.setStyle(announcement, 'left', '-10000px');
    this.renderer.setProperty(announcement, 'textContent', message);
    this.renderer.appendChild(document.body, announcement);
    
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        this.renderer.removeChild(document.body, announcement);
      }
    }, 1000);
  }
}
