import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterService } from '../../../Service/register.service';
import { response } from 'express';

@Component({
  selector: 'app-register',
  imports: [RouterModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registrationForm: FormGroup;
  registerser = inject(RegisterService);

  constructor( private router: Router) {
    // Initialize the registrationForm without FormBuilder
    this.registrationForm = new FormGroup({
      // UserId: new FormControl(null), // Assuming it's auto-generated or hidden/readonly
      FullName: new FormControl('', []),
      UserName: new FormControl('', []),
      Password: new FormControl('', []),
      ConfirmPassword: new FormControl('', []),
      EmailId: new FormControl('', []),
      MobileNo: new FormControl('',[]),
      BirthDay: new FormControl('', []),
      Gender: new FormControl('male', []),
    });
  }

  // Check if Password and Confirm Password match
  passwordsMatch(): boolean {
    const password = this.registrationForm.get('Password')?.value;
    const confirmPassword = this.registrationForm.get('ConfirmPassword')?.value;
    return password === confirmPassword;
  }

  // Submit function
  onSubmit() {debugger
    const formData = this.registrationForm.value;
    if (this.registrationForm.valid && this.passwordsMatch()) {
      console.log(this.registrationForm.value);
      if (formData.BirthDay) {
        const birthDayDate = new Date(formData.BirthDay); // Parse the string into a Date object
        formData.BirthDay = birthDayDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
      }

      // Remove ConfirmPassword field before sending to API
      delete formData.ConfirmPassword;

      // Make sure the registerser service is injected properly and call the postUser method
      this.registerser.postUser(formData).subscribe({
        next:(response)=>{
          console.log('Response:', response);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error:', err);
          alert('Registration Error Because of Failure');
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }

  // Reset the form
  onReset() {
    this.registrationForm.reset();
  }
}
