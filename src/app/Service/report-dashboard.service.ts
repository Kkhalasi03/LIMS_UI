import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportDashboardService {

 constructor(private http: HttpClient) {}


   // Method to get all Branches
  getBranches(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/Branch/GetAllBranches');
  }
 // Method to get all B2B records
  getB2B(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/B2B/GetAllB2B');
  }
    // Method to get a Sample Register by SampleRegisterId, SampleCode, or Status
  getSearchDetailsExcel(filter: any): Observable<any> {
    const body = JSON.stringify(filter);
    console.log(body);
    return this.http.post('https://localhost:7139/api/ReportDashboard/SearchDetails', filter, {
      responseType: 'blob',
      headers: new HttpHeaders({ 'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })    });
  }
  getSearchDetails(filter: any): Observable<any> {
    const body = JSON.stringify(filter);
    console.log(body);
    return this.http.post('https://localhost:7139/api/ReportDashboard/GetDeatilsById', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getSampleStatus(date: string): Observable<any> {
    const body = JSON.stringify(date);
    console.log(body);
    return this.http.post('https://localhost:7139/api/ReportDashboard/GetSampleStatusforDashboard', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

