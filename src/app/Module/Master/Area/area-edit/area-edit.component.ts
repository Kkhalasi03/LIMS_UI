import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AreaService } from '../../../../Service/area.service';

@Component({
  selector: 'app-area-edit',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './area-edit.component.html',
  styleUrl: './area-edit.component.css'
})
export class AreaEditComponent implements AfterViewInit{
  isFormVisible = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  isEditMode: boolean = false; // Flag to toggle Add/Edit modes
  areaForm: FormGroup; // Reactive form group
  cities: any[] = []; // Array to store cities

  // Injecting the service to interact with the backend
  areaSer = inject(AreaService);

  // Initialize form group with form controls
  constructor() {
    this.areaForm = new FormGroup({
      AreaId: new FormControl(null),
      AreaName: new FormControl('', [ ]),
      CityId: new FormControl(null, []),
      Pincode: new FormControl('', []),
      IsActive: new FormControl(true, []),
    });
  }

  ngAfterViewInit(): void {
    console.log('AreaEditComponent View Initialized');
  }

  ngOnInit() {
    this.fetchCities(); // Fetch the cities
  }

  fetchCities() {
    this.areaSer.getCities().subscribe({
      next: (response: any[]) => {
        console.log('Cities API Response:', response); // Log the response
        this.cities = response;
      },
      error: (err) => console.error('Error fetching cities:', err),
    });
  }

  // Open the form in Add mode
  openForm() {
    this.isEditMode = false;
    this.areaForm.reset(); // Reset form for a fresh Add
    this.areaForm.get('AreaId')?.disable(); // Disable AreaId field in Add mode
    this.isFormVisible = true;
  }

  // Open the form in Edit mode and populate it with existing area data
  openFormEdit(AreaId: number, AreaName: string, CityId: number, Pincode: string) {
    console.log('Populating Edit Form:', { AreaId, AreaName, CityId, Pincode }); // Debug log
  
    this.isEditMode = true;
    this.areaForm.setValue({
      AreaId: AreaId, // Ensure these keys match form control names
      AreaName: AreaName,
      CityId: CityId,
      Pincode: Pincode,
      IsActive: true, // Default value for IsActive
    });
  
    this.areaForm.get('AreaId')?.disable(); // Disable AreaId for editing
    this.isFormVisible = true; // Show the form
  }
  

  // Close the form modal
  closeForm() {
    this.isFormVisible = false;
  }

  // Close the popup modal
  closePopup() {
    this.showPopup = false;
  }

  // Submit the form to add a new area
  onAddSubmit() {
    const formData = this.areaForm.value;

    this.areaSer.postArea(formData).subscribe({
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

  // Submit the form to edit an existing area
  onSubmit() {
    const formData = this.areaForm.getRawValue();
    console.log('Submitting Edit:', formData);

    this.areaSer.editArea(formData).subscribe({
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
