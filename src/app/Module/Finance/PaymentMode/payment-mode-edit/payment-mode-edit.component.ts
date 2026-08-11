import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PaymentModeService } from '../../../../Service/payment-mode.service';
import { PaymentModeModel } from '../../../../Model/payment-mode-model';

@Component({
  selector: 'app-payment-mode-edit',
  imports: [RouterModule,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './payment-mode-edit.component.html',
  styleUrl: './payment-mode-edit.component.css'
})
export class PaymentModeEditComponent {
  isFormVisible = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  isEditMode: boolean = false;

  // Form group for Payment Mode data
  paymentModeForm: FormGroup;

  // Injecting the service
  PaymentModeService = inject(PaymentModeService);

  constructor() {
    // Initialize form group
    this.paymentModeForm = new FormGroup({
      PaymentModeId: new FormControl<number>(0), // Nullable for Add mode
      PaymentModeName: new FormControl<string>('', { nonNullable: true }),
      isCash: new FormControl<boolean>(false, { nonNullable: true }), // Default false
      isCheque: new FormControl<boolean>(false, { nonNullable: true }), // Default false
      isOnlinePayment: new FormControl<boolean>(false, { nonNullable: true }), // Default false
      isActive: new FormControl<boolean>(true, { nonNullable: true }) // Default active
    });
  }

  ngAfterViewInit() {
    // Perform any initialization tasks after view load
  }

  // Open form in Add mode
  openForm() {
    this.isEditMode = false;
    this.paymentModeForm.reset({
      PaymentModeName: '',
      isCash: false,
      isCheque: false,
      isOnlinePayment: false,
      isActive: true
    });
    this.paymentModeForm.get('PaymentModeId')?.setValue(0);
    this.paymentModeForm.get('PaymentModeId')?.disable(); // Disable PaymentModeId in Add mode
    this.isFormVisible = true;
  }

  // Open form in Edit mode
  openFormEdit(paymentMode: PaymentModeModel) {
    this.isEditMode = true;
    this.paymentModeForm.enable(); // Enable all fields
    this.paymentModeForm.setValue({
      PaymentModeId: paymentMode.PaymentModeId ?? 0,
      PaymentModeName: paymentMode.PaymentModeName,
      isCash: paymentMode.isCash ?? false,
      isCheque: paymentMode.isCheque ?? false,
      isOnlinePayment: paymentMode.isOnlinePayment ?? false,
      isActive: paymentMode.isActive ?? false
    });
    this.paymentModeForm.get('PaymentModeId')?.disable(); // Disable PaymentModeId in Edit mode
    this.isFormVisible = true;
  }

  // Close form
  closeForm() {
    this.isFormVisible = false;
  }

  // Close popup
  closePopup() {
    this.showPopup = false;
  }

  // Submit form in Add mode
  onAddSubmit() {
    const formData = this.paymentModeForm.getRawValue(); // Get all values, including disabled ones
    console.log(formData);
    this.PaymentModeService.postPaymentMode(formData).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.popupMessage = response.message;
        this.showPopup = true;
        this.isFormVisible = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.popupMessage = err.error.message || 'An error occurred.';
        this.showPopup = true;
      }
    });
  }

  // Submit form in Edit mode
  onSubmit() {
    const formData: PaymentModeModel = this.paymentModeForm.getRawValue();

    this.PaymentModeService.editPaymentMode(formData).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.popupMessage = response.message;
        this.showPopup = true;
        this.isFormVisible = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.popupMessage = err.error.message || 'An error occurred.';
        this.showPopup = true;
      }
    });
  }
}
