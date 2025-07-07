import { Component, OnInit, OnDestroy, inject, Optional, SkipSelf } from '@angular/core';
import { I18nService } from '../services/i18n.service';
import { NgIf, NgClass } from '@angular/common';
import { IzmoCheckmarkSvgComponent } from '../util/izmo-checksvg.component';
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

@Component({
  selector: 'izmo-highlight-all',
  standalone: true,
  imports: [NgIf, NgClass, IzmoCheckmarkSvgComponent],
  template: `
    <button
      (click)="toggleHighlightAll()"
      [ngClass]="{ 'in-use': isActive }"
      [attr.aria-label]="getAriaLabel()"
      [attr.aria-pressed]="isActive"
    >
      <div class="title">
        <div class="icon-state-wrap">
          <div class="icon action-icon" [ngClass]="{ inactive: !isActive, active: isActive }">
            <svg width="25" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" rx="2"/>
              <text x="6" y="15" font-size="10" fill="currentColor" font-weight="bold">ALL</text>
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
export class HighlightAllComponent implements OnInit, OnDestroy {
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
    return this.i18n.getTranslation('highlight-all' as any) || 'Highlight All';
  }
  get isActive() {
    return this._isActive;
  }
  getAriaLabel(): string {
    return this.isActive
      ? this.i18n.getTranslation('highlight-all-active' as any) || 'Highlight All enabled'
      : this.i18n.getTranslation('highlight-all-disabled' as any) || 'Enable Highlight All';
  }

  toggleHighlightAll() {
    this._isActive = !this._isActive;
    if (this._isActive) {
      this.createHighlightStyle();
    } else {
      this.removeHighlightStyle();
    }
  }
  toggleFromProfile(desiredState: boolean) {
    if (this.isActive !== desiredState) {
      this.toggleHighlightAll();
    }
  }

  private createHighlightStyle() {
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'izmo-highlight-all-style';
    this.styleElement.textContent = `
      body > :not(izmo-accessibility) p,
      body > :not(izmo-accessibility) span,
      body > :not(izmo-accessibility) div,
      body > :not(izmo-accessibility) li,
      body > :not(izmo-accessibility) td,
      body > :not(izmo-accessibility) th,
      body > :not(izmo-accessibility) h1,
      body > :not(izmo-accessibility) h2,
      body > :not(izmo-accessibility) h3,
      body > :not(izmo-accessibility) h4,
      body > :not(izmo-accessibility) h5,
      body > :not(izmo-accessibility) h6 {
        background-color: #fff3cd !important;
        color: #000 !important;
        padding: 2px 4px !important;
        border-radius: 2px !important;
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