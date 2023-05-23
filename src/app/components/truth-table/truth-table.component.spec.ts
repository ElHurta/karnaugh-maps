import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruthTableComponent } from './truth-table.component';

describe('TruthTableComponent', () => {
  let component: TruthTableComponent;
  let fixture: ComponentFixture<TruthTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TruthTableComponent]
    });
    fixture = TestBed.createComponent(TruthTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
