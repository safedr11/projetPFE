import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeDecisionComponent } from './demande-decision.component';

describe('DemandeDecisionComponent', () => {
  let component: DemandeDecisionComponent;
  let fixture: ComponentFixture<DemandeDecisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeDecisionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandeDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
