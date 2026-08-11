import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CityService } from '../../../../Service/city.service';
import { CityListComponent } from '../city-list/city-list.component';

@Component({
  selector: 'app-city-edit',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.css']
})
export class CityEditComponent implements AfterViewInit {
  // Component properties
  isFormVisible = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  isEditMode: boolean = false; // Flag to toggle Add/Edit modes
  isTableVisible:boolean=false;
  cityForm: FormGroup; // Reactive form group
  states: any[]=[];
  districts:any[]=[];
  // Injecting the service to interact with the backend
  Cityser = inject(CityService);

  // Initialize form group with form controls
  constructor() {
    this.cityForm = new FormGroup({
      CityId: new FormControl(null),
      CityName: new FormControl('', [/* Add Validators Here */]),
      DistrictId: new FormControl(null), // New field for DistrictId
      StateId: new FormControl(null), // New field for StateId
    });
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit() {
    this.fetchStates();   // Fetch the states
    this.fetchDistricts();  // Fetch the districts
  }
  
  fetchStates() {
    this.Cityser.getStates().subscribe({
        next: (response: any[]) => {
            console.log('States API Response:', response); // Log the response
            this.states = response;
        },
        error: (err) => console.error('Error fetching states:', err),
    });
  }
  
  fetchDistricts() {
    this.Cityser.getDistricts().subscribe({
        next: (response: any[]) => {
            console.log('Districts API Response:', response); // Log the response
            this.districts = response;
        },
        error: (err) => console.error('Error fetching districts:', err),
    });
  }

 
  // Open the form in Add mode
  openForm() {
    this.isEditMode = false;
    this.cityForm.reset(); // Reset form for a fresh Add
    this.cityForm.get('CityId')?.disable(); // Disable CityId field in Add mode
    this.isFormVisible = true;
  }

  // Open the form in Edit mode and populate it with existing city data
  openFormEdit(cityId: number, cityName: string, districtId: number, stateId: number){
    this.cityForm.get('CityId')?.markAsPristine();  // Optionally mark as pristine

    this.isEditMode = true;
    this.cityForm.setValue({
      CityId: cityId,
      CityName: cityName,
      DistrictId: districtId, // Pre-fill the DistrictId
      StateId: stateId, // Pre-fill the StateId
    });

    this.isFormVisible = true;
  }

  // Close the form modal
  closeForm() {
    this.isFormVisible = false;
  }
  // Close the popup modal
  closePopup() {
    this.showPopup = false;
  
  }

  // Submit the form to add a new city
  onAddsubmit() {
    const formData = this.cityForm.value;

    this.Cityser.postCity(formData).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.isFormVisible = false; // Close form modal
        this.popupMessage = response.message;
        this.showPopup = true; // Show success popup
      },
      error: (err) => {
        console.error('Error:', err);
        this.isFormVisible = false;
        this.popupMessage = err.error.message || 'An error occurred.';
        this.showPopup = true; // Show error popup
      }
    });
  }

  // Submit the form to edit an existing city
  onSubmit() {
    const formData = this.cityForm.value;
    console.log(formData);

    this.Cityser.editCity(formData).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.isFormVisible = false; // Close form modal
        this.popupMessage = response.message;
        this.showPopup = true; // Show success popup
      },
      error: (err) => {
        console.error('Error:', err);
        this.isFormVisible = false;
        this.popupMessage = err.error.message || 'An error occurred.';
        this.showPopup = true; // Show error popup
      }
    });
  }
}
      