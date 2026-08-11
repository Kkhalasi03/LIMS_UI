import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SidenavBarComponent } from '../../../../sidenav-bar/sidenav-bar.component';
import { DoctorEditComponent } from '../doctor-edit/doctor-edit.component';
import { DoctorModel } from '../../../../Model/doctor-model';
import { DoctorService } from '../../../../Service/doctor.service';

@Component({
  selector: 'app-doctor-list',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, SidenavBarComponent, DoctorEditComponent],
  templateUrl: './doctor-list.component.html',
  styleUrl: './doctor-list.component.css'
})
export class DoctorListComponent {
  username:string|null=null;
  isFormVisibleADD = false;
  isTableVisible = false;
  isFormVisible = false;
  showPopup = false;
  hasSearched = false; // New flag to check if search was performed
  popupMessage = '';
  homeDoctorId: number | null = null; // Add this property
  homeDoctorCode: string = ''; // Existing property
  homeDoctorName: string = ''; // Existing property
  apiResponse: DoctorModel[] = []; // List of doctors
  selectedValue: boolean | null = null; // For isActive filter
  
  modalData: DoctorModel = {
    DoctorId: 0,
    DoctorCode: '',
    DoctorName: '',
    MobileNo: '',
    EmailId: '',
    isActive: true
  };

  DoctorService = inject(DoctorService);
constructor(private router:Router){}
  // Form for filtering data
  applyForm1 = new FormGroup({
    homeDoctorId: new FormControl<number | null>(0),
    homeDoctorCode: new FormControl<string>(''),
    homeDoctorName: new FormControl<string>(''),
    selectedValue: new FormControl<boolean | null>(null)
  });

  @ViewChild('doctorEditComponent') doctorEditComponent!: DoctorEditComponent;
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
    if (this.doctorEditComponent) {
      this.doctorEditComponent.openForm();
    } else {
      console.warn('DoctorEditComponent instance is undefined');
    }
  }

  // Open Edit Form
  openFormEdit(doctor: DoctorModel) {
    this.modalData = { ...doctor }; // Set modal data
    this.isFormVisibleADD = true;
    if (this.doctorEditComponent) {
      this.doctorEditComponent.openFormEdit(doctor);
    } else {
      console.warn('DoctorEditComponent instance is undefined');
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
    this.isFormVisible = false; // Hide the form
    this.hasSearched = false; // Reset search state

  }

  // Delete Doctor
  deleteForm(DoctorId: number | null) {
    if (DoctorId !== null) {
      this.DoctorService.deleteDoctor(DoctorId).subscribe({
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
    this.hasSearched=true;
    const searchParams: DoctorModel = {
      DoctorId: this.applyForm1.value.homeDoctorId || 0,
      DoctorCode: this.applyForm1.value.homeDoctorCode || '',
      DoctorName: this.applyForm1.value.homeDoctorName || '',
      isActive: this.applyForm1.value.selectedValue === null ? null : this.applyForm1.value.selectedValue === true ? true : false,
      MobileNo: '', // Add filter for MobileNo if needed
      EmailId: ''  // Add filter for EmailId if needed
    };

    if (!searchParams.DoctorId && !searchParams.DoctorCode && !searchParams.DoctorName && searchParams.isActive === null) {
      this.fetchAllData();
    } else {
      this.fetchFilteredData(searchParams);
    }
  }

  // Fetch All Data
  fetchAllData() {
    this.DoctorService.getDoctors().subscribe({
      next: (data: DoctorModel[]) => {
        this.apiResponse = data;
        this.isTableVisible = true;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // Fetch Filtered Data
  fetchFilteredData(searchParams: DoctorModel) {
    this.DoctorService.getDoctorByIdOrCode(searchParams).subscribe({
      next: (data: DoctorModel[]) => {
        this.apiResponse = data;
        this.isTableVisible = true;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
