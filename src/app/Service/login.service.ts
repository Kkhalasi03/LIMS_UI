import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private https:HttpClient) {  }
  GetUser(User:{UserName:string,Password:string}): Observable<any>
  {
     const body=JSON.stringify(User);
    console.log(body);
    return this.https.post('https://localhost:7139/GetUser/',body, {
      headers: { 'Content-Type': 'application/json' }});
  }
}
