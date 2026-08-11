import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DoctorModel } from '../Model/doctor-model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http: HttpClient) {}

  // Method to get all Doctors
  getDoctors(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/Doctor/GetAllDoctors');
  }

  // Method to get a Doctor by DoctorId, DoctorCode, or Status
  getDoctorByIdOrCode(Doctor: DoctorModel): Observable<any> {
    const body = JSON.stringify(Doctor);
    console.log(body);
    return this.http.post('https://localhost:7139/api/Doctor/GetDoctorByIdOrCode', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method to add a new doctor
  postDoctor(Doctor: DoctorModel): Observable<any> {
    const body = JSON.stringify(Doctor); // Convert the Doctor object to a JSON string
    console.log(body); // Log the request payload for debugging

    // Send a POST request to the API with the request body
    return this.http.post('https://localhost:7139/api/Doctor/AddDoctor', body, {
      headers: { 'Content-Type': 'application/json' } // Set content type to JSON
    });
  }

  // Method to edit an existing doctor
  editDoctor(Doctor: DoctorModel): Observable<any> {
    const body = JSON.stringify(Doctor);
    console.log(body);
    return this.http.post('https://localhost:7139/api/Doctor/EditDoctor', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method to delete a doctor by DoctorId
  deleteDoctor(DoctorId: number): Observable<any> {
    const body = JSON.stringify(DoctorId); // Convert DoctorId to a JSON string
    console.log(body);
    
    // Send a POST request to delete the doctor with the provided DoctorId
    return this.http.post('https://localhost:7139/api/Doctor/DeleteDoctor', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method for application-specific logic (example for debugging)
  searchApplication(Doctor: { DoctorId: number, DoctorCode: string, DoctorName: string, isActive: boolean }) {
    console.log(Doctor);
  }
}
