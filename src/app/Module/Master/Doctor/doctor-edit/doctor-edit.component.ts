import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DoctorService } from '../../../../Service/doctor.service';
import { DoctorModel } from '../../../../Model/doctor-model';

@Component({
  selector: 'app-doctor-edit',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './doctor-edit.component.html',
  styleUrl: './doctor-edit.component.css'
})
export class DoctorEditComponent {
  isFormVisible = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  isEditMode: boolean = false;

  // Form group for doctor data
  doctorForm: FormGroup;

  // Injecting the service
  DoctorService = inject(DoctorService);

  constructor() {
    // Initialize form group
    this.doctorForm = new FormGroup({
      DoctorId: new FormControl<number>(0), // Nullable for Add mode
      DoctorCode: new FormControl<string>('', { nonNullable: true }),
      DoctorName: new FormControl<string>('', { nonNullable: true }),
      MobileNo: new FormControl<string>('', { nonNullable: true }), // Added MobileNo
      EmailId: new FormControl<string>('', { nonNullable: true }), // Added EmailId
      isActive: new FormControl<boolean>(true, { nonNullable: true }) // Default active
    });
  }

  ngAfterViewInit() {
    // Perform any initialization tasks after view load
  }

  // Open form in Add mode
  openForm() {
    this.isEditMode = false;
    this.doctorForm.reset({
      DoctorCode: '',
      DoctorName: '',
      MobileNo: '',
      EmailId: '',
      isActive: true
    });
    this.doctorForm.reset();
    // Explicitly set DoctorId to 0, since it's not included in the reset above
    this.doctorForm.get('DoctorId')?.setValue(0);
    this.doctorForm.get('DoctorId')?.disable(); // Disable DoctorId in Add mode
    this.isFormVisible = true;
  }

  // Open form in Edit mode
  openFormEdit(doctor: DoctorModel) {
    this.isEditMode = true;
    this.doctorForm.enable(); // Enable all fields
    this.doctorForm.setValue({
      DoctorId: doctor.DoctorId ?? 0,
      DoctorCode: doctor.DoctorCode,
      DoctorName: doctor.DoctorName,
      MobileNo: doctor.MobileNo,
      EmailId: doctor.EmailId,
      isActive: doctor.isActive
    });
    this.doctorForm.get('DoctorId')?.disable(); // Disable DoctorId in Edit mode
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
    const formData = this.doctorForm.getRawValue(); // Get all values, including disabled ones
    console.log(formData);
    this.DoctorService.postDoctor(formData).subscribe({
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
    const formData: DoctorModel = this.doctorForm.getRawValue();

    this.DoctorService.editDoctor(formData).subscribe({
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
