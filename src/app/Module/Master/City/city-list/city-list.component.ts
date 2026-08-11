import { Component, inject, ViewChild } from '@angular/core';
import { CityEditComponent } from "../city-edit/city-edit.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import {  Router,RouterModule } from '@angular/router';
import { StateService } from '../../../../Service/state.service';
import { CityService } from '../../../../Service/city.service';
import { SidenavBarComponent } from '../../../../sidenav-bar/sidenav-bar.component';

@Component({
  selector: 'app-city-list',
  imports: [RouterModule, ReactiveFormsModule, FormsModule, CommonModule, CityEditComponent,SidenavBarComponent],
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.css'],
})
export class CityListComponent {
  username: string | null = null;// know the user
  isFormVisibleADD = false;
  isFormVisible= false;
  apiResponse: any;
  showPopup: boolean = false;
  popupMessage: string = '';
  isTableVisible = false;
  hasSearched = false; // New flag to check if search was performed
  selectedValue: boolean | null = null;
  cityId: number = 0;
  cityName: string = '';
  stateId: number = 0;
  districtId: number = 0;
  modalData: { CityId: number | null, CityName: string, StateId: number | null, DistrictId: number | null } = {
    CityId: null, CityName: '', StateId: null, DistrictId: null
  };

  // Injecting the service to interact with the backend
  cityser = inject(CityService); // Assuming you have methods like `getCities`, `getCityByIdOrName`, etc.
  states: any[] = [];
  districts: any[] = [];
constructor(private router: Router){}
  @ViewChild('cityEditComponent') cityEditComponent!: CityEditComponent;

  applyForm1 = new FormGroup({
    cityId: new FormControl(''),
    cityName: new FormControl(''),
    selectedValue: new FormControl(),
    stateId: new FormControl(null),
    districtId: new FormControl(null),
  });

  ngOnInit(): void {
    this.fetchStates();
    this.fetchDistricts();
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

  fetchStates(): void {
    this.cityser.getStates().subscribe((data) => {
      this.states = data;
    });
  }

  fetchDistricts(): void {
    this.cityser.getDistricts().subscribe((data) => {
      this.districts = data;
    });
  }

  getStateName(StateId: number): string {
    const state = this.states.find(s => s.StateId === StateId);
    return state ? state.StateName : 'Unknown';
  }

  getDistrictName(DistrictId: number): string {
    const district = this.districts.find(d => d.DistrictId === DistrictId);
    return district ? district.DistrictName : 'Unknown';
  }
  onLogout() {
    if (sessionStorage) {
      sessionStorage.clear(); // Clear all session data
    }
    this.router.navigate(['/login']); // Redirect to login page
  }
  openForm() {
    console.log("Opening city form...");
    this.isFormVisibleADD = true; // Show the form
    if (this.cityEditComponent) {
      this.cityEditComponent.openForm(); // Call the child component's method
    } else {
      console.warn('CityEditComponent instance is undefined');
    }
  }

  closeForm() {
    console.log("Closing city form...");
    this.isFormVisibleADD = false; // Hide the form
  }

  openFormEdit(CityId: number, CityName: string, StateId: number, DistrictId: number) {
    this.modalData = { CityId, CityName, StateId, DistrictId }; // Populate the modal with the selected row's data
    console.log(this.modalData + "Call OPEN FORM");
    this.isFormVisible = true; // Show the modal
    if (this.cityEditComponent) {
      this.cityEditComponent.openFormEdit(CityId, CityName, StateId, DistrictId); // Call the child component's method
    } else {
      console.log('CityEditComponent instance is undefined');
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
    this.cityId = 0;
    this.cityName = '';
    this.stateId = 0;
    this.districtId = 0;
    this.apiResponse = []; // Clear the table data
    this.isTableVisible = false; // Hide the table when clearing the form
    this.hasSearched=false;
  }

  searchApplication() {
    this.hasSearched=true;
    const cityId = Number(this.applyForm1.value.cityId) || 0; // Convert to number, default to 0 if invalid
    const cityName = this.applyForm1.value.cityName ?? ''; // Default to empty string if empty
    const selectedStatus = this.applyForm1.value.selectedValue;
    const stateId = this.applyForm1.value.stateId ?? 0; // Default to 0 if no state selected
    const districtId = this.applyForm1.value.districtId ?? 0; // Default to 0 if no district selected

    const searchParams = {
      CityId: cityId,
      CityName: cityName,
      StateId: stateId,
      DistrictId: districtId,
      isActive: selectedStatus,
    };

    console.log(searchParams);

    if (cityId === 0 && cityName === '' && stateId === 0 && districtId === 0 && selectedStatus === null) {
      this.fetchAllData();
    } else {
      this.fetchFilteredData(searchParams);
    }
  }

  fetchAllData() {
    this.cityser.getCities().subscribe({
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

  fetchFilteredData(searchParams: { CityId: number, CityName: string, StateId: number, DistrictId: number, isActive: boolean }) {
    console.log(searchParams);
    this.cityser.getCitiesByIdORName(searchParams).subscribe({
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

  deleteForm(CityId: number, CityName: string) {
    this.modalData = { CityId, CityName, StateId: null, DistrictId: null }; // Populate the modal with the selected row's data
    this.cityser.DeleteCity(CityId).subscribe({
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
