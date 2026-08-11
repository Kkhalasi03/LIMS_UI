import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SidenavBarComponent } from '../../../../sidenav-bar/sidenav-bar.component';
import { RegisterEditComponent } from '../register-edit/register-edit.component';
import { RegisterModel } from '../../../../Model/register-model';
import { RegisterService } from '../../../../Service/register.service';

@Component({
  selector: 'app-register-list',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, SidenavBarComponent,RegisterEditComponent],
  templateUrl: './register-list.component.html',
  styleUrl: './register-list.component.css'
})
export class RegisterListComponent implements AfterViewInit {
  username: string | null = null;
  isTableVisible = false;
  showPopup = false;
  popupMessage = '';
  hasSearched = false;
  apiResponse: RegisterModel[] = [];  // List of sample registers
  selectedValue: boolean | null = null;
  isFormVisibleADD = false;
  isFormVisible = false;
  userId: number | null = null;
  userName: string = '';
  userType: string = '';
  @ViewChild('registerEditComponent') registerEditComponent!: RegisterEditComponent;

  modalData: RegisterModel = {
    UserId: 0,
    FullName: '',
    UserName: '',
    Password: '',
    EmailId: '',
    MobileNo: '',
    BirthDay: '',
    Gender: '',
    isActive: true,
    UserType: '',
    SignatureFile: {} as File, //Placeholder to satisfy type, but not a real file
    Signature: null
  };

  UserMasterService = inject(RegisterService);

  constructor(private router: Router) {}

  userForm = new FormGroup({
    userId: new FormControl<number | null>(null),
    userName: new FormControl<string>(''),
    userType: new FormControl<string>(''),
    selectedValue: new FormControl<boolean | null>(null)
  });

  ngAfterViewInit() {
    const savedLoginData = sessionStorage.getItem('UserName');
    if (savedLoginData) {
      this.username = savedLoginData;
    } // Delay form visibility and access to the registerEditComponent after view initialization
    setTimeout(() => {
      if (this.registerEditComponent) {
        console.log('registerEditComponent is available');
      }
    });

  }

  openForm() {
    this.isFormVisibleADD = true;
    if (this.registerEditComponent) {
      this.registerEditComponent.openForm();
    } else {
      console.warn('registerEditComponent instance is undefined');
    }
  }

  openFormEdit(user: RegisterModel) {
    this.modalData = { ...user };
    this.isFormVisibleADD = true;
    if (this.registerEditComponent) {
      this.registerEditComponent.openFormEdit(user);
    } else {
      console.warn('registerEditComponent instance is undefined');
    }
  }

  closeForm() {
    this.isFormVisibleADD = false;
  }
  closeFormEdit() {
    this.isFormVisible= false; // Hide the form
  }
  closePopup() {
    this.showPopup = false;
    this.fetchAllData();
  }

  clearUserForm() {
    this.userForm.reset();
    this.userId = null;
    this.userName = '';
    this.userType = '';
    this.selectedValue = null;
    this.apiResponse = [];
    this.isTableVisible = false;
    this.hasSearched = false;
  }

  deleteUser(UserId: number | null) {
    if (UserId !== null) {
      this.UserMasterService.deleteUser(UserId).subscribe({
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
      alert("Please provide valid data.");
    }
  }
  onLogout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  onSelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    const selectedValue = value === 'true' ? true : (value === 'false' ? false : null);
    this.userForm.get('selectedValue')?.setValue(selectedValue);
  }

  searchUser() {
    this.hasSearched = true;
    const searchParams = {
      UserId: this.userForm.value.userId || 0,
      UserName: this.userForm.value.userName || '',
      UserType: this.userForm.value.userType || '',
      isActive: this.userForm.value.selectedValue === null ? null : this.userForm.value.selectedValue === true ? true : false,
    };

    if (!searchParams.UserId && !searchParams.UserName && !searchParams.UserType && searchParams.isActive === null) {
      this.fetchAllData();
    } else {
      this.fetchFilteredData(searchParams);
    }
  }

  fetchAllData() {
    this.UserMasterService.getUsers().subscribe({
      next: (data: RegisterModel[]) => {
        this.apiResponse = data;
        this.isTableVisible = true;
      },
      error: (err) => console.error(err)
    });
  }

  fetchFilteredData(searchParams: { UserId: number; UserName: string; UserType: string; isActive: boolean | null }) {
    this.UserMasterService.getUsersByIdOrName(searchParams).subscribe({
      next: (data: RegisterModel[]) => {
        this.apiResponse = data;
        this.isTableVisible = true;
      },
      error: (err) => console.error(err)
    });
  }

  editUser(user: RegisterModel) {
    this.openFormEdit(user);
  }
}
  // username: string | null = null;
  // isTableVisible = false;
  // showPopup = false;
  // popupMessage = '';
  // hasSearched = false;
  // apiResponse: RegisterModel[] = [];  // List of sample registers
  // selectedValue: boolean | null = null;
  // isFormVisibleADD = false;
  // isFormVisible = false;
  // userId: number | null = null;
  // userName: string = '';
  // userType: string = '';
  // @ViewChild('userMasterEditComponent') registerEditComponent!: RegisterEditComponent;

  // modalData: RegisterModel = {
  //   UserId: 0,
  //   FullName: '',
  //   UserName: '',
  //   Password: '',
  //   EmailId: '',
  //   MobileNo: '',
  //   BirthDay: '',
  //   Gender: '',
  //   isActive: true,
  //   UserType: '',
  //   SignatureFile: null,
  //   Signature: null
  // };

  // UserMasterService = inject(RegisterService);

  // constructor(private router: Router) {}

  // userForm = new FormGroup({
  //   userId: new FormControl<number | null>(null),
  //   userName: new FormControl<string>(''),
  //   userType: new FormControl<string>(''),
  //   selectedValue: new FormControl<boolean | null>(null)
  // });


  // ngAfterViewInit() {
  //   const savedLoginData = sessionStorage.getItem('UserName');
  //   if (savedLoginData) {
  //     this.username = savedLoginData;
  //   }
  // }

  // onLogout() {
  //   sessionStorage.clear();
  //   this.router.navigate(['/login']);
  // }

  // openForm() {debugger
  //   this.isFormVisibleADD = true;
  //   if (this.registerEditComponent) {
  //     this.registerEditComponent.openForm();
  //   } else {
  //     console.warn('registerEditComponent instance is undefined');
  //   }
  //   // this.registerEditComponent?.openForm();
  // }
  

  // openFormEdit(user: RegisterModel) {debugger
  //   this.modalData = { ...user };
  //   this.isFormVisibleADD = true;
  //   this.registerEditComponent?.openFormEdit(user);
  // }

  // closeForm() {
  //   this.isFormVisibleADD = false;
  // }

  // closePopup() {
  //   this.showPopup = false;
  //   this.fetchAllData();
  // }

  // clearUserForm() {
  //   this.userForm.reset();
  //   this.userId = null;
  //   this.userName = '';
  //   this.userType = '';
  //   this.selectedValue = null;
  //   this.apiResponse = [];
  //   this.isTableVisible = false;
  //   this.hasSearched = false;
  // }

  // deleteUser(UserId: number | null) {
  //   if (UserId !== null) {
  //     this.UserMasterService.deleteUser(UserId).subscribe({
  //       next: (response) => {
  //         this.popupMessage = response.message;
  //         this.showPopup = true;
  //       },
  //       error: (err) => {
  //         this.popupMessage = err.error.message || 'An error occurred.';
  //         this.showPopup = true;
  //       }
  //     });
  //   }else {
  //     alert("Please provide valid data.");
  //   }
  // }
 

  // onSelected(event: Event): void {
  //   const target = event.target as HTMLSelectElement;
  //   const value = target.value;
  //   const selectedValue = value === 'true' ? true : (value === 'false' ? false : null);
  //   this.userForm.get('selectedValue')?.setValue(selectedValue);
  // }

  // searchUser() {
  //   this.hasSearched = true;
  //   const searchParams = {
  //     UserId: this.userForm.value.userId || 0,
  //     UserName: this.userForm.value.userName || '',
  //     UserType: this.userForm.value.userType || '',
  //     isActive: this.userForm.value.selectedValue === null ? null : this.userForm.value.selectedValue === true ? true : false,
  //   };

  //   if (!searchParams.UserId && !searchParams.UserName && !searchParams.UserType && searchParams.isActive === null) {
  //     this.fetchAllData();
  //   } else {
  //     this.fetchFilteredData(searchParams);
  //   }
  // }

  // fetchAllData() {
  //   this.UserMasterService.getUsers().subscribe({
  //     next: (data: RegisterModel[]) => {
  //       // console.log(data);
  //       this.apiResponse = data;
  //       this.isTableVisible = true;
  //     },
  //     error: (err) => console.error(err)
  //   });
  // }

  // fetchFilteredData(searchParams: { UserId: number; UserName: string; UserType: string; isActive: boolean | null }) {
  //   this.UserMasterService.getUsersByIdOrName(searchParams).subscribe({
  //     next: (data: RegisterModel[]) => {
  //       // console.log(data);
  //       this.apiResponse = data;
  //       this.isTableVisible = true;
  //     },
  //     error: (err) => console.error(err)
  //   });
  // }

  // editUser(user: RegisterModel) {
  //   this.openFormEdit(user);
  // }
// }
