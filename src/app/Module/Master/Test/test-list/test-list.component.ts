import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TestEditComponent } from "../test-edit/test-edit.component";
import { TestModel } from '../../../../Model/test-model';
import { TestServiceService } from '../../../../Service/test-service.service';
import { SidenavBarComponent } from "../../../../sidenav-bar/sidenav-bar.component";

@Component({
  selector: 'app-test-list',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, TestEditComponent, SidenavBarComponent],
  templateUrl: './test-list.component.html',
  styleUrl: './test-list.component.css'
})
export class TestListComponent {
  username: string | null = null;
  isFormVisibleADD = false;
  isTableVisible = false;
  isFormVisible = false;
  showPopup = false;
  hasSearched = false;
  popupMessage = '';
  homeTestId: number | null = null;
  homeTestCode: string = '';
  homeTestName: string = '';
  apiResponse: TestModel[] = [];
  selectedValue: boolean | null = null;

  modalData: TestModel = {
    TestId: 0,
    TestCode: '',
    TestName: '',
    ReferenceValue: '',
    Unit: '',
    isActive: true
  };

  TestMasterService = inject(TestServiceService);

  constructor(private router: Router) {}

  applyForm1 = new FormGroup({
    homeTestId: new FormControl<number | null>(0),
    homeTestCode: new FormControl<string>(''),
    homeTestName: new FormControl<string>(''),
    selectedValue: new FormControl<boolean | null>(null)
  });

  @ViewChild('testMasterEditComponent') testMasterEditComponent!: TestEditComponent;

  ngOnInit(): void {
    const savedLoginData = sessionStorage.getItem('UserName');
    if (savedLoginData) {
      this.username = savedLoginData;
    }
  }

  openForm() {
    this.isFormVisibleADD = true;
    if (this.testMasterEditComponent) {
      this.testMasterEditComponent.openForm();
    }
  }

  onLogout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  openFormEdit(testMaster: TestModel) {
    this.modalData = { ...testMaster };
    this.isFormVisibleADD = true;
    if (this.testMasterEditComponent) {
      this.testMasterEditComponent.openFormEdit(testMaster);
    }
  }

  closeForm() {
    this.isFormVisibleADD = false;
  }

  closePopup() {
    this.showPopup = false;
    this.fetchAllData();
  }

  clearForm() {
    this.applyForm1.reset();
    this.apiResponse = [];
    this.isTableVisible = false;
    this.hasSearched = false;
  }

  closeFormEdit() {
    this.isFormVisible = false;
  }

  deleteForm(TestId: number | null) {
    if (TestId !== null) {
      this.TestMasterService.toggleTestMasterStatus(TestId).subscribe({
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
    const selectedValue = value === 'true' ? true : (value === 'false' ? false : null);
    this.applyForm1.get('selectedValue')?.setValue(selectedValue);
  }

  searchApplication() {
    this.hasSearched = true;
    const searchParams: TestModel = {
      TestId: this.applyForm1.value.homeTestId || 0,
      TestCode: this.applyForm1.value.homeTestCode || '',
      TestName: this.applyForm1.value.homeTestName || '',
      ReferenceValue: '',
      Unit: '',
      isActive: this.applyForm1.value.selectedValue === null ? null : this.applyForm1.value.selectedValue === true ? true : false
    };

    if (!searchParams.TestId && !searchParams.TestCode && !searchParams.TestName && searchParams.isActive === null) {
      this.fetchAllData();
    } else {
      this.fetchFilteredData(searchParams);
    }
  }

  fetchAllData() {
    this.TestMasterService.getTestMasters().subscribe({
      next: (data: TestModel[]) => {
        this.apiResponse = data;
        this.isTableVisible = true;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  fetchFilteredData(searchParams: TestModel) {
    this.TestMasterService.getTestMasterByIdOrCode(searchParams).subscribe({
      next: (data: TestModel[]) => {
        this.apiResponse = data;
        this.isTableVisible = true;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}