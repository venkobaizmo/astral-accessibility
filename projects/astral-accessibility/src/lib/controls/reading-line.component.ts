import { Component, OnInit, OnDestroy, inject, Optional, SkipSelf } from '@angular/core';
import { I18nService } from '../services/i18n.service';
import { NgIf, NgClass } from '@angular/common';
import { IzmoCheckmarkSvgComponent } from '../util/izmo-checksvg.component';
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

@Component({
  selector: 'izmo-reading-line',
  standalone: true,
  imports: [NgIf, NgClass, IzmoCheckmarkSvgComponent],
  template: `
    <button
      (click)="toggleReadingLine()"
      [ngClass]="{ 'in-use': isActive }"
      [attr.aria-label]="getAriaLabel()"
      [attr.aria-pressed]="isActive"
    >
      <div class="title">
        <div class="icon-state-wrap">
          <div class="icon action-icon" [ngClass]="{ inactive: !isActive, active: isActive }">
            <svg width="25" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="3"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
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
    .reading-line {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, #4A90E2 50%, transparent 100%);
      pointer-events: none;
      z-index: 9999998;
      opacity: 0.8;
      transition: top 0.1s ease;
      /* Ensure it's not affected by widget protection */
      filter: none !important;
      transform: none !important;
      font-family: inherit !important;
      line-height: normal !important;
      word-spacing: normal !important;
      letter-spacing: normal !important;
    }
  `]
})
export class ReadingLineComponent implements OnInit, OnDestroy {
  isActive = false;
  private i18n = inject(I18nService);
  private readingLine: HTMLElement | null = null;
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
    return this.i18n.getTranslation('reading-line' as any) || 'Reading Line';
  }
  getAriaLabel(): string {
    return this.isActive
      ? this.i18n.getTranslation('reading-line-active' as any) || 'Reading Line enabled'
      : this.i18n.getTranslation('reading-line-disabled' as any) || 'Enable Reading Line';
  }

  toggleReadingLine() {
    this.isActive = !this.isActive;
    if (this.isActive) {
      this.createReadingLine();
      document.addEventListener('mousemove', this.onMouseMove);
    } else {
      this.removeReadingLine();
    }
  }

  private createReadingLine() {
    this.readingLine = document.createElement('div');
    this.readingLine.className = 'reading-line';
    document.body.appendChild(this.readingLine);
  }

  private onMouseMove = (e: MouseEvent) => {
    if (this.readingLine) {
      this.readingLine.style.top = `${e.clientY}px`;
      this.readingLine.style.left = '0px';
      this.readingLine.style.width = '100%';
      this.readingLine.style.display = 'block';
    }
  };

  private removeReadingLine() {
    if (this.readingLine) {
      this.readingLine.remove();
      this.readingLine = null;
    }
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  reset() {
    this.isActive = false;
    this.removeReadingLine();
  }
}