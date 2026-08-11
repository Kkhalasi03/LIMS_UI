import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SampleRegisterService } from '../../../../Service/sample-register.service';
import { CityService } from '../../../../Service/city.service';
import { AreaService } from '../../../../Service/area.service';
import { SeviceMasterService } from '../../../../Service/sevice-master.service';

@Component({
  selector: 'app-sample-register-edit',
  imports: [RouterModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './sample-register-edit.component.html',
  styleUrl: './sample-register-edit.component.css'
})
export class SampleRegisterEditComponent {
  sampleregistrationForm: FormGroup;
  registerser = inject(SampleRegisterService);
  cities: any[] = [];
  areas: any[] = [];
  servicesformUser:any[]=[];
  cityser=inject(CityService);
  areaser=inject(AreaService);
  serviceser = inject(SeviceMasterService);  // Inject the ServiceService for API calls
  age: number = 0; // Initialize age to 0
  selectedServices :number[]= [];
  selectedServiceDetails: any[] = []; // Array to hold detailed info about selected services
  services = [
    { ServiceId: 1, ServiceName: 'Service 1', ServiceCode: 'S1' },
    { ServiceId: 2, ServiceName: 'Service 2', ServiceCode: 'S2' },
    { ServiceId: 3, ServiceName: 'Service 3', ServiceCode: 'S3' }
  ];
  selectedServiceIds: number[] = []; // Array to store selected service IDs


  constructor(private router: Router) {
    // Initialize the registrationForm with additional fields
    this.sampleregistrationForm = new FormGroup({
      // SampleRegisterId:new FormControl(null),
      MobileNo: new FormControl('', []),
      Title: new FormControl('', []),
      FirstName: new FormControl('', []),
      MiddleName: new FormControl(''),
      LastName: new FormControl('', []),
      DOB: new FormControl('', []),
      Age: new FormControl('',[]), // Calculated based on DOB
      Gender: new FormControl('male', []),
      EmailId: new FormControl('', []),
      Address: new FormControl('', ),
      CityId: new FormControl(null),
      AreaId: new FormControl(null ),
      ServiceId:new FormControl(null)
    });
    
  }
  ngOnInit(): void {
    // Fetching States, Cities, Areas, and Services on component load
    this.fetchCities();
    this.fetchAreas();
    this.fetchServices();
    
  }
  calculateAge(): void {
    const dob = this.sampleregistrationForm.get('DOB')?.value;
    if (dob) {
      const birthDate = new Date(dob); // Create a date object from the DOB
      const today = new Date(); // Get the current date

      // Calculate the difference in years
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      // Adjust age if the birthday has not occurred yet this year
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      // Update the age field in the form
      this.age = age;
      this.sampleregistrationForm.patchValue({ Age: this.age });
    }
  }



  // Fetch Cities
  fetchCities(): void {
    this.cityser.getCities().subscribe((data) => {
      this.cities = data;
    });
  }

  // Fetch Areas
  fetchAreas(): void {
    this.areaser.getAreas().subscribe((data) => {
      this.areas = data;
    });
  }

  // Fetch Services
  fetchServices(): void {
    this.serviceser.getServices().subscribe((data) => {
      this.services = data;
    });
  }
  // addServiceToList() {
  //   const serviceId = this.sampleregistrationForm.get('ServiceId')?.value;
  //   console.log(serviceId);
  //   if (serviceId && !this.selectedServiceIds.includes(serviceId)) {
  //     this.selectedServiceIds.push(serviceId);
  //   }
  //   console.log(this.selectedServiceIds);
  // }
  // getServiceNameById(serviceId: number): string {
  //   console.log(this.services);
  //   const service = this.services.find(s => s.ServiceId.toString().trim() === serviceId.toString().trim());
  //   console.log(service);
  //   return service ? service.ServiceName : '';
  // }

  // Function to add a service to the selected list
  addServiceToList() {
    const selectedServiceId = this.sampleregistrationForm.get('ServiceId')?.value;

    // Check if the serviceId is already selected
    if (selectedServiceId) {
      const selectedService =  this.services.find(s => s.ServiceId.toString().trim() === selectedServiceId.toString().trim());;
      if (selectedService && !this.selectedServiceDetails.some(item => item.ServiceId === selectedServiceId)) {
        this.selectedServiceDetails.push({
          ServiceId: selectedService.ServiceId,
          ServiceName: selectedService.ServiceName,
          ServiceCode: selectedService.ServiceCode
        });
      }
    }
  }

  // Function to remove a service from the selected list
  removeService(index: number) {
    this.selectedServiceDetails.splice(index, 1); // Remove service by index
  }
  onSubmit() {debugger
    if (this.sampleregistrationForm.valid) {
      const formData = this.sampleregistrationForm.value;
  
      // Prepare the payload for the Sample Register API (First API call)
      const userPayload = {
        SampleRegisterId: formData.SampleRegisterId,
        MobileNo: formData.MobileNo,
        Title: formData.Title,
        FirstName: formData.FirstName,
        MiddleName: formData.MiddleName,
        LastName: formData.LastName,
        DOB: formData.DOB,
        Age: formData.Age,
        Gender: formData.Gender,
        EmailId: formData.EmailId,
        Address: formData.Address,
        CityId: formData.CityId,
        AreaId: formData.AreaId
      };
      debugger
  
      // Call Sample Register API to create the user (First API call)
      this.registerser.postSampleRegister(userPayload).subscribe(
        response => {
          console.log('Sample Register API Response:', response);
          console.log(response.SampleRegisterId);
          // After the first API call succeeds, send each selected service to the second API
          const sampleRegisterId =response.sampleRegisterId;  // Assuming the response contains the SampleRegisterId
          console.log(sampleRegisterId);
          // Prepare the payload for each service (Second API call for each service)
          this.selectedServiceIds.forEach(serviceId => {
            const servicePayload = {
              SampleRegisterId: sampleRegisterId, // Pass the SampleRegisterId from the response of the first API
              ServiceId: serviceId,  // Send each selected service ID individually
            };
            console.log(servicePayload);
            // Call the Sample Register Service API (Second API call for each service)
            this.registerser.postSampleRegisterService(servicePayload).subscribe(
              serviceResponse => {
                console.log('Sample Register Service API Response:', serviceResponse);
                // Handle success for each service, maybe navigate or show a success message
              },
              error => {
                console.error('Error in Sample Register Service API:', error);
                // Handle error for each service, show an error message
              }
            );
          });
        },
        error => {
          console.error('Error in Sample Register API:', error);
          // Handle error for the user creation, show an error message
        }
      );
    }
  }
   

   // Submit function
  // onSubmit() {debugger
  //   const formData = this.sampleregistrationForm.value; // Get form data
  //   if (this.sampleregistrationForm.valid) {
  //     console.log(this.sampleregistrationForm.value);

  //     if (formData.DOB) {
  //       const dobDate = new Date(formData.DOB); // Parse the string into a Date object
  //       formData.DOB = dobDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
  //     }
      // Call the postUser method of the service
      // this.registerser.postSampleRegister(formData).subscribe({
  //       next: (response) => {
  //         console.log('Response:', response);
  //               },
  //       error: (err) => {
  //         console.error('Error:', err);
  //         alert('Registration failed due to an error.');
  //       }
  //     });
  //   } else {
  //     console.error('Form is invalid or passwords do not match');
  //   }
  // }

  // Reset the form
  onReset() {
    this.sampleregistrationForm.reset();
    this.sampleregistrationForm.get('Gender')?.setValue('male'); // Reset default gender
    this.selectedServices = [];

  }
}
