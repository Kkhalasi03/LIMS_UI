import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SampleServiceModel } from '../Model/sample-service-model';
import { ServiceTestModel } from '../Model/service-test-model';
import { TestResultDetails } from '../Model/test-result-details';

@Injectable({
  providedIn: 'root'
})
export class TestResultService {

  constructor(private http: HttpClient) {}
     // Method to get all Services
  getServices(): Observable<any> {
      return this.http.get<any>('https://localhost:7139/api/Service/GetAllServices/');
  }
  getBranches(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/Branch/GetAllBranches');
  }
 // Method to get all B2B records
  getB2B(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/B2B/GetAllB2B');
  }
  getSampleSeviceMapping(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/TestResult/GetAllSampleServiceMapping');
  }
    // Method to get all Sample Registers
  getSampleRegisters(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/SampleRegister/GetAllSampleRegisters');
  }
  getTestMasters(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/Test/GetAllTest');
  }
  // Method to get a Sample Register by SampleRegisterId, SampleCode, or Status
  getSampleRegisterByIdOrName(searchParams: { SampleRegisterId: number; FirstName:string,MiddleName:string,CreatedOn:Date,Status:string }): Observable<any> {
    const body = JSON.stringify(searchParams);
    console.log(body);
    return this.http.post('https://localhost:7139/api/TestResult/GetSampleRegisterByIdOrName', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
    // Method to delete a sample register by SampleRegisterId
  GetSampleRegisterDetailsById(SampleRegisterId: number): Observable<any> {
    const body = JSON.stringify(SampleRegisterId); // Convert SampleRegisterId to a JSON string
    console.log(body);
    return this.http.post('https://localhost:7139/api/TestResult/GetSampleDetailsById', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  SaveTestResultDetails(testResult:TestResultDetails):Observable<any> {
    const body=JSON.stringify(testResult);
    console.log(body);
    // Send a POST request to the API with the request body
    return this.http.post('https://localhost:7139/api/TestResult/AddTestResultDetails', body, {
      headers: { 'Content-Type': 'application/json' } // Set content type to JSON
    });
  }
  SaveTestResultApprovalDetails(testResult:TestResultDetails):Observable<any> {
    const body=JSON.stringify(testResult);
    console.log(body);
    // Send a POST request to the API with the request body
    return this.http.post('https://localhost:7139/api/TestResult/EdtTestResult', body, {
      headers: { 'Content-Type': 'application/json' } // Set content type to JSON
    });
  }
    getServiceTestById(ServiceTest: ServiceTestModel): Observable<any> {
      const body = JSON.stringify(ServiceTest);
      console.log(body);
      return this.http.post('https://localhost:7139/api/Service/GetServiceTestById', body, {
         headers: { 'Content-Type': 'application/json' }
      });
    }
    GetTestResultById(SampleRegisterId: number): Observable<any> {
      const body = JSON.stringify(SampleRegisterId); // Convert SampleRegisterId to a JSON string
      console.log(body);
      
      // Send a POST request to delete the sample register with the provided SampleRegisterId
      return this.http.post('https://localhost:7139/api/TestResult/GetTestResultBySampleRegisterId', body, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    GetTestBySampleregisterId(SampleRegisterId: number): Observable<any> {
      const body = JSON.stringify(SampleRegisterId); // Convert SampleRegisterId to a JSON string
      console.log(body);
      
      // Send a POST request to delete the sample register with the provided SampleRegisterId
      return this.http.post('https://localhost:7139/api/TestResult/GetTestBySampleRegisterId', body, {
        headers: { 'Content-Type': 'application/json' }
      });
    }

  AddTestResults(testResults: TestResultDetails[]): Observable<any> {
    const body = JSON.stringify(testResults);
    console.log("Sending Payload to API:", body);
  
    return this.http.post('https://localhost:7139/api/TestResult/AddTestResultDetails', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  generatePDF(sampleRegisterId: number): Observable<Blob> {
    return this.http.get(`https://localhost:7139/api/pdf/generate/${sampleRegisterId}`, {
      responseType: 'blob' // Expect binary PDF data
    });
  }
  
  }
