import { Component, inject, ViewChild } from '@angular/core';
import { StateEditComponent } from "../state-edit/state-edit.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule,NgForm, FormControl, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StateService } from '../../../../Service/state.service';
import { CityEditComponent } from "../../City/city-edit/city-edit.component";
import { SidenavBarComponent } from '../../../../sidenav-bar/sidenav-bar.component';

@Component({
  selector: 'app-state-list',
  imports: [RouterModule, ReactiveFormsModule, FormsModule, CommonModule, StateEditComponent,SidenavBarComponent],
  templateUrl: './state-list.component.html',
  styleUrl: './state-list.component.css'
})
export class StateListComponent {
  username:string|null=null;
  isFormVisibleADD = false;
  apiResponse: any;
  showPopup: boolean = false;
  popupMessage: string = '';
  isTableVisible=false;
  hasSearched = false; // New flag to check if search was performed
  selectedValue: boolean | null = null;
  stateId: number = 0;
  stateName: string = '';
  stateCode: string = '';
  homeStateId: number | null = null; // Allow null as the initial value
  homeStateName: string = '';
  homeCountryId: number | null = null; // For example, if you want to relate it to countries
  public countryadd:any;
  status!: string;
  errorMessage!: string;
  requestFinished=false;
  requestValid=false;
  isFormVisible = false;
  stateser = inject(StateService);  // Inject the StateService for API calls
  countries: any[] = [];
   @ViewChild('stateEditComponent') stateEditComponent!: StateEditComponent;
   modalData: { StateId: number | null, StateCode: string, StateName: string, CountryId: number | null } = { StateId: null, StateCode: '', StateName: '', CountryId: null };
  constructor(private router:Router){}
   applyForm1 = new FormGroup({
     homeStateId: new FormControl(''),
     homeStateName: new FormControl(''),
     selectedValue: new FormControl(),
   });
   ngAfterViewInit(): void {
    console.log('StateEditComponent initialized:', this.stateEditComponent);
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
   ngOnInit(): void {
    this.fetchCountries();
  }
  fetchCountries(): void {
    this.stateser.getcountries().subscribe((data) => {
      this.countries = data;
    });
  }
  getCountryName(CountryId:number):string{
    const country=this.countries.find(s=>s.CountryId===CountryId);
    return country?country.CountryName:'Unknown';
  }
  openForm()
  {
    console.log("Opening country form...");
    this.isFormVisibleADD = true; // Show the form
    if (this.stateEditComponent) {
      this.stateEditComponent.openForm(); // Call the child component's method
    } else {
      console.warn('CountryEditComponent instance is undefined');
    }
  }
  // Function to close the form
  closeForm() {
    console.log("Closing country form...");
    this.isFormVisibleADD = false; // Hide the form
  }
  openFormEdit(StateId: number, StateCode: string, StateName: string, CountryId: number) {
    this.modalData = { StateId, StateCode, StateName, CountryId };
    console.log('Edit Form Triggered with data:', this.modalData);
  
    this.isFormVisible = true;
  
    setTimeout(() => {
      if (this.stateEditComponent) {
        this.stateEditComponent.openFormEdit(StateId, StateCode, StateName, CountryId);
      } else {
        console.warn('StateEditComponent is not initialized.');
      }
    });
  }
  
  closeFormEdit() {
    this.isFormVisible= false; // Hide the form
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
    this.homeStateId = null;
    this.homeStateName = '';
    this.apiResponse = []; // Clear the table data
    this.isTableVisible = false; // Hide the table when clearing the form
    this.hasSearched=false;
  }
  searchApplication() {
    this.hasSearched=true;
    const stateId = Number(this.applyForm1.value.homeStateId) || 0; // Convert to number, default to 0 if invalid
    const stateName = this.applyForm1.value.homeStateName ?? ''; // Default to empty string if empty
    const selectedStatus = this.applyForm1.value.selectedValue;

    const searchParams = {
      StateId: stateId,
      StateName: stateName,
      isActive: selectedStatus,
    };
    console.log(searchParams);
    if (stateId === 0 && stateName===null  && selectedStatus === null) {
      this.fetchAllData();
    } else {
      this.fetchFilteredData(searchParams);
    }
  }

  fetchAllData() {
    this.stateser.getStates().subscribe({
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

  fetchFilteredData(searchParams: { StateId: number, StateName: string, isActive: boolean }) {
    console.log(searchParams);
    this.stateser.getStateByIdOrName(searchParams).subscribe({
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
  deleteForm(StateId: number, StateName: string) {
    this.modalData = { StateId, StateName, StateCode: '', CountryId: null }; // Populate the modal with the selected row's data
    this.stateser.DeleteState(StateId).subscribe({
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
