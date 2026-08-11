import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RegisterService } from '../../../../Service/register.service';
import { RegisterModel } from '../../../../Model/register-model';
import { MenuService } from '../../../../Service/menu.service';
import { UserMenuRightsService } from '../../../../Service/user-menu-rights.service';
import { UserMenurigthsModel } from '../../../../Model/user-menurigths-model';

@Component({
  selector: 'app-register-edit',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register-edit.component.html',
  styleUrl: './register-edit.component.css'
})
export class RegisterEditComponent {
  activeTab: string = 'General';
  isFormVisible = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  isEditMode: boolean = false;
  signatureFile: File | null = null;
  signatureInvalid: boolean = false;
  menuRights: any[] = [];
  selectedUserId: number | null = null;

  RegistrationService = inject(RegisterService);
  menuService=inject(MenuService);
  usermenuService=inject(UserMenuRightsService);

  registrationForm: FormGroup = new FormGroup({
    UserId: new FormControl<number>({ value: 0, disabled: true }),
    FullName: new FormControl<string>(''),
    UserName: new FormControl<string>(''),
    BirthDay: new FormControl<string>(''),
    Gender: new FormControl<string>('Male'),
    EmailId: new FormControl<string>(''),
    MobileNo: new FormControl<string>(''),
    UserType: new FormControl<string>(''),
    Signature: new FormControl<File | null>(null)
  });

  openForm() {
    this.isEditMode = false;
    this.activeTab = 'General'; // Always reset to General tab
    this.registrationForm.reset({
      UserId: 0,
      FullName: '',
      UserName: '',
      BirthDay: '',
      Gender: 'Male',
      EmailId: '',
      MobileNo: '',
      UserType: '',
      Signature: null
    });
    this.signatureFile = null;
    this.signatureInvalid = false;
    this.isFormVisible = true;
  }

  openFormEdit(registration: RegisterModel) {
    this.isEditMode = true;
    this.registrationForm.patchValue({
      UserId: registration.UserId ?? 0,
      FullName: registration.FullName,
      UserName: registration.UserName,
      BirthDay: registration.BirthDay,
      Gender: registration.Gender,
      EmailId: registration.EmailId,
      MobileNo: registration.MobileNo,
      UserType: registration.UserType,
      Signature: null
    });
    this.signatureFile = null;
    this.signatureInvalid = false;
    this.isFormVisible = true;
  }

  closeForm() {
    this.isFormVisible = false;
  }

  closePopup() {
    this.showPopup = false;
  }
  closeModal(){
    this.isFormVisible = false;

  }
  onSignatureChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.type.startsWith('image/')) {
        this.signatureFile = file;
        this.signatureInvalid = false;
        // this.registrationForm.patchValue({ Signature: file });
         // Log the file details to the console
         console.log('Selected file:', file);
         console.log('File name:', file.name);
         console.log('File type:', file.type);
         console.log('File size:', file.size);
         console.log(this.signatureFile);
      } else {
        this.signatureFile = null;
        this.signatureInvalid = true;
        this.registrationForm.patchValue({ Signature: null });
      }
    }
  }
  onFileSelected(event: any) {
    this.signatureFile = event.target.files[0];
  }
  
  onAddSubmit() {
    debugger;
    // if (this.registrationForm.invalid || this.passwordMismatch()) {
    //   this.registrationForm.markAllAsTouched();
    //   return;
    // }
  
    // Check if SignatureFile is set
    if (!this.signatureFile) {
      console.log('No signature file selected');
      this.popupMessage = 'Please select a signature file.';
      this.showPopup = true;
      return;
    }
  
    // Prepare FormData to send file + other fields
    const formData = new FormData();
    formData.append('UserId', '0'); // For Add, UserId is 0
    formData.append('FullName', this.registrationForm.get('FullName')?.value);
    formData.append('UserName', this.registrationForm.get('UserName')?.value);
    formData.append('BirthDay', this.registrationForm.get('BirthDay')?.value);
    formData.append('Gender', this.registrationForm.get('Gender')?.value);
    formData.append('EmailId', this.registrationForm.get('EmailId')?.value);
    formData.append('MobileNo', this.registrationForm.get('MobileNo')?.value);
    formData.append('Password', ''); // or 'null' string depending on backend expectations
    // formData.append('Password', this.registrationForm.get('Password')?.value);
    formData.append('isActive', 'true');
    formData.append('UserType', this.registrationForm.get('UserType')?.value);
  
    // Add SignatureFile to FormData
    formData.append('SignatureFile', this.signatureFile, this.signatureFile.name);
  
    // Optional: log FormData content
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  
    this.RegistrationService.postUser(formData).subscribe({
      next: (response) => {
        this.popupMessage = response.message;
        this.showPopup = true;
        this.isFormVisible = false;
      },
      error: (err) => {
        this.popupMessage = err.error.message || 'An error occurred.';
        this.showPopup = true;
      }
    });
  }
  
  onSubmit() {debugger
    const formData = new FormData();

    formData.append('UserId', this.registrationForm.get('UserId')?.value);
    formData.append('FullName', this.registrationForm.get('FullName')?.value);
    formData.append('UserName', this.registrationForm.get('UserName')?.value);
    formData.append('BirthDay', this.registrationForm.get('BirthDay')?.value);
    formData.append('Gender', this.registrationForm.get('Gender')?.value);
    formData.append('EmailId', this.registrationForm.get('EmailId')?.value);
    formData.append('MobileNo', this.registrationForm.get('MobileNo')?.value);
    formData.append('Password', ''); // or 'null' string depending on backend expectations
    // formData.append('Password', this.registrationForm.get('Password')?.value);
    formData.append('isActive', 'true');
    formData.append('UserType', this.registrationForm.get('UserType')?.value);
  
    if (this.signatureFile) {
      formData.append('SignatureFile', this.signatureFile, this.signatureFile.name);
    } else {
      formData.append('SignatureFile', '');
    }
  
    //  Correct way to check the contents of FormData
    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    this.RegistrationService.editUser(formData).subscribe(
      response => {
        this.popupMessage = response.message;
        this.showPopup = true;
        this.isFormVisible = false;
        console.log('User updated successfully!', response);
      },
      error => {
        this.popupMessage = error.message || 'An error occurred.';
        this.showPopup = true;
        console.error('Error updating user:', error);
      }
    );
  }
  // Load all user menu rights
  loadAllUserMenuRights(): void {
    this.usermenuService.getUserMenuRights().subscribe((data: any) => {
      this.menuRights = data;
    });
  }

  // Fetch user menu rights by UserId
  fetchUserMenuRights(): void {
    const userId = this.registrationForm.get('UserId')?.value;
    if (!userId) {
      console.error('UserId is missing');
      return;
    }
    
    this.usermenuService.getUserMenuRightsByUserId({ UserId: userId }).subscribe(
      (data) => {
        this.menuRights = data;
        console.log(this.menuRights);
      },
      (error) => {
        console.error('Error loading menu rights', error);
      }
    );
  }
  

  loadMenuRights() {
    if (this.menuRights.length === 0) { // Optional: Load only once
      this.menuService.getMenus().subscribe(
        (data) => {
          this.menuRights = data;  // Example structure: [{ MenuName: 'Dashboard', HasRight: true }, ...]
          console.log(this.menuRights);
        },
        (error) => {
          console.error('Error loading menu rights', error);
        }
      );
    }
  }


  // passwordMismatch() {
  //   return (
  //     this.registrationForm.get('Password')?.value !==
  //     this.registrationForm.get('ConfirmPassword')?.value
  //   );
  // }

  onReset() {
    this.registrationForm.reset({
      UserId: 0,
      FullName: '',
      UserName: '',
      BirthDay: '',
      Gender: 'Male',
      EmailId: '',
      MobileNo: '',
      UserType: '',
      Signature: null
    });
    this.signatureFile = null;
    this.signatureInvalid = false;
  }
  updateMenuRights() {
    if (!this.registrationForm.get('UserId')?.value) {
      console.error('UserId is missing');
      return;
    }
  
    const userMenuRights: UserMenurigthsModel = {
      UserId: this.registrationForm.get('UserId')?.value,
      MenuId: this.menuRights.map(menu => menu.MenuId),
      HasAccess: this.menuRights.map(menu => menu.HasAccess ? true : false) // Ensure boolean type

    };
  
    this.usermenuService.editUserMenuRight(userMenuRights).subscribe(
      response => {
        console.log('Menu rights updated successfully!', response);
        this.popupMessage = 'Menu rights updated successfully!';
        this.showPopup = true;
        this.isFormVisible = false;

      },
      error => {
        console.error('Error updating menu rights:', error);
        this.popupMessage = 'Failed to update menu rights.';
        this.showPopup = true;
        this.isFormVisible = false;

      }
    );
  }
  
}
