import { DOCUMENT, NgIf, NgClass } from "@angular/common";
import { Component, inject, Renderer2, OnDestroy, Optional, SkipSelf } from "@angular/core";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from "../izmo-accessibility.component";

@Component({
  selector: "izmo-dictionary",
  standalone: true,
  template: `
    <button
      (click)="toggleDictionary()"
      [ngClass]="{ 'in-use': isDictionaryActive }"
    >
      <div class="title">
        <div class="icon-state-wrap">
          <div
            class="icon action-icon"
            [ngClass]="{
              inactive: !isDictionaryActive,
              active: isDictionaryActive
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
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
              <path
                fill="white"
                d="M6 17h12v2H6z"
              />
            </svg>
          </div>

          <div class="state-dots-wrap">
            <span>{{ isDictionaryActive ? i18n.getTranslation('dictionary-active') : i18n.getTranslation('dictionary') }}</span>
          </div>
        </div>
      </div>

      <izmo-widget-checkmark
        [isActive]="isDictionaryActive"
      ></izmo-widget-checkmark>
    </button>

    <!-- Dictionary popup -->
    <div 
      *ngIf="isDictionaryActive && selectedWord" 
      class="dictionary-popup"
      [style.top.px]="popupTop"
      [style.left.px]="popupLeft"
    >
      <div class="dictionary-content">
        <div class="dictionary-header">
          <strong>{{ selectedWord }}</strong>
          <button class="close-btn" (click)="closeDictionary()">×</button>
        </div>
        <div class="dictionary-definition">
          {{ definition || 'Loading definition...' }}
        </div>
      </div>
    </div>
  `,
  imports: [NgIf, NgClass, IzmoCheckmarkSvgComponent],
  styles: [`
    .dictionary-popup {
      position: fixed;
      z-index: 10000;
      background: white;
      border: 2px solid #333;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      max-width: 300px;
      min-width: 200px;
    }

    .dictionary-content {
      padding: 12px;
    }

    .dictionary-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 1rem;
      font-weight: bold;
      color: #333;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      color: #333;
      background: #f0f0f0;
      border-radius: 50%;
    }

    .dictionary-definition {
      font-size: 0.875rem;
      line-height: 1.4;
      color: #555;
    }
  `]
})
export class DictionaryComponent implements OnDestroy {
  document = inject(DOCUMENT);
  renderer = inject(Renderer2);
  i18n = inject(I18nService);

  constructor(
    @Optional() @SkipSelf() private parent?: IzmoAccessibilityComponent
  ) {
    if (this.parent) {
      this.parent.resetEvent.subscribe(() => this.reset());
    }
  }

  isDictionaryActive = false;
  selectedWord = '';
  definition = '';
  popupTop = 0;
  popupLeft = 0;

  private clickListener?: () => void;
  private selectionListener?: () => void;

  reset() {
    this.isDictionaryActive = false;
    this.closeDictionary();
  }

  toggleDictionary() {
    this.isDictionaryActive = !this.isDictionaryActive;
    
    if (this.isDictionaryActive) {
      this.startDictionary();
    } else {
      this.stopDictionary();
    }
  }

  private startDictionary() {
    // Listen for text selection
    this.selectionListener = this.renderer.listen('document', 'mouseup', (event) => {
      this.handleTextSelection(event);
    });

    // Also listen for double-click for word selection
    this.clickListener = this.renderer.listen('document', 'dblclick', (event) => {
      this.handleWordSelection(event);
    });
  }

  private stopDictionary() {
    if (this.selectionListener) {
      this.selectionListener();
      this.selectionListener = undefined;
    }

    if (this.clickListener) {
      this.clickListener();
      this.clickListener = undefined;
    }

    this.closeDictionary();
  }

  private handleTextSelection(event: MouseEvent) {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString().trim();
      if (selectedText.split(' ').length === 1) { // Only single words
        this.showDefinition(selectedText, event.clientX, event.clientY);
      }
    }
  }

  private handleWordSelection(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target && target.textContent) {
      // Get the word at the click position
      const range = document.caretRangeFromPoint(event.clientX, event.clientY);
      if (range) {
        const textNode = range.startContainer;
        if (textNode.nodeType === Node.TEXT_NODE) {
          const text = textNode.textContent || '';
          const offset = range.startOffset;
          
          // Find word boundaries
          let start = offset;
          let end = offset;
          
          while (start > 0 && /\w/.test(text[start - 1])) {
            start--;
          }
          while (end < text.length && /\w/.test(text[end])) {
            end++;
          }
          
          const word = text.substring(start, end).trim();
          if (word) {
            this.showDefinition(word, event.clientX, event.clientY);
          }
        }
      }
    }
  }

  private showDefinition(word: string, x: number, y: number) {
    this.selectedWord = word;
    this.definition = 'Loading definition...';
    this.popupTop = y + 10;
    this.popupLeft = x + 10;

    // Simulate getting definition (in real implementation, you'd call a dictionary API)
    setTimeout(() => {
      this.definition = this.getSimpleDefinition(word.toLowerCase());
    }, 500);
  }

  private getSimpleDefinition(word: string): string {
    // Simple dictionary with common words
    const definitions: { [key: string]: string } = {
      'accessibility': 'The design of products, devices, services, or environments for people with disabilities.',
      'contrast': 'The difference in luminance or color that makes an object distinguishable.',
      'screen': 'A flat panel or area on an electronic device on which images and data are displayed.',
      'reader': 'A device or software program that converts text to speech.',
      'text': 'Written or printed words, typically forming a connected passage.',
      'font': 'A particular style and size of type.',
      'size': 'The relative extent of something; a measurement.',
      'spacing': 'The arrangement of items with gaps between them.',
      'height': 'The measurement from base to top or head to foot.',
      'color': 'The property possessed by an object of producing different sensations on the eye.',
      'saturation': 'The intensity and purity of a color.',
      'invert': 'To reverse the colors or values of an image.',
      'mask': 'A covering that hides or protects part of something.',
      'cursor': 'A movable indicator on a computer screen identifying the point of operation.',
      'link': 'A connection between documents or sections of a document.',
      'button': 'A small disk or knob sewn onto a garment, or a control on a device.',
      'navigation': 'The process of planning and controlling movement from one place to another.',
      'keyboard': 'A panel of keys for operating a computer or typewriter.',
      'language': 'A method of human communication using words.',
      'image': 'A visual representation of something.',
      'animation': 'The technique of photographing successive drawings or positions.',
      'motion': 'The action or process of moving or being moved.'
    };

    return definitions[word] || `Definition for "${word}" not found. This is a simplified dictionary for demonstration purposes.`;
  }

  closeDictionary() {
    this.selectedWord = '';
    this.definition = '';
  }

  ngOnDestroy() {
    this.stopDictionary();
  }

  get isActive(): boolean {
    return this.isDictionaryActive;
  }

  /**
   * Programmatically activate/deactivate from profile selection
   */
  toggleFromProfile(desiredState: boolean) {
    if (this.isDictionaryActive !== desiredState) {
      this.toggleDictionary();
    }
  }
}
