import { NgIf, NgClass, NgFor } from "@angular/common";
import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { I18nService } from "../services/i18n.service";

export interface AccessibilityProfile {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  category: 'visual' | 'reading' | 'navigation' | 'comprehensive';
}

@Component({
  selector: "izmo-accessibility-profiles",
  standalone: true,
  template: `
    <div class="izmo-profiles-accordion">
      <button class="izmo-profiles-header" (click)="toggleAccordion()" [attr.aria-expanded]="expanded" aria-controls="profiles-content">
        <h3 class="izmo-profiles-title">{{ i18n.getTranslation('accessibility-profiles-title') }}</h3>
        <span class="izmo-profiles-arrow" [ngClass]="{ 'expanded': expanded }" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20"><polyline points="6 8 10 12 14 8" fill="none" stroke="currentColor" stroke-width="2"/></svg>
        </span>
      </button>
      <div id="profiles-content" class="izmo-profiles-content" *ngIf="expanded">
        <p class="izmo-profiles-subtitle">{{ i18n.getTranslation('accessibility-profiles-subtitle') }}</p>
        <div class="izmo-profiles-grid">
          <div 
            *ngFor="let profile of profiles" 
            class="izmo-profile-card"
            [ngClass]="{ 'active': selectedProfile?.id === profile.id }"
            (click)="selectProfile(profile)"
            [attr.aria-label]="i18n.getTranslation('select-profile') + ': ' + profile.name"
            role="button"
            tabindex="0"
            (keydown.enter)="selectProfile(profile)"
            (keydown.space)="selectProfile(profile)"
          >
            <div class="izmo-profile-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path [attr.d]="profile.icon" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </div>
            <div class="izmo-profile-content">
              <h4 class="izmo-profile-name">{{ profile.name }}</h4>
              <p class="izmo-profile-description">{{ profile.description }}</p>
              <div class="izmo-profile-features">
                <span 
                  *ngFor="let feature of profile.features.slice(0, 3)" 
                  class="izmo-profile-feature-tag"
                >
                  {{ getFeatureTranslation(feature) }}
                </span>
                <span 
                  *ngIf="profile.features.length > 3" 
                  class="izmo-profile-feature-more"
                >
                  +{{ profile.features.length - 3 }} {{ i18n.getTranslation('more-features') }}
                </span>
              </div>
            </div>
            <div class="izmo-profile-checkmark" *ngIf="selectedProfile?.id === profile.id">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [NgIf, NgClass, NgFor],
  styles: [`
    .izmo-section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--izmo-section-title-color, var(--izmo-text-color, #001E50));
      margin: 0 0 12px 0;
      padding: 0;
      line-height: 1.2;
    }
    .izmo-profiles-accordion {
      background: var(--izmo-profiles-background-color, #fff);
      border-bottom: 1px solid var(--izmo-profiles-border-color, #E8E8E8);
      transition: max-height 0.2s;
    }
    .izmo-profiles-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      background: none;
      border: none;
      padding: 0 0 8px 0;
      cursor: pointer;
      outline: none;
    }
    .izmo-section-title, .izmo-profiles-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--izmo-section-title-color, var(--izmo-text-color, #001E50));
      margin: 0;
      padding: 0;
      line-height: 1.2;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    .izmo-profiles-arrow {
      display: flex;
      align-items: center;
      transition: transform 0.2s;
    }
    .izmo-profiles-arrow svg {
      display: block;
    }
    .izmo-profiles-arrow.expanded {
      transform: rotate(180deg);
    }
    .izmo-profiles-content {
      background: var(--izmo-profiles-background-color, #fff);
      padding-bottom: 8px;
      margin-bottom: 8px;
      transition: max-height 0.2s;
    }
    .izmo-profiles-section {
      padding: 20px;
      background: var(--izmo-profiles-background-color, var(--izmo-modal-background-color, #FFFFFF));
      border-bottom: 1px solid var(--izmo-profiles-border-color, var(--izmo-border-color, #E8E8E8));
    }
    
    .izmo-profiles-header {
      margin-bottom: 20px;
      text-align: center;
    }
    
    .izmo-profiles-title {
      margin: 0 0 8px 0;
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--izmo-profiles-title-color, var(--izmo-text-color, #001E50));
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    
    .izmo-profiles-subtitle {
      margin: 0;
      font-size: 0.875rem;
      color: var(--izmo-profiles-subtitle-color, var(--izmo-text-color, #001E50));
      opacity: 0.8;
    }
    
    .izmo-profiles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }
    
    .izmo-profile-card {
      display: flex;
      align-items: flex-start;
      padding: 16px;
      background: var(--izmo-profile-card-background-color, var(--izmo-action-background-color, #FFFFFF));
      border: 2px solid var(--izmo-profile-card-border-color, var(--izmo-action-border-color, transparent));
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }
    
    .izmo-profile-card:hover {
      border-color: var(--izmo-profile-card-hover-border-color, var(--izmo-action-selected-border-color, #FFD100));
      background: var(--izmo-profile-card-hover-background-color, var(--izmo-action-hover-background-color, #F8F9FA));
    }
    
    .izmo-profile-card.active {
      border-color: var(--izmo-profile-card-active-border-color, var(--izmo-action-selected-border-color, #FFD100));
      background: var(--izmo-profile-card-active-background-color, var(--izmo-action-active-background-color, #FFD100));
    }
    
    .izmo-profile-icon {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--izmo-profile-icon-background-color, var(--izmo-action-icon-inactive-background-color, #E8E8E8));
      border-radius: 6px;
      margin-right: 12px;
      color: var(--izmo-action-text-color, #001E50);
    }
    
    .izmo-profile-card.active .izmo-profile-icon {
      background: var(--izmo-profile-icon-active-background-color, var(--izmo-action-icon-active-background-color, #FFD100));
      color: var(--izmo-action-active-text-color, #000000);
    }
    
    .izmo-profile-content {
      flex: 1;
      min-width: 0;
    }
    
    .izmo-profile-name {
      margin: 0 0 4px 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--izmo-profile-name-color, var(--izmo-action-text-color, #001E50));
    }
    
    .izmo-profile-card.active .izmo-profile-name {
      color: var(--izmo-profile-name-active-color, var(--izmo-action-active-text-color, #000000));
    }
    
    .izmo-profile-description {
      margin: 0 0 8px 0;
      font-size: 0.8125rem;
      line-height: 1.4;
      color: var(--izmo-profile-description-color, var(--izmo-action-text-color, #001E50));
      opacity: 0.8;
    }
    
    .izmo-profile-card.active .izmo-profile-description {
      color: var(--izmo-profile-description-active-color, var(--izmo-action-active-text-color, #000000));
    }
    
    .izmo-profile-features {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    
    .izmo-profile-feature-tag {
      padding: 2px 6px;
      background: var(--izmo-profile-feature-tag-background-color, var(--izmo-action-icon-inactive-background-color, #E8E8E8));
      border-radius: 4px;
      font-size: 0.6875rem;
      color: var(--izmo-profile-feature-tag-color, var(--izmo-action-text-color, #001E50));
    }
    
    .izmo-profile-card.active .izmo-profile-feature-tag {
      background: var(--izmo-profile-feature-tag-active-background-color, var(--izmo-action-icon-active-background-color, #FFD100));
      color: var(--izmo-profile-feature-tag-active-color, var(--izmo-action-active-text-color, #000000));
    }
    
    .izmo-profile-feature-more {
      padding: 2px 6px;
      background: var(--izmo-action-icon-disabled-background-color, #B0B0B0);
      border-radius: 4px;
      font-size: 0.6875rem;
      color: var(--izmo-action-disabled-text-color, #B0B0B0);
    }
    
    .izmo-profile-checkmark {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 20px;
      height: 20px;
      background: var(--izmo-profile-checkmark-background-color, var(--izmo-action-selected-border-color, #FFD100));
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--izmo-profile-checkmark-color, var(--izmo-action-active-text-color, #000000));
    }
    
    .izmo-profiles-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    
    .izmo-profile-apply-btn,
    .izmo-profile-reset-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .izmo-profile-apply-btn {
      background: var(--izmo-profile-apply-btn-background-color, var(--izmo-action-selected-border-color, #FFD100));
      color: var(--izmo-profile-apply-btn-color, var(--izmo-action-active-text-color, #000000));
    }
    
    .izmo-profile-apply-btn:hover {
      background: var(--izmo-action-active-background-color, #FFD100);
      transform: translateY(-1px);
    }
    
    .izmo-profile-reset-btn {
      background: var(--izmo-profile-reset-btn-background-color, var(--izmo-action-background-color, #FFFFFF));
      color: var(--izmo-profile-reset-btn-color, var(--izmo-action-text-color, #001E50));
      border: 1px solid var(--izmo-profile-reset-btn-border-color, var(--izmo-border-color, #E8E8E8));
    }
    
    .izmo-profile-reset-btn:hover {
      background: var(--izmo-action-hover-background-color, #F8F9FA);
    }
    
    @media (max-width: 768px) {
      .izmo-profiles-grid {
        grid-template-columns: 1fr;
      }
      
      .izmo-profiles-actions {
        flex-direction: column;
      }
    }
  `]
})
export class AccessibilityProfilesComponent implements OnInit {
  @Output() profileSelected = new EventEmitter<AccessibilityProfile>();
  @Output() profileApplied = new EventEmitter<string[]>();
  expanded = false;
  selectedProfile: AccessibilityProfile | null = null;

  constructor(public readonly i18n: I18nService) {}

  ngOnInit() {
    // No need to initialize profiles here as they're now reactive
  }

  toggleAccordion() {
    this.expanded = !this.expanded;
  }

  get profiles(): AccessibilityProfile[] {
    return [
      {
        id: 'visual-impairment',
        name: this.i18n.getTranslation('profile-visual-impairment'),
        description: this.i18n.getTranslation('profile-visual-impairment-desc'),
        icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
        features: ['Bigger Text', 'Contrast', 'Screen Reader', 'Cursor'],
        category: 'visual'
      },
      {
        id: 'color-blindness',
        name: this.i18n.getTranslation('profile-color-blindness'),
        description: this.i18n.getTranslation('profile-color-blindness-desc'),
        icon: 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
        features: ['Contrast', 'Grayscale'],
        category: 'visual'
      },
      {
        id: 'dyslexia',
        name: this.i18n.getTranslation('profile-dyslexia'),
        description: this.i18n.getTranslation('profile-dyslexia-desc'),
        icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
        features: ['Dyslexia Friendly', 'Text Spacing', 'Line Height', 'Readable Font'],
        category: 'reading'
      },
      {
        id: 'motor-impairment',
        name: this.i18n.getTranslation('profile-motor-impairment'),
        description: this.i18n.getTranslation('profile-motor-impairment-desc'),
        icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
        features: ['Skip Links', 'Cursor'],
        category: 'navigation'
      },
      {
        id: 'cognitive-impairment',
        name: this.i18n.getTranslation('profile-cognitive-impairment'),
        description: this.i18n.getTranslation('profile-cognitive-impairment-desc'),
        icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
        features: ['Reduced Motion'],
        category: 'reading'
      },
      {
        id: 'comprehensive',
        name: this.i18n.getTranslation('profile-comprehensive'),
        description: this.i18n.getTranslation('profile-comprehensive-desc'),
        icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
        features: ['Bigger Text', 'Contrast', 'Screen Reader', 'Dyslexia Friendly', 'Reduced Motion'],
        category: 'comprehensive'
      }
    ];
  }

  selectProfile(profile: AccessibilityProfile) {
    this.selectedProfile = profile;
    this.profileApplied.emit(profile.features);
  }

  // Update selected profile when language changes
  updateSelectedProfile() {
    if (this.selectedProfile) {
      // Find the updated profile with the same ID
      const updatedProfile = this.profiles.find(p => p.id === this.selectedProfile!.id);
      if (updatedProfile) {
        this.selectedProfile = updatedProfile;
      }
    }
  }

  // Reset profile selection
  resetProfile() {
    this.selectedProfile = null;
    // Emit empty array to indicate no profile is active
    this.profileApplied.emit([]);
  }

  getFeatureTranslation(feature: string): string {
    const translationMap: { [key: string]: string } = {
      'Bigger Text': this.i18n.getTranslation('bigger-text'),
      'Contrast': this.i18n.getTranslation('contrast'),
      'Screen Reader': this.i18n.getTranslation('screen-reader'),
      'Cursor': this.i18n.getTranslation('cursor'),
      'Grayscale': this.i18n.getTranslation('grayscale'),
      'Dyslexia Friendly': this.i18n.getTranslation('dyslexia-friendly'),
      'Text Spacing': this.i18n.getTranslation('text-spacing'),
      'Line Height': this.i18n.getTranslation('line-height'),
      'Readable Font': this.i18n.getTranslation('readable-font'),
      'Skip Links': this.i18n.getTranslation('skip-links'),
      'Reduced Motion': this.i18n.getTranslation('reduced-motion')
    };
    
    return translationMap[feature] || feature;
  }
} 