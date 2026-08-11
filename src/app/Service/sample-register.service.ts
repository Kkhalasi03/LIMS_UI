import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SampleRegisterModel } from '../Model/sample-register-model';
import { SampleServiceModel } from '../Model/sample-service-model';
import { SamplePaymentDetails } from '../Model/sample-payment-details';

@Injectable({
  providedIn: 'root'
})
export class SampleRegisterService {

  constructor(private http: HttpClient) {}

  getCities(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/City/GetAllCity');
  }
  getAreas(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/Area/GetAllAreas/');
  }
   // Method to get all Services
   getServices(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/Service/GetAllServices/');
  }
   // Method to get all Branches
  getBranches(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/Branch/GetAllBranches');
  }
 // Method to get all B2B records
  getB2B(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/B2B/GetAllB2B');
  }
  getPaymentMode(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/PaymentMode/GetAllPaymentModes'); // Updated API URL
  }
  // Method to get all Sample Registers
  getSampleRegisters(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/SampleRegister/GetAllSampleRegisters');
  }
    // Method to get a Sample Register by SampleRegisterId, SampleCode, or Status
  getSampleServiceById(sampleRegisterId: number): Observable<any> {
    //const body = JSON.stringify(searchParams);
    const body: SampleServiceModel = {
    SampleRegisterId:sampleRegisterId ,  // Pass only SampleRegisterId
      ServiceId: [],   //  Pass an empty array
      Amount: []       //  Pass an empty array
    };
    console.log(body);
    return this.http.post<any>('https://localhost:7139/api/SampleRegister/GetSampleServiceById', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getSamplePayment(sampleRegisterId: number): Observable<SamplePaymentDetails[]> {
    const body = { SampleRegisterId: sampleRegisterId }; // Only send the required ID
    return this.http.post<SamplePaymentDetails[]>('https://localhost:7139/api/SampleRegister/GetSamplePaymentById', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  

  // Method to get a Sample Register by SampleRegisterId, SampleCode, or Status
  getSampleRegisterByIdOrName(searchParams: { SampleRegisterId: number,MiddleName: string, isActive: boolean|null }): Observable<any> {
    const body = JSON.stringify(searchParams);
    console.log(body);
    return this.http.post('https://localhost:7139/api/SampleRegister/GetSampleRegisterByIdOrName', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method to add a new sample register
  postSampleRegister(SampleRegister: SampleRegisterModel): Observable<any> {
    const body = JSON.stringify(SampleRegister); // Convert the SampleRegister object to a JSON string
    console.log(body); // Log the request payload for debugging

    // Send a POST request to the API with the request body
    return this.http.post('https://localhost:7139/api/SampleRegister/AddSampleRegister', body, {
      headers: { 'Content-Type': 'application/json' } // Set content type to JSON
    });
  }
    // Method to save the selected services (new method)
  saveSelectedServices(SampleService: SampleServiceModel): Observable<any> {
      const body = JSON.stringify(SampleService); // Convert the SampleService object to a JSON string
      console.log(body); // Log the request payload for debugging
  
      // Send a POST request to the API with the request body
      return this.http.post<any>('https://localhost:7139/api/SampleRegister/AddSampleRegisterService', body, {
        headers: { 'Content-Type': 'application/json' } // Set content type to JSON
      });
  }
  saveSamplePaymentDetails(SamplePayment:SamplePaymentDetails):Observable<any> {
    const body = JSON.stringify(SamplePayment);
    console.log(body); 
    // Send a POST request to the API with the request body
    return this.http.post<any>('https://localhost:7139/api/SampleRegister/AddSamplePaymentDetails', body, {
      headers: { 'Content-Type': 'application/json' } // Set content type to JSON
    });
}
  // Method to edit an existing sample register
  editSampleRegister(SampleRegister: SampleRegisterModel): Observable<any> {
    const body = JSON.stringify(SampleRegister);
    console.log(body);
    return this.http.post('https://localhost:7139/api/SampleRegister/EditSampleRegister', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method to delete a sample register by SampleRegisterId
  deleteSampleRegister(SampleRegisterId: number): Observable<any> {
    const body = JSON.stringify(SampleRegisterId); // Convert SampleRegisterId to a JSON string
    console.log(body);
    
    // Send a POST request to delete the sample register with the provided SampleRegisterId
    return this.http.post('https://localhost:7139/api/SampleRegister/DeleteSampleRegister', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  // Method to delete a sample register by SampleRegisterId
  deleteSampleService(sampleRegisterId: number, serviceId: number): Observable<any> {
    const body: SampleServiceModel = {
      SampleRegisterId: sampleRegisterId,
      ServiceId: [serviceId], // Pass ServiceId as a List<int>
      Amount: [0]      // Set Amount to 0
    };
    console.log(body);
    // Send a POST request to delete the sample register with the provided SampleRegisterId
    return this.http.post('https://localhost:7139/api/SampleRegister/DeleteSampleService', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  // Method for application-specific logic (example for debugging)
  searchApplication(SampleRegister: { SampleRegisterId: number, SampleCode: string, SampleName: string, isActive: boolean }) {
    console.log(SampleRegister);
  }
}
