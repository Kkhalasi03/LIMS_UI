import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormControl,FormGroup,FormsModule,NgForm,ReactiveFormsModule } from '@angular/forms';
import { CountryService } from '../../../../Service/countryservice.service';
import { CountryModel } from '../../../../Model/country-model';
@Component({
  selector: 'app-country-edit',
  imports: [RouterModule,ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './country-edit.component.html',
  styleUrl: './country-edit.component.css'
})
export class CountryEditComponent implements AfterViewInit{
  isFormVisible = false;
  showPopup = false;
  popupMessage = '';
  isEditMode = false;
  countryForm: FormGroup;

  CountryService = inject(CountryService);

  constructor() {
    this.countryForm = new FormGroup({
      CountryId: new FormControl(0),
      CountryName: new FormControl(''),
      IsActive: new FormControl<boolean>(true, { nonNullable: true }) // Default active
    });
  }

  ngAfterViewInit() {}

  openForm() {
    this.isEditMode = false;
    this.countryForm.reset({CountryName:'',IsActive:true});
    this.countryForm.reset();
    this.countryForm.get('CountryId')?.setValue(0);
    this.countryForm.get('countryId')?.disable();
    this.isFormVisible = true;
    this.isEditMode = false;
  }

  openFormEdit(country: CountryModel) {debugger
    this.isEditMode = true;
    this.countryForm.enable(); // Enable all fields

    this.countryForm.setValue({
       CountryId: country.CountryId ?? 0,
       CountryName: country.CountryName,
       IsActive: country.IsActive
       });
    this.countryForm.get('CountryId')?.disable(); // Disable B2BId in Edit mode
    this.isFormVisible = true;
  }

  closeForm() {
    this.isFormVisible = false;
  }

  closePopup() {
    this.showPopup = false;
  }

  onAddsubmit() {debugger
    const formData = this.countryForm.value;
    this.CountryService.postCountry(formData).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.isFormVisible = false;
        this.popupMessage = response.message;
        this.showPopup = true;
      },
      error: (err) => {
        console.error('Error:', err);
        this.isFormVisible = false;
        this.popupMessage = err.error.message || 'An error occurred.';
        this.showPopup = true;
      }
    });
  }

  onSubmit() {debugger
    const formData: CountryModel = this.countryForm.getRawValue();
    
     //const formData = this.countryForm.value;
     console.log(formData);
 
     this.CountryService.editCountry(formData).subscribe({
       next: (response) => {
         console.log('Response:', response);
         this.isFormVisible = false; // Close form modal
         this.popupMessage = response.message;
         this.showPopup = true; // Show success popup
       },
       error: (err) => {
         console.error('Error:', err);
         this.isFormVisible = false;
         this.popupMessage = err.error.message || 'An error occurred.';
         this.showPopup = true; // Show error popup
       }
    });
  }
  //  // Component properties
  //  isFormVisible = false;
  //  showPopup: boolean = false;
  //  popupMessage: string = '';
  //  isEditMode: boolean = false; // Flag to toggle Add/Edit modes
 
  //  countryForm: FormGroup; // Reactive form group
 
  //  // Injecting the service to interact with the backend
  //  Countryser = inject(CountryService);
 
  //  // Initialize form group with form controls
  //  constructor() {
  //    this.countryForm = new FormGroup({
  //      CountryId: new FormControl(null),
  //      CountryName: new FormControl('', [/* Add Validators Here */])
  //    });
  //  }
 
  //  ngAfterViewInit() {
  //    // Perform any after view initialization tasks
  //  }
 
  //  // Open the form in Add mode
  //  openForm() {
  //    this.isEditMode = false;
  //    this.countryForm.reset(); // Reset form for a fresh Add
  //    this.countryForm.get('CountryId')?.disable(); // Disable CountryId field in Add mode
  //    this.isFormVisible = true;
  //  }
 
  //  // Open the form in Edit mode and populate it with existing country data
  //  openFormEdit(countryId: number, countryName: string) {
  //    this.isEditMode = true;
  //    this.countryForm.setValue({ CountryId: countryId, CountryName: countryName }); // Pre-fill the form with data
  //    this.countryForm.get('CountryId')?.markAsPristine();  // Optionally mark as pristine
  //    this.isFormVisible = true;
  //  }
 
  //  // Close the form modal
  //  closeForm() {
  //    this.isFormVisible = false;
  //  }
 
  //  // Close the popup modal
  //  closePopup() {
  //    this.showPopup = false;
  //  }
 
  //  // Submit the form to add a new country
  //  onAddsubmit() {debugger
  //    const formData = this.countryForm.value;
 
  //    this.Countryser.postcountry(formData).subscribe({
  //      next: (response) => {
  //        console.log('Response:', response);
  //        this.isFormVisible = false; // Close form modal
  //        this.popupMessage = response.message;
  //        this.showPopup = true; // Show success popup
  //      },
  //      error: (err) => {
  //        console.error('Error:', err);
  //        this.isFormVisible = false;
  //        this.popupMessage = err.error.message || 'An error occurred.';
  //        this.showPopup = true; // Show error popup
  //      }
  //    });
  //  }
 
  //  // Submit the form to edit an existing country
  //  onSubmit() {
  //    const formData = this.countryForm.value;
  //    console.log(formData);
 
  //    this.Countryser.EditCountry(formData).subscribe({
  //      next: (response) => {
  //        console.log('Response:', response);
  //        this.isFormVisible = false; // Close form modal
  //        this.popupMessage = response.message;
  //        this.showPopup = true; // Show success popup
  //      },
  //      error: (err) => {
  //        console.error('Error:', err);
  //        this.isFormVisible = false;
  //        this.popupMessage = err.error.message || 'An error occurred.';
  //        this.showPopup = true; // Show error popup
  //      }
  //    });
  //  }
  // countryId: number=0;
  // countryName:string='';
  // isFormVisibleADD=false;
  // isFormVisible=false;
  // showPopupAdd:boolean=false;
  // showPopup:boolean=false;
  // popupMessage: string = '';
  // modalData: { CountryId: number | null, CountryName: string,Status?:string } = { CountryId: null, CountryName: '',Status:'' };
  // Countryser=inject(CountryService);
  // @ViewChild('countryEditComponent') countryEditComponent!: CountryEditComponent;

  // ngAfterViewInit() {
  //   if (this.countryEditComponent) {
  //     console.log('CountryEditComponent initialized:', this.countryEditComponent);
  //   }
  // }
  // openForm() {
  //   this.isFormVisibleADD = true;

  //   if (this.countryEditComponent) {
  //     this.countryEditComponent.openForm();
  //   } else {
  //     console.log('CountryEditComponent is undefined');
  //   }
  // }
  // openFormEdit(CountryId: number, CountryName: string) {
  //   this.modalData = { CountryId,CountryName }; // Populate the modal with the selected row's data
  //   console.log(this.modalData);
  //   this.isFormVisible = true;

  //   if (this.countryEditComponent) {
  //     this.countryEditComponent.openFormEdit(CountryId,CountryName);
  //   } else {
  //     console.log('CountryEditComponent is undefined');
  //   }
  // }
  // closeForm(): void {
  //   this.isFormVisibleADD=false;
  // }
  // closeFormEdit(): void {
  //   this.isFormVisible=false;
  // }
  // onAddsubmit(Countries: { CountryId: number; CountryName: string }) {
  
  //     // Proceed with the API call
  //     this.Countryser.postcountry(Countries).subscribe({
  //       next: (response) => {
  //         console.log('Response:', response);
  //         this.isFormVisibleADD = false; // Close the form modal first
  //         this.popupMessage = response.message; // Assign response message
  //         this.showPopupAdd = true; // Show popup with success message
  //       },
  //       error: (err) => {
  //         console.error('Error:', err);
  //         this.isFormVisibleADD = false; // Close the form modal first
  //         this.popupMessage = err.error.message || 'An error occurred.'; // Show error message
  //         this.showPopupAdd = true; // Show popup with error message
  //       }
  //     });
  // }
  // closePopupAdd() {
  //   this.showPopupAdd = false; // Close popup
  // }
  // closePopup() {
  //   this.showPopup = false; // Close popup
  // }
  // onSubmit(Countries:{CountryId:number,CountryName:string})
  // {
  //   console.log(Countries);
  //   this.Countryser.EditCountry(Countries).subscribe({
  //     next: (response) => {
  //         console.log('Response:', response);
  //         this.isFormVisible = false; // Close the form modal first
  //         this.popupMessage = response.message; // Assign response message
  //         this.showPopup = true; // Show popup
  //     },
  //     error: (err) => {
  //       console.error('Error:', err);
  //       this.isFormVisible = false; // Close the form modal first
  //       this.popupMessage = err.error.message || 'An error occurred.';
  //       this.showPopup = true; // Show popup even for errors
  //     }
  //   });
  // }
}

