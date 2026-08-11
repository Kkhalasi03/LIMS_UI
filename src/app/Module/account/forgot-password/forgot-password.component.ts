import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ForgotpasswordService } from '../../../Service/forgotpassword.service';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterModule,FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  otpForm: FormGroup;
  ResetPasswordForm: FormGroup;
  resendOtpMessage: string = ''; // Message for OTP resend status
  showForgotPasswordForm: boolean = true;
  showOtpForm: boolean = false;
  showResetPasswordForm: boolean = false;
  emailId: string = ''; // Store email for reuse
  errorMessage: string = ''; // Error message variable

  resetpwdser = inject(ForgotpasswordService);

  constructor(private router: Router) {
    this.forgotPasswordForm = new FormGroup({
      to: new FormControl('', [])
    });

    this.otpForm = new FormGroup({
      EnteredOTP: new FormControl('', [])
    });

    this.ResetPasswordForm = new FormGroup({
      EmailId: new FormControl<string>(''),
      Password: new FormControl<string>(''),
      ConfirmPassword: new FormControl<string>(''),
      EnteredOTP: new FormControl<string>('') // Store OTP in ResetPasswordForm
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const formData = this.forgotPasswordForm.value;
      this.emailId = formData.to; // Store email for reuse

      this.resetpwdser.SendMail(formData).subscribe({
        next: (response) => {
          console.log('Response:', response);
          this.errorMessage = ''; // Clear error message on success
          this.showForgotPasswordForm = false;
          this.showOtpForm = true;
        },
        error: (err) => {
          console.error('Error:', err);
          this.errorMessage = err.error.message || 'Failed to send reset link. Please try again.';
        }
      });
    }
  }

  // onOTPSubmit(): void {
  //   if (this.otpForm.valid) {
  //     const otpValue = this.otpForm.value.EnteredOTP;
  //     this.ResetPasswordForm.patchValue({ EnteredOTP: otpValue });

  //     this.showOtpForm = false;
  //     this.showResetPasswordForm = true;
  //   }
  // }
  onOTPSubmit(): void {
    if (this.otpForm.valid) {debugger
      const formData = new FormData();
      formData.append('EmailId', this.emailId); // Use stored email
      formData.append('EnteredOTP', this.otpForm.get('EnteredOTP')?.value);

      this.resetpwdser.VerifyOTP(formData).subscribe(
        (response: any) => {
          console.log('API Response:', response);
          if (response.message === 'OTP verification successful.') {
            console.log('OTP verification successful.');
            this.showOtpForm = false;
            this.showResetPasswordForm = true;      
            // Set EmailId in Reset Password form
            this.ResetPasswordForm.patchValue({
              EmailId: this.emailId// Use stored email
            }); 
       } else {
            console.log('OTP verification failed.');
            this.errorMessage = 'Invalid OTP. Please try again.';
          }
        },
        (error) => {
          console.error('Error verifying OTP:', error);
          this.errorMessage = 'Invalid OTP. Please try again.';
        }
      );
    }
  }

  onResetSubmit(): void {
    const formData = new FormData();
    // formData.append('UserName', this.ResetPasswordForm.get('UserName')?.value);
    formData.append('Password', this.ResetPasswordForm.get('Password')?.value);
    formData.append('EmailId', this.emailId); // Use stored email

    this.resetpwdser.EdtPassword(formData).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.errorMessage = ''; // Clear error message on success
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage = err.error.message || 'Failed to reset password. Please try again.';
      }
    });
  }
  resendOtp(): void {

    const formData = this.forgotPasswordForm.value;
    console.log('Resend OTP clicked and OTP sent to:', formData);

  this.resetpwdser.SendMail(formData).subscribe({
    next: (response) => {
      console.log('Response:', response);
      this.errorMessage = ''; // Clear previous errors
      this.showForgotPasswordForm = false;
      this.showOtpForm = true;
      this.resendOtpMessage = "A new OTP has been sent to your email."; // Success message
    },
    error: (err) => {
      console.error('Error:', err);
      this.resendOtpMessage = "Failed to resend OTP. Please try again."; // Error message
    }
  });

  }

  onResetClear(): void {
    this.ResetPasswordForm.reset();
    this.errorMessage = ''; // Clear error message
  }
//   forgotPasswordForm: FormGroup;
//   otpForm: FormGroup;
//   showForgotPasswordForm: boolean = true; // Initially show Forgot Password form
//   showOtpForm: boolean = false;
//   ResetPasswordForm:FormGroup;
//   showResetPasswordForm:boolean=false;
//   resetpwdser = inject(ForgotpasswordService);
  
//   constructor( private router: Router) 
//   {
//      this.forgotPasswordForm = new FormGroup({
//       to:new FormControl('',[])
//     })
//     this.otpForm = new FormGroup({
//       EnteredOTP:new FormControl('',[])
//     });
//     this.ResetPasswordForm = new FormGroup({
//       UserName: new FormControl<string>(''),
//       Password: new FormControl<string>(''),
//       ConfirmPassword: new FormControl<string>(''),
//       EnteredOTP: new FormControl<string>('')  // Store OTP in ResetPasswordForm

//     });
//   }
//   onSubmit(): void {
//     if (this.forgotPasswordForm.valid) {
//       // const email = this.forgotPasswordForm.value;
//       const formData=this.forgotPasswordForm.value;
//       // Replace with your actual API call
//       console.log('Sending reset link to:', formData);
//       this.showForgotPasswordForm = false;
//       this.showOtpForm = true;
//       this.resetpwdser.SendMail(formData).subscribe({
//         next: (response) => {
//           console.log('Response:', response);
//           this.showForgotPasswordForm = false;
//           this.showOtpForm = true;
//         },
//         error: (err) => {
//           console.error('Error:', err);
//         }
//       });
//     }
//   }
//   onOTPSubmit(): void {
//     if (this.otpForm.valid) {
//       const otpValue = this.otpForm.value.EnteredOTP;
//       console.log('Entered OTP:', otpValue);
//        // Add OTP to Reset Password Form
//        this.ResetPasswordForm.patchValue({
//         EnteredOTP: otpValue,  // Store OTP entered by user in ResetPasswordForm
//       });
//       this.showOtpForm=false;
//       this.showResetPasswordForm=true;
//       // Call your API to verify the OTP here
//     }
//   }

//   resendOtp(): void {

//     // const email = this.forgotPasswordForm.value;
//     const formData=this.forgotPasswordForm.value;
//     // Replace with your actual API call
//     console.log('Sending reset link to:', formData);
//     this.showForgotPasswordForm = false;
//     this.showOtpForm = true;
//     this.resetpwdser.SendMail(formData).subscribe({
//       next: (response) => {
//         console.log('Response:', response);
        
//       },
//       error: (err) => {
//         console.error('Error:', err);
//       }
//     });
//     console.log('Resend OTP clicked and OTP send To:',formData);
//     // Call your API to resend the OTP here
//   }

//   onResetSubmit() {
//     // const formData = this.ResetPasswordForm.value;
//     // Remove ConfirmPassword field before sending to API
//   //  delete formData.ConfirmPassword;
//   const formData=new  FormData();
//   formData.append('UserName', this.ResetPasswordForm.get('UserName')?.value);
//   formData.append('Password', this.ResetPasswordForm.get('Password')?.value);
//   formData.append('EmailId', this.forgotPasswordForm.get('to')?.value);
//   formData.append('EnteredOTP',this.ResetPasswordForm.get('EnteredOTP')?.value);
//   formData.forEach((value, key) => {
//     console.log(`${key}: ${value}`);
//   });
//   this.resetpwdser.EdtPassword(formData).subscribe({
//     next: (response) => {
//       console.log('Response:', response);
//       this.router.navigate(['/login']);

//     },
//     error: (err) => {
//       console.error('Error:', err);
//     }
//   });
    
//   }

//   onResetClear() {
//    this.ResetPasswordForm.reset();
//   }
}
