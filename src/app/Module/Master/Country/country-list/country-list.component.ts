import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { CountryEditComponent } from '../country-edit/country-edit.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule ,NgForm, FormGroup, FormControl} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CountryService } from '../../../../Service/countryservice.service';
import { SidenavBarComponent } from "../../../../sidenav-bar/sidenav-bar.component";
import { CountryModel } from '../../../../Model/country-model';
@Component({
  selector: 'app-country-list',
  imports: [RouterModule, ReactiveFormsModule, FormsModule, CommonModule, CountryEditComponent, SidenavBarComponent],
  templateUrl: './country-list.component.html',
  styleUrl: './country-list.component.css'
})
export class CountryListComponent implements AfterViewInit{
  username: string | null = null;// know the user
  isFormVisibleADD = false;
  isTableVisible = false;
  isFormVisible = false;
  showPopup = false;
  hasSearched = false; // New flag to check if search was performed
  popupMessage = '';
  homeCountryId: number | null = null;
  homeCountryName = '';
  apiResponse: CountryModel[] = [];
  selectedValue: boolean | null = null;

  modalData: CountryModel = {
    CountryId: 0,
    CountryName: '',
    IsActive: true
  };
constructor(private router: Router){}
  CountryService = inject(CountryService);

  applyForm1 = new FormGroup({
    homeCountryId: new FormControl<number | null>(0),
    homeCountryName: new FormControl<string>(''),
    selectedValue: new FormControl<boolean | null>(null)
  });

  @ViewChild('countryEditComponent') countryEditComponent!: CountryEditComponent;
  ngAfterViewInit() {
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
    //  if (savedLoginData) {//for JSON DATA
    //    const parsedData = JSON.parse(savedLoginData);  // Parse JSON
    //    this.username = parsedData.UserName;  // Extract UserName
    //    console.log('Retrieved username:', this.username);
    //  } else {
    //    console.log('No user data found in SessionStorage');
    //  }
    if (!this.countryEditComponent) {
      console.error('CountryEditComponent instance is undefined');
    } else {
      console.log('CountryEditComponent instance initialized successfully');
    }
  }
  onLogout() {
    if (sessionStorage) {
      sessionStorage.clear(); // Clear all session data
    }
    this.router.navigate(['/login']); // Redirect to login page
  }
  openForm() {
    this.isFormVisibleADD = true;
    this.countryEditComponent?.openForm();
  }

  openFormEdit(country: CountryModel) {
    this.modalData = { ...country };
    console.log(this.modalData);
    this.isFormVisible = true; // Show the modal
    if (this.countryEditComponent) {
      this.countryEditComponent.openFormEdit(country); // Call the child component's method
    } else {
      console.log('CountryEditComponent instance is undefined');
    }
  }

  closeForm() {
    this.isFormVisibleADD = false;
  }

  closePopup() {
    this.showPopup = false;
    this.fetchAllData();
  }

  clearForm() {
    this.applyForm1.reset();
    this.apiResponse = [];
    this.isTableVisible = false;
    this.hasSearched=false;
  }
  
  closeFormEdit() {
    this.isFormVisible = false;
  }

  deleteForm(countryId: number | null) {
    if (countryId !== null) {
      this.CountryService.deleteCountry(countryId).subscribe({
        next: (response) => {
          this.popupMessage = response.message;
          this.showPopup = true;
        },
        error: (err) => {
          this.popupMessage = err.error.message || 'An error occurred.';
          this.showPopup = true;
        }
      });
    } else {
      alert("Please provide valid data");
    }
  }

  onSelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    const selectedValue = value === 'true' ? true : value === 'false' ? false : null;
    this.applyForm1.get('selectedValue')?.setValue(selectedValue);
    console.log('Selected value:', selectedValue);
  }

  searchApplication() {
    this.hasSearched=true;
    const searchParams: CountryModel = {
      CountryId: this.applyForm1.value.homeCountryId || 0,
      CountryName: this.applyForm1.value.homeCountryName || '',
      IsActive: this.applyForm1.value.selectedValue === null ? null : this.applyForm1.value.selectedValue === true ? true : false
    };

    if (!searchParams.CountryId && !searchParams.CountryName && searchParams.IsActive === null) {
      this.fetchAllData();
    } else {
      this.fetchFilteredData(searchParams);
    }
  }

  fetchAllData() {
    this.CountryService.getcountries().subscribe({
      next: (data: CountryModel[]) => {
        this.apiResponse = data;
        this.isTableVisible = true;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  fetchFilteredData(searchParams: CountryModel) {
    this.CountryService.getCountryByIdOrName(searchParams).subscribe({
      next: (data: CountryModel[]) => {
        this.apiResponse = data;
        this.isTableVisible = true;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
//   constructor(private route:Router){}
//   countryId: number=0;
//   countryName:string='';  
//   isFormVisibleADD = false;
//   apiResponse: any;
//   homeCountryId: number | null = null; // Allow null as the initial value
//   homeCountryName:string='';
//   showPopup: boolean = false;
//   popupMessage: string = '';
//   isTableVisible=false;
//   selectedValue: boolean | null = null;
//   public countryadd:any;
//   status!: string;
//   errorMessage!: string;
//   requestFinished=false;
//   requestValid=false;
//   isFormVisible = false;
//   modalData: { CountryId: number | null, CountryName: string,Status?:string } = { CountryId: null, CountryName: '',Status:'' };
//   Countryser=inject(CountryService);
//   applyForm1=new FormGroup({
//     homeCountryId:new FormControl(''),
//     homeCountryName:new FormControl(''),
//     selectedValue:new FormControl,
//   });
//   @ViewChild('countryEditComponent') countryEditComponent!: CountryEditComponent;

//   // Function to open the form
//   openForm() {
//     console.log("Opening country form...");
//     this.isFormVisibleADD = true; // Show the form
//     if (this.countryEditComponent) {
//       this.countryEditComponent.openForm(); // Call the child component's method
//     } else {
//       console.warn('CountryEditComponent instance is undefined');
//     }
//   }
//   openFormEdit(CountryId:number,CountryName:string){
//     this.modalData = { CountryId,CountryName }; // Populate the modal with the selected row's data
//     console.log(this.modalData);
//     this.isFormVisible = true; // Show the modal
//     if (this.countryEditComponent) {
//       this.countryEditComponent.openFormEdit(CountryId,CountryName); // Call the child component's method
//     } else {
//       console.log('CountryEditComponent instance is undefined');
//     }
//   }
//   // Function to close the form
//   closeForm() {
//     console.log("Closing country form...");
//     this.isFormVisibleADD = false; // Hide the form
//   }

//   closeFormEdit() {
//     this.isFormVisible= false; // Hide the form
//   }
//   closePopup() {
//     this.showPopup = false; // Close popup
//     this.fetchAllData();
//   }
//   clearForm() {
//     this.applyForm1.reset(); // Resets all fields in the form group
//     this.homeCountryId = null;
//     this.homeCountryName = '';
//     this.apiResponse = []; // Clear the table data
//     this.isTableVisible = false; // Hide the table when clearing the form
//   }
 
//   deleteForm(CountryId:number,CountryName:string) {
//     this.modalData = { CountryId,CountryName }; // Populate the modal with the selected row's data
//     // this.isFormVisible=false;
//     this.Countryser.DeleteCountry(CountryId).subscribe({
//       next: (response) => {
//           console.log('Response:', response);
//           this.popupMessage = response.message; // Assign response message
//           this.showPopup = true; // Show popup
//       },
//       error: (err) => {
//         console.error('Error:', err);
//         this.popupMessage = err.error.message || 'An error occurred.';
//         this.showPopup = true; // Show popup even for errors
//       }
//     });
//   }
//   onSelected(event: Event): void {
//     const target = event.target as HTMLSelectElement;
//     const value = target.value;
//      // Update the FormControl with boolean values, based on selected value
//     const selectedValue = value === 'true' ? true : (value === 'false' ? false : null);
//     this.applyForm1.get('selectedValue')?.setValue(selectedValue);
//      console.log('Selected value:', selectedValue);
//  }
//    searchApplication()
//    {
//      // console.log(this.selectedValue);
//       // Retrieve the values from the form controls
//       const cid = Number(this.applyForm1.value.homeCountryId) || 0; // Convert to number, default to 0 if invalid
//       const cnm = this.applyForm1.value.homeCountryName ?? ''; // Default to empty string if empty
//       const selectedstatus=this.applyForm1.value.selectedValue;
//       // Prepare the search parameters to send in the POST request
//       const searchParams = {
//         CountryId: cid,
//         CountryName: cnm,
//         isActive:selectedstatus,
//       };
    
//       // If both cid and cnm are empty or 0, fetch all data, otherwise fetch filtered data
//       if (cid === 0 && !cnm&& selectedstatus===null) {
//         // Fetch all data if both cid and cnm are empty or cid is 0
//         this.fetchAllData();
//       } else {
//         // Otherwise, fetch filtered data using POST method
//         this.fetchFilteredData(searchParams);
//       }
//    }
//  fetchAllData()
//  {
//    this.Countryser.getcountries().subscribe({
//        next:(data)=>{       
//          console.log(data);
//          this.isTableVisible = true;
//          if (typeof data === 'string') {
//            this.apiResponse = JSON.parse(data);
//          } else {
//            this.apiResponse = data;
//          }
//          //this.countryser.setData(this.apiResponse);
//        },
//        error:(err)=>{console.log(err);}
//      });
  
//  }
//  fetchFilteredData(searchParams:{CountryId:number,CountryName:string,isActive:boolean})
//  {
//    console.log(searchParams);
//    this.Countryser.getcountryByIdORName(searchParams).subscribe({
//      next:(data)=>{       
//        console.log(data);
//        this.isTableVisible = true;
//        if (typeof data === 'string') {
//          this.apiResponse = JSON.parse(data);
//        } else {
//          this.apiResponse = data;
//        }
//        //this.countryser.setData(this.apiResponse);
//      },
//      error:(err)=>{console.log(err);}
//    });
 
//  }
}
