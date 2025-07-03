import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IzmoAccessibilityComponent } from "./izmo-accessibility.component";

describe("IzmoAccessibilityComponent", () => {
  let component: IzmoAccessibilityComponent;
  let fixture: ComponentFixture<IzmoAccessibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IzmoAccessibilityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IzmoAccessibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
