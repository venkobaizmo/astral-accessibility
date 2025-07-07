import { Component, OnInit, OnDestroy, inject, Optional, SkipSelf } from '@angular/core';
import { I18nService } from '../services/i18n.service';
import { NgIf, NgClass } from '@angular/common';
import { IzmoCheckmarkSvgComponent } from '../util/izmo-checksvg.component';
import { IzmoAccessibilityComponent } from '../izmo-accessibility.component';

@Component({
  selector: 'izmo-mute-sounds',
  standalone: true,
  imports: [NgIf, NgClass, IzmoCheckmarkSvgComponent],
  template: `
    <button
      (click)="toggleMuteSounds()"
      [ngClass]="{ 'in-use': isActive }"
      [attr.aria-label]="getAriaLabel()"
      [attr.aria-pressed]="isActive"
    >
      <div class="title">
        <div class="icon-state-wrap">
          <div class="icon action-icon" [ngClass]="{ inactive: !isActive, active: isActive }">
            <svg width="25" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L6 9H2v6h4l6 6V3z" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M16 5l4 4M20 5l-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
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
export class MuteSoundsComponent implements OnInit, OnDestroy {
  private _isActive = false;
  private i18n = inject(I18nService);
  private styleElement: HTMLStyleElement | null = null;
  private originalVolumes: Map<HTMLMediaElement, number> = new Map();
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
    return this.i18n.getTranslation('mute-sounds' as any) || 'Mute Sounds';
  }
  get isActive() {
    return this._isActive;
  }
  getAriaLabel(): string {
    return this.isActive
      ? this.i18n.getTranslation('mute-sounds-active' as any) || 'Mute Sounds enabled'
      : this.i18n.getTranslation('mute-sounds-disabled' as any) || 'Enable Mute Sounds';
  }

  toggleMuteSounds() {
    this._isActive = !this._isActive;
    if (this._isActive) {
      this.muteAllSounds();
    } else {
      this.unmuteAllSounds();
    }
  }
  toggleFromProfile(desiredState: boolean) {
    if (this.isActive !== desiredState) {
      this.toggleMuteSounds();
    }
  }

  private muteAllSounds() {
    // Create style to prevent autoplay
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'izmo-mute-sounds-style';
    this.styleElement.textContent = `
      body > :not(izmo-accessibility) audio,
      body > :not(izmo-accessibility) video {
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(this.styleElement);

    // Mute all existing media elements
    const mediaElements = document.querySelectorAll('audio, video');
    mediaElements.forEach((media: Element) => {
      const mediaEl = media as HTMLMediaElement;
      if (mediaEl !== document.querySelector('izmo-accessibility')?.querySelector('audio, video')) {
        this.originalVolumes.set(mediaEl, mediaEl.volume);
        mediaEl.volume = 0;
        mediaEl.muted = true;
        mediaEl.pause();
      }
    });

    // Observe for new media elements
    this.observeNewMedia();
  }

  private unmuteAllSounds() {
    // Remove style
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }

    // Restore original volumes
    this.originalVolumes.forEach((volume, mediaEl) => {
      if (mediaEl !== document.querySelector('izmo-accessibility')?.querySelector('audio, video')) {
        mediaEl.volume = volume;
        mediaEl.muted = false;
      }
    });
    this.originalVolumes.clear();

    // Stop observing
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private observer: MutationObserver | null = null;

  private observeNewMedia() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const mediaElements = element.querySelectorAll ? element.querySelectorAll('audio, video') : [];
            mediaElements.forEach((media: Element) => {
              const mediaEl = media as HTMLMediaElement;
              if (mediaEl !== document.querySelector('izmo-accessibility')?.querySelector('audio, video')) {
                this.originalVolumes.set(mediaEl, mediaEl.volume);
                mediaEl.volume = 0;
                mediaEl.muted = true;
                mediaEl.pause();
              }
            });
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  reset() {
    this._isActive = false;
    this.unmuteAllSounds();
  }
} 