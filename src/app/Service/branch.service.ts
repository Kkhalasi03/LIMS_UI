import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BranchModel } from '../Model/branch-model';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(private http: HttpClient) {}

  // Method to get all Branches
  getBranches(): Observable<any> {
    return this.http.get<any>('https://localhost:7139/api/Branch/GetAllBranches');
  }

  // Method to get a Branch by BranchId, BranchName, or Status
  getBranchByIdOrCode(Branch:BranchModel): Observable<any> {
    const body = JSON.stringify(Branch);
    console.log(body);
    return this.http.post('https://localhost:7139/api/Branch/GetBranchByIdOrCode', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method to add a new branch
  postBranch(Branch: BranchModel): Observable<any> {
    const body = JSON.stringify(Branch); // Convert the Branch object to a JSON string
    console.log(body); // Log the request payload for debugging

    // Send a POST request to the API with the request body
    return this.http.post('https://localhost:7139/api/Branch/AddBranch', body, {
      headers: { 'Content-Type': 'application/json' } // Set content type to JSON
    });
  }

  // Method to edit a branch
  editBranch(Branch: BranchModel): Observable<any> {
    const body = JSON.stringify(Branch);
    console.log(body);
    return this.http.post('https://localhost:7139/api/Branch/EditBranch', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method to delete a branch by BranchId
  deleteBranch(BranchId: number): Observable<any> {
    const body = JSON.stringify(BranchId); // Convert BranchId to a JSON string
    console.log(body);
    
    // Send a POST request to delete the branch with the provided BranchId
    return this.http.post('https://localhost:7139/api/Branch/DeleteBranch', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method for application-specific logic (example for debugging)
  searchApplication(Branch: { BranchId: number, BranchCode: string, BranchName: string, StateId: number }) {
    console.log(Branch);
  }
}
