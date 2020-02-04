import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContourFilteringComponent } from './contour-filtering.component';

describe('ContourFilteringComponent', () => {
  let component: ContourFilteringComponent;
  let fixture: ComponentFixture<ContourFilteringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContourFilteringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContourFilteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
