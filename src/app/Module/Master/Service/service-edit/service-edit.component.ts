import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SeviceMasterService } from '../../../../Service/sevice-master.service';
import { ServiceModel } from '../../../../Model/service-model';
import { ServiceTestModel } from '../../../../Model/service-test-model';
import bootstrap from '../../../../../main.server';

@Component({
  selector: 'app-service-edit',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './service-edit.component.html',
  styleUrl: './service-edit.component.css'
})
export class ServiceEditComponent implements OnInit{
  activeTab: string = 'general'; // Default tab
  serviceTestMappings: any[] = []; // Stores mapped TestIds for the Service
  testMasterList: any[] = []; // List of available tests from TestMaster
  selectedTestId: number | null = null;
  isMappingFormVisible = false;
  isFormVisible = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  isEditMode: boolean = false;

  // Form group for service master data
  serviceForm: FormGroup;

  // Injecting the service
  ServiceMasterService = inject(SeviceMasterService);

  constructor() {
    // Initialize form group
    this.serviceForm = new FormGroup({
      ServiceId: new FormControl<number>(0), // Nullable for Add mode
      ServiceCode: new FormControl<string>('', { nonNullable: true }),
      ServiceName: new FormControl<string>('', { nonNullable: true }),
      B2BAmount: new FormControl<number>(0, { nonNullable: true }),
      B2CAmount: new FormControl<number>(0, { nonNullable: true }),
      isActive: new FormControl<boolean>(true, { nonNullable: true }) // Default active
    });
  }
  
  ngOnInit() {
    if (this.isEditMode) {
      this.loadMappings();
      this.fetchTestMasterList();
    }
    this.fetchTestMasterList();

  }


  // Open form in Add mode
  openForm() {
    this.isEditMode = false;
    this.serviceForm.reset({
      ServiceCode: '',
      ServiceName: '',
      B2BAmount: 0,
      B2CAmount: 0,
      isActive: true
    });
    this.serviceForm.get('ServiceId')?.setValue(0); // Set ServiceId to 0 for Add mode
    this.serviceForm.get('ServiceId')?.disable(); // Disable ServiceId in Add mode
    this.isFormVisible = true;
  }

  // Open form in Edit mode
  openFormEdit(service:ServiceModel) {// Accept the service data
    this.isEditMode = true;
    this.serviceForm.enable(); // Enable all fields
    this.serviceForm.setValue({
      ServiceId: service.ServiceId ?? 0,
      ServiceCode: service.ServiceCode,
      ServiceName: service.ServiceName,
      B2BAmount: service.B2BAmount,
      B2CAmount: service.B2CAmount,
      isActive: service.isActive
    });
    this.serviceForm.get('ServiceId')?.disable(); // Disable ServiceId in Edit mode
    this.isFormVisible = true;
  }

  // Close form
  closeForm() {
    this.isFormVisible = false;
  }

  // Close popup
  closePopup() {
    this.showPopup = false;
  }

  // Submit form in Add mode
  onAddSubmit() {
    const formData = this.serviceForm.getRawValue(); // Get all values, including disabled ones
    console.log(formData);
    this.ServiceMasterService.postServiceMaster(formData).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.popupMessage = response.message;
        this.showPopup = true;
        this.isFormVisible = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.popupMessage = err.error.message || 'An error occurred.';
        this.showPopup = true;
      }
    });
  }

  // Submit form in Edit mode
  onSubmit() {
    const formData: any = this.serviceForm.getRawValue();

    this.ServiceMasterService.editServiceMaster(formData).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.popupMessage = response.message;
        this.showPopup = true;
        this.isFormVisible = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.popupMessage = err.error.message || 'An error occurred.';
        this.showPopup = true;
      }
    });
  }

// Fetch available tests from TestMaster
fetchTestMasterList() {
  this.ServiceMasterService.getAllTest().subscribe((data) => {
    this.testMasterList = data;
    console.log(this.testMasterList);
  });
}

// Load existing test mappings for this ServiceId
loadMappings() {
  const serviceId = this.serviceForm.get('ServiceId')?.value;
  this.ServiceMasterService.getServiceTestById(serviceId).subscribe((data) => {
    this.serviceTestMappings = data;
  });
}

// Open the Add Mapping Modal
openAddMappingModal() {
  this.isMappingFormVisible = true;
}

// Close Mapping Form
closeMappingForm() {
  this.isMappingFormVisible = false;
}

// Add Mapping to API
addMapping() {
  const serviceId = this.serviceForm.get('ServiceId')?.value;
  if (!serviceId || !this.selectedTestId) return;

  const mappingData: ServiceTestModel = { 
    ServiceId: serviceId, 
    TestId: [this.selectedTestId]  // Wrap TestId in an array
  };

  this.ServiceMasterService.postServiceTestMapping(mappingData).subscribe(() => {
    this.fetchMappings(); // Refresh the table
    this.isMappingFormVisible = false;
  });
}
fetchMappings() {
  const serviceId = this.serviceForm.get('ServiceId')?.value;
  console.log("ServiceID: "+serviceId);
    // Construct ServiceTestModel with SampleRegisterId = 0
  const requestData: ServiceTestModel = {
    ServiceId: serviceId,
    TestId: [], // Assuming TestId array is not needed for fetching mappings
  };
  if (!serviceId || serviceId === 0) {
    console.warn("fetchMappings: Invalid ServiceId", serviceId);
    return;
  }

  this.ServiceMasterService.getServiceTestById(requestData).subscribe({
    next: (data) => {
      console.log("Mappings fetched:", data);
      
      this.serviceTestMappings = data || []; // Ensure it's an array
    },
    error: (err) => {
      console.error("Error fetching mappings:", err);
    }
  });
}
getTestName(TestId: number): string {
  const test = this.testMasterList.find(t => t.TestId === TestId);
  return test ? test.TestName : 'Unknown Test';
}
deleteForm(ServiceTestId: number) {

  // Call the update API instead of delete to toggle isActive
  this.ServiceMasterService.deleteServiceTest(ServiceTestId).subscribe({
    next: (response) => {
      console.log('Response:', response);
      this.fetchMappings();
      // this.popupMessage = response.message; // Assign response message
      // this.showPopup = true; // Show popup
    },
    error: (err) => {
      console.error('Error:', err);
      this.popupMessage = err.error.message || 'An error occurred.';
      this.showPopup = true; // Show popup even for errors
    }
  });
}
}
