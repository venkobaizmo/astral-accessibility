import { NgIf } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Renderer2 } from "@angular/core";
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
import { I18nService } from "./services/i18n.service";

@Component({
  selector: "astral-accessibility",
  templateUrl: "./astral-accessibility.component.html",
  styleUrls: ["./astral-accessibility.component.scss"],
  standalone: true,
  imports: [
    NgIf,
    InvertComponent,
    ContrastComponent,
    SaturateComponent,
    TextSizeComponent,
    TextSpacingComponent,
    ScreenReaderComponent,
    ScreenMaskComponent,
    LineHeightComponent,
    SkipLinksComponent,    ReducedMotionComponent,
    FocusEnhancementComponent,
    ColorBlindSupportComponent,
    // KeyboardNavigationComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AstralAccessibilityComponent {
  modalVisible = false;
  userAgent = navigator.userAgent;
  astralAccessibilityPanel = "astral-modal";
  astralAccessibilityIcon = "astral-icon";
  options: Record<string, any> = {};
  enabledFeatures: string[] = [];
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
  }  ngOnInit() {
    const astralElement = document.querySelector("astral-accessibility");
    const astralOptions = astralElement?.getAttribute("astral-features");

    if (astralOptions) {
      this.options = JSON.parse(astralOptions);
      this.enabledFeatures = this.options["enabledFeatures"];
      
      // Set locale if provided
      if (this.options["locale"]) {
        this.i18n.setLocale(this.options["locale"]);
      }
        // Apply custom height if provided, otherwise default to 75vh
      const customHeight = this.options["widgetHeight"] ?? "75vh";
      this.setWidgetHeight(customHeight);
    } else {
      // No config provided, use default height
      this.setWidgetHeight("75vh");
    }

    const phones =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    if (phones.test(this.userAgent)) {
      this.astralAccessibilityPanel = "astral-page astral-modal";
      this.astralAccessibilityIcon = "astral-icon astral-icon-mobile";
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
}
