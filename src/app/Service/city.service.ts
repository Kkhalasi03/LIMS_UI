import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private data: any;
  https = inject(HttpClient);
  
  constructor(private http: HttpClient) {}

  // --- Methods for Districts ---

  getDistricts(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/District/GetAllDistrict/');
  }
  getStates(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/State/GetAllStates');
  }

  

  // Method to get all cities
  getCities(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/City/GetAllCity');
  }

  // Method to search cities by filters: CityId, CityName, DistrictId, StateId
  getCitiesByIdORName(city: { CityId: number | null, CityName: string, isActive: boolean}): Observable<any> {
    const body = JSON.stringify(city);
    console.log('Searching Cities with filters:', body);
    return this.http.post('https://localhost:7139/api/City/GetCityByIdORNAme/', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method to add a new city
  postCity(city: { CityId: number | null, CityName: string, DistrictId: number | null, StateId: number | null }): Observable<any> {
    const body = JSON.stringify(city);
    console.log('Adding City:', body);
    return this.http.post('https://localhost:7139/api/City/AddCity/', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method to edit an existing city
  editCity(city: { CityId: number | null, CityName: string, DistrictId: number | null, StateId: number | null }): Observable<any> {
    const body = JSON.stringify(city);
    console.log('Editing City:', body);
    return this.http.post('https://localhost:7139/api/City/EdtCity/', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method to delete a city by CityId
  DeleteCity(CityId: number): Observable<any> {
    const body = JSON.stringify(CityId);
    console.log('Deleting City:', body);
    return this.http.post('https://localhost:7139/api/City/DeleteCity', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
