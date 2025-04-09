import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationDemandeComponent } from './consultation-demande.component';

describe('ConsultationDemandeComponent', () => {
  let component: ConsultationDemandeComponent;
  let fixture: ComponentFixture<ConsultationDemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultationDemandeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultationDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
