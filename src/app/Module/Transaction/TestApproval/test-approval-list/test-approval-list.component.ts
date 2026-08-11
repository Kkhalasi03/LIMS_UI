import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SidenavBarComponent } from '../../../../sidenav-bar/sidenav-bar.component';
import { TestResultService } from '../../../../Service/test-result.service';
import { ServiceModel } from '../../../../Model/service-model';
import { SampleServiceModel } from '../../../../Model/sample-service-model';
import { SampleRegisterModel } from '../../../../Model/sample-register-model';
import { TestApprovalService } from '../../../../Service/test-approval.service';

@Component({
  selector: 'app-test-approval-list',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, SidenavBarComponent],
  templateUrl: './test-approval-list.component.html',
  styleUrl: './test-approval-list.component.css'
})
export class TestApprovalListComponent {
  username:string|null=null;
  applyForm1: FormGroup;
    homeSampleRegisterId: number | null = null;
    homeFirstName: string = '';
    homeMiddleName: string = '';
    homeDate: string = '';
    homeServiceId: number = 0;
    homeStatus: string = '';
    services: any[] = [];
    apiResponse: any[] = [];
    isTableVisible: boolean = false;
    hasSearched: boolean = false;
    showPopup: boolean = false;
    popupMessage: string = '';
    constructor(private apiService: TestApprovalService,private router:Router) {
      const today = new Date().toISOString().split('T')[0];
      this.homeDate = today;
      this.applyForm1 = new FormGroup({
        homeSampleRegisterId: new FormControl(0),
        homeFirstName: new FormControl(''),
        homeMiddleName: new FormControl(''),
        homeDate: new FormControl(this.homeDate),
        homeServiceId: new FormControl(0),
        homeStatus: new FormControl('V'),
        selectedValue: new FormControl(null)
      });
    }
  
    ngAfterViewInit() {
          this.getServices();
          this.getSampleServiceMapping();
          console.log('Is SessionStorage accessible:', sessionStorage ? true : false);
          const savedLoginData = sessionStorage.getItem('UserName');
          console.log('Raw loginData from SessionStorage:', savedLoginData);
          if (savedLoginData) {
           this.username = savedLoginData;
           console.log('Retrieved username:', this.username);
         } else {
           console.log('No user data found in SessionStorage');
         }
    }
    getServices(): void {
          this.apiService.getServices().subscribe({
            next: (data: ServiceModel[]) => {
              this.services = data;
            },
            error: (err) => {
              console.error('Error fetching services:', err);
            }
          });
    }
    getSampleServiceMapping(): void {
      this.apiService.getSampleSeviceMapping().subscribe({
        next: (data: SampleServiceModel[]) => {
          this.services = data;
        },
        error: (err) => {
          console.error('Error fetching services:', err);
        }
      });
  }
      onLogout() {
          if (sessionStorage) {
            sessionStorage.clear();
          }
          this.router.navigate(['/login']);
      }
    searchApplication(): void {
      const searchParams = {
        SampleRegisterId: this.applyForm1.value.homeSampleRegisterId || 0,
        FirstName: this.applyForm1.value.homeFirstName || '',
        MiddleName: this.applyForm1.value.homeMiddleName || '',
        CreatedOn: this.applyForm1.value.homeDate || '',
        Status: this.applyForm1.value.homeStatus
      };
      
      console.log(searchParams);
      if (searchParams.SampleRegisterId > 0 ||searchParams.FirstName!==''||searchParams.MiddleName!==''|| searchParams.CreatedOn !== '' || searchParams.Status !== '') {
        this.fetchFilteredData(searchParams);
      } else {
        this.fetchAllData();
      }
    }
  
    fetchAllData(): void {
      this.apiService.getSampleRegisters().subscribe(
        (data) => {
          this.apiResponse = data;
          this.isTableVisible = data.length > 0;
        },
        (error) => {
          console.error('Error fetching all data', error);
        }
      );
    }
  
    fetchFilteredData(searchParams:{SampleRegisterId:number,FirstName:string,MiddleName:string,CreatedOn:Date,Status:string}): void {
        this.apiService.getSampleRegisterByIdOrName(searchParams).subscribe({
          next: (data: SampleRegisterModel[]) => {
            console.log(data);
            this.hasSearched=true;
          this.isTableVisible = true;
          if (typeof data === 'string') {
            this.apiResponse = JSON.parse(data);
          } else {
            this.apiResponse = data;
          }
      },
      error: (err) => {
         console.log(err);
       }
    });
  }
   
  
    clearForm(): void {
      this.applyForm1.reset();
      this.apiResponse = [];
      this.isTableVisible = false;
      this.hasSearched = false;
    }
  
    viewTestResult(sampleRegisterId: number): void {
      console.log('Viewing test result for:', sampleRegisterId);
      this.router.navigate(['/testapproval/testapproval-edit', sampleRegisterId]);
    }
    viewServiceDetails(sampleRegisterId: number): void {
      console.log('Viewing test result for:', sampleRegisterId);
      this.router.navigate(['/testapproval/testapproval-edit', sampleRegisterId]);
    }
    showPopupMessage(message: string): void {
      this.popupMessage = message;
      this.showPopup = true;
    }
  
    closePopup(): void {
      this.showPopup = false;
    }
    downloadPDF(sampleRegisterId: number) {
      this.apiService.generatePDF(sampleRegisterId).subscribe(
        (response: Blob) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `LabReport_${sampleRegisterId}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Error generating PDF:', error);
        }
      );
    }
    sendMail(sampleRegisterId: number) {
      this.apiService.sendMail(sampleRegisterId).subscribe({
        next: (response: string) => {  // Now response is a string, not JSON
          this.popupMessage = response;
          this.showPopup = true;        
        },
        error: (error) => {
          this.popupMessage = error.message || 'An error occurred.';
          this.showPopup = true;        }
      });
    }
}
