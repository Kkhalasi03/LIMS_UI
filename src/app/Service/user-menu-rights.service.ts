import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserMenurigthsModel } from '../Model/user-menurigths-model';

@Injectable({
  providedIn: 'root'
})
export class UserMenuRightsService {

  constructor(private http: HttpClient) {}

  // Get all UserMenuRights
  getUserMenuRights(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/UserMenuRights/GetAllUserMenuRights');
  }
  getUserMenuRightsByUserId(user: { UserId: number }): Observable<any> {
    const body = {
      UserId: user.UserId,
      MenuId: [], // Initialize as empty array
      HasAccess: [] // Initialize as empty array
    };
    console.log('Searching Menus for UserId:', body);
    return this.http.post('https://localhost:7139/api/UserMenuRights/GetUserMenuRights', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // // Get UserMenuRights by UserId
  // getUserMenuRightsByUserId(userMenuRights: UserMenurigthsModel): Observable<any> {
  //   const body = JSON.stringify(userMenuRights);
  //   console.log(body);
  //   return this.http.post('https://localhost:7139/api/UserMenuRights/GetUserMenuRights', body, {
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // }

  // Add User Menu Rights
  addUserMenuRight(userMenuRights: UserMenurigthsModel): Observable<any> {
    const body = JSON.stringify(userMenuRights);
    console.log(body);
    return this.http.post('https://localhost:7139/api/UserMenuRights/AddUserMenuRight', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Edit User Menu Rights
  editUserMenuRight(userMenuRights: UserMenurigthsModel): Observable<any> {
    const body = JSON.stringify(userMenuRights);
    console.log(body);
    return this.http.post('https://localhost:7139/api/UserMenuRights/EditUserMenuRight/', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Delete User Menu Rights by UserId
  deleteUserMenuRight(userId: number): Observable<any> {
    const body = JSON.stringify(userId);
    console.log(body);
    return this.http.post('https://localhost:7139/api/UserMenuRights/DeleteUserMenuRight/', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }}
