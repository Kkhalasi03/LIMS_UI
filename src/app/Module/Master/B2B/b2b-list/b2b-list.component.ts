import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SidenavBarComponent } from '../../../../sidenav-bar/sidenav-bar.component';
import { B2BModel } from '../../../../Model/b2-bmodel';
import { B2bService } from '../../../../Service/b2b.service';
import { B2bEditComponent } from '../b2b-edit/b2b-edit.component';

@Component({
  selector: 'app-b2b-list',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, SidenavBarComponent, B2bEditComponent],
  templateUrl: './b2b-list.component.html',
  styleUrl: './b2b-list.component.css'
})
export class B2bListComponent {
  username:string|null=null;
  isFormVisibleADD = false;
  isTableVisible = false;
  isFormVisible = false;
  showPopup = false;
  hasSearched = false; // New flag to check if search was performed
  popupMessage = '';
  homeB2BId: number | null = null; // Add this property
  homeB2BCode: string = ''; // Existing property
  homeB2BName: string = ''; // Existing property
  apiResponse: B2BModel[] = []; // List of B2Bs
  selectedValue: boolean | null = null; // For isActive filter

  modalData: B2BModel = {
    B2BId: 0,
    B2BCode: '',
    B2BName: '',
    isActive: true
  };

  B2BService = inject(B2bService);
constructor(private router:Router){}
  // Form for filtering data
  applyForm1 = new FormGroup({
    homeB2BId: new FormControl<number | null>(0),
    homeB2BCode: new FormControl<string>(''),
    homeB2BName: new FormControl<string>(''),
    selectedValue: new FormControl<boolean | null>(null)
  });

  @ViewChild('b2bEditComponent') b2bEditComponent!: B2bEditComponent;
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
  // Open Add Form
  openForm() {
    this.isFormVisibleADD = true;
    if (this.b2bEditComponent) {
      this.b2bEditComponent.openForm();
    } else {
      console.warn('B2BEditComponent instance is undefined');
    }
  }
  onLogout() {
    if (sessionStorage) {
      sessionStorage.clear(); // Clear all session data
    }
    this.router.navigate(['/login']); // Redirect to login page
  }
  // Open Edit Form
  openFormEdit(b2b: B2BModel) {
    this.modalData = { ...b2b }; // Set modal data
    this.isFormVisibleADD = true;
    if (this.b2bEditComponent) {
      this.b2bEditComponent.openFormEdit(b2b);
    } else {
      console.warn('B2BEditComponent instance is undefined');
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
    this.isFormVisible = false; // Hide the form
  }

  // Delete B2B
  deleteForm(B2BId: number | null) {
    if (B2BId !== null) {
      this.B2BService.deleteB2B(B2BId).subscribe({
        next: (response) => {
          this.popupMessage = response.message;
          this.showPopup = true;
        },
        error: (err) => {
          this.popupMessage = err.error.message || 'An error occurred.';
          this.showPopup = true;
        }
      });
    } else {
      alert("Please provide valid data");
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
    const searchParams: B2BModel = {
      B2BId: this.applyForm1.value.homeB2BId || 0,
      B2BCode: this.applyForm1.value.homeB2BCode || '',
      B2BName: this.applyForm1.value.homeB2BName || '',
      isActive: this.applyForm1.value.selectedValue === null ? null : this.applyForm1.value.selectedValue === true ? true : false
    };

    if (!searchParams.B2BId && !searchParams.B2BCode && !searchParams.B2BName && searchParams.isActive === null) {
      this.fetchAllData();
    } else {
      this.fetchFilteredData(searchParams);
    }
  }

  // Fetch All Data
  fetchAllData() {
    this.B2BService.getB2B().subscribe({
      next: (data: B2BModel[]) => {
        this.apiResponse = data;
        this.isTableVisible = true;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // Fetch Filtered Data
  fetchFilteredData(searchParams: B2BModel) {
    this.B2BService.getB2BByIdOrCode(searchParams).subscribe({
      next: (data: B2BModel[]) => {
        this.apiResponse = data;
        this.isTableVisible = true;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
