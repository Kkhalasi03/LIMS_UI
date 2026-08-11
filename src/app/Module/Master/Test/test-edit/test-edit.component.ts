import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TestServiceService } from '../../../../Service/test-service.service';
import { TestModel } from '../../../../Model/test-model';

@Component({
  selector: 'app-test-edit',
  imports: [RouterModule,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './test-edit.component.html',
  styleUrl: './test-edit.component.css'
})
export class TestEditComponent {
  isFormVisible = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  isEditMode: boolean = false;

  // Form group for TestMaster data
  testMasterForm: FormGroup;

  // Injecting the service
  TestMasterService = inject(TestServiceService);

  constructor() {
    // Initialize form group with additional fields
    this.testMasterForm = new FormGroup({
      TestId: new FormControl<number>(0),
      TestCode: new FormControl<string>('', { nonNullable: true }),
      TestName: new FormControl<string>('', { nonNullable: true }),
      ReferenceValue: new FormControl<string>('', { nonNullable: true }),
      Unit: new FormControl<string>('', { nonNullable: true }),
      isActive: new FormControl<boolean>(true, { nonNullable: true })
    });
  }

  ngAfterViewInit() {
    // Perform any initialization tasks after view load
  }

  // Open form in Add mode
  openForm() {
    this.isEditMode = false;
    this.testMasterForm.reset({
      TestCode: '',
      TestName: '',
      ReferenceValue: '',
      Unit: '',
      isActive: true
    });
    this.testMasterForm.get('TestId')?.setValue(0);
    this.testMasterForm.get('TestId')?.disable(); // Disable TestId in Add mode
    this.isFormVisible = true;
  }

  // Open form in Edit mode
  openFormEdit(testMaster: TestModel) {
    this.isEditMode = true;
    this.testMasterForm.enable(); // Enable all fields

    this.testMasterForm.setValue({
      TestId: testMaster.TestId ?? 0,
      TestCode: testMaster.TestCode,
      TestName: testMaster.TestName,
      ReferenceValue: testMaster.ReferenceValue,
      Unit: testMaster.Unit,
      isActive: testMaster.isActive
    });

    this.testMasterForm.get('TestId')?.disable(); // Disable TestId in Edit mode
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
    const formData = this.testMasterForm.getRawValue(); // Get all values, including disabled ones
    console.log(formData);
    this.TestMasterService.addTestMaster(formData).subscribe({
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
    const formData: TestModel = this.testMasterForm.getRawValue();

    this.TestMasterService.editTestMaster(formData).subscribe({
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