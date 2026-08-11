import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentModeEditComponent } from './payment-mode-edit.component';

describe('PaymentModeEditComponent', () => {
  let component: PaymentModeEditComponent;
  let fixture: ComponentFixture<PaymentModeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentModeEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentModeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
