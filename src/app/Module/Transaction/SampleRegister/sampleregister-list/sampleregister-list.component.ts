import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SidenavBarComponent } from '../../../../sidenav-bar/sidenav-bar.component';
import { SampleregisterEditComponent } from '../sampleregister-edit/sampleregister-edit.component';
import { SampleRegisterModel } from '../../../../Model/sample-register-model';
import { SampleRegisterService } from '../../../../Service/sample-register.service';
import { SampleServiceModel } from '../../../../Model/sample-service-model';
import { SamplePaymentDetails } from '../../../../Model/sample-payment-details';

@Component({
  selector: 'app-sampleregister-list',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, SidenavBarComponent, SampleregisterEditComponent],
  templateUrl: './sampleregister-list.component.html',
  styleUrl: './sampleregister-list.component.css'
})
export class SampleregisterListComponent {
  username:string|null=null;
  isFormVisibleADD = false;
  isTableVisible = false;
  isFormVisible = false;
  showPopup = false;
  hasSearched = false; // New flag to check if search was performed
  popupMessage = '';
  homeSampleRegisterId: number | null = null;
  homeMiddleName: string = '';  // Property for Middle Name filtering
  apiResponse: SampleRegisterModel[] = [];  // List of sample registers
  selectedValue: boolean | null = null; // For isActive filter

  modalData: SampleRegisterModel = {
    SampleRegisterId: 0,
    BranchId:0,
    B2BId:0,
    MobileNo: '',
    Title: '',
    FirstName: '',
    MiddleName: '',
    LastName: '',
    DOB: '',
    Age: 0,
    Gender: '',
    EmailId: '',
    Address: '',
    CityId: 0,
    AreaId: 0,
    isActive: true,
    TotalAmount:0,
    CreatedBy:'',
  };

  SampleRegisterService = inject(SampleRegisterService);
constructor(private router:Router){}
  // Form for filtering data
  applyForm1 = new FormGroup({
    homeSampleRegisterId: new FormControl<number | null>(0),
    homeMiddleName: new FormControl<string>(''),
    selectedValue: new FormControl<boolean | null>(null)
  });

  @ViewChild('sampleRegisterEditComponent') sampleRegisterEditComponent!: SampleregisterEditComponent;
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
    if (this.sampleRegisterEditComponent) {
      this.sampleRegisterEditComponent.openForm(this.username);
    } else {
      console.warn('SampleRegisterEditComponent instance is undefined');
    }
  }

  // Open Edit Form
  openFormEdit(sample: SampleRegisterModel) {
    this.modalData = { ...sample };
    // this.SampleRegisterService.getSampleServiceById(sample.SampleRegisterId).subscribe({
    //   next: (serviceData: SampleServiceModel[]) => {
    //     const extractedServiceIds = serviceData.map(item => item.ServiceId);
    //     const updatedSample = { ...sample, ServiceId: extractedServiceIds };
    //     this.isFormVisibleADD = true;
    //     this.sampleRegisterEditComponent?.openFormEdit(updatedSample, serviceData);
    //   },
    //   error: (err) => console.error('Error fetching ServiceId:', err)
    // });
    this.SampleRegisterService.getSampleServiceById(sample.SampleRegisterId).subscribe({
      next: (serviceData: SampleServiceModel[]) => {
        const extractedServiceIds = serviceData.map(item => item.ServiceId);
  
        // Fetch Payment IDs
        this.SampleRegisterService.getSamplePayment(sample.SampleRegisterId).subscribe({
          next: (paymentData: SamplePaymentDetails[]) => {
            // const extractedPaymentIds = paymentData.map(item => item.SamplePaymentId);
            const extractedPaymentIds = Array.isArray(paymentData) ? paymentData.map(item => item.SamplePaymentId) : [];

  
            // Update sample with both ServiceId and SamplePaymentId
            const updatedSample = { 
              ...sample, 
              ServiceId: extractedServiceIds, 
              SamplePaymentId: extractedPaymentIds 
            };
  
            this.isFormVisibleADD = true;
            console.log('DATA FOR EDITFORM',updatedSample);

            
            // Ensure openFormEdit correctly handles both serviceData and paymentData
            this.sampleRegisterEditComponent?.openFormEdit(updatedSample, serviceData, paymentData);
          },
          error: (err) => console.error('Error fetching SamplePaymentId:', err)
        });
      },
      error: (err) => console.error('Error fetching ServiceId:', err)
    });
    
  }

  // openFormEdit(sample: SampleRegisterModel) {
  //   console.log(sample);
  //   this.modalData = { ...sample }; // Set modal data   
  //   this.SampleRegisterService.getSampleServiceById(sample.SampleRegisterId).subscribe({
  //     next: (serviceData:SampleServiceModel[]) => {
  //       console.log('Fetched Service Data:', serviceData);
  //       const extractedServiceIds = serviceData.map((item: SampleServiceModel) => item.ServiceId);

  //       console.log('SapmleRegisterId:',extractedServiceIds);
  //       //  Step 2: Add ServiceId to sample data before passing to edit component
  //       const updatedSample = { ...sample, ServiceId:extractedServiceIds};
  
  //       //  Step 3: Ensure @ViewChild is available before calling openFormEdit
  //         this.isFormVisibleADD = true;
  //         console.log(updatedSample);
  //         if (this.sampleRegisterEditComponent) {
  //           console.log('SampleRegisterEditComponent found, calling openFormEdit');
  //           this.sampleRegisterEditComponent.openFormEdit(updatedSample,serviceData);
  //         } else {
  //           console.warn('SampleRegisterEditComponent instance is undefined');
  //         }
  //     },
  //     error: (err) => {
  //       console.error('Error fetching ServiceId:', err);
  //     }
  //   });
    // if (this.sampleRegisterEditComponent) {
    //   this.sampleRegisterEditComponent.openFormEdit(sample);
    // } else {
    //   console.warn('SampleRegisterEditComponent instance is undefined');
    // }
  // }

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

  // Delete Sample Register
  deleteForm(SampleRegisterId: number | null) {
    if (SampleRegisterId !== null) {
      this.SampleRegisterService.deleteSampleRegister(SampleRegisterId).subscribe({
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
      alert("Please provide valid data.");
    }
  }

  // Handle Status Change
  onSelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    const selectedValue = value === 'true' ? true : (value === 'false' ? false : null);
    this.applyForm1.get('selectedValue')?.setValue(selectedValue);
    console.log('Selected value:', selectedValue);
  }

  // Filter Logic
  searchApplication() {
    this.hasSearched = true; // Set flag when search is clicked

    const searchParams = {
      SampleRegisterId: this.applyForm1.value.homeSampleRegisterId || 0,
      
      MiddleName: this.applyForm1.value.homeMiddleName || '',
     
      isActive: this.applyForm1.value.selectedValue === null ? null : this.applyForm1.value.selectedValue === true ? true : false,

    };

    if (!searchParams.SampleRegisterId  &&!searchParams.MiddleName && searchParams.isActive === null) {
      this.fetchAllData();
    } else {
      this.fetchFilteredData(searchParams);
    }
  }

  // Fetch All Data
  fetchAllData() {
    this.SampleRegisterService.getSampleRegisters().subscribe({
      next: (data: SampleRegisterModel[]) => {
        // console.log(data);
        this.apiResponse = data;
        this.isTableVisible = true;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // Fetch Filtered Data
  fetchFilteredData(searchParams: { SampleRegisterId: number,MiddleName: string, isActive: boolean|null }) {
    this.SampleRegisterService.getSampleRegisterByIdOrName(searchParams).subscribe({
      next: (data: SampleRegisterModel[]) => {
        this.apiResponse = data;
        this.isTableVisible = true;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
