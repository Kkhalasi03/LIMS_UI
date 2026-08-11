import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BranchModel } from '../../../../Model/branch-model';
import { BranchService } from '../../../../Service/branch.service';
import { BranchEditComponent } from '../branch-edit/branch-edit.component';
import { SidenavBarComponent } from "../../../../sidenav-bar/sidenav-bar.component";

@Component({
  selector: 'app-branch-list',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, SidenavBarComponent, BranchEditComponent],
  templateUrl: './branch-list.component.html',
  styleUrl: './branch-list.component.css'
})
export class BranchListComponent {
  username: string | null = null;// know the user
  isFormVisibleADD = false;
  isTableVisible = false;
  isFormVisible=false;
  showPopup = false;
  hasSearched = false; // New flag to check if search was performed
  popupMessage = '';
  homeBranchId: number | null = null; // Add this property
  homeBranchCode: string = ''; // Existing property
  homeBranchName: string = ''; // Existing property
  apiResponse: BranchModel[] = []; // List of branches
  selectedValue: boolean | null = null; // For isActive filter
  

  modalData: BranchModel= {
    BranchId: 0,
    BranchCode: '',
    BranchName: '',
    isActive: true
  };
  
constructor(private router: Router){}

  BranchService = inject(BranchService);

  // Form for filtering data
  applyForm1 = new FormGroup({
    homeBranchId: new FormControl<number | null>(0),
    homeBranchCode: new FormControl<string>(''),
    homeBranchName: new FormControl<string>(''),
    selectedValue: new FormControl<boolean | null>(null)
  });

  @ViewChild('branchEditComponent') branchEditComponent!: BranchEditComponent;
  ngOnInit(): void {

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
  // Open Add Form
  openForm() {
    this.isFormVisibleADD = true;
    if (this.branchEditComponent) {
      this.branchEditComponent.openForm();
    } else {
      console.warn('BranchEditComponent instance is undefined');
    }
  }

  // Open Edit Form
  openFormEdit(branch: BranchModel) {
    this.modalData = { ...branch }; // Set modal data
    this.isFormVisibleADD = true;
    if (this.branchEditComponent) {
      this.branchEditComponent.openFormEdit(branch);
    } else {
      console.warn('BranchEditComponent instance is undefined');
    }
  }

  // Close Add/Edit Form
  closeForm() {
    this.isFormVisibleADD = false;
  }

  // Close Popup
  closePopup() {
    this.showPopup = false;
    this.fetchAllData();
  }

  // Clear Filter Form
  clearForm() {
    this.applyForm1.reset();
    this.apiResponse = [];
    this.isTableVisible = false;
    this.hasSearched=false;
  }
  closeFormEdit() {
    this.isFormVisible= false; // Hide the form
  }

  // Delete Branch
  deleteForm(BranchId:number|null) {
    if(BranchId!==null)
    {
      this.BranchService.deleteBranch(BranchId).subscribe({
        next: (response) => {
          this.popupMessage = response.message;
          this.showPopup = true;
        },
        error: (err) => {
          this.popupMessage = err.error.message || 'An error occurred.';
          this.showPopup = true;
        }
      });
    }
    else
    {
      alert("please Provide Valid Data");
    }
    
   
    
  }
  onSelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
     // Update the FormControl with boolean values, based on selected value
    const selectedValue = value === 'true' ? true : (value === 'false' ? false : null);
    this.applyForm1.get('selectedValue')?.setValue(selectedValue);
     console.log('Selected value:', selectedValue);
 }
  // Filter Logic
  searchApplication() {
    this.hasSearched=true;
    const searchParams: BranchModel = {
      BranchId: this.applyForm1.value.homeBranchId || 0,
      BranchCode: this.applyForm1.value.homeBranchCode || '',
      BranchName: this.applyForm1.value.homeBranchName || '',
      isActive: this.applyForm1.value.selectedValue === null ? null : this.applyForm1.value.selectedValue === true ? true : false
    };

    if (!searchParams.BranchId && !searchParams.BranchCode && !searchParams.BranchName && searchParams.isActive === null) {
      this.fetchAllData();
    } 
    else {
      this.fetchFilteredData(searchParams);
    }
  }

  // Fetch All Data
  fetchAllData() {
    this.BranchService.getBranches().subscribe({
      next: (data: BranchModel[]) => {
        this.apiResponse = data;
        this.isTableVisible = true;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // Fetch Filtered Data
  fetchFilteredData(searchParams: BranchModel) {
    this.BranchService.getBranchByIdOrCode(searchParams).subscribe({
      next: (data: BranchModel[]) => {
        this.apiResponse = data;
        this.isTableVisible = true;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
