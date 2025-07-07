import { DOCUMENT, NgIf, NgClass } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

@Component({
  selector: "izmo-text-size",
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
              <rect x="4" y="8" width="33" height="25" fill="none" stroke="currentColor" stroke-width="2"/>
              <text x="8" y="12" font-family="Arial" font-size="8" fill="currentColor">A</text>
              <text x="12" y="20" font-family="Arial" font-size="10" fill="currentColor">A</text>
              <text x="16" y="28" font-family="Arial" font-size="12" fill="currentColor">A</text>
              <text x="20" y="36" font-family="Arial" font-size="14" fill="currentColor">A</text>
              <path d="M6 6 L35 6" stroke="currentColor" stroke-width="1"/>
              <path d="M6 38 L35 38" stroke="currentColor" stroke-width="1"/>
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
  `,
  imports: [NgIf, NgClass, IzmoCheckmarkSvgComponent],
})
export class TextSizeComponent implements OnInit {
  document = inject(DOCUMENT);
  i18n = inject(I18nService);
  parent = inject(IzmoAccessibilityComponent);

  currentState = 0;
  currentScale = 1;
  
  // Make these reactive to language changes
  get base() {
    return this.i18n.getTranslation('bigger-text');
  }
  
  get states() {
    return [
      this.base, 
      this.i18n.getTranslation('medium-text'), 
      this.i18n.getTranslation('large-text'), 
      this.i18n.getTranslation('extra-large-text')
    ];
  }
  get isActive() {
    return this.currentState !== 0;
  }
  toggleFromProfile(desiredState: boolean) {
    if (desiredState && this.currentState === 0) {
      this.currentState = 1;
      this._runStateLogic();
    } else if (!desiredState && this.currentState !== 0) {
      this.currentState = 0;
      this._runStateLogic();
    }
  }
  private readonly initialStyles = new WeakMap();

  _style: HTMLStyleElement;

  private readonly observer: MutationObserver;

  // Select the node that will be observed for mutations
  targetNode = document.body;

  // Options for the observer (which mutations to observe)
  config = { attributes: true, childList: true, subtree: true };

  constructor() {
    this.observer = new MutationObserver((mutations: MutationRecord[]) => {
      this.observer.disconnect();
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            this.updateTextSize(node, this.currentScale);
          }
        });
      });
      this.observer.observe(this.targetNode, this.config);
    });
    /* No observer here, we don't want it to be on by default */
  }

  ngOnInit() {
    this.parent.resetEvent.subscribe(() => {
      this.currentState = 0;
      this.currentScale = 1;
      this._runStateLogic();
    });
  }

  updateTextSize(node: HTMLElement, scale: number, previousScale: number = 1) {
    // Skip the widget element and its children
    if (node.tagName === 'IZMO-ACCESSIBILITY' || node.closest('izmo-accessibility')) {
      return;
    }

    // keep initial styling
    if (!this.initialStyles.has(node)) {
      // store initial styling of fontSize, lineHeight, and wordSpacing
      this.initialStyles.set(node, {
        "font-size": node.style.fontSize,
        "line-height": node.style.lineHeight,
        "word-spacing": node.style.wordSpacing,
      });
    }
    
    const children = node.children;
    const excludeNodes = ["SCRIPT"];
    // traverse and update children first
    if (children.length > 0) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (!excludeNodes.includes(child.nodeName))
          this.updateTextSize(child as HTMLElement, scale, previousScale);
      }
    }

    if (
      Array.from(node.childNodes).some(
        (child) =>
          child.nodeType === child.TEXT_NODE &&
          child.nodeValue?.replace(/\s*/i, "")?.length,
      ) ||
      children.length === 0
    ) {
      const currentFontSize = window.getComputedStyle(node).fontSize;
      const currentFontSizeNum = parseFloat(currentFontSize);

      node.style.fontSize = `${(currentFontSizeNum / previousScale) * scale}px`;
      node.style.lineHeight = `initial`;
      node.style.wordSpacing = `initial`;
    }
  }

  restoreTextSize(node: HTMLElement) {
    // Skip the widget element and its children
    if (node.tagName === 'IZMO-ACCESSIBILITY' || node.closest('izmo-accessibility')) {
      return;
    }

    const children = node.children;
    if (this.initialStyles.has(node)) {
      const styles = this.initialStyles.get(node) as Record<string, string>;
      for (const [key, value] of Object.entries(styles)) {
        (node.style as any)[key] = value;
      }
    }
    
    for (const child of Array.from(children)) {
      this.restoreTextSize(child as HTMLElement);
    }
  }

  nextState() {
    this.observer.disconnect();
    this.currentState += 1;
    this.currentState = this.currentState % 4;

    this._runStateLogic();
    if (this.currentState !== 0) {
      // is not base state, don't need observer for base state
      this.observer.observe(this.targetNode, this.config);
    }
  }

  private _runStateLogic() {
    let previousScale = this.currentScale;    if (this.states[this.currentState] === this.i18n.getTranslation('medium-text')) {
      this.currentScale = 1.2;
    }

    if (this.states[this.currentState] === this.i18n.getTranslation('large-text')) {
      this.currentScale = 1.5;
    }

    if (this.states[this.currentState] === this.i18n.getTranslation('extra-large-text')) {
      this.currentScale = 1.8;
    }

    if (this.states[this.currentState] !== this.base) {
      this.updateTextSize(document.body, this.currentScale, previousScale);
    } else {
      // is base state
      this.restoreTextSize(document.body);
      this.currentScale = 1;
    }
  }
}
