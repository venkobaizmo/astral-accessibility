import { Component, OnInit, OnDestroy, inject, Optional, SkipSelf } from '@angular/core';
import { I18nService } from '../services/i18n.service';
import { NgIf, NgClass } from '@angular/common';
import { IzmoCheckmarkSvgComponent } from '../util/izmo-checksvg.component';
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

@Component({
  selector: 'izmo-luminosity',
  standalone: true,
  imports: [NgIf, NgClass, IzmoCheckmarkSvgComponent],
  template: `
    <button
      (click)="nextState()"
      [ngClass]="{ 'in-use': !isBaseState() }"
      [attr.aria-label]="getAriaLabel()"
      [attr.aria-pressed]="!isBaseState()"
    >
      <div class="title">
        <div class="icon-state-wrap">
          <div class="icon action-icon" [ngClass]="{ inactive: isBaseState(), active: !isBaseState() }">
            <svg width="25" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M12 7v2M12 15v2M7 12H5M19 12h-2M8.5 8.5l-1.5-1.5M17 17l-1.5-1.5M8.5 15.5l-1.5 1.5M17 7l-1.5 1.5" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="state-dots-wrap">
            <span>{{ getDisplayText() }}</span>
            <div class="dots" [ngClass]="{ inactive: isBaseState() }">
              <div class="dot" [ngClass]="{ active: isIncreased() }"></div>
              <div class="dot" [ngClass]="{ active: isDecreased() }"></div>
            </div>
          </div>
        </div>
      </div>

      <izmo-widget-checkmark
        [isActive]="!isBaseState()"
      ></izmo-widget-checkmark>
    </button>
  `,
  styles: []
})
export class LuminosityComponent implements OnInit, OnDestroy {
  private i18n = inject(I18nService);
  state: 0 | 1 | 2 = 0; // 0: normal, 1: increased, 2: decreased
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
    switch (this.state) {
      case 1:
        return this.i18n.getTranslation('luminosity-increased' as any) || 'Increased Brightness';
      case 2:
        return this.i18n.getTranslation('luminosity-decreased' as any) || 'Decreased Brightness';
      default:
        return this.i18n.getTranslation('luminosity' as any) || 'Luminosity';
    }
  }
  getAriaLabel(): string {
    switch (this.state) {
      case 1:
        return this.i18n.getTranslation('luminosity-increased-active' as any) || 'Increased Brightness enabled';
      case 2:
        return this.i18n.getTranslation('luminosity-decreased-active' as any) || 'Decreased Brightness enabled';
      default:
        return this.i18n.getTranslation('luminosity-disabled' as any) || 'Enable Luminosity';
    }
  }

  isBaseState() { return this.state === 0; }
  isIncreased() { return this.state === 1; }
  isDecreased() { return this.state === 2; }

  nextState() {
    this.state = ((this.state + 1) % 3) as 0 | 1 | 2;
    this.applyLuminosity();
  }

  applyLuminosity() {
    // Remove existing style
    const existingStyle = document.getElementById('izmo-luminosity-style');
    if (existingStyle) existingStyle.remove();

    if (this.state === 0) return; // Normal state

    const style = document.createElement('style');
    style.id = 'izmo-luminosity-style';
    
    if (this.state === 1) {
      style.textContent = `
        body > :not(izmo-accessibility) {
          filter: brightness(1.3) !important;
        }
      `;
    } else if (this.state === 2) {
      style.textContent = `
        body > :not(izmo-accessibility) {
          filter: brightness(0.7) !important;
        }
      `;
    }
    
    document.head.appendChild(style);
  }

  reset() {
    this.state = 0;
    const style = document.getElementById('izmo-luminosity-style');
    if (style) style.remove();
  }
} 