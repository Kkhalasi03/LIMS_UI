import { Routes } from '@angular/router';
import { StateListComponent } from './Module/Master/State/state-list/state-list.component';
import { StateEditComponent } from './Module/Master/State/state-edit/state-edit.component';
import { CityListComponent } from './Module/Master/City/city-list/city-list.component';
import { CityEditComponent } from './Module/Master/City/city-edit/city-edit.component';
import { DistrictListComponent } from './Module/Master/District/district-list/district-list.component';
import { DistrictEditComponent } from './Module/Master/District/district-edit/district-edit.component';
import { CountryEditComponent } from './Module/Master/Country/country-edit/country-edit.component';
import { CountryListComponent } from './Module/Master/Country/country-list/country-list.component';
import { LoginComponent } from './Module/account/login/login.component';
import { ForgotPasswordComponent } from './Module/account/forgot-password/forgot-password.component';
import { AreaListComponent } from './Module/Master/Area/area-list/area-list.component';
import { AreaEditComponent } from './Module/Master/Area/area-edit/area-edit.component';
import { ServiceListComponent } from './Module/Master/Service/service-list/service-list.component';
import { ServiceEditComponent } from './Module/Master/Service/service-edit/service-edit.component';
import { B2bListComponent } from './Module/Master/B2B/b2b-list/b2b-list.component';
import { BranchListComponent } from './Module/Master/Branch/branch-list/branch-list.component';
import { BranchEditComponent } from './Module/Master/Branch/branch-edit/branch-edit.component';
import { DoctorListComponent } from './Module/Master/Doctor/doctor-list/doctor-list.component';
import { DoctorEditComponent } from './Module/Master/Doctor/doctor-edit/doctor-edit.component';
import { SampleregisterListComponent } from './Module/Transaction/SampleRegister/sampleregister-list/sampleregister-list.component';
import { SampleregisterEditComponent } from './Module/Transaction/SampleRegister/sampleregister-edit/sampleregister-edit.component';
import { PaymentModeListComponent } from './Module/Finance/PaymentMode/payment-mode-list/payment-mode-list.component';
import { PaymentModeEditComponent } from './Module/Finance/PaymentMode/payment-mode-edit/payment-mode-edit.component';
import { TestResultListComponent } from './Module/Transaction/TestResult/test-result-list/test-result-list.component';
import { TestResultEditComponent } from './Module/Transaction/TestResult/test-result-edit/test-result-edit.component';
import { TestListComponent } from './Module/Master/Test/test-list/test-list.component';
import { TestEditComponent } from './Module/Master/Test/test-edit/test-edit.component';
import { TestApprovalListComponent } from './Module/Transaction/TestApproval/test-approval-list/test-approval-list.component';
import { TestApprovalEditComponent } from './Module/Transaction/TestApproval/test-approval-edit/test-approval-edit.component';
import { RegisterListComponent } from './Module/account/register/register-list/register-list.component';
import { RegisterEditComponent } from './Module/account/register/register-edit/register-edit.component';
import { ReportdashboardListComponent } from './Module/Transaction/Reportdashboard/reportdashboard-list/reportdashboard-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DailyReportdashboardListComponent } from './Module/Transaction/DailyReportdashboard/daily-reportdashboard-list/daily-reportdashboard-list.component';

export const routes: Routes = [
    {
        path:'',
        component:LoginComponent
    },
    { 
        path: 'login', 
        component: LoginComponent
    },
    { 
        path: 'dashboard', 
        component: DashboardComponent
    },
  
    {
        path:'register/register-list',
        component:RegisterListComponent
    },
    {
        path:'register/register-edit',
        component:RegisterEditComponent
    },
    // {
    //     path:'register',
    //     component:RegisterComponent
    // },
    {
        path:'forgot-password',
        component:ForgotPasswordComponent
    },
    {
        path:'country/country-list',
        component:CountryListComponent
    },
    {
        path:'country/country-edit',
        component:CountryEditComponent
    },
    {
        path:'sampleregister/sampleregister-list',
        component:SampleregisterListComponent
    },
    {
        path:'sampleregister/sampleregister-edit',
        component:SampleregisterEditComponent
    },
    {
        path:'b2b/b2b-list',
        component:B2bListComponent
    },
    {
        path:'b2b/b2b-edit',
        component:B2bListComponent
    },
    {
        path:'branch/branch-list',
        component:BranchListComponent
    },
    {
        path:'branch/branch-edit',
        component:BranchEditComponent
    },
    {
        path:'doctor/doctor-list',
        component:DoctorListComponent
    },
    {
        path:'doctor/doctor-edit',
        component:DoctorEditComponent
    },
    {
        path:'state/state-list',
        component:StateListComponent
    },
    {
        path:'service/service-list',
        component:ServiceListComponent
    },
    {
        path:'service/service-edit',
        component:ServiceEditComponent
    },
    {
        path:'state/state-edit',
        component:StateEditComponent
    },
    {
        path:'area/area-list',
        component:AreaListComponent
    },
    {
        path:'area/area-edit',
        component:AreaEditComponent
    },
    {
        path:'city/city-list',
        component:CityListComponent
    },
    {
        path:'city/city-edit',
        component:CityEditComponent
    },
    {
        path:'district/district-list',
        component:DistrictListComponent
    },
    {
        path:'district/district-edit',
        component:DistrictEditComponent
    },
    {
        path:'paymentmode/paymentmode-list',
        component:PaymentModeListComponent
    },
    {
        path:'paymentmode/paymentmode-edit',
        component:PaymentModeEditComponent
    },
    {
        path:'testresult/testresult-list',
        component:TestResultListComponent
    },
    {
        path:'testresult/testresult-edit',
        component:TestResultEditComponent
    },
    { 
        path: 'testresult/testresult-edit/:id', 
        component: TestResultEditComponent
    }, 
    {
        path:'test/test-list',
        component:TestListComponent
    },
    { 
        path: 'test/test-edit', 
        component: TestEditComponent
    },
    {
        path:'testapproval/testapproval-list',
        component:TestApprovalListComponent
    },
    { 
        path: 'testapproval/testapproval-edit', 
        component: TestApprovalEditComponent
    },
    { 
        path: 'testapproval/testapproval-edit/:id', 
        component: TestApprovalEditComponent
    }, 
    {
        path: 'reportdashboard/reportdashboard-list',
        component:ReportdashboardListComponent
    },
    {
        path:'dailyreportdashboard/dailyreportdashboard-list',
        component:DailyReportdashboardListComponent
    },
];
