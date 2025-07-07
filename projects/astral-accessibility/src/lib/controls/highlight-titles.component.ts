import { Component, OnInit, OnDestroy, inject, Optional, SkipSelf } from '@angular/core';
import { I18nService } from '../services/i18n.service';
import { NgIf, NgClass } from '@angular/common';
import { IzmoCheckmarkSvgComponent } from '../util/izmo-checksvg.component';
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

@Component({
  selector: 'izmo-highlight-titles',
  standalone: true,
  imports: [NgIf, NgClass, IzmoCheckmarkSvgComponent],
  template: `
    <button
      (click)="toggleHighlightTitles()"
      [ngClass]="{ 'in-use': isActive }"
      [attr.aria-label]="getAriaLabel()"
      [attr.aria-pressed]="isActive"
    >
      <div class="title">
        <div class="icon-state-wrap">
          <div class="icon action-icon" [ngClass]="{ inactive: !isActive, active: isActive }">
            <svg width="25" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <text x="4" y="8" font-size="8" fill="currentColor" font-weight="bold">H1</text>
              <text x="4" y="16" font-size="6" fill="currentColor" font-weight="bold">H2</text>
              <text x="4" y="22" font-size="5" fill="currentColor" font-weight="bold">H3</text>
              <rect x="2" y="2" width="20" height="20" stroke="currentColor" stroke-width="1" fill="none" rx="2"/>
            </svg>
          </div>
          <div class="state-dots-wrap">
            <span>{{ getDisplayText() }}</span>
            <div class="dots" [ngClass]="{ inactive: !isActive }">
              <div class="dot" [ngClass]="{ active: isActive }"></div>
            </div>
          </div>
        </div>
      </div>

      <izmo-widget-checkmark
        [isActive]="isActive"
      ></izmo-widget-checkmark>
    </button>
  `,
  styles: []
})
export class HighlightTitlesComponent implements OnInit, OnDestroy {
  private _isActive = false;
  private i18n = inject(I18nService);
  private styleElement: HTMLStyleElement | null = null;
  private resetSub?: any;
  constructor(@Optional() @SkipSelf() private parent: IzmoAccessibilityComponent) {}

  ngOnInit() {
    if (this.parent && this.parent.resetEvent) {
      this.resetSub = this.parent.resetEvent.subscribe(() => this.reset());
    }
  }
  ngOnDestroy() { 
    this.reset(); 
    if (this.resetSub) this.resetSub.unsubscribe();
  }

  getDisplayText(): string {
    return this.i18n.getTranslation('highlight-titles' as any) || 'Highlight Titles';
  }
  get isActive() {
    return this._isActive;
  }
  getAriaLabel(): string {
    return this.isActive
      ? this.i18n.getTranslation('highlight-titles-active' as any) || 'Highlight Titles enabled'
      : this.i18n.getTranslation('highlight-titles-disabled' as any) || 'Enable Highlight Titles';
  }

  toggleHighlightTitles() {
    this._isActive = !this._isActive;
    if (this._isActive) {
      this.createHighlightStyle();
    } else {
      this.removeHighlightStyle();
    }
  }
  toggleFromProfile(desiredState: boolean) {
    if (this.isActive !== desiredState) {
      this.toggleHighlightTitles();
    }
  }

  private createHighlightStyle() {
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'izmo-highlight-titles-style';
    this.styleElement.textContent = `
      body > :not(izmo-accessibility) h1,
      body > :not(izmo-accessibility) h2,
      body > :not(izmo-accessibility) h3,
      body > :not(izmo-accessibility) h4,
      body > :not(izmo-accessibility) h5,
      body > :not(izmo-accessibility) h6 {
        background-color: #ffeb3b !important;
        color: #000 !important;
        padding: 4px 8px !important;
        border-radius: 4px !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
      }
    `;
    document.head.appendChild(this.styleElement);
  }

  private removeHighlightStyle() {
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
  }

  reset() {
    this._isActive = false;
    this.removeHighlightStyle();
  }
} 