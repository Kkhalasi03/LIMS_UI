import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { B2BModel } from '../Model/b2-bmodel';

@Injectable({
  providedIn: 'root'
})
export class B2bService {

  constructor(private http: HttpClient) {}

  // Method to get all B2B records
  getB2B(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/B2B/GetAllB2B');
  }

  // Method to get a B2B by B2BId, B2BCode, or Status
  getB2BByIdOrCode(B2B: B2BModel): Observable<any> {
    const body = JSON.stringify(B2B);
    console.log(body);
    return this.http.post('https://localhost:7139/api/B2B/GetB2BByIdOrCode', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method to add a new B2B
  postB2B(B2B: B2BModel): Observable<any> {
    const body = JSON.stringify(B2B); // Convert the B2B object to a JSON string
    console.log(body); // Log the request payload for debugging

    // Send a POST request to the API with the request body
    return this.http.post('https://localhost:7139/api/B2B/AddB2B', body, {
      headers: { 'Content-Type': 'application/json' } // Set content type to JSON
    });
  }

  // Method to edit an existing B2B
  editB2B(B2B: B2BModel): Observable<any> {
    const body = JSON.stringify(B2B);
    console.log(body);
    return this.http.post('https://localhost:7139/api/B2B/EditB2B', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method to delete a B2B by B2BId
  deleteB2B(B2BId: number): Observable<any> {
    const body = JSON.stringify(B2BId); // Convert B2BId to a JSON string
    console.log(body);
    
    // Send a POST request to delete the B2B with the provided B2BId
    return this.http.post('https://localhost:7139/api/B2B/DeleteB2B', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method for application-specific logic (example for debugging)
  searchApplication(B2B: { B2BId: number, B2BCode: string, B2BName: string, isActive: boolean }) {
    console.log(B2B);
  }
}
