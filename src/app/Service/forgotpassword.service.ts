import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotpasswordService {

  constructor(private https:HttpClient) {  }
    // Method to send Mail
  SendMail(user: { to: string }): Observable<any> {
      const body = JSON.stringify(user);
      console.log(body);
      return this.https.post('https://localhost:7139/api/Email/SendEmail/', body, {
        headers: { 'Content-Type': 'application/json' }
      });
  }
  EdtPassword(user: FormData): Observable<any> {
    //  Just to check what is inside FormData
    console.log('Editing User Password:');
    user.forEach((value, key) => {
      console.log(key, value);
    });
     return this.https.post('https://localhost:7139/api/Email/UpdatePassword/', user);
 }
 VerifyOTP(user: FormData): Observable<any> {
  //  Just to check what is inside FormData
  console.log('Verify the OTP:');
  user.forEach((value, key) => {
    console.log(key, value);
  });
   return this.https.post('https://localhost:7139/api/Email/VerifyOTP/', user);
}
 
}
