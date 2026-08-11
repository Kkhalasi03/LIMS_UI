import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(private http: HttpClient) {}
  // Method to get all States
  getcountries(){
    return this.http.get<any>('https://localhost:7139/api/Country/GetAllCountries');
  }
getStates(): Observable<any> {
  return this.http.get<any>('https://localhost:7139/api/State/GetAllStates');
}

// Method to get a State by StateId, StateName, or Status
getStateByIdOrName(State: { StateId: number, StateName: string, isActive: boolean }): Observable<any> {
  const body = JSON.stringify(State);
  console.log(body);
  return this.http.post('https://localhost:7139/api/State/GetStateByIdORName', body, {
    headers: { 'Content-Type': 'application/json' }
  });
}
  // Method to add a new state
  poststate(States: { StateId: number, StateCode: string, StateName: string, CountryId: number }): Observable<any> {
    const body = JSON.stringify(States);  // Convert the States object to a JSON string
    console.log(body);  // Log the request payload for debugging

    // Send a POST request to the API with the request body
    return this.http.post('https://localhost:7139/api/State/AddState/', body, {
      headers: { 'Content-Type': 'application/json' }  // Set content type to JSON
    });
  }
  EditState(States: { StateId: number, StateCode: string, StateName: string, CountryId: number }): Observable<any>
  {
     const body=JSON.stringify(States);
    console.log(body);
    // return this.http.post('https://localhost:7227/api/Editcountry/EdtCountry/',Countries);
    return this.http.post('https://localhost:7139/api/State/EdtState/',body, {
      headers: { 'Content-Type': 'application/json' }});
  }
  // Method to delete a state by StateId
DeleteState(StateId: number): Observable<any> {
  const body = JSON.stringify(StateId); // Convert StateId to a JSON string
  console.log(body);
  
  // Send a POST request to delete the state with the provided StateId
  return this.http.post('https://localhost:7139/api/State/DeleteState', body, {
    headers: { 'Content-Type': 'application/json' }
  });
}
searchApplication(States: { StateId: number, StateCode: string, StateName: string, CountryId: number })
 {
    console.log(States);
 }
}
