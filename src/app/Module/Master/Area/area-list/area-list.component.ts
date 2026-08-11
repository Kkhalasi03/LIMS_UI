import { Component, inject, ViewChild } from '@angular/core';
import { SidenavBarComponent } from "../../../../sidenav-bar/sidenav-bar.component";
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AreaEditComponent } from '../area-edit/area-edit.component';
import { AreaService } from '../../../../Service/area.service';
import { CityService } from '../../../../Service/city.service';

@Component({
  selector: 'app-area-list',
  imports: [RouterModule, ReactiveFormsModule, FormsModule, CommonModule, AreaEditComponent, SidenavBarComponent],
  templateUrl: './area-list.component.html',
  styleUrl: './area-list.component.css'
})
export class AreaListComponent {
  // Variables for Area data
  username:string|null=null;
  areaId: number = 0;
  areaName: string = '';
  isFormVisibleADD = false;
  apiResponse: any;
  homeAreaId: number | null = null; // Allow null as the initial value
  homeAreaName: string = '';
  showPopup: boolean = false;
  popupMessage: string = '';
  isTableVisible = false;
  hasSearched = false; // New flag to check if search was performed
  selectedValue: boolean | null = null;
  status!: string;
  errorMessage!: string;
  requestFinished = false;
  requestValid = false;
  isFormVisible = false;
  public cities: any[] = [];

  modalData: { AreaId: number | null, AreaName: string, CityId:number|null, Pincode:string } = { AreaId: null, AreaName: '', CityId:null, Pincode:''};
constructor(private router:Router){}
  // Inject AreaService to fetch data
  AreaSer = inject(AreaService);
  cityser=inject(CityService);
  // Define the form group for filtering
  applyForm1 = new FormGroup({
    homeAreaId: new FormControl(''),
    homeAreaName: new FormControl(''),
    selectedValue: new FormControl,
  });

  // @ViewChild to reference AreaEditComponent
  @ViewChild('areaEditComponent') areaEditComponent!: AreaEditComponent;
  // Fetch cities when the component is initialized
  ngOnInit() {
    this.fetchCities();  // Fetch cities and assign to cities[] array
    if (this.areaEditComponent) {
      console.log('AreaEditComponent is available:', this.areaEditComponent);
    } else {
      console.warn('AreaEditComponent is undefined');
    }
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
  onLogout() {
    if (sessionStorage) {
      sessionStorage.clear(); // Clear all session data
    }
    this.router.navigate(['/login']); // Redirect to login page
  }
  // Fetch Cities Data
fetchCities(): void {
  this.cityser.getCities().subscribe((data) => {
    this.cities = data;  // Assign the response data to the cities array
  });
}

// Get City Name by CityId
getCityName(CityId: number): string {
  const city = this.cities.find(c => c.CityId === CityId);  // Search for the city by CityId
  return city ? city.CityName : 'Unknown';  // Return the CityName if found, otherwise return 'Unknown'
}

  // Open form to add new area
openForm() {
  console.log("Opening area form...");
  this.isFormVisibleADD = true; // Show the form
  if (this.areaEditComponent) {
    this.areaEditComponent.openForm(); // Call the child component's method
  } else {
    console.warn('AreaEditComponent instance is undefined');
  }
}

  // Open form to edit existing area
  openFormEdit(AreaId: number, AreaName: string, CityId: number, Pincode: string) {
    console.log('Edit Form Parameters:', { AreaId, AreaName, CityId, Pincode }); // Debug log
    this.modalData = { AreaId, AreaName, CityId, Pincode }; // Populate the modal data
    this.isFormVisible = true; // Show the form
  
    setTimeout(() => {
      if (this.areaEditComponent) {
        this.areaEditComponent.openFormEdit(AreaId, AreaName, CityId, Pincode); // Call the child method
      } else {
        console.warn('AreaEditComponent is not initialized yet.');
      }
    });
  }
  

  // Close the form for adding area
  closeForm() {
    console.log("Closing area form...");
    this.isFormVisibleADD = false; // Hide the form
  }

  // Close the form for editing area
  closeFormEdit() {
    this.isFormVisible = false; // Hide the form
  }

  // Close the popup modal and refresh the table
  closePopup() {
    this.showPopup = false; // Close popup
    this.fetchAllData(); // Refresh the data
  }

  // Clear the filter form
  clearForm() {
    this.applyForm1.reset(); // Resets all fields in the form group
    this.homeAreaId = null;
    this.homeAreaName = '';
    this.apiResponse = []; // Clear the table data
    this.isTableVisible = false; // Hide the table when clearing the form
    this.hasSearched=false;
  }

  // Delete an area
  deleteForm(AreaId: number, AreaName: string) {
    this.modalData = { AreaId, AreaName,CityId:null,Pincode:'' }; // Populate the modal with the selected row's data
    this.AreaSer.deleteArea(AreaId).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.popupMessage = response.message; // Assign response message
        this.showPopup = true; // Show popup
      },
      error: (err) => {
        console.error('Error:', err);
        this.popupMessage = err.error.message || 'An error occurred.';
        this.showPopup = true; // Show popup even for errors
      }
    });
  }

  // Handle the selection of status filter
  onSelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;

    // Update the FormControl with boolean values, based on selected value
    const selectedValue = value === 'true' ? true : (value === 'false' ? false : null);
    this.applyForm1.get('selectedValue')?.setValue(selectedValue);
    console.log('Selected value:', selectedValue);
  }

  // Search application based on filters
  searchApplication() {
    this.hasSearched=true;
    const areaId = Number(this.applyForm1.value.homeAreaId) || 0; // Convert to number, default to 0 if invalid
    const areaName = this.applyForm1.value.homeAreaName ?? ''; // Default to empty string if empty
    const selectedStatus = this.applyForm1.value.selectedValue;

    const searchParams = {
      AreaId: areaId,
      AreaName: areaName,
      isActive: selectedStatus,
    };

    if (areaId === 0 && !areaName && selectedStatus === null) {
      // Fetch all data if both areaId and areaName are empty or areaId is 0
      this.fetchAllData();
    } else {
      // Otherwise, fetch filtered data using POST method
      this.fetchFilteredData(searchParams);
    }
  }

  // Fetch all data from the server
  fetchAllData() {
    this.AreaSer.getAreas().subscribe({
      next: (data) => {
        console.log(data);
        this.isTableVisible = true;
        this.apiResponse = typeof data === 'string' ? JSON.parse(data) : data;
      },
      error: (err) => { console.log(err); }
    });
  }

  // Fetch filtered data from the server based on search parameters
  fetchFilteredData(searchParams: { AreaId: number, AreaName: string, isActive: boolean }) {
    console.log(searchParams);
    this.AreaSer.getAreasByIdOrName(searchParams).subscribe({
      next: (data) => {
        console.log(data);
        this.isTableVisible = true;
        this.apiResponse = typeof data === 'string' ? JSON.parse(data) : data;
      },
      error: (err) => { console.log(err); }
    });
  }
}
