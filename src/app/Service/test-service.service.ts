import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TestModel } from '../Model/test-model';

@Injectable({
  providedIn: 'root'
})
export class TestServiceService {

  constructor(private http: HttpClient) {}

  // Method to get all TestMaster records
  getTestMasters(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/Test/GetAllTest');
  }

  // Method to get a TestMaster by TestId, TestCode, or Status
  getTestMasterByIdOrCode(testMaster: TestModel): Observable<any> {
    const body = JSON.stringify(testMaster);
    console.log(body);
    return this.http.post('https://localhost:7139/api/Test/GetTestByIdORName', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method to add a new TestMaster
  addTestMaster(testMaster: TestModel): Observable<any> {
    const body = JSON.stringify(testMaster);
    console.log(body);
    return this.http.post('https://localhost:7139/api/Test/AddTest', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method to edit an existing TestMaster
  editTestMaster(testMaster: TestModel): Observable<any> {
    const body = JSON.stringify(testMaster);
    console.log(body);
    return this.http.post('https://localhost:7139/api/Test/EdtTest', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method to delete a TestMaster by TestId (will toggle isActive instead of deleting)
  toggleTestMasterStatus(TestId: number): Observable<any> {
    const body = JSON.stringify(TestId);
    console.log(body);
    
    return this.http.post('https://localhost:7139/api/Test/DeleteState', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method for application-specific logic (example for debugging)
  searchApplication(testMaster: { TestId: number, TestCode: string, TestName: string, isActive: boolean }) {
    console.log(testMaster);
  }
}
