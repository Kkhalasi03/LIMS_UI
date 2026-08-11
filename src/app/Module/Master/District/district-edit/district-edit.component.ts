import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DistrictService } from '../../../../Service/district.service'; // Adjust import path to your district service
import { StateService } from '../../../../Service/state.service'; // Adjust import path to your state service

@Component({
  selector: 'app-district-edit',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './district-edit.component.html',
  styleUrls: ['./district-edit.component.css'],
})
export class DistrictEditComponent implements AfterViewInit {
  // Component properties
  isFormVisible = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  isEditMode: boolean = false; // Flag to toggle Add/Edit modes
  districtForm: FormGroup; // Reactive form group

  states: any[] = []; // List of states
  modalData: { DistrictId: number | null; DistrictName: string; StateId: number | null } = {
    DistrictId: null,
    DistrictName: '',
    StateId: null,
  };

  // Injecting the service to interact with the backend
  districtSer = inject(DistrictService);
  stateSer = inject(StateService);

  // Initialize form group with form controls
  constructor() {
    this.districtForm = new FormGroup({
      DistrictId: new FormControl(null),
      DistrictName: new FormControl('', []), // Add Validators here if needed
      StateId: new FormControl(null),
    });
  }

  ngAfterViewInit() {
    // Perform any after view initialization tasks
    this.fetchStates();
  }

  fetchStates(): void {
    this.stateSer.getStates().subscribe({
      next: (data) => {
        this.states = data;
      },
      error: (err) => {
        console.error('Error fetching states:', err);
      },
    });
  }

  openForm() {
    this.isEditMode = false;
    this.districtForm.reset(); // Reset form for a fresh Add
    this.districtForm.get('DistrictId')?.disable(); // Disable DistrictId field in Add mode
    this.isFormVisible = true;
  }

  openFormEdit(DistrictId: number, DistrictName: string, StateId: number) {
    this.isEditMode = true;
    this.districtForm.setValue({ DistrictId, DistrictName, StateId }); // Pre-fill the form with data
    this.districtForm.get('DistrictId')?.markAsPristine(); // Disable DistrictId field in Edit mode
    this.isFormVisible = true;
  }

  closeForm() {
    this.isFormVisible = false;
  }

  closePopup() {
    this.showPopup = false;
  }

  onAddsubmit() {
    const formData = this.districtForm.value;

    this.districtSer.postDistrict(formData).subscribe({
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
   * Submit the form to edit an existing district
   */
  onSubmit() {
    const formData = this.districtForm.value;
    console.log(formData);

    this.districtSer.editDistrict(formData).subscribe({
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
