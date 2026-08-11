import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportDashboardService } from '../Service/report-dashboard.service';
import { SidenavBarComponent } from "../sidenav-bar/sidenav-bar.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidenavBarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent   implements OnInit {
  username: string = '';
  selectedDate = new FormControl(new Date().toISOString().split('T')[0]); // Default to today's date
  reports: any[] = [];

  constructor(private dashboardService: ReportDashboardService, private router: Router) {}

  ngOnInit() {
    const savedLoginData = sessionStorage.getItem('UserName');
    this.username = savedLoginData ? savedLoginData : '';

    this.fetchReports(); // Fetch report data on load
  }

  fetchReports() {
    let date: string = this.selectedDate.value ? this.selectedDate.value.split('T')[0] : new Date().toISOString().split('T')[0];
  
    this.dashboardService.getSampleStatus(date).subscribe(
      (data: any) => {
        if (data && data.length > 0) {
          const reportData = data[0]; // Extract first object from API response
  
          this.reports = [
            { 
              title: 'Total Patients', 
              count: reportData.TotalPatientsInSystem, 
              B2B: reportData.TotalB2BPatientsInSystem, 
              B2C: reportData.TotalB2CPatientsInSystem, 
              icon: 'bi bi-people', 
              color: 'info' 
            },
            { 
              title: 'New Tests', 
              count: reportData.TotalPatients, 
              B2B: reportData.B2BCount, 
              B2C: reportData.B2CCount, 
              icon: 'bi bi-clipboard-plus', 
              color: 'primary' 
            },
            { title: 'Approved Tests', count: reportData.ApprovedPatients, icon: 'bi bi-patch-check', color: 'success' },
            { title: 'Approval Pending', count: reportData.ValidatedPatients, icon: 'bi bi-hourglass-split', color: 'warning' },
            { title: 'Gross Amount(₹)', count: reportData.TotalAmountForTheDay.toFixed(2), icon: 'bi bi-cash-stack', color: 'danger' },
            { title: 'Net Amount (₹)', count: reportData.TotalPaidAmount.toFixed(2), icon: 'bi bi-coin', color: 'success' },
            { title: 'Total Payments', count: reportData.TotalPaymentsThatDay, icon: 'bi bi-wallet', color: 'secondary' },
            { title: 'Due Amount (₹)', count: reportData.DueAmount.toFixed(2), icon: 'bi bi-exclamation-circle', color: 'warning' }
          ];
        } else {
          this.reports = [
            { title: 'Total Patients', count: 0, B2B: 0, B2C: 0, icon: 'bi bi-people', color: 'info' },
            { title: 'New Tests', count: 0, B2B: 0, B2C: 0, icon: 'bi bi-clipboard-plus', color: 'primary' },
            // Continue with other reports as before
          ];
        }
      },
      (error) => {
        console.error('Error fetching reports:', error);
      }
    );
  }
  

  onDateChange() {
    this.fetchReports(); // Refresh report data when date changes
  }

  onLogout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}