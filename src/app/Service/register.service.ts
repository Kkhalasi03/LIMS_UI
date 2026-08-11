import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterModel } from '../Model/register-model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private https:HttpClient) {  }

  // Method to get all users
  getUsers(): Observable<any> {
    return this.https.get<any>('https://localhost:7139/api/Register/GetAllUser');
  }
  getUsersByIdOrName(user: { UserId: number, UserName: string, UserType: string, isActive: boolean | null }): Observable<any> {
    const body = JSON.stringify(user);
    console.log('Searching Users with filters:', body);
    return this.https.post('https://localhost:7139/api/Register/GetUserByIdOrName', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  
  // Method to add a new user
  postUser(user: FormData): Observable<any> {
    console.log('Adding User FormData:');
    user.forEach((value, key) => {
      console.log(key, value);
    });
    return this.https.post('https://localhost:7139/api/Register/AddUser/', user);
  }

 // Method to edit an existing user
 editUser(user: FormData): Observable<any> {debugger
  //  Just to check what is inside FormData
  console.log('Editing User FormData:');
  user.forEach((value, key) => {
    console.log(key, value);
  });

  return this.https.post('https://localhost:7139/api/Register/EdtUser', user);
}

  // Method to delete a user by UserId
  deleteUser(UserId: number): Observable<any> {
    const body = JSON.stringify(UserId);
    console.log('Deleting User:', body);
    return this.https.post('https://localhost:7139/api/Register/DeleteUser', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
   
}
