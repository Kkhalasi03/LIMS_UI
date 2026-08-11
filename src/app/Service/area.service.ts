import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private data: any;
  https = inject(HttpClient);

  // Method to get all cities
  getCities(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/City/GetAllCity');
  }

  constructor(private http: HttpClient) {}
  getAreas(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/Area/GetAllAreas/');
  }
  getAreasByIdOrName(area: {AreaId: number | null;AreaName: string;isActive: boolean | null; }): Observable<any> {
    const body = JSON.stringify(area);
    console.log('Searching Areas with filters:', body);
    return this.http.post('https://localhost:7139/api/Area/GetAreaByIdOrName/', body, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Method to add a new area
  postArea(area: {AreaId: number | null;AreaName: string;CityId: number | null;Pincode: string;IsActive: boolean;}): Observable<any> {
    const body = JSON.stringify(area);
    console.log('Adding Area:', body);
    return this.http.post('https://localhost:7139/api/Area/AddArea/', body, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Method to edit an existing area
  editArea(area: {AreaId: number;AreaName: string;CityId: number | null;Pincode: string;IsActive: boolean;}): Observable<any> {
    const body = JSON.stringify(area);
    console.log('Editing Area:', body);
    return this.http.post('https://localhost:7139/api/Area/EditArea/', body, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Method to toggle the IsActive status of an area (logical delete)
  deleteArea(AreaId: number): Observable<any> {
    const body = JSON.stringify(AreaId);
    console.log('Toggling Area Status:', body);
    return this.http.post('https://localhost:7139/api/Area/DeleteArea', body, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
