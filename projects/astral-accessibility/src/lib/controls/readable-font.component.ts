import { Component, inject, OnDestroy, OnInit, Optional, SkipSelf } from '@angular/core';
import { I18nService } from '../services/i18n.service';
import { NgIf, NgClass } from '@angular/common';
import { IzmoCheckmarkSvgComponent } from '../util/izmo-checksvg.component';
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

@Component({
  selector: 'izmo-readable-font',
  standalone: true,
  imports: [NgIf, NgClass, IzmoCheckmarkSvgComponent],
  template: `
    <button
      (click)="toggleReadableFont()"
      [ngClass]="{ 'in-use': isActive }"
      [attr.aria-label]="getAriaLabel()"
      [attr.aria-pressed]="isActive"
    >
      <div class="title">
        <div class="icon-state-wrap">
          <div class="icon action-icon" [ngClass]="{ inactive: !isActive, active: isActive }">
            <svg width="25" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <text x="6" y="20" font-size="18" fill="currentColor" font-family="Arial, Verdana, Tahoma, Trebuchet MS, Segoe UI, sans-serif">A</text>
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
    :host ::ng-deep button.in-use {
      font-family: 'Arial', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Segoe UI', sans-serif !important;
    }
  `]
})
export class ReadableFontComponent implements OnInit, OnDestroy {
  isActive = false;
  private i18n = inject(I18nService);
  private langChangeUnsub?: () => void;
  private resetSub?: any;
  constructor(@Optional() @SkipSelf() private parent: IzmoAccessibilityComponent) {}

  ngOnInit() {
    // Listen for language changes if the service supports it
    if ((this.i18n as any).onLangChange) {
      this.langChangeUnsub = (this.i18n as any).onLangChange(() => {
        // Trigger change detection if needed
      });
    }
    if (this.parent && this.parent.resetEvent) {
      this.resetSub = this.parent.resetEvent.subscribe(() => this.reset());
    }
  }

  ngOnDestroy() {
    this.reset();
    if (this.langChangeUnsub) this.langChangeUnsub();
    if (this.resetSub) this.resetSub.unsubscribe();
  }

  getDisplayText(): string {
    return this.i18n.getTranslation('readable-font' as any) || 'Readable Font';
  }

  getAriaLabel(): string {
    return this.isActive
      ? this.i18n.getTranslation('readable-font-active' as any) || 'Readable Font enabled'
      : this.i18n.getTranslation('readable-font-disabled' as any) || 'Enable Readable Font';
  }

  toggleReadableFont() {
    this.isActive = !this.isActive;
    if (this.isActive) {
      // Apply readable font to body but exclude widget
      const style = document.createElement('style');
      style.textContent = `
        body > :not(izmo-accessibility) * {
          font-family: Arial, Verdana, Tahoma, Trebuchet MS, Segoe UI, sans-serif !important;
        }
      `;
      style.id = 'izmo-readable-font-style';
      document.head.appendChild(style);
    } else {
      const style = document.getElementById('izmo-readable-font-style');
      if (style) style.remove();
    }
  }

  toggleFromProfile(desiredState: boolean) {
    if (this.isActive !== desiredState) {
      this.toggleReadableFont();
    }
  }

  reset() {
    this.isActive = false;
    const style = document.getElementById('izmo-readable-font-style');
    if (style) style.remove();
  }
}