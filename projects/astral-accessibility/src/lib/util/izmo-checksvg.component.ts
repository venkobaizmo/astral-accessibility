import { Component, Input } from "@angular/core";
import { NgIf } from "@angular/common";

@Component({
  selector: "izmo-widget-checkmark",
  standalone: true,
  template: `
    <div *ngIf="isActive" class="icon active active-check">
      <svg
        width="14px"
        height="14px"
        viewBox="0 0 24 24"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <path
            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
            fill="#ffffff"
            fill-rule="nonzero"
          ></path>
        </g>
      </svg>
    </div>
  `,
  imports: [NgIf],
})
export class IzmoCheckmarkSvgComponent {
  @Input() isActive: boolean;
}
