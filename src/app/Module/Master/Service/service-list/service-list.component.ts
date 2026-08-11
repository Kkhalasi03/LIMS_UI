import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StateEditComponent } from '../../State/state-edit/state-edit.component';
import { SidenavBarComponent } from '../../../../sidenav-bar/sidenav-bar.component';
import { SeviceMasterService } from '../../../../Service/sevice-master.service';
import { ServiceEditComponent } from '../service-edit/service-edit.component';
import { ServiceModel } from '../../../../Model/service-model';

@Component({
  selector: 'app-service-list',
  imports: [RouterModule, ReactiveFormsModule, FormsModule, CommonModule, SidenavBarComponent, ServiceEditComponent],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.css'
})
export class ServiceListComponent {
  username:string|null=null;
  isFormVisibleADD = false;
  isTableVisible = false;
  isFormVisible = false;
  showPopup = false;
  hasSearched = false; // New flag to check if search was performed
  popupMessage = '';
  homeServiceId: number | null = null;
  homeServiceCode: string = '';
  homeServiceName: string = '';
  apiResponse: ServiceModel[] = [];
  selectedValue: boolean | null = null;

  modalData: ServiceModel = {
    ServiceId: 0,
    ServiceCode: '',
    ServiceName: '',
    B2BAmount: 0,
    B2CAmount: 0,
    isActive: true
  };

  ServiceMasterService = inject(SeviceMasterService);
constructor(private router:Router){}
  applyForm1 = new FormGroup({
    homeServiceId: new FormControl<number | null>(0),
    homeServiceCode: new FormControl<string>(''),
    homeServiceName: new FormControl<string>(''),
    selectedValue: new FormControl<boolean | null>(null)
  });

  @ViewChild('serviceEditComponent') serviceEditComponent!: ServiceEditComponent;
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
  onSelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
     // Update the FormControl with boolean values, based on selected value
    const selectedValue = value === 'true' ? true : (value === 'false' ? false : null);
    this.applyForm1.get('selectedValue')?.setValue(selectedValue);
     console.log('Selected value:', selectedValue);
 }
  // Open Add Form
  openForm() {
    this.isFormVisibleADD = true;
    if (this.serviceEditComponent) {
      this.serviceEditComponent.openForm();
    } else {
      console.warn('ServiceMasterEditComponent instance is undefined');
    }
  }

  // Open Edit Form
  openFormEdit(serviceMaster: ServiceModel) {
    this.modalData = { ...serviceMaster }; // Set modal data
    this.isFormVisibleADD = true;
    if (this.serviceEditComponent) {
      this.serviceEditComponent.openFormEdit(serviceMaster);
    } else {
      console.warn('ServiceMasterEditComponent instance is undefined');
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
    this.hasSearched=false;
  }

  closeFormEdit() {
    this.isFormVisible = false;
    this.hasSearched=false;
  }

  // Delete ServiceMaster
  deleteForm(ServiceId: number | null) {
    if (ServiceId !== null) {
      this.ServiceMasterService.deleteServiceMaster(ServiceId).subscribe({
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

  // Filter Logic
  searchApplication() {
    this.hasSearched=true;
    const searchParams: ServiceModel = {
      ServiceId: this.applyForm1.value.homeServiceId || 0,
      ServiceCode: this.applyForm1.value.homeServiceCode || '',
      ServiceName: this.applyForm1.value.homeServiceName || '',
      B2BAmount:0,
      B2CAmount: 0,
      isActive: this.applyForm1.value.selectedValue === null ? null : this.applyForm1.value.selectedValue === true ? true : false
    };
    console.log(searchParams);

    if (!searchParams.ServiceId && !searchParams.ServiceCode && !searchParams.ServiceName && !searchParams.B2BAmount && !searchParams.B2CAmount && searchParams.isActive === null) {
      this.fetchAllData();
    } else {
      this.fetchFilteredData(searchParams);
    }
  }

  // Fetch All Data
  fetchAllData() {
    this.ServiceMasterService.getServiceMasters().subscribe({
      next: (data: ServiceModel[]) => {
        this.apiResponse = data;
        this.isTableVisible = true;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // Fetch Filtered Data
  fetchFilteredData(searchParams: ServiceModel) {
    this.ServiceMasterService.getServiceMasterByIdOrCode(searchParams).subscribe({
      next: (data: ServiceModel[]) => {
        this.apiResponse = data;
        this.isTableVisible = true;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
