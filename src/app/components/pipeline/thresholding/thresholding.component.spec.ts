import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThresholdingComponent } from './thresholding.component';

describe('ThresholdingComponent', () => {
  let component: ThresholdingComponent;
  let fixture: ComponentFixture<ThresholdingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThresholdingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThresholdingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
