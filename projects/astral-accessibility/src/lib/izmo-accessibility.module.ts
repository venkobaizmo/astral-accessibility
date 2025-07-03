import { NgModule } from "@angular/core";
import { IzmoAccessibilityComponent } from "./izmo-accessibility.component";
import { IzmoCheckmarkSvgComponent } from "./util/izmo-checksvg.component";

export { IzmoAccessibilityComponent } from "./izmo-accessibility.component";

@NgModule({
  declarations: [IzmoCheckmarkSvgComponent],
  imports: [IzmoAccessibilityComponent],
  exports: [IzmoAccessibilityComponent],
})
export class IzmoAccessibilityModule {}
