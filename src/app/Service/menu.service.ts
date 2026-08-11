import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MenuModel } from '../Model/menu-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  getMenus() {
    return this.http.get<any>('https://localhost:7139/api/Menu/GetAllMenus');
  }

  getMenuByIdOrName(menu: MenuModel): Observable<any> {
    const body = JSON.stringify(menu);
    console.log(body);
    return this.http.post('https://localhost:7139/api/Menu/GetMenuByIdOrName/', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  postMenu(menu: MenuModel): Observable<any> {
    const body = JSON.stringify(menu);
    console.log(body);
    return this.http.post('https://localhost:7139/api/Menu/AddMenu/', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  editMenu(menu: MenuModel): Observable<any> {
    const body = JSON.stringify(menu);
    console.log(body);
    return this.http.post('https://localhost:7139/api/Menu/EditMenu/', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  deleteMenu(menuId: number): Observable<any> {
    const body = JSON.stringify(menuId);
    console.log(body);
    return this.http.post('https://localhost:7139/api/Menu/DeleteMenu/', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }}
