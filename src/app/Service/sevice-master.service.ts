import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceModel } from '../Model/service-model';
import { ServiceTestModel } from '../Model/service-test-model';

@Injectable({
  providedIn: 'root'
})
export class SeviceMasterService {

  constructor(private http: HttpClient) {}
  // Method to get all TestMaster records
  getAllTest(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/Test/GetAllTest');
  }
  // Method to get a ServiceTest by ServiceId
  getServiceTestById(ServiceTest: ServiceTestModel): Observable<any> {
    const body = JSON.stringify(ServiceTest);
    console.log(body);
    return this.http.post('https://localhost:7139/api/Service/GetServiceTestById', body, {
       headers: { 'Content-Type': 'application/json' }
    });
  }
  deleteServiceTest(ServiceTestId: number): Observable<any> {
    const body = JSON.stringify(ServiceTestId); // Convert ServiceId to JSON string
    console.log(body);

    // Send a POST request to delete the ServiceMaster with the provided ServiceId
    return this.http.post('https://localhost:7139/api/Service/DeleteServiceTest', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  // Method to get all ServiceMasters
  getServiceMasters(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/Service/GetAllServices');
  }

  // Method to get a ServiceMaster by ServiceId, ServiceCode, ServiceName, or Status
  getServiceMasterByIdOrCode(ServiceMaster: ServiceModel): Observable<any> {
    const body = JSON.stringify(ServiceMaster);
    console.log(body);
    return this.http.post('https://localhost:7139/api/Service/GetServiceByIdOrCode', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method to add a new ServiceMaster
  postServiceMaster(ServiceMaster: ServiceModel): Observable<any> {
    const body = JSON.stringify(ServiceMaster); // Convert ServiceMaster object to JSON string
    console.log(body); // Log the request payload for debugging

    // Send a POST request to the API with the request body
    return this.http.post('https://localhost:7139/api/Service/AddService', body, {
      headers: { 'Content-Type': 'application/json' } // Set content type to JSON
    });
  }
    // Method to add a new ServiceMaster
    postServiceTestMapping(ServiceTest: ServiceTestModel): Observable<any> {
      const body = JSON.stringify(ServiceTest); // Convert ServiceMaster object to JSON string
      console.log(body); // Log the request payload for debugging
  
      // Send a POST request to the API with the request body
      return this.http.post('https://localhost:7139/api/Service/AddserviceTestMapping', body, {
        headers: { 'Content-Type': 'application/json' } // Set content type to JSON
      });
    }

  // Method to edit a ServiceMaster
  editServiceMaster(ServiceMaster: ServiceModel): Observable<any> {
    const body = JSON.stringify(ServiceMaster);
    console.log(body);
    return this.http.post('https://localhost:7139/api/Service/EditService', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method to delete a ServiceMaster by ServiceId
  deleteServiceMaster(ServiceId: number): Observable<any> {
    const body = JSON.stringify(ServiceId); // Convert ServiceId to JSON string
    console.log(body);

    // Send a POST request to delete the ServiceMaster with the provided ServiceId
    return this.http.post('https://localhost:7139/api/Service/DeleteService', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method for application-specific logic (example for debugging)
  searchApplication(ServiceMaster: { ServiceId: number, ServiceCode: string, ServiceName: string, isActive: boolean }) {
    console.log(ServiceMaster);
  }
}