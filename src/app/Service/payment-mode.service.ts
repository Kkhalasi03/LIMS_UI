import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentModeModel } from '../Model/payment-mode-model';

@Injectable({
  providedIn: 'root'
})
export class PaymentModeService {

  constructor(private http:HttpClient) { }
    // Method to get all Payment Modes
    getPaymentMode(): Observable<any> {
      return this.http.get<any>('https://localhost:7139/api/PaymentMode/GetAllPaymentModes'); // Updated API URL
    }
  
    // Method to get a Payment Mode by PaymentModeId, PaymentModeName, or Status
    getPaymentModeByIdOrName(paymentMode: PaymentModeModel): Observable<any> {
      const body = JSON.stringify(paymentMode);
      console.log(body);
      return this.http.post('https://localhost:7139/api/PaymentMode/GetPaymentModeByIdOrName', body, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  
    // Method to add a new Payment Mode
    postPaymentMode(paymentMode: PaymentModeModel): Observable<any> {
      const body = JSON.stringify(paymentMode);  // Convert PaymentMode object to a JSON string
      console.log(body);  // Log the request payload for debugging
  
      // Send a POST request to the API with the request body
      return this.http.post('https://localhost:7139/api/PaymentMode/AddPaymentMode', body, {
        headers: { 'Content-Type': 'application/json' }  // Set content type to JSON
      });
    }
  
    // Method to edit a Payment Mode
    editPaymentMode(paymentMode: PaymentModeModel): Observable<any> {
      const body = JSON.stringify(paymentMode);
      console.log(body);
      return this.http.post('https://localhost:7139/api/PaymentMode/EditPaymentMode', body, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  
    // Method to delete a Payment Mode by PaymentModeId
    deletePaymentMode(PaymentModeId: number): Observable<any> {
      const body = JSON.stringify(PaymentModeId);  // Convert PaymentModeId to a JSON string
      console.log(body);
      
      // Send a POST request to delete the PaymentMode with the provided PaymentModeId
      return this.http.post('https://localhost:7139/api/PaymentMode/DeletePaymentMode', body, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  
    // Method for application-specific logic (example for debugging)
    searchPaymentMode(paymentMode: { PaymentModeId: number, PaymentModeName: string }) {
      console.log(paymentMode);
    }
}
