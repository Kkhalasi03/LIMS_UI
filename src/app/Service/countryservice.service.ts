import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CountryModel } from '../Model/country-model';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
    constructor(private http:HttpClient) {  }
      getcountries(){
    return this.http.get<any>('https://localhost:7139/api/Country/GetAllCountries');
  }
  getCountryByIdOrName(country: CountryModel): Observable<any> {
    const body = JSON.stringify(country);
    console.log(body);
    return this.http.post('https://localhost:7139/api/Country/GetCountryByIdORName/',body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  postCountry(country: CountryModel): Observable<any> {
    const body = JSON.stringify(country);
    console.log(body);
    return this.http.post('https://localhost:7139/api/Country/AddCountry/', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  editCountry(country: CountryModel): Observable<any> {
    const body = JSON.stringify(country);
    console.log(body);
    return this.http.post('https://localhost:7139/api/Country/EdtCountry/', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  deleteCountry(countryId: number): Observable<any> {
    const body = JSON.stringify(countryId);
    console.log(body);
    return this.http.post('https://localhost:7139/api/Country/DeleteCountry/', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
//   constructor(private https:HttpClient) {  }
//   getcountries(){
//     return this.https.get<any>('https://localhost:7139/api/Country/GetAllCountries');
//   }
//   getcountryByIdORName(Countries:{CountryId:number,CountryName:string,isActive:boolean}): Observable<any>
//   {
//      const body=JSON.stringify(Countries);
//     console.log(body);
//     return this.https.post('https://localhost:7139/api/Country/GetCountryByIdORName/',body, {
//       headers: { 'Content-Type': 'application/json' }});
//   }
//   postcountry(Countries:{CountryId:number,CountryName:string}): Observable<any>
//   {
//     const body=JSON.stringify(Countries);
//     console.log(body);
//     // return this.http.post('https://localhost:7227/api/Editcountry/EdtCountry/',Countries);
//     return this.https.post('https://localhost:7139/api/Country/AddCountry/',body, {
//       headers: { 'Content-Type': 'application/json' }});
//   }
//   EditCountry(Countries:{CountryId:number,CountryName:string}): Observable<any>
//   {
//      const body=JSON.stringify(Countries);
//     console.log(body);
//     // return this.http.post('https://localhost:7227/api/Editcountry/EdtCountry/',Countries);
//     return this.https.post('https://localhost:7139/api/Country/EdtCountry/',body, {
//       headers: { 'Content-Type': 'application/json' }});
//   }
//   DeleteCountry(CountryId:number): Observable<any>
//   {
//      const body=JSON.stringify(CountryId);
//     console.log(body);
//     // return this.http.post('https://localhost:7227/api/Editcountry/EdtCountry/',Countries);
//     return this.https.post('https://localhost:7139/api/Country/DeleteCountry/',body, {
//       headers: { 'Content-Type': 'application/json' }});
//   }
//  searchApplication(countryId:string,countryName:string,isACtive:boolean)
//  {
//     console.log(countryId,countryName,isACtive);
//  }

}
