import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SidenavBarComponent } from '../../../../sidenav-bar/sidenav-bar.component';
import { ReportDashboardService } from '../../../../Service/report-dashboard.service';

@Component({
  selector: 'app-daily-reportdashboard-list',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, SidenavBarComponent],
  templateUrl: './daily-reportdashboard-list.component.html',
  styleUrl: './daily-reportdashboard-list.component.css'
})
export class DailyReportdashboardListComponent implements OnInit {
  username:string|null=null;
  branchList: any[] = [];
  b2bList: any[] = [];
  reportData: any[] = [];
  hasSearched = false;

  // Form Fields
  branchId: string = '';
  b2bId: string = '';
  fromDate: string = this.getTodayDate();
  toDate: string = this.getTodayDate();
  constructor(private dashboardService: ReportDashboardService,private router:Router) {  }

  ngOnInit() {
    this.loadBranches();
    this.loadB2Bs();
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
// Fetch Branch List
loadBranches() {
  this.dashboardService.getBranches().subscribe((res: any) => {
    this.branchList = res;
  });
}

// Fetch B2B List
loadB2Bs() {
  this.dashboardService.getB2B().subscribe((res: any) => {
    this.b2bList = res;
  });
}

// Search Function
searchReport() {
    // Check if branchId or b2bId is not selected and set them to 0
    if (!this.branchId) {
      this.branchId = '0'; // Set to 0 if not selected
    }
    if (!this.b2bId) {
      this.b2bId = '0'; // Set to 0 if not selected
    }
  const formData = {
    branchId: this.branchId,
    b2bId: this.b2bId,
    fromDate: this.fromDate,
    toDate: this.toDate
  };

  this.dashboardService.getSearchDetails(formData).subscribe((res: any) => {
    this.reportData = res;
    this.hasSearched = true;
  });
}

// Clear Form
clearForm() {
  this.branchId = '';
  this.b2bId = '';
  this.fromDate = this.getTodayDate();
  this.toDate = this.getTodayDate();
  this.reportData = [];
  this.hasSearched = false;
}

// Get Today's Date in yyyy-MM-dd format
getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}
onLogout() {
  if (sessionStorage) {
    sessionStorage.clear(); // Clear all session data
  }
  this.router.navigate(['/login']); // Redirect to login page
}
 // Download Excel Report
 downloadExcelReport() {
    // Check if branchId or b2bId is not selected and set them to 0
    if (!this.branchId) {
      this.branchId = '0'; // Set to 0 if not selected
    }
    if (!this.b2bId) {
      this.b2bId = '0'; // Set to 0 if not selected
    }
  const formData = {
    branchId: this.branchId,
    b2bId: this.b2bId,
    fromDate: this.fromDate,
    toDate: this.toDate
  };
  this.dashboardService.getSearchDetailsExcel(formData).subscribe(
    (response: Blob) => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Report_${new Date().toISOString().split('T')[0]}.xlsx`; // Set Excel filename with today's date
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    (error) => {
      console.error('Error generating Excel:', error);
    }
  );
}

}
