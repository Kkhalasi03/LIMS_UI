import { Component, inject, ViewChild } from '@angular/core';
import { SidenavBarComponent } from "../../../../sidenav-bar/sidenav-bar.component";
import { PaymentModeEditComponent } from "../payment-mode-edit/payment-mode-edit.component";
import { PaymentModeModel } from '../../../../Model/payment-mode-model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentModeService } from '../../../../Service/payment-mode.service';

@Component({
  selector: 'app-payment-mode-list',
  imports: [SidenavBarComponent, PaymentModeEditComponent,CommonModule,RouterModule,FormsModule,ReactiveFormsModule],
  templateUrl: './payment-mode-list.component.html',
  styleUrl: './payment-mode-list.component.css'
})
export class PaymentModeListComponent {
  username:string|null=null;
  isFormVisibleADD = false;
  isTableVisible = false;
  hasSearched = false; // New flag to check if search was performed
  isFormVisible = false;
  showPopup = false;
  popupMessage = '';
  homePaymentModeId: number | null = null; // Updated property for PaymentModeId
  homePaymentModeName: string = ''; // Updated property for PaymentModeName
  apiResponse: PaymentModeModel[] = []; // Updated list type to PaymentModeModel
  selectedValue: boolean | null = null; // For isActive filter

  modalData: PaymentModeModel = {
    PaymentModeId: 0,
    PaymentModeName: '',
    isCash:false,
    isCheque:false,
    isOnlinePayment:false,
    isActive: true
  };
constructor(private router:Router){}
  PaymentModeService = inject(PaymentModeService); // Updated service injection

  // Form for filtering data
  applyForm1 = new FormGroup({
    homePaymentModeId: new FormControl<number | null>(0),
    homePaymentModeName: new FormControl<string>(''),
    selectedValue: new FormControl<boolean | null>(null),
    isCash:new FormControl<boolean | null>(null),
    isCheque:new FormControl<boolean | null>(null),
    isOnlinePayment:new FormControl<boolean | null>(null)
  });

  @ViewChild('paymentModeEditComponent') paymentModeEditComponent!: PaymentModeEditComponent;
  ngAfterViewInit() {
    // Retrieve the username from localStorage or sessionStorage
    console.log('Is SessionStorage accessible:', sessionStorage ? true : false);
    const savedLoginData = sessionStorage.getItem('UserName');
    console.log('Raw loginData from SessionStorage:', savedLoginData);
    if (savedLoginData) {
     this.username = savedLoginData;  // Directly assign the value
     console.log('Retrieved username:', this.username);
   } else {
     console.log('No user data found in SessionStorage');
   }
  }
  onLogout() {
    if (sessionStorage) {
      sessionStorage.clear(); // Clear all session data
    }
    this.router.navigate(['/login']); // Redirect to login page
  }
  // Open Add Form
  openForm() {
    this.isFormVisibleADD = true;
    if (this.paymentModeEditComponent) {
      this.paymentModeEditComponent.openForm();
    } else {
      console.warn('PaymentModeEditComponent instance is undefined');
    }
  }

  // Open Edit Form
  openFormEdit(paymentMode: PaymentModeModel) {
    this.modalData = { ...paymentMode }; // Set modal data
    this.isFormVisibleADD = true;
    if (this.paymentModeEditComponent) {
      this.paymentModeEditComponent.openFormEdit(paymentMode);
    } else {
      console.warn('PaymentModeEditComponent instance is undefined');
    }
  }

  // Close Add/Edit Form
  closeForm() {
    this.isFormVisibleADD = false;
  }

  // Close Popup
  closePopup() {
    this.showPopup = false;
    this.fetchAllData();
  }

  // Clear Filter Form
  clearForm() {
    this.applyForm1.reset();
    this.apiResponse = [];
    this.isTableVisible = false;
    this.hasSearched = false; // Reset search state

  }

  closeFormEdit() {
    this.isFormVisible = false; // Hide the form
  }

  // Delete PaymentMode
  deleteForm(PaymentModeId: number | null) {
    if (PaymentModeId !== null) {
      this.PaymentModeService.deletePaymentMode(PaymentModeId).subscribe({
        next: (response) => {
          this.popupMessage = response.message;
          this.showPopup = true;
        },
        error: (err) => {
          this.popupMessage = err.error.message || 'An error occurred.';
          this.showPopup = true;
        }
      });
    } else {
      alert("Please provide valid data");
    }
  }

  onSelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    // Update the FormControl with boolean values, based on selected value
    const selectedValue = value === 'true' ? true : (value === 'false' ? false : null);
    this.applyForm1.get('selectedValue')?.setValue(selectedValue);
    console.log('Selected value:', selectedValue);
  }

  // Filter Logic
  searchApplication() {
    this.hasSearched = true; // Set flag when search is clicked
    const searchParams: PaymentModeModel = {
      PaymentModeId: this.applyForm1.value.homePaymentModeId || 0,
      PaymentModeName: this.applyForm1.value.homePaymentModeName || '',
      isCash: this.applyForm1.value.isCash !== undefined ? this.applyForm1.value.isCash : false,  // Ensure false if undefined
      isCheque: this.applyForm1.value.isCheque !== undefined ? this.applyForm1.value.isCheque : false,  // Ensure false if undefined
      isOnlinePayment: this.applyForm1.value.isOnlinePayment !== undefined ? this.applyForm1.value.isOnlinePayment : false,  // Ensure false if undefined
      isActive: this.applyForm1.value.selectedValue === null ? null : this.applyForm1.value.selectedValue === true ? true : false
    };

    if (!searchParams.PaymentModeId && !searchParams.PaymentModeName && searchParams.isActive === null) {
      this.fetchAllData();
    } else {
      this.fetchFilteredData(searchParams);
    }
  }

  // Fetch All Data
  fetchAllData() {
    this.PaymentModeService.getPaymentMode().subscribe({
      next: (data: PaymentModeModel[]) => {
        this.apiResponse = data;
        this.isTableVisible = this.apiResponse.length > 0;
      },
      error: (err) => {
        console.error(err);
        this.isTableVisible = false;

      }
    });
  }

  // Fetch Filtered Data
  fetchFilteredData(searchParams: PaymentModeModel) {
    this.PaymentModeService.getPaymentModeByIdOrName(searchParams).subscribe({
      next: (data: PaymentModeModel[]) => {
        this.apiResponse = data;
        this.isTableVisible = this.apiResponse.length > 0;
      },
      error: (err) => {
        console.error(err);
        this.isTableVisible = false;

      }
    });
  }
}
