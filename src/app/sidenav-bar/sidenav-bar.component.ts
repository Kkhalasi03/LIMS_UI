import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MenuModel } from '../Model/menu-model';
const MENU_DISPLAY_NAMES: { [key: string]: string } = {
  'Country': 'Country Master',
  'State': 'State Master',
  'District': 'District Master',
  'City': 'City Master',
  'Area': 'Area Master',
  'Service': 'Service Master',
  'Branch': 'Branch Master',
  'B2B': 'B2B Master',
  'Doctor': 'Doctor Master',
  'Test': 'Test Master',
  'SampleRegister': 'Sample Registration',
  'TestResult': 'Test Result',
  'TestApproval': 'Test Approval',
  'PaymentMode': 'Payment Mode Master',
  'Login': 'User Login',
  'Register': 'User Registration',
  'ReportDashboard':'Report Dashboard'
};
@Component({
  selector: 'app-sidenav-bar',
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './sidenav-bar.component.html',
  styleUrl: './sidenav-bar.component.css'
})

export class SidenavBarComponent implements OnInit {
  sidenavWidth: string = '0'; // Initially, the sidebar is closed
  activeSection: string = ''; // Stores which section is currently open
  searchQuery: string = ''; // Search query

  masterMenu: any[] = [];
  transactionMenu: any[] = [];
  financeMenu: any[] = [];
  accountMenu: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadMenusFromLocalStorage();
  }

  loadMenusFromLocalStorage() {
    // this.transactionMenu.push({ 
    //   name: 'Dashboard', 
    //   route: '/dashboard' 
    // });
    
    const storedMenus = localStorage.getItem('Menus');
  if (storedMenus) {
    const parsedMenus: MenuModel[] = JSON.parse(storedMenus);
    console.log("Loaded Menus:", parsedMenus);

    this.masterMenu = parsedMenus
      .filter(m => ['Country', 'State', 'District', 'City', 'Area', 'Service', 'Branch', 'B2B', 'Doctor', 'Test'].includes(m.MenuName))
      .map(m => ({ name: MENU_DISPLAY_NAMES[m.MenuName] || m.MenuName, route: `/${m.MenuName.toLowerCase()}/${m.MenuName.toLowerCase()}-list` }));

    this.transactionMenu = parsedMenus
      .filter(m => ['SampleRegister', 'TestResult', 'TestApproval','ReportDashboard'].includes(m.MenuName))
      .map(m => ({ name: MENU_DISPLAY_NAMES[m.MenuName] || m.MenuName, route: `/${m.MenuName.toLowerCase()}/${m.MenuName.toLowerCase()}-list` }));

    this.financeMenu = parsedMenus
      .filter(m => ['PaymentMode'].includes(m.MenuName))
      .map(m => ({ name: MENU_DISPLAY_NAMES[m.MenuName] || m.MenuName, route: `/${m.MenuName.toLowerCase()}/${m.MenuName.toLowerCase()}-list` }));

    this.accountMenu = parsedMenus
      .filter(m => m.MenuName === 'Register')
      .map(m => ({ name: MENU_DISPLAY_NAMES[m.MenuName] || m.MenuName, route: `/${m.MenuName.toLowerCase()}/register-list` }));
  }

  // ✅ Ensure empty arrays are assigned to avoid undefined/null
  this.masterMenu = this.masterMenu && this.masterMenu.length ? this.masterMenu : [];
  this.transactionMenu = this.transactionMenu && this.transactionMenu.length ? this.transactionMenu : [];
  this.financeMenu = this.financeMenu && this.financeMenu.length ? this.financeMenu : [];
  this.accountMenu = this.accountMenu && this.accountMenu.length ? this.accountMenu : [];
  }

  get filteredMasterMenu() {
    return this.searchQuery ? this.masterMenu?.filter(item => item.name.toLowerCase().includes(this.searchQuery.toLowerCase())) : this.masterMenu;
  }

  get filteredTransactionMenu() {
    return this.searchQuery ? this.transactionMenu?.filter(item => item.name.toLowerCase().includes(this.searchQuery.toLowerCase())) : this.transactionMenu;
  }

  get filteredFinanceMenu() {
    return this.searchQuery ? this.financeMenu?.filter(item => item.name.toLowerCase().includes(this.searchQuery.toLowerCase())) : this.financeMenu;
  }

  get filteredAccountMenu() {
    return this.searchQuery ? this.accountMenu?.filter(item => item.name.toLowerCase().includes(this.searchQuery.toLowerCase())) : this.accountMenu;
  }

  onSearch() {
    const filteredResults = this.getFilteredResults();
    if (filteredResults.length === 1 && filteredResults[0].name.toLowerCase() === this.searchQuery.toLowerCase()) {
      this.router.navigate([filteredResults[0].route]);
      this.closeNav();
    } else if (filteredResults.length > 0) {
      this.openSection('master');
    }
  }

  getFilteredResults() {
    return [
      ...(this.filteredMasterMenu || []),
      ...(this.filteredTransactionMenu || []),
      ...(this.filteredFinanceMenu || []),
      ...(this.filteredAccountMenu || [])
    ];
  }

  openNav() {
    this.sidenavWidth = '250px';
  }

  closeNav() {
    this.sidenavWidth = '0';
    this.searchQuery = ''; 
  }

  toggleSection(section: string) {
    this.activeSection = this.activeSection === section ? '' : section;
  }

  openSection(section: string) {
    this.activeSection = section;
  }
}
//    sidenavWidth: string = '0';  // Initially, the sidebar is closed
//    isMasterMenuOpen = false;
//    isTransactionMenuOpen = false;  // Whether the Transaction dropdown is open
//    isFinanceMenuOpen = false;   // Whether the Finance dropdown is open
//    isAccountMenuOpen=false;
//    activeSection: string = '';  // Stores which section is currently open (expanded)
//    searchQuery: string = '';  // Search query
//    searchResult: any[] = [];  // To store filtered items when user types
// constructor(private router:Router){}
//   // Static arrays for each menu section
//  // Static menu items for each section with their associated routes
//  masterMenu = [
//   { name: 'Country', route: '/Country/country-list' },
//   { name: 'State', route: '/State/state-list' },
//   { name: 'District', route: '/District/district-list' },
//   { name: 'City', route: '/City/city-list' },
//   { name: 'Area', route: '/Area/area-list' },
//   { name: 'Service Master', route: '/Service/service-list' },
//   { name: 'Branch Master', route: '/Branch/branch-list' },
//   { name: 'B2B Master', route: '/B2B/b2b-list' },
//   { name: 'Doctor Master', route: '/Doctor/doctor-list' },
//   { name: 'Test Master', route: '/Test/test-list' },
// ];

// transactionMenu = [
//   { name: 'SampleRegisteration', route: '/SampleRegister/sampleregister-list' },
//   { name: 'Test Result', route: '/TestResult/testresult-list' },
//   { name: 'Test Approval', route: '/TestApproval/testapproval-list' }


// ];

// financeMenu = [
//   { name: 'Payment Mode Master', route: '/Payment/paymentmode-list' }
// ];

// accountMenu = [
//   { name: 'Login', route: '/login' },
//   { name: 'Forgot Password', route: '/forgot-password' },
//   { name: 'User Registration', route: '/register/register-list' },

// ];

//   // Filter the menu items dynamically based on the search query
//   get filteredMasterMenu() {
//     if (this.searchQuery === '') {
//       return this.masterMenu;  // If searchQuery is empty, return all items
//     }
//     return this.masterMenu.filter(item => 
//       item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
//     );
//   }

//   get filteredTransactionMenu() {
//     if (this.searchQuery === '') {
//       return this.transactionMenu;
//     }
//     return this.transactionMenu.filter(item => 
//       item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
//     );
//   }

//   get filteredFinanceMenu() {
//     if (this.searchQuery === '') {
//       return this.financeMenu;
//     }
//     return this.financeMenu.filter(item => 
//       item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
//     );
//   }

//   get filteredAccountMenu() {
//     if (this.searchQuery === '') {
//       return this.accountMenu;
//     }
//     return this.accountMenu.filter(item => 
//       item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
//     );
//   }
//  // Method to handle the real-time typing and automatic redirection if there's an exact match
//  onSearch() {
//   const filteredResults = this.getFilteredResults();

//   // If there is exactly one matching result and the search is an exact match, redirect immediately
//   if (filteredResults.length === 1 && filteredResults[0].name.toLowerCase() === this.searchQuery.toLowerCase()) {
//     this.router.navigate([filteredResults[0].route]); // Navigate to the corresponding route
//     this.closeNav(); // Close the sidebar after navigation
//   } else if (filteredResults.length > 0) {
//     // If multiple results, expand the section to show them
//     this.openSection('master'); // You can modify this to any other section if needed
//   }
// }

// // Function to get all filtered results (combining results from all sections)
// getFilteredResults() {
//   let results = [];
//   results.push(...this.filteredMasterMenu);
//   results.push(...this.filteredTransactionMenu);
//   results.push(...this.filteredFinanceMenu);
//   results.push(...this.filteredAccountMenu);
//   return results;
// }
//   // Method to open a section dynamically (expand/collapse)
//   openSection(section: string) {
//     this.activeSection = section;  // Expand the selected section
//   }

//   // Method to open the sidebar
//   openNav() {
//     this.sidenavWidth = '250px';
//   }

//   // Method to close the sidebar
//   closeNav() {
//     this.sidenavWidth = '0';
//     this.searchQuery = '';  // Clear the search query

//   }
//  // Method to toggle sections (open or close)
//  toggleSection(section: string) {
//   // If the section clicked is already active, close it, otherwise open it
//   this.activeSection = this.activeSection === section ? '' : section;
// }
// }
