import { Component, inject, ViewChild } from '@angular/core';
import { DistrictEditComponent } from "../district-edit/district-edit.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NgForm, FormControl, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DistrictService } from '../../../../Service/district.service'; // Updated to DistrictService
import { StateService } from '../../../../Service/state.service';
import { CityEditComponent } from "../../City/city-edit/city-edit.component";
import { SidenavBarComponent } from '../../../../sidenav-bar/sidenav-bar.component';

@Component({
  selector: 'app-district-list',
  imports: [RouterModule, ReactiveFormsModule, FormsModule, CommonModule, DistrictEditComponent,SidenavBarComponent],
  templateUrl: './district-list.component.html',
  styleUrl: './district-list.component.css'
})
export class DistrictListComponent {
  username:string|null=null;
  isFormVisibleADD = false;
  apiResponse: any;
  showPopup: boolean = false;
  popupMessage: string = '';
  isTableVisible = false;
  hasSearched = false; // New flag to check if search was performed
  selectedValue: boolean | null = null;
  districtId: number = 0;
  districtName: string = '';
  homeDistrictId: number | null = null; // Allow null as the initial value
  homeDistrictName: string = '';
  homeStateId: number | null = null; // For example, if you want to relate it to states
  public states: any[] = [];
  status!: string;
  errorMessage!: string;
  requestFinished = false;
  requestValid = false;
  isFormVisible = false;
  districtSer = inject(DistrictService);  // Inject the DistrictService for API calls
  stateSer = inject(StateService);  // Inject the StateService for fetching states
  modalData: { DistrictId: number | null, DistrictName: string, StateId: number | null } = { DistrictId: null, DistrictName: '', StateId: null };
  
  applyForm1 = new FormGroup({
    homeDistrictId: new FormControl(''),
    homeDistrictName: new FormControl(''),
    selectedValue: new FormControl(),
  });
constructor(private router:Router){}
  @ViewChild('districtEditComponent') districtEditComponent!: DistrictEditComponent;

  ngOnInit(): void {
    this.fetchStates(); // Fetch states when component initializes
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
  fetchStates(): void {
    this.stateSer.getStates().subscribe((data) => {
      this.states = data;
    });
  }
  
  getStateName(StateId: number): string {
    const state = this.states.find(s => s.StateId === StateId);
    return state ? state.StateName : 'Unknown';
  }

  openForm() {
    console.log("Opening district form...");
    this.isFormVisibleADD = true; // Show the form
    if (this.districtEditComponent) {
      this.districtEditComponent.openForm(); // Call the child component's method
    } else {
      console.warn('DistrictEditComponent instance is undefined');
    }
  }

  closeForm() {
    console.log("Closing district form...");
    this.isFormVisibleADD = false; // Hide the form
  }

  openFormEdit(DistrictId: number, DistrictName: string, StateId: number) {
    this.modalData = { DistrictId, DistrictName, StateId }; // Populate the modal with the selected row's data
    console.log(this.modalData + " Call OPEN FORM");
    this.isFormVisible = true; // Show the modal
    if (this.districtEditComponent) {
      this.districtEditComponent.openFormEdit(DistrictId, DistrictName, StateId); // Call the child component's method
    } else {
      console.log('DistrictEditComponent instance is undefined');
    }
  }

  closeFormEdit() {
    this.isFormVisible = false; // Hide the form
  }

  onSelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;

    // Update the FormControl with boolean values, based on selected value
    const selectedValue = value === 'true' ? true : (value === 'false' ? false : null);
    this.applyForm1.get('selectedValue')?.setValue(selectedValue);

    console.log('Selected value:', selectedValue);
  }

  clearForm() {
    this.applyForm1.reset(); // Resets all fields in the form group
    this.homeDistrictId = null;
    this.homeDistrictName = '';
    this.apiResponse = []; // Clear the table data
    this.isTableVisible = false; // Hide the table when clearing the form
    this.hasSearched = false; // Reset search state

  }

  searchApplication() {
    this.hasSearched=true;
    const districtId = Number(this.applyForm1.value.homeDistrictId) || 0; // Convert to number, default to 0 if invalid
    const districtName = this.applyForm1.value.homeDistrictName ?? ''; // Default to empty string if empty
    const selectedStatus = this.applyForm1.value.selectedValue;

    const searchParams = {
      DistrictId: districtId,
      DistrictName: districtName,
      isActive: selectedStatus,
    };

    console.log(searchParams);
    if (districtId === 0 && districtName === null && selectedStatus === null) {
      this.fetchAllData();
    } else {
      this.fetchFilteredData(searchParams);
    }
  }

  fetchAllData() {
    this.districtSer.getDistricts().subscribe({
      next: (data) => {
        console.log(data);
        this.isTableVisible = true;
        if (typeof data === 'string') {
          this.apiResponse = JSON.parse(data);
        } else {
          this.apiResponse = data;
        }
      },
      error: (err) => { console.log(err); }
    });
  }

  fetchFilteredData(searchParams: { DistrictId: number, DistrictName: string, isActive: boolean }) {
    console.log(searchParams);
    this.districtSer.getDistrictByIdOrName(searchParams).subscribe({
      next: (data) => {
        console.log(data);
        this.isTableVisible = true;
        if (typeof data === 'string') {
          this.apiResponse = JSON.parse(data);
        } else {
          this.apiResponse = data;
        }
      },
      error: (err) => { console.log(err); }
    });
  }

  deleteForm(DistrictId: number, DistrictName: string) {
    this.modalData = { DistrictId, DistrictName, StateId: null }; // Populate the modal with the selected row's data
    this.districtSer.DeleteDistrict(DistrictId).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.popupMessage = response.message; // Assign response message
        this.showPopup = true; // Show popup
      },
      error: (err) => {
        console.error('Error:', err);
        this.popupMessage = err.error.message || 'An error occurred.';
        this.showPopup = true; // Show popup even for errors
      }
    });
  }

  closePopup() {
    this.showPopup = false; // Close popup
    this.fetchAllData();
  }
}
