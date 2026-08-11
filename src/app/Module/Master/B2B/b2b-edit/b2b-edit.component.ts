import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { B2bService } from '../../../../Service/b2b.service';
import { B2BModel } from '../../../../Model/b2-bmodel';

@Component({
  selector: 'app-b2b-edit',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './b2b-edit.component.html',
  styleUrl: './b2b-edit.component.css'
})
export class B2bEditComponent {
  isFormVisible = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  isEditMode: boolean = false;

  // Form group for B2B data
  b2bForm: FormGroup;

  // Injecting the service
  B2BService = inject(B2bService);

  constructor() {
    // Initialize form group
    this.b2bForm = new FormGroup({
      B2BId: new FormControl<number>(0), // Nullable for Add mode
      B2BCode: new FormControl<string>('', { nonNullable: true }),
      B2BName: new FormControl<string>('', { nonNullable: true }),
      isActive: new FormControl<boolean>(true, { nonNullable: true }) // Default active
    });
  }

  ngAfterViewInit() {
    // Perform any initialization tasks after view load
  }

  // Open form in Add mode
  openForm() {
    this.isEditMode = false;
    this.b2bForm.reset({
      B2BCode: '',
      B2BName: '',
      isActive: true
    });
    this.b2bForm.reset();
    // Explicitly set B2BId to 0, since it's not included in the reset above
    this.b2bForm.get('B2BId')?.setValue(0);
    this.b2bForm.get('B2BId')?.disable(); // Disable B2BId in Add mode
    this.isFormVisible = true;
  }

  // Open form in Edit mode
  openFormEdit(b2b: B2BModel) {
    this.isEditMode = true;
    this.b2bForm.enable(); // Enable all fields
    this.b2bForm.setValue({
      B2BId: b2b.B2BId ?? 0,
      B2BCode: b2b.B2BCode,
      B2BName: b2b.B2BName,
      isActive: b2b.isActive
    });
    this.b2bForm.get('B2BId')?.disable(); // Disable B2BId in Edit mode
    this.isFormVisible = true;
  }

  // Close form
  closeForm() {
    this.isFormVisible = false;
  }

  // Close popup
  closePopup() {
    this.showPopup = false;
  }

  // Submit form in Add mode
  onAddSubmit() {
    const formData = this.b2bForm.getRawValue(); // Get all values, including disabled ones
    console.log(formData);
    this.B2BService.postB2B(formData).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.popupMessage = response.message;
        this.showPopup = true;
        this.isFormVisible = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.popupMessage = err.error.message || 'An error occurred.';
        this.showPopup = true;
      }
    });
  }

  // Submit form in Edit mode
  onSubmit() {
    const formData: B2BModel = this.b2bForm.getRawValue();

    this.B2BService.editB2B(formData).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.popupMessage = response.message;
        this.showPopup = true;
        this.isFormVisible = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.popupMessage = err.error.message || 'An error occurred.';
        this.showPopup = true;
      }
    });
  }
}
