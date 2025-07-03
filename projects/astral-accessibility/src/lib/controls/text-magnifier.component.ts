import { Component, OnInit, OnDestroy, inject, Optional, SkipSelf } from '@angular/core';
import { I18nService } from '../services/i18n.service';
import { NgIf, NgClass } from '@angular/common';
import { IzmoCheckmarkSvgComponent } from '../util/izmo-checksvg.component';
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

@Component({
  selector: 'izmo-text-magnifier',
  standalone: true,
  imports: [NgIf, NgClass, IzmoCheckmarkSvgComponent],
  template: `
    <button
      (click)="toggleMagnifier()"
      [ngClass]="{ 'in-use': isActive }"
      [attr.aria-label]="getAriaLabel()"
      [attr.aria-pressed]="isActive"
    >
      <div class="title">
        <div class="icon-state-wrap">
          <div class="icon action-icon" [ngClass]="{ inactive: !isActive, active: isActive }">
            <svg width="25" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
              <text x="8" y="18" font-size="12" fill="currentColor" font-family="Arial, Verdana, sans-serif">A+</text>
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
  styles: [`
    .magnifier-overlay {
      position: fixed;
      pointer-events: none;
      z-index: 9999999;
      background: rgba(255,255,255,0.95);
      border: 2px solid #4A90E2;
      border-radius: 8px;
      padding: 8px 16px;
      font-size: 2.2em;
      font-family: inherit;
      color: #222;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      transition: opacity 0.1s;
      opacity: 0.98;
      max-width: 400px;
      max-height: 120px;
      overflow: hidden;
      white-space: nowrap;
      /* Ensure it's not affected by widget protection */
      filter: none !important;
      transform: none !important;
      line-height: normal !important;
      word-spacing: normal !important;
      letter-spacing: normal !important;
    }
  `]
})
export class TextMagnifierComponent implements OnInit, OnDestroy {
  isActive = false;
  private i18n = inject(I18nService);
  private overlay: HTMLElement | null = null;
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
    return this.i18n.getTranslation('text-magnifier' as any) || 'Text Magnifier';
  }
  getAriaLabel(): string {
    return this.isActive
      ? this.i18n.getTranslation('text-magnifier-active' as any) || 'Text Magnifier enabled'
      : this.i18n.getTranslation('text-magnifier-disabled' as any) || 'Enable Text Magnifier';
  }

  toggleMagnifier() {
    this.isActive = !this.isActive;
    if (this.isActive) {
      document.addEventListener('mousemove', this.onMouseMove, true);
      document.addEventListener('mouseover', this.onMouseOver, true);
      document.addEventListener('mouseout', this.onMouseOut, true);
    } else {
      this.reset();
    }
  }

  private onMouseMove = (e: MouseEvent) => {
    if (!this.overlay) return;
    this.overlay.style.left = `${e.clientX + 20}px`;
    this.overlay.style.top = `${e.clientY - 20}px`;
  };

  private onMouseOver = (e: MouseEvent) => {
    if (!this.isActive) return;
    const target = e.target as HTMLElement;
    if (target && target.textContent && target.textContent.trim().length > 0 && target.nodeType === 1 && target !== this.overlay) {
      this.showOverlay(target.textContent!.trim());
    }
  };

  private onMouseOut = (e: MouseEvent) => {
    this.hideOverlay();
  };

  private showOverlay(text: string) {
    if (!this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.className = 'magnifier-overlay';
      document.body.appendChild(this.overlay);
    }
    this.overlay.textContent = text;
    this.overlay.style.display = 'block';
  }

  private hideOverlay() {
    if (this.overlay) {
      this.overlay.style.display = 'none';
    }
  }

  reset() {
    this.isActive = false;
    document.removeEventListener('mousemove', this.onMouseMove, true);
    document.removeEventListener('mouseover', this.onMouseOver, true);
    document.removeEventListener('mouseout', this.onMouseOut, true);
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
  }
} 