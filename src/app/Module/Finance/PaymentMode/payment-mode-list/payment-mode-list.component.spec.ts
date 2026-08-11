import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentModeListComponent } from './payment-mode-list.component';

describe('PaymentModeListComponent', () => {
  let component: PaymentModeListComponent;
  let fixture: ComponentFixture<PaymentModeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentModeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentModeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
