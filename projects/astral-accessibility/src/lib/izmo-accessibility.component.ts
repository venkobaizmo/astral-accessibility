import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Renderer2, OnInit, EventEmitter, AfterViewInit, ViewChildren, QueryList } from "@angular/core";
import { ContrastComponent } from "./controls/contrast.component";
import { InvertComponent } from "./controls/invert.component";
import { SaturateComponent } from "./controls/saturate.component";
import { TextSizeComponent } from "./controls/text-size.component";
import { TextSpacingComponent } from "./controls/text-spacing.component";
import { ScreenReaderComponent } from "./controls/screen-reader.component";
import { ScreenMaskComponent } from "./controls/screen-mask.component";
import { LineHeightComponent } from "./controls/line-height.component";
import { SkipLinksComponent } from "./controls/skip-links.component";
import { ReducedMotionComponent } from "./controls/reduced-motion.component";
import { FocusEnhancementComponent } from "./controls/focus-enhancement.component";
import { ColorBlindSupportComponent } from "./controls/color-blind-support.component";
// New accessibility components
import { AltTextValidatorComponent } from "./controls/alt-text-validator.component";
import { PageTitleValidatorComponent } from "./controls/page-title-validator.component";
import { LanguageValidatorComponent } from "./controls/language-validator.component";
import { AutoRefreshControlsComponent } from "./controls/auto-refresh-controls.component";
import { FocusTrapComponent } from "./controls/focus-trap.component";
import { TouchTargetValidatorComponent } from "./controls/touch-target-validator.component";
import { ReadingOrderValidatorComponent } from "./controls/reading-order-validator.component";
import { ErrorIdentificationComponent } from "./controls/error-identification.component";
import { DyslexiaFriendlyComponent } from "./controls/dyslexia-friendly.component";
// Additional missing components
import { HighlightLinksComponent } from "./controls/highlight-links.component";
import { PauseAnimationsComponent } from "./controls/pause-animations.component";
import { HideImagesComponent } from "./controls/hide-images.component";
import { CursorComponent } from "./controls/cursor.component";
import { TooltipComponent } from "./controls/tooltip.component";
import { PageStructureComponent } from "./controls/page-structure.component";
import { DictionaryComponent } from "./controls/dictionary.component";
import { FormEnhancementComponent } from "./controls/form-enhancement.component";
import { TextAlignComponent } from "./controls/text-align.component";
import { I18nService } from "./services/i18n.service";
import { ReadableFontComponent } from "./controls/readable-font.component";
import { TextMagnifierComponent } from "./controls/text-magnifier.component";
import { LuminosityComponent } from "./controls/luminosity.component";
import { GrayscaleComponent } from "./controls/grayscale.component";
import { ReadingLineComponent } from "./controls/reading-line.component";
import { HighlightTitlesComponent } from "./controls/highlight-titles.component";
import { HighlightAllComponent } from "./controls/highlight-all.component";
import { MuteSoundsComponent } from "./controls/mute-sounds.component";
import { AccessibilityProfilesComponent } from "./controls/accessibility-profiles.component";

export interface IzmoTheme {
  // Modal colors
  modalBackgroundColor?: string;
  modalBorderColor?: string;
  
  // Action colors
  actionTextColor?: string;
  actionActiveTextColor?: string;
  actionDisabledTextColor?: string;
  actionBackgroundColor?: string;
  actionActiveBackgroundColor?: string;
  actionDisabledBackgroundColor?: string;
  
  // Icon colors
  actionIconActiveBackgroundColor?: string;
  actionIconInactiveBackgroundColor?: string;
  actionIconDisabledBackgroundColor?: string;
  
  // Header colors
  headerBackgroundColor?: string;
  headerTextColor?: string;
  headerTitleColor?: string;
  headerCloseButtonColor?: string;
  
  // Language selector colors
  languageSelectBackgroundColor?: string;
  languageSelectTextColor?: string;
  languageSelectBorderColor?: string;
  languageSelectFocusColor?: string;
  
  // Footer colors
  footerBackgroundColor?: string;
  footerTextColor?: string;
  footerLinkColor?: string;
  footerResetButtonBackgroundColor?: string;
  footerResetButtonTextColor?: string;
  
  // Widget icon colors
  widgetIconBackgroundColor?: string;
  widgetIconColor?: string;
  widgetIconActiveBackgroundColor?: string;
  widgetIconActiveColor?: string;
  
  // General colors
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  shadowColor?: string;
}

export type LayoutType = '1-column' | '2-column' | '3-column' | 'responsive';

@Component({
  selector: "izmo-accessibility",
  templateUrl: "./izmo-accessibility.component.html",
  styleUrls: ["./izmo-accessibility.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InvertComponent,
    ContrastComponent,
    SaturateComponent,
    TextSizeComponent,
    TextSpacingComponent,
    ScreenReaderComponent,
    ScreenMaskComponent,
    LineHeightComponent,
    SkipLinksComponent,
    ReducedMotionComponent,
    FocusEnhancementComponent,
    ColorBlindSupportComponent,
    AltTextValidatorComponent,
    PageTitleValidatorComponent,
    LanguageValidatorComponent,
    AutoRefreshControlsComponent,
    FocusTrapComponent,
    TouchTargetValidatorComponent,
    ReadingOrderValidatorComponent,
    ErrorIdentificationComponent,
    DyslexiaFriendlyComponent,
    GrayscaleComponent,
    LuminosityComponent,
    MuteSoundsComponent,
    HideImagesComponent,
    HighlightLinksComponent,
    HighlightTitlesComponent,
    HighlightAllComponent,
    CursorComponent,
    TooltipComponent,
    ReadableFontComponent,
    TextMagnifierComponent,
    DictionaryComponent,
    FormEnhancementComponent,
    PageStructureComponent,
    PauseAnimationsComponent,
    AccessibilityProfilesComponent,
    TextAlignComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IzmoAccessibilityComponent implements OnInit, AfterViewInit {
  izmoAccessibilityPanel = "izmo-modal";
  izmoAccessibilityIcon = "izmo-icon";
  options: Record<string, any> = {};
  enabledFeatures: string[] = [];
  private defaultEnabledFeatures: string[] = [];
  
  // Default features that should be shown when enabledFeatures is empty
  private readonly defaultFeatures: string[] = [
    // WCAG 2.1 Core Navigation Features
    "Skip Links",
    
    // WCAG 2.1 Visual Features
    "Contrast", "Color Blind Support", "Saturation", "Invert", "Hide Images", "Luminosity", "Grayscale",
    
    // WCAG 2.1 Text and Reading Features
    "Screen Reader", "Bigger Text", "Text Spacing", "Line Height", "Text Align", "Dyslexia Friendly", "Cursor", "Highlight Links", "Readable Font",
    
    // WCAG 2.1 Motion Features
    "Reduced Motion", "Screen Mask", "Pause Animations",
    
    // Additional Navigation Features
    "Highlight Titles", "Highlight All", "Mute Sounds"
  ];

  // Getter that returns enabled features or default features if empty
  get activeFeatures(): string[] {
    return this.enabledFeatures.length > 0 ? this.enabledFeatures : this.defaultFeatures;
  }
  
  // New layout and theme properties
  layoutType: LayoutType = 'responsive';
  theme: IzmoTheme = {};
  
  // Language properties
  currentLanguage: string = 'en-US';
  availableLanguages = [
    { code: 'en-US', name: 'English (United States)' },
    { code: 'es-ES', name: 'Español (España)' },
    { code: 'fr-FR', name: 'Français (France)' },
    { code: 'de-DE', name: 'Deutsch (Deutschland)' },
    { code: 'it-IT', name: 'Italiano (Italia)' },
    { code: 'pt-BR', name: 'Português (Brasil)' },
    { code: 'ru-RU', name: 'Русский (Россия)' },
    { code: 'ja-JP', name: '日本語 (日本)' },
    { code: 'ko-KR', name: '한국어 (대한민국)' },
    { code: 'ar-SA', name: 'العربية (السعودية)' },
    { code: 'hi-IN', name: 'हिन्दी (भारत)' }
  ];
  
  public resetEvent: EventEmitter<void> = new EventEmitter<void>();
  
  allControls: string[] = [
    'Skip Links',
    'Alt Text Validator',
    'Page Title Validator',
    'Language Validator',
    'Auto Refresh Controls',
    'Focus Trap',
    'Touch Target Validator',
    'Reading Order Validator',
    'Error Identification',
    'Focus Enhancement',
    'Contrast',
    'Color Blind Support',
    'Saturation',
    'Luminosity',
    'Grayscale',
    'Dyslexia Friendly',
    'Screen Reader',
    'Bigger Text',
    'Text Spacing',
    'Line Height',
    'Text Align',
    'Dictionary',
    'Highlight Links',
    'Cursor',
    'Tooltip',
    'Readable Font',
    'Text Magnifier',
    'Reduced Motion',
    'Pause Animations',
    'Screen Mask',
    'Hide Images',
    'Page Structure',
    'Form Enhancement',
    'Reading Line',
    'Highlight Titles',
    'Highlight All',
    'Mute Sounds'
  ];

  @ViewChildren(SkipLinksComponent) skipLinksControls!: QueryList<SkipLinksComponent>;
  @ViewChildren(ContrastComponent) contrastControls!: QueryList<ContrastComponent>;
  @ViewChildren(InvertComponent) invertControls!: QueryList<InvertComponent>;
  @ViewChildren(SaturateComponent) saturateControls!: QueryList<SaturateComponent>;
  @ViewChildren(TextSizeComponent) textSizeControls!: QueryList<TextSizeComponent>;
  @ViewChildren(TextSpacingComponent) textSpacingControls!: QueryList<TextSpacingComponent>;
  @ViewChildren(ScreenReaderComponent) screenReaderControls!: QueryList<ScreenReaderComponent>;
  @ViewChildren(ScreenMaskComponent) screenMaskControls!: QueryList<ScreenMaskComponent>;
  @ViewChildren(LineHeightComponent) lineHeightControls!: QueryList<LineHeightComponent>;
  @ViewChildren(ReducedMotionComponent) reducedMotionControls!: QueryList<ReducedMotionComponent>;
  @ViewChildren(FocusEnhancementComponent) focusEnhancementControls!: QueryList<FocusEnhancementComponent>;
  @ViewChildren(ColorBlindSupportComponent) colorBlindSupportControls!: QueryList<ColorBlindSupportComponent>;
  @ViewChildren(AltTextValidatorComponent) altTextValidatorControls!: QueryList<AltTextValidatorComponent>;
  @ViewChildren(PageTitleValidatorComponent) pageTitleValidatorControls!: QueryList<PageTitleValidatorComponent>;
  @ViewChildren(LanguageValidatorComponent) languageValidatorControls!: QueryList<LanguageValidatorComponent>;
  @ViewChildren(AutoRefreshControlsComponent) autoRefreshControls!: QueryList<AutoRefreshControlsComponent>;
  @ViewChildren(FocusTrapComponent) focusTrapControls!: QueryList<FocusTrapComponent>;
  @ViewChildren(TouchTargetValidatorComponent) touchTargetValidatorControls!: QueryList<TouchTargetValidatorComponent>;
  @ViewChildren(ReadingOrderValidatorComponent) readingOrderValidatorControls!: QueryList<ReadingOrderValidatorComponent>;
  @ViewChildren(ErrorIdentificationComponent) errorIdentificationControls!: QueryList<ErrorIdentificationComponent>;
  @ViewChildren(DyslexiaFriendlyComponent) dyslexiaFriendlyControls!: QueryList<DyslexiaFriendlyComponent>;
  @ViewChildren(HighlightLinksComponent) highlightLinksControls!: QueryList<HighlightLinksComponent>;
  @ViewChildren(PauseAnimationsComponent) pauseAnimationsControls!: QueryList<PauseAnimationsComponent>;
  @ViewChildren(HideImagesComponent) hideImagesControls!: QueryList<HideImagesComponent>;
  @ViewChildren(CursorComponent) cursorControls!: QueryList<CursorComponent>;
  @ViewChildren(TooltipComponent) tooltipControls!: QueryList<TooltipComponent>;
  @ViewChildren(ReadableFontComponent) readableFontControls!: QueryList<ReadableFontComponent>;
  @ViewChildren(TextMagnifierComponent) textMagnifierControls!: QueryList<TextMagnifierComponent>;
  @ViewChildren(DictionaryComponent) dictionaryControls!: QueryList<DictionaryComponent>;
  @ViewChildren(FormEnhancementComponent) formEnhancementControls!: QueryList<FormEnhancementComponent>;
  @ViewChildren(PageStructureComponent) pageStructureControls!: QueryList<PageStructureComponent>;
  @ViewChildren(ReadingLineComponent) readingLineControls!: QueryList<ReadingLineComponent>;
  @ViewChildren(HighlightTitlesComponent) highlightTitlesControls!: QueryList<HighlightTitlesComponent>;
  @ViewChildren(HighlightAllComponent) highlightAllControls!: QueryList<HighlightAllComponent>;
  @ViewChildren(MuteSoundsComponent) muteSoundsControls!: QueryList<MuteSoundsComponent>;
  @ViewChildren(AccessibilityProfilesComponent) accessibilityProfilesControls!: QueryList<AccessibilityProfilesComponent>;

  constructor(
    private readonly elementRef: ElementRef, 
    private readonly renderer: Renderer2,
    public readonly i18n: I18nService
  ) {}

  get openAccessibilityPanelText(): string {
    return this.i18n.getTranslation('open-accessibility-panel');
  }

  get closeAccessibilityPanelText(): string {
    return this.i18n.getTranslation('close-accessibility-panel');
  }

  ngOnInit() {
    const izmoElement = document.querySelector("izmo-accessibility");
    const izmoOptions = izmoElement?.getAttribute("izmo-features");

    if (izmoOptions) {
      this.options = JSON.parse(izmoOptions);
      this.enabledFeatures = this.options["enabledFeatures"] || [];
      this.defaultEnabledFeatures = [...this.enabledFeatures];
      
      // Set locale if provided
      if (this.options["locale"]) {
        this.currentLanguage = this.options["locale"];
        this.i18n.setLocale(this.options["locale"]);
      } else {
        // Auto-detect language if not provided
        this.currentLanguage = this.detectBrowserLanguage();
        this.i18n.setLocale(this.currentLanguage);
      }
      
      // Set layout type if provided
      if (this.options["layout"]) {
        this.layoutType = this.options["layout"];
      }
      
      // Set custom theme if provided
      if (this.options["theme"]) {
        this.theme = this.options["theme"];
      }
      
      // Apply custom height if provided, otherwise default to 58vh
      const customHeight = this.options["widgetHeight"] ?? "58vh";
      this.setWidgetHeight(customHeight);
      
      // Apply layout and theme configurations
      this.applyLayoutConfiguration();
      this.applyThemeConfiguration();
    } else {
      // No config provided, use defaults
      this.currentLanguage = this.detectBrowserLanguage();
      this.i18n.setLocale(this.currentLanguage);
      this.setWidgetHeight("58vh");
      this.applyLayoutConfiguration();
    }

    const phones =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    if (phones.test(this.userAgent)) {
      this.izmoAccessibilityPanel = "izmo-page izmo-modal";
      this.izmoAccessibilityIcon = "izmo-icon izmo-icon-mobile";
    }
  }

  private setWidgetHeight(height: string) {
    // Set the CSS custom property for modal height
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      '--modalHeight',
      height
    );
  }

  private applyLayoutConfiguration() {
    const hostElement = this.elementRef.nativeElement;
    
    // Remove existing layout classes
    this.renderer.removeClass(hostElement, 'izmo-layout-1-column');
    this.renderer.removeClass(hostElement, 'izmo-layout-2-column');
    this.renderer.removeClass(hostElement, 'izmo-layout-3-column');
    this.renderer.removeClass(hostElement, 'izmo-layout-responsive');
    
    // Add the appropriate layout class
    this.renderer.addClass(hostElement, `izmo-layout-${this.layoutType}`);
  }

  private applyThemeConfiguration() {
    const widgetRoot = this.elementRef.nativeElement;
    // Merge config theme with defaults for all known variables
    const allThemeVars: Record<string, string> = {
      '--izmo-primary-color': '#4A90E2',
      '--izmo-secondary-color': '#F5A623',
      '--izmo-accent-color': '#7ED321',
      '--izmo-background-color': '#FFFFFF',
      '--izmo-text-color': '#333333',
      '--izmo-border-color': '#E1E8ED',
      '--izmo-shadow-color': 'rgba(0, 0, 0, 0.25)',
      '--izmo-modal-background-color': '#232323',
      '--izmo-modal-border-color': '#e8e8e8',
      '--izmo-action-text-color': '#fff',
      '--izmo-action-active-text-color': '#000',
      '--izmo-action-disabled-text-color': '#a4a4a4',
      '--izmo-action-background-color': '#444444',
      '--izmo-action-active-background-color': '#ffcb00',
      '--izmo-action-disabled-background-color': '#373737',
      '--izmo-action-border-color': 'transparent',
      '--izmo-action-selected-border-color': '#4A90E2',
      '--izmo-action-icon-active-background-color': '#ffd73b',
      '--izmo-action-icon-inactive-background-color': '#6c6c6c',
      '--izmo-action-icon-disabled-background-color': '#595959',
      '--izmo-header-background-color': '#232323',
      '--izmo-header-text-color': '#e5e7eb',
      '--izmo-header-title-color': '#fff',
      '--izmo-header-close-button-color': '#fff',
      '--izmo-language-select-background-color': '#374151',
      '--izmo-language-select-text-color': '#fff',
      '--izmo-language-select-border-color': '#4b5563',
      '--izmo-language-select-focus-color': '#3b82f6',
      '--izmo-footer-background-color': 'transparent',
      '--izmo-footer-text-color': '#bbb',
      '--izmo-footer-link-color': '#e53935',
      '--izmo-footer-reset-button-background-color': '#232323',
      '--izmo-footer-reset-button-text-color': '#fff',
      '--izmo-widget-icon-background-color': '#4A90E2',
      '--izmo-widget-icon-color': '#FFFFFF',
      '--izmo-widget-icon-active-background-color': '#ffcb00',
      '--izmo-widget-icon-active-color': '#000',
    };
    // Overwrite with any provided theme config
    if (this.options?.['theme']) {
      Object.entries(this.options['theme']).forEach(([property, value]) => {
        allThemeVars[property] = value as string;
      });
    }
    // Set all variables on the widget root
    Object.entries(allThemeVars).forEach(([cssProperty, value]) => {
      widgetRoot.style.setProperty(cssProperty, value as string);
    });
    // If shadowRoot exists, set there too
    if (widgetRoot.shadowRoot) {
      Object.entries(allThemeVars).forEach(([cssProperty, value]) => {
        widgetRoot.shadowRoot.host.style.setProperty(cssProperty, value as string);
      });
    }
  }

  private convertToCssProperty(property: string): string | null {
    const propertyMap: { [key: string]: string } = {
      'primaryColor': '--izmo-primary-color',
      'secondaryColor': '--izmo-secondary-color',
      'accentColor': '--izmo-accent-color',
      'backgroundColor': '--izmo-background-color',
      'textColor': '--izmo-text-color',
      'borderColor': '--izmo-border-color',
      'modalBackgroundColor': '--izmo-modal-background-color',
      'actionBackgroundColor': '--izmo-action-background-color',
      'actionActiveBackgroundColor': '--izmo-action-active-background-color',
      'widgetIconBackgroundColor': '--izmo-widget-icon-background-color',
      'widgetIconColor': '--izmo-widget-icon-color',
      'headerBackgroundColor': '--izmo-header-background-color',
      'actionTextColor': '--izmo-action-text-color',
      'actionActiveTextColor': '--izmo-action-active-text-color',
      'actionDisabledTextColor': '--izmo-action-disabled-text-color',
      'actionDisabledBackgroundColor': '--izmo-action-disabled-background-color',
      'actionIconActiveBackgroundColor': '--izmo-action-icon-active-background-color',
      'actionIconInactiveBackgroundColor': '--izmo-action-icon-inactive-background-color',
      'actionIconDisabledBackgroundColor': '--izmo-action-icon-disabled-background-color',
      'headerTextColor': '--izmo-header-text-color',
      'headerTitleColor': '--izmo-header-title-color',
      'headerCloseButtonColor': '--izmo-header-close-button-color',
      'languageSelectBackgroundColor': '--izmo-language-select-background-color',
      'languageSelectTextColor': '--izmo-language-select-text-color',
      'languageSelectBorderColor': '--izmo-language-select-border-color',
      'languageSelectFocusColor': '--izmo-language-select-focus-color',
      'footerBackgroundColor': '--izmo-footer-background-color',
      'footerTextColor': '--izmo-footer-text-color',
      'footerLinkColor': '--izmo-footer-link-color',
      'footerResetButtonBackgroundColor': '--izmo-footer-reset-button-background-color',
      'footerResetButtonTextColor': '--izmo-footer-reset-button-text-color',
      'widgetIconActiveBackgroundColor': '--izmo-widget-icon-active-background-color',
      'widgetIconActiveColor': '--izmo-widget-icon-active-color',
      'shadowColor': '--izmo-shadow-color'
    };
    
    return propertyMap[property] || null;
  }

  getLayoutClass(): string {
    return `izmo-layout-${this.layoutType}`;
  }

  private detectBrowserLanguage(): string {
    const browserLang = navigator.language || navigator.languages?.[0] || 'en-US';
    const availableCodes = this.availableLanguages.map(lang => lang.code);
    
    // Try exact match first
    if (availableCodes.includes(browserLang)) {
      return browserLang;
    }
    
    // Try language code match (e.g., 'en' for 'en-US')
    const langCode = browserLang.split('-')[0];
    const match = availableCodes.find(code => code.startsWith(langCode));
    
    return match || 'en-US';
  }

  onLanguageChange(event: any): void {
    const newLanguage = event.target.value;
    this.currentLanguage = newLanguage;
    this.i18n.setLocale(newLanguage);
  }

  public resetAllSelections(): void {
    this.resetEvent.emit();
  }

  get userAgent(): string {
    return navigator.userAgent;
  }

  isModalOpen: boolean = false;

  toggleModal(): void {
    this.isModalOpen = !this.isModalOpen;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  minimizeModal(): void {
    this.isModalOpen = false;
  }

  restoreModal(): void {
    this.isModalOpen = true;
  }

  ngAfterViewInit() {
    // Simple initialization - no complex scroll handling needed
  }

  onProfileApplied(features: string[]) {
    // Only Contrast supports programmatic activation out of the box
    this.contrastControls.forEach(ctrl => {
      if (features.includes('Contrast') && ctrl.currentState === 0) ctrl.nextState();
      if (!features.includes('Contrast') && ctrl.currentState !== 0) ctrl.nextState();
    });
    // For other controls, programmatic activation is not supported by default.
    // To support it, add a public method to the control and call it here.
  }
}
