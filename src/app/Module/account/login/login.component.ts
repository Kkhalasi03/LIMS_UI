import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';  // <-- Add this import
import { LoginService } from '../../../Service/login.service';
@Component({
  selector: 'app-login',
  imports: [RouterModule,FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  Loginser = inject(LoginService);
  loginForm: FormGroup;
  errorMessage: string = ''; // Add an error message variable

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
    this.loginForm = new FormGroup({
      UserName: new FormControl('', []),
      Password: new FormControl('', []),
      rememberMe: new FormControl(false)
    });
  }
  ngOnInit() {
    // if (isPlatformBrowser(this.platformId)) {
    //   const savedLoginData = sessionStorage.getItem('loginData');
    //   if (savedLoginData) {
    //     const parsedData = JSON.parse(savedLoginData);
    //     this.loginForm.patchValue({
    //       UserName: parsedData.UserName,
    //       Password: parsedData.Password
    //     });
    //   }
    // }
    // Ensure we are running in the browser
    if (isPlatformBrowser(this.platformId)) {
      const savedLoginData = localStorage.getItem('loginData');
      if (savedLoginData) {
        const parsedData = JSON.parse(savedLoginData);
        // Auto-fill the Password based on the UserName
        this.loginForm.get('UserName')?.valueChanges.subscribe((userName) => {
          // Find the matching UserName in localStorage
          const user = parsedData.find((entry: { UserName: string }) => entry.UserName === userName);
    
          if (user) {
            this.loginForm.patchValue({
              UserName:user.UserName,
              Password: user.Password // Auto-fill Password based on the matched UserName
            });
          }
        });
      }
    }
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;

      if (formData.rememberMe && isPlatformBrowser(this.platformId)) {
        sessionStorage.setItem('loginData', JSON.stringify({
          UserName: formData.UserName,
          Password: formData.Password
        }));
      }
      //  If "Remember Me" is checked, store the credentials in localStorage
      if (formData.rememberMe) {
        // Retrieve the existing login data (if any)
        const existingData = localStorage.getItem('loginData');
        let loginDataArray = existingData ? JSON.parse(existingData) : [];

        // Check if loginDataArray is an array
        if (!Array.isArray(loginDataArray)) {
          loginDataArray = [];  // If it's not an array, initialize it as an empty array
        }

        // Append new login data to the array
        loginDataArray.push({
          UserName: formData.UserName,
          Password: formData.Password,
          timestamp: new Date().toISOString()  // Store timestamp of the login
        });
        // Save the updated array back to localStorage
        localStorage.setItem('loginData', JSON.stringify(loginDataArray));
      }
      console.log('Login Form Submitted:', formData);
      this.Loginser.GetUser(formData).subscribe({
        next: (response) => {
          console.log(response);
          if (response && response.success) {
            if (isPlatformBrowser(this.platformId)) {
              let userNameToStore = '';
              try {
                if (response.UserName) {
                  if (response.UserName.startsWith('{')) {
                    const parsedUser = JSON.parse(response.UserName);
                    userNameToStore = parsedUser.UserName;
                  } else {
                    userNameToStore = response.UserName;
                  }
                  sessionStorage.setItem('UserName', userNameToStore);
                  localStorage.setItem('authToken', response.UserId);
                  localStorage.setItem('Menus',response.Menus)
                }
              } catch (error) {
                console.error('Error parsing UserName:', error);
              }
            }
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = response.message || 'Login failed. Please provide correct data.';
          }
        },
        error: (err) => {
          this.errorMessage = 'An error occurred. Please try again.';
          console.error('Error:', err);
        }
      });
    } else {
      this.errorMessage = 'Please fill the form correctly.';
    }
  }

  // Clear form fields
  onClear(): void {
    this.loginForm.reset();
    this.errorMessage = ''; // Clear error message
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('loginData');
      sessionStorage.removeItem('loginData');
    }
  }
}
