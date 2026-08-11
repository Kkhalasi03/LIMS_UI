import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SidenavBarComponent } from "../../../../sidenav-bar/sidenav-bar.component";
import { SampleServiceModel } from '../../../../Model/sample-service-model';
import { SampleRegisterService } from '../../../../Service/sample-register.service';
import { TestResultService } from '../../../../Service/test-result.service';
import { ServiceModel } from '../../../../Model/service-model';
import { SampleRegisterModel } from '../../../../Model/sample-register-model';

@Component({
  selector: 'app-test-result-list',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, SidenavBarComponent],
  templateUrl: './test-result-list.component.html',
  styleUrl: './test-result-list.component.css'
})
export class TestResultListComponent {
//   username:string|null=null;
//   applyForm1: FormGroup;
//   isTableVisible: boolean = false;
//   hasSearched: boolean = false;
//   showPopup: boolean = false;
//   popupMessage: string = '';
//   apiResponse:any[]=[];
//   homeSampleRegisterId: number | null = null;
//   homeMiddleName: string = '';  // Property for Middle Name filtering
//   homeFirstName:string='';
//   homeDate:string='';
//   // apiResponse: SampleServiceModel[] = []; // List of service mappings
//   services = [
//     { ServiceId: 1, ServiceName: 'Service 1', ServiceCode: 'S1',B2BAmount:1 ,B2CAmount:1},
//     { ServiceId: 2, ServiceName: 'Service 2', ServiceCode: 'S2',B2BAmount:1,B2CAmount:1 },
//     { ServiceId: 3, ServiceName: 'Service 3', ServiceCode: 'S3' ,B2BAmount:1,B2CAmount:1}
//   ];
//   testResultService=inject(TestResultService);
//   constructor(private router:Router){
//      // Initialize form controls
//      this.applyForm1 = new FormGroup({
//       homeSampleRegisterId: new FormControl<number | null>(0),
//       homeFirstName: new FormControl<string>(''),
//       homeMiddleName: new FormControl<string>(''),
//       homeDate: new FormControl<string>('')
//     });
//   }
//   ngAfterViewInit() {
//     this.getServices();
//     // Retrieve the username from localStorage or sessionStorage
//     console.log('Is SessionStorage accessible:', sessionStorage ? true : false);
//     const savedLoginData = sessionStorage.getItem('UserName');
//     console.log('Raw loginData from SessionStorage:', savedLoginData);
//     if (savedLoginData) {
//      this.username = savedLoginData;  // Directly assign the value
//      console.log('Retrieved username:', this.username);
//    } else {
//      console.log('No user data found in SessionStorage');
//    }
//   }
//   getServices(): void {
//     this.testResultService.getServices().subscribe({
//       next: (data: ServiceModel[]) => {
//         this.services = data;
//       },
//       error: (err) => {
//         console.error('Error fetching services:', err);
//       }
//     });
//   }
//   onLogout() {
//     if (sessionStorage) {
//       sessionStorage.clear(); // Clear all session data
//     }
//     this.router.navigate(['/login']); // Redirect to login page
//   }
//     // Handle search button click
//  // Fetch filtered service mappings
//  searchApplication(): void {
//   this.hasSearched = true;

//   const searchParams = {
//     SampleRegisterId: this.applyForm1.value.homeSampleRegisterId || 0,
//     FirstName:this.applyForm1.value.homeFirstName||'',
//     MiddleName:this.applyForm1.value.homeMiddleName||'',    
//     CreatedOn:this.applyForm1.value.homeDate||'',
//   };

//   if (!searchParams.SampleRegisterId && !searchParams.FirstName&&!searchParams.MiddleName&&!searchParams.CreatedOn) {
//     this.fetchAllData();
//   } else {
//     this.fetchFilteredData(searchParams);
//   }
// }

// fetchFilteredData(searchParams:{SampleRegisterId:number,FirstName:string,MiddleName:string,CreatedOn:string}): void {debugger
//   this.testResultService.getSampleRegisterByIdOrName(searchParams).subscribe({
//     next: (data: SampleServiceModel[]) => {
//       this.apiResponse = data;
//       this.isTableVisible = data.length > 0;
//     },
//     error: (err) => {
//       console.error(err);
//     }
//   });
// }
//    // Fetch all service mappings
//    fetchAllData(): void {
//     this.testResultService.getSampleRegisters().subscribe({
//       next: (data: SampleServiceModel[]) => {
//         this.apiResponse = data;
//         this.isTableVisible = data.length > 0;
//       },
//       error: (err) => {
//         console.error(err);
//       }
//     });
//   }
//     // Handle clear button click
//     clearForm(): void {
//       this.applyForm1.reset();
//       this.apiResponse = [];
//       this.isTableVisible = false;
//       this.hasSearched = false; // Reset search state
//     }
//       // Close Popup
//   closePopup() {
//     this.showPopup = false;
//     // this.fetchAllData();
//   }
//  // View Service details
//  viewTestResult(serviceId: number): void {
//     console.log('Viewing Service Details with ID:', serviceId);
//     // Implement logic to navigate to service details page or open a modal
//   }
username:string|null=null;
applyForm1: FormGroup;
  homeSampleRegisterId: number | null = null;
  homeFirstName: string = '';
  homeMiddleName: string = '';
  homeDate: string = '';
  homeServiceId: number = 0;
  services: any[] = [];
  apiResponse: any[] = [];
  isTableVisible: boolean = false;
  hasSearched: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  constructor(private apiService: TestResultService,private router:Router) {
    const today = new Date().toISOString().split('T')[0];
    this.homeDate = today;
    this.applyForm1 = new FormGroup({
      homeSampleRegisterId: new FormControl(0),
      homeFirstName: new FormControl(''),
      homeMiddleName: new FormControl(''),
      homeDate: new FormControl(this.homeDate),
      homeServiceId: new FormControl(0),
      homeStatus: new FormControl('N')
    });
  }

  ngAfterViewInit() {
        this.getServices();
        this.getSampleServiceMapping();
        // Retrieve the username from localStorage or sessionStorage
        console.log('Is SessionStorage accessible:', sessionStorage ? true : false);
        const savedLoginData = sessionStorage.getItem('UserName');
        console.log('Raw loginData from SessionStorage:', savedLoginData);
        if (savedLoginData) {
         this.username = savedLoginData;  // Directly assign the value
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
          sessionStorage.clear(); // Clear all session data
        }
        this.router.navigate(['/login']); // Redirect to login page
    }
  searchApplication(): void {
    const searchParams = {
      SampleRegisterId: this.applyForm1.value.homeSampleRegisterId || 0,
      FirstName: this.applyForm1.value.homeFirstName || '',
      MiddleName: this.applyForm1.value.homeMiddleName || '',
      CreatedOn: this.applyForm1.value.homeDate || '',
      Status:this.applyForm1.value.homeStatus||'N',
    };
    
    console.log(searchParams);
    if (searchParams.SampleRegisterId > 0 ||searchParams.FirstName!==''||searchParams.MiddleName!==''|| searchParams.CreatedOn !== '') {
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
          this.apiResponse = data;
          this.isTableVisible = true;
        },
        error: (err) => {
          console.error(err);
        }
  });
}
 

  clearForm(): void {
    const today = new Date().toISOString().split('T')[0];
    this.applyForm1.reset({
      homeSampleRegisterId: 0,
      homeFirstName: '',
      homeMiddleName: '',
      homeDate: today, // reset to current date
      homeServiceId: 0,
      selectedValue: null,
      homeStatus: 'N' // reset to New
    });
    this.apiResponse = [];
    this.isTableVisible = false;
    this.hasSearched = false;
  }

  viewTestResult(sampleRegisterId: number): void {
    console.log('Viewing test result for:', sampleRegisterId);
    // Implement navigation or modal logic
    this.router.navigate(['/testresult/testresult-edit', sampleRegisterId]);
  }
  viewServiceDetails(sampleRegisterId: number): void {
    console.log('Viewing test result for:', sampleRegisterId);
    // Implement navigation or modal logic
    this.router.navigate(['/testresult/testresult-edit', sampleRegisterId]);
  }
  showPopupMessage(message: string): void {
    this.popupMessage = message;
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
  }
}
