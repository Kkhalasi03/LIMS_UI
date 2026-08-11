import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {
  private data: any;  
  https = inject(HttpClient);
  constructor(private http: HttpClient) {}


  // Method to get all Districts
  getDistricts(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/District/GetAllDistrict');
  }

  // Method to get a District by DistrictId, DistrictName, or Status
  getDistrictByIdOrName(District: { DistrictId: number, DistrictName: string, isActive: boolean }): Observable<any> {
    const body = JSON.stringify(District);
    console.log(body);
    return this.http.post('https://localhost:7139/api/District/GetDistrictByIdORName/', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method to add a new district
  postDistrict(District: { DistrictId: number, DistrictName: string, StateId: number }): Observable<any> {
    const body = JSON.stringify(District);
    console.log(body);
    return this.http.post('https://localhost:7139/api/District/AddDistrict/', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method to edit a district
  editDistrict(District: { DistrictId: number, DistrictName: string, StateId: number }): Observable<any> {
    const body = JSON.stringify(District);
    console.log(body);
    return this.https.post('https://localhost:7139/api/District/EdtDistrict/', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method to delete a district by DistrictId
  DeleteDistrict(DistrictId: number): Observable<any> {
    const body = JSON.stringify(DistrictId);
    console.log(body);
    return this.http.post('https://localhost:7139/api/District/DeleteDistrict', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Fetch countries for other purposes
  getStates(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/State/GetAllStates');
  }
}
