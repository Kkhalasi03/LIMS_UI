import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TestResultService } from '../../../../Service/test-result.service';
import { ServiceModel } from '../../../../Model/service-model';
import { TestModel } from '../../../../Model/test-model';
import { TestResultDetails } from '../../../../Model/test-result-details';
import { ServiceTestMapping } from '../../../../Model/service-test-mapping';
import { TestResult } from '../../../../Model/test-result';
import { TestApprovalService } from '../../../../Service/test-approval.service';

@Component({
  selector: 'app-test-approval-edit',
  imports: [RouterModule,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './test-approval-edit.component.html',
  styleUrl: './test-approval-edit.component.css'
})
export class TestApprovalEditComponent {
 showPopup: boolean = false;
  popupMessage: string = '';
  sampleDetails: any = {};  // Stores sample details
  testResults: any[] = [];  // Stores dynamically fetched test results
  groupedTests: any[] = [];  // Stores grouped tests by ServiceId
  services: any[] = [];
  tests:any[]=[];
  branches: any[] = [];
  b2bList: any[] = [];
  sampleRegisterId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: TestApprovalService
  ) {}

  ngOnInit(): void {
    this.sampleRegisterId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.sampleRegisterId) {
      this.fetchSampleDetails(this.sampleRegisterId);
      this.fetchTestResults();
      // this.fetchGroupedTests();
    }
    this.getServices();
    this.getTest();
    this.getBranches();
    this.getB2BList();
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
getBranches(): void {
  this.apiService.getBranches().subscribe(
    (data) => this.branches = data,
    (error) => console.error('Error fetching branches', error)
  );
}

getB2BList(): void {
  this.apiService.getB2B().subscribe(
    (data) => this.b2bList = data,
    (error) => console.error('Error fetching B2B list', error)
  );
}

getTest(): void {
  this.apiService.getTestMasters().subscribe({
    next: (data: TestModel[]) => {
      this.tests = data;
    },
    error: (err) => {
      console.error('Error fetching services:', err);
    }
  });
}
  getServiceName(serviceId: number): string {
    const service = this.services.find(s => s.ServiceId === serviceId);
    return service ? service.ServiceName : 'Unknown Service';
  }

  getTestName(testId: number): string {
    const test = this.tests.find(t => t.TestId === testId);
    return test ? test.TestName : 'Unknown Test';
  }

  getBranchName(branchId: number): string {
    const branch = this.branches.find(b => b.BranchId === branchId);
    return branch ? branch.BranchName : 'Unknown';
  }

  getB2BName(b2bId: number): string {
    const b2b = this.b2bList.find(b => b.B2BId === b2bId);
    return b2b ? b2b.B2BName : 'Unknown';
  }
  formatDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  }

  fetchSampleDetails(SampleRegisterId: number | null) {
    if (SampleRegisterId !== null) {
      this.apiService.GetSampleRegisterDetailsById(SampleRegisterId).subscribe({
        next: (response) => {
          console.log(response);
          this.sampleDetails=response;
          console.log(this.sampleDetails);
          // this.popupMessage = response.message;
          // this.showPopup = true;
        },
        error: (err) => {
          this.sampleDetails=err;
          // this.popupMessage = err.error.message || 'An error occurred.';
          // this.showPopup = true;
        }
      });
    } else {
      alert("Please provide valid data.");
    }
  }
//   fetchGroupedTests() {
//     this.apiService.GetTestBySampleregisterId(this.sampleRegisterId).subscribe(
//       (data) => {
//         console.log("API Response:", data); // Debugging
//               // Call separate function to process data
//               if (!data || data.length === 0) {
//                 console.warn("No test results found!");
//                 this.groupedTests = [];
//                 return;
//             }

//             // Process the API response and initialize test inputs
//             this.groupedTests = this.initializeTestInputs(data);
    
//             // Call separate function to process data
//             // this.groupedTests = this.groupTestsByService(data);
    
//         console.log("Final Grouped Tests:", this.groupedTests); // Debugging
//     },
//     (error) => {
//         console.error('Error fetching test results:', error);
//     }
//   );
// }
// /**
//  * Groups test data by ServiceId and initializes empty input fields.
//  */
// initializeTestInputs(data: { ServiceId: number; TestId: number }[]): { ServiceId: number; TestResults: any[] }[] {
//   // Explicitly type `acc` to be an object with `ServiceId` as keys
//   const grouped: Record<number, { ServiceId: number; TestResults: any[] }> = {};

//   data.forEach(item => {
//       if (!grouped[item.ServiceId]) {
//           grouped[item.ServiceId] = { 
//               ServiceId: item.ServiceId, 
//               TestResults: [] 
//           };
//       }
//       grouped[item.ServiceId].TestResults.push({
//           TestId: item.TestId,
//           userInput: '',  // Default empty input
//           userValidated: false // Default unchecked
//       });
//   });

//   return Object.values(grouped);
// }


// groupTestsByService(data: { ServiceId: number; TestId: number }[]): { ServiceId: number; TestIds: number[] }[] {
//   return data.reduce<{ ServiceId: number; TestIds: number[] }[]>((acc, item) => {
//       let existingService = acc.find(service => service.ServiceId === item.ServiceId);
//       if (!existingService) {
//           existingService = {
//               ServiceId: item.ServiceId,
//               TestIds: []
//           };
//           acc.push(existingService);
//       }
//       existingService.TestIds.push(item.TestId);
//       return acc;
//   }, []);
// }
  fetchTestResults(): void {
    this.apiService.GetTestResultById(this.sampleRegisterId).subscribe({
      next: (response) => {
        console.log(response);
        this.testResults = response;
        this.testResults = response.map((test: TestResult) => ({
          ...test,
          ResultValue: test.ResultValue || ''  ,// Initialize if undefined
          ServiceStatus: test.ServiceStatus || 'V' // Default to 'V' if undefined

        }));
        this.groupTestsByService();
      },
      error: (err) => console.error('Error fetching test results:', err)
    });
  }

  groupTestsByService(): void {
    // Group the tests by ServiceId
    const grouped = this.testResults.reduce((groups, test) => {
      const serviceId = test.ServiceId;
      if (!groups[serviceId]) {
        groups[serviceId] = { ServiceId: serviceId, TestResults: [] };
      }
      groups[serviceId].TestResults.push(test);
      return groups;
    }, {});

    this.groupedTests = Object.values(grouped);  // Convert the grouped object to an array
  }


  toggleServiceStatus(test: any): void {
    test.ServiceStatus = test.ServiceStatus === 'A' ? 'V' : 'A';
  }
  
  saveTestResults(): void {
 // Retrieve username from local storage
 const validateByUsername =  sessionStorage.getItem('UserName') || 'UnknownUser';
  
 // Ensure `CreatedBy` is retrieved from `sampleDetails`
 const createdBy = this.sampleDetails[0]?.CreatedBy|| 'Unknown';
 // Ensure `CreatedOn` is a valid date
 const createdOn = this.sampleDetails?.CreatedOn ? new Date(this.sampleDetails.CreatedOn) : new Date();

 // Debugging: Check if groupedTests is populated before processing
 console.log("Debug: Raw groupedTests before processing:", this.groupedTests);

 if (!this.groupedTests || this.groupedTests.length === 0) {
   console.error(" No test results available!");
   this.popupMessage = "No test results to save!";
   this.showPopup = true;
   return;
 }

 // Prepare the payload following the TestResultDetails structure
 const payload: TestResultDetails = {
   TestResultId: 0,
   SampleRegisterId: this.sampleRegisterId,
   ServiceTests: [],
   ValidateBy: validateByUsername,
   ValidateOn: new Date(),
   CreatedBy: createdBy,
   CreatedOn: createdOn,
   isActive: true,
 };

 // **Map groupedTests into ServiceTests, grouping by ServiceId**
 this.groupedTests.forEach(group => {
   let serviceTest: ServiceTestMapping = {
     ServiceId: group.ServiceId,
     TestResults: []
   };

   group.TestResults.forEach((test: { TestId: number; ResultValue: string; ServiceStatus: string }) => {
     serviceTest.TestResults.push({
       TestId: test.TestId,
       ResultValue: test.ResultValue || "",  // Ensure default empty string
       ServiceStatus: test.ServiceStatus === "A" ? "A" : "V"
      });
   });

   payload.ServiceTests.push(serviceTest);
 });

  
 console.log("Sending Payload:", JSON.stringify(payload, null, 2));

    this.apiService.SaveTestResultApprovalDetails(payload).subscribe(
      (response) => {
        console.log('Test results saved successfully:', response);
        this.popupMessage = 'Test results saved successfully!';
        this.showPopup = true;
      },
      (error) => {
        console.error('Error saving test results:', error);
        this.popupMessage = 'Failed to save test results.';
        this.showPopup = true;
      }
    );
  }

  goBack(): void {
    this.router.navigate(['testapproval/testapproval-list']);
  }

  closePopup(): void {
    this.showPopup = false;
  }
}
