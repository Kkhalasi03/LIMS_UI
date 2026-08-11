import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BranchService } from '../../../../Service/branch.service';
import { BranchModel } from '../../../../Model/branch-model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-branch-edit',
  imports: [RouterModule,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './branch-edit.component.html',
  styleUrl: './branch-edit.component.css'
})
export class BranchEditComponent {
  isFormVisible = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  isEditMode: boolean = false;

  // Form group for branch data
  branchForm: FormGroup;

  // Injecting the service
  BranchService = inject(BranchService);

  constructor() {
    // Initialize form group
    this.branchForm = new FormGroup({
      BranchId: new FormControl<number>(0), // Nullable for Add mode
      BranchCode: new FormControl<string>('', { nonNullable: true }),
      BranchName: new FormControl<string>('', { nonNullable: true }),
      isActive: new FormControl<boolean>(true, { nonNullable: true }) // Default active
    });
  }

  ngAfterViewInit() {
    // Perform any initialization tasks after view load
  }

  // Open form in Add mode
  openForm() {
    this.isEditMode = false;
    this.branchForm.reset({
      BranchCode: '',
      BranchName: '',
      isActive: true
    });
    this.branchForm.reset();
    // Explicitly set BranchId to 0, since it's not included in the reset above
  this.branchForm.get('BranchId')?.setValue(0);
    this.branchForm.get('BranchId')?.disable(); // Disable BranchId in Add mode
    this.isFormVisible = true;
  }

  // Open form in Edit mode
  openFormEdit(branch: BranchModel) {
    this.isEditMode = true;
    this.branchForm.enable(); // Enable all fields
    this.branchForm.setValue({
      BranchId: branch.BranchId ?? 0,
      BranchCode: branch.BranchCode,
      BranchName: branch.BranchName,
      isActive: branch.isActive
    });
    this.branchForm.get('BranchId')?.disable(); // Disable BranchId in Edit mode
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
    const formData = this.branchForm.getRawValue(); // Get all values, including disabled ones
    console.log(formData);
    this.BranchService.postBranch(formData).subscribe({
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
    const formData: BranchModel = this.branchForm.getRawValue();

    this.BranchService.editBranch(formData).subscribe({
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
