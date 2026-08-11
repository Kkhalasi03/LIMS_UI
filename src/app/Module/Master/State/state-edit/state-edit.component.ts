import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { StateService } from '../../../../Service/state.service';

@Component({
  selector: 'app-state-edit',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './state-edit.component.html',
  styleUrls: ['./state-edit.component.css'],
})
export class StateEditComponent implements AfterViewInit {
  // Component properties
  isFormVisible = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  isEditMode: boolean = false; // Flag to toggle Add/Edit modes
  stateForm: FormGroup; // Reactive form group

  countries: any[] = []; // List of countries
  modalData: { StateId: number | null; StateCode: string; StateName: string; CountryId: number | null } = {
    StateId: null,
    StateCode: '',
    StateName: '',
    CountryId: null,
  };

  // Injecting the service to interact with the backend
  stateSer = inject(StateService);

  // Initialize form group with form controls
  constructor() {
    this.stateForm = new FormGroup({
      StateId: new FormControl(null),
      StateCode: new FormControl('', []), // Add Validators here if needed
      StateName: new FormControl('', []),
      CountryId: new FormControl(null),
    });
  }

  ngAfterViewInit() {
    // Perform any after view initialization tasks
    this.fetchCountries();
  }

  fetchCountries(): void {
    this.stateSer.getcountries().subscribe({
      next: (data) => {
        this.countries = data;
      },
      error: (err) => {
        console.error('Error fetching countries:', err);
      },
    });
  }

  openForm() {
    this.isEditMode = false;
    this.stateForm.reset(); // Reset form for a fresh Add
    this.stateForm.get('StateId')?.disable(); // Disable StateId field in Add mode
    this.isFormVisible = true;
  }
  openFormEdit(StateId: number, StateCode: string, StateName: string, CountryId: number) {
    console.log('Populating Edit Form with:', { StateId, StateCode, StateName, CountryId });
  
    this.isEditMode = true;
    this.stateForm.setValue({
      StateId: StateId,
      StateCode: StateCode,
      StateName: StateName,
      CountryId: CountryId,
    });
  
    this.stateForm.get('StateId')?.disable(); // Disable StateId for editing
    this.isFormVisible = true; // Show the form
  }
  
  closeForm() {
    this.isFormVisible = false;
  }
  closePopup() {
    this.showPopup = false;
  }

  onAddsubmit() {
    const formData = this.stateForm.value;

    this.stateSer.poststate(formData).subscribe({
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
      },
    });
  }

  /**
   * Submit the form to edit an existing state
   */
  onSubmit() {
    const formData = this.stateForm.value;
    console.log(formData);

    this.stateSer.EditState(formData).subscribe({
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
      },
    });
  }
}
