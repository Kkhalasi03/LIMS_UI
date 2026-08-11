import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ReportDashboardService } from '../../../../Service/report-dashboard.service';
import { SidenavBarComponent } from "../../../../sidenav-bar/sidenav-bar.component";

@Component({
  selector: 'app-reportdashboard-list',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, SidenavBarComponent],
  templateUrl: './reportdashboard-list.component.html',
  styleUrl: './reportdashboard-list.component.css'
})
export class ReportdashboardListComponent implements OnInit {
  username: string | null = null;
  branchList: any[] = [];
  b2bList: any[] = [];
  reportData: any[] = [];
  hasSearched = false;
  reportType: string = 'Detailed'; // Default report type

  // Form Fields
  branchId: string = '';
  b2bId: string = '';
  fromDate: string = this.getTodayDate();
  toDate: string = this.getTodayDate();

  constructor(private dashboardService: ReportDashboardService, private router: Router) {}

  ngOnInit() {
    this.loadBranches();
    this.loadB2Bs();
    this.loadUsername();
  }

  loadUsername() {
    const savedLoginData = sessionStorage.getItem('UserName');
    this.username = savedLoginData ? savedLoginData : null;
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
    const formData = {
      branchId: this.branchId || '0',
      b2bId: this.b2bId || '0',
      fromDate: this.fromDate,
      toDate: this.toDate,
      reportType: this.reportType
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
    this.reportType = 'Detailed'; // Reset to default report type
  }

  // Get Today's Date in yyyy-MM-dd format
  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  onLogout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  // Download Excel Report
  downloadExcelReport() {
    const formData = {
      branchId: this.branchId || '0',
      b2bId: this.b2bId || '0',
      fromDate: this.fromDate,
      toDate: this.toDate,
      reportType: this.reportType
    };

    this.dashboardService.getSearchDetailsExcel(formData).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Report_${new Date().toISOString().split('T')[0]}.xlsx`;
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
