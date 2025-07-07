import { Component, OnInit, OnDestroy, inject, Optional, SkipSelf } from '@angular/core';
import { I18nService } from '../services/i18n.service';
import { NgIf, NgClass } from '@angular/common';
import { IzmoCheckmarkSvgComponent } from '../util/izmo-checksvg.component';
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

@Component({
  selector: 'izmo-grayscale',
  standalone: true,
  imports: [NgIf, NgClass, IzmoCheckmarkSvgComponent],
  template: `
    <button
      (click)="toggleGrayscale()"
      [ngClass]="{ 'in-use': isActive }"
      [attr.aria-label]="getAriaLabel()"
      [attr.aria-pressed]="isActive"
    >
      <div class="title">
        <div class="icon-state-wrap">
          <div class="icon action-icon" [ngClass]="{ inactive: !isActive, active: isActive }">
            <svg width="25" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
              <circle cx="8" cy="8" r="2" fill="currentColor"/>
              <circle cx="16" cy="8" r="2" fill="currentColor"/>
              <circle cx="8" cy="16" r="2" fill="currentColor"/>
              <circle cx="16" cy="16" r="2" fill="currentColor"/>
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
export class GrayscaleComponent implements OnInit, OnDestroy {
  // Remove isActive property, use currentState for state
  currentState = 0;
  private i18n = inject(I18nService);
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
    return this.i18n.getTranslation('grayscale' as any) || 'Grayscale';
  }
  getAriaLabel(): string {
    return this.isActive
      ? this.i18n.getTranslation('grayscale-active' as any) || 'Grayscale enabled'
      : this.i18n.getTranslation('grayscale-disabled' as any) || 'Enable Grayscale';
  }

  toggleGrayscale() {
    this.currentState = this.currentState === 0 ? 1 : 0;
    this._runStateLogic();
  }

  private _runStateLogic() {
    if (this.currentState !== 0) {
      let style = document.getElementById('izmo-grayscale-style') as HTMLStyleElement;
      if (!style) {
        style = document.createElement('style');
        style.id = 'izmo-grayscale-style';
        document.head.appendChild(style);
      }
      style.textContent = `
        body > :not(izmo-accessibility) {
          filter: grayscale(100%) !important;
        }
      `;
    } else {
      const style = document.getElementById('izmo-grayscale-style');
      if (style) style.remove();
    }
  }

  reset() {
    this.currentState = 0;
    const style = document.getElementById('izmo-grayscale-style');
    if (style) style.remove();
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
} 