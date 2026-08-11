import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SampleRegisterService } from '../../../../Service/sample-register.service';
import { SampleRegisterModel } from '../../../../Model/sample-register-model';
import { SampleServiceModel } from '../../../../Model/sample-service-model';
import { SamplePaymentDetails } from '../../../../Model/sample-payment-details';
import { error } from 'node:console';

@Component({
  selector: 'app-sampleregister-edit',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sampleregister-edit.component.html',
  styleUrl: './sampleregister-edit.component.css'
})
export class SampleregisterEditComponent implements AfterViewInit{
  isFormVisible = false;
  isTableVisible=false;
  showPopup: boolean = false;
  popupMessage: string = '';
  isEditMode: boolean = false;
  isCash: boolean = false;
  isCheque: boolean = false;
  isOnlinePayment: boolean = false;
  // Form group for sample register data
  sampleRegisterForm: FormGroup;
  totalAmount: number = 0; // Add this property to track the total amount

  // City, Area, and Service dropdown options
  cities: any[] = [];
  areas: any[] = [];
  branches: any[] = [];
  selectedServices: SampleServiceModel[] = [];
  isB2B: boolean = false;
  b2bOptions: any[] = [];
  paymentOptions: any[] = [
    {PaymentModeId:1,PaymentModeName:'Cash'},
    {PaymentModeId:2,PaymentModeName:'Cheque'},
  ];
  selectedPayment: number=0; // Store multiple selected payment modes
  selectedPaymentId: any[]=[]; // Store multiple selected payment modes
  selectedServiceDetails: any[] = []; // Array to hold detailed info about selected services
  services = [
    { ServiceId: 1, ServiceName: 'Service 1', ServiceCode: 'S1',B2BAmount:1 ,B2CAmount:1},
    { ServiceId: 2, ServiceName: 'Service 2', ServiceCode: 'S2',B2BAmount:1,B2CAmount:1 },
    { ServiceId: 3, ServiceName: 'Service 3', ServiceCode: 'S3' ,B2BAmount:1,B2CAmount:1}
  ];
  showChequeFields: boolean = false;
  showCardFields: boolean = false;
  showTransactionNoField: boolean = false;
  showAmountField: boolean = true; // Amount field is always shown
  selectedServiceIds: number[] = []; // Array to store selected service IDs
  selectedPaymentIds: number[] = []; // Array to store selected payment mode IDs
  todayDate: string = '';

  ngAfterViewInit(): void {
    console.log('SampleEditComponent View Initialized');

  }

  // Injecting the service
  sampleRegisterService = inject(SampleRegisterService);
  ngOnInit(): void {
    // Fetch the City, Area, and Service data from the API
    this.getCities();
    this.getAreas();
    this.getServices();
    this.getBranches();
    this.getB2B();
    this.getPaymentmode();
    if (this.isEditMode) {
      // Ensure API date is properly formatted before patching
      let apiDate = this.sampleRegisterForm.get('CreatedOn')?.value;
      if (apiDate) {
        // Convert API date if needed (ensure it matches input[date] format: YYYY-MM-DD)
        const formattedDate = new Date(apiDate).toISOString().split('T')[0];
        this.sampleRegisterForm.patchValue({ CreatedOn: formattedDate });
      }
    } else {
      // In Add Mode, set today's date
      this.todayDate = new Date().toISOString().split('T')[0];
      this.sampleRegisterForm.patchValue({ CreatedOn: this.todayDate });
    }
    console.log("API Date:", this.sampleRegisterForm.get('CreatedOn')?.value);
    console.log("Formatted API Date:", new Date(this.sampleRegisterForm.get('CreatedOn')?.value).toISOString().split('T')[0]);




  }
  constructor() {
    // Initialize form group
    this.sampleRegisterForm = new FormGroup({
      SampleRegisterId: new FormControl<number>(0), // Nullable for Add mode
      BranchId: new FormControl<number>(0), // Nullable for Add mode
      B2BId: new FormControl<number>(0), // Nullable for Add mode
      MobileNo: new FormControl<string>(''),
      Title: new FormControl<string>(''),
      FirstName: new FormControl<string>('', { nonNullable: true }),
      MiddleName: new FormControl<string>(''),
      LastName: new FormControl<string>('', { nonNullable: true }),
      DOB: new FormControl<string>(''),
      Age: new FormControl<number>(0),
      Gender: new FormControl<string>(''),
      EmailId: new FormControl<string>(''),
      Address: new FormControl<string>(''),
      CityId: new FormControl<number>(0),
      AreaId: new FormControl<number>(0),
      ServiceId: new FormControl<number[]>([]), // New field for ServiceId
      isActive: new FormControl<boolean | null>(true),
      TotalAmount:new FormControl<number>(0),
      PaymentModeId:new FormControl<number>(0),
      AmountPaid:new FormControl<number>(0),
      ChequeNo:new FormControl<string>(''),
      DateOfTransaction:new FormControl<string>(''),
      CardNo:new FormControl<string>(''),
      TransactionNo:new FormControl<string>(''),
      CreatedBy: new FormControl<string>(''), 
      CreatedOn:new FormControl<string>(''),
    });
  }


  getBranches() {
    this.sampleRegisterService.getBranches().subscribe((response) => {
      this.branches = response;
      console.log(this.branches);
    });
  }
  getB2B() {
    // Replace with your actual API service to fetch cities
    this.sampleRegisterService.getB2B().subscribe((response) => {
      this.b2bOptions = response;
    });
  }
  getPaymentmode()
  {
    this.sampleRegisterService.getPaymentMode().subscribe(
      (data: string[]) => {
        this.paymentOptions = data;
        console.log(this.paymentOptions);
      },
      (error) => {
        console.error('Error fetching payment options', error);
      }
    );

  }
  // Fetch cities from API
  getCities() {
    // Replace with your actual API service to fetch cities
    this.sampleRegisterService.getCities().subscribe({
      next: (response: any[]) => {
        console.log('Cities API Response:', response); // Log the response
        this.cities = response;
      },
      error: (err) => console.error('Error fetching cities:', err),
    });
  }

  // Fetch areas from API
  getAreas() {
    // Replace with your actual API service to fetch areas
    this.sampleRegisterService.getAreas().subscribe((response) => {
      this.areas = response;
    });
  }

  // Fetch services from API
  getServices() {
    // Replace with your actual API service to fetch services
    this.sampleRegisterService.getServices().subscribe((response) => {
      this.services = response;
    });
  }
  onB2BSelect() {
    const selectedBranchId = this.sampleRegisterForm.get('B2BId')?.value;
  
    if (selectedBranchId === null) {
      console.log('No branch selected yet');
    } else {
      console.log('Selected Branch ID:', selectedBranchId);
    }
      // Check if B2B is enabled and set B2BId accordingly
  if (this.isB2B) {
    console.log(this.sampleRegisterForm.get('B2BId')?.value); // Get B2BId value from the form
  } else {
    console.log(0); // If toggle is off, pass null
  }
  }
  onPaymentChange() {
    const selectedPaymentId= this.sampleRegisterForm.get('PaymentModeId')?.value;
    console.log('Selected Payment Mode ID:', selectedPaymentId);
     // Find the selected payment mode from `paymentOptions`
     const selectedPayment = this.paymentOptions.find(mode => mode.PaymentModeId == selectedPaymentId);

     if (selectedPayment) {
       // Store values in component variables
       this.isCash = selectedPayment.isCash;
       this.isCheque = selectedPayment.isCheque;
       this.isOnlinePayment = selectedPayment.isOnlinePayment;
     } else {
       // Reset variables if no match is found
       this.isCash = false;
       this.isCheque = false;
       this.isOnlinePayment = false;
     }
 
     console.log(`isCash: ${this.isCash}, isCheque: ${this.isCheque}, isOnlinePayment: ${this.isOnlinePayment}`);
     if(this.isCheque==true)
     {
      this.showAmountField = true;
      this.showChequeFields=true;
      this.showTransactionNoField=false;
     }
     else if(this.isOnlinePayment==true)
     {
       this.showChequeFields=false;
       this.showAmountField = true;
       this.showTransactionNoField=true;
     }
     else if(this.isCash==true)
      {
        this.showChequeFields=false;
        this.showAmountField = true;
        this.showTransactionNoField=false;
      }
     else
     {
        this.showAmountField = false;
        this.showChequeFields=false;
        this.showTransactionNoField=false;
     }
     
  }
  toggleB2B() {
    this.isB2B = !this.isB2B; // Toggle the value
  
    if (!this.isB2B) {
      // Clear only the B2B dropdown when toggled OFF
      this.sampleRegisterForm.get('B2BId')?.setValue(null);
      // this.selectedB2BOption = null;
    } else {
      // Ensure B2B dropdown has a default value or remains empty for selection
      this.sampleRegisterForm.get('B2BId')?.setValue('');
      // this.selectedB2BOption = '';
    }
  }

  // Add service to the list
  addServiceToList() {
    const selectedServiceId = this.sampleRegisterForm.get('ServiceId')?.value;

    if (selectedServiceId) {
      const selectedService = this.services.find(
        (s) => s.ServiceId.toString().trim() === selectedServiceId.toString().trim()
      );
      console.log(selectedService);
      if (selectedService && !this.selectedServiceDetails.some((item) => item.ServiceId === selectedServiceId)) {
        const amount = this.isB2B ? selectedService.B2BAmount : selectedService.B2CAmount;
        this.selectedServiceDetails.push({
          ServiceId: selectedService.ServiceId,
          ServiceName: selectedService.ServiceName,
          ServiceCode: selectedService.ServiceCode,
          B2BAmount: this.isB2B ? selectedService.B2BAmount : selectedService.B2CAmount,
          B2CAmount: this.isB2B ? selectedService.B2BAmount : selectedService.B2CAmount,
          Amount: amount,
        });
        console.log(this.selectedServiceDetails);
        this.calculateTotal();
      }
    }
  }

  calculateTotal() {
    this.totalAmount = this.selectedServiceDetails.reduce((sum, service) => sum + service.B2BAmount, 0);
  }

  removeService(index: number, serviceId: number) {    
    const formData = this.sampleRegisterForm.getRawValue(); // Use getRawValue() to include disabled fields
    const sampleRegisterId = formData.SampleRegisterId;

    // Log the SampleRegisterId to debug
    console.log('Sample Register ID:', sampleRegisterId);  
    if (this.isEditMode) {debugger
      console.log(sampleRegisterId,serviceId);
      this.sampleRegisterService.deleteSampleService(sampleRegisterId, serviceId).subscribe(
        (response: any) => {
          console.log('Services Delete:', response);
            this.popupMessage = response.message;
          this.showPopup = true; // Show success popup
        },
        (error) => {
          console.log('Services Delete:', error);
          this.popupMessage = error;
          this.showPopup = true; // Show success popup
        }
      );
    }
  
    // Remove service from the UI
    this.selectedServiceDetails.splice(index, 1);
    this.selectedServiceIds = this.selectedServiceDetails.map(service => service.ServiceId);
  }
  
  // Calculate age from DOB
  calculateAge() {
    const dob = new Date(this.sampleRegisterForm.get('DOB')?.value);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    
    // Adjust age if the birthday hasn't occurred yet this year
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      this.sampleRegisterForm.get('Age')?.setValue(age - 1);
    } else {
      this.sampleRegisterForm.get('Age')?.setValue(age);
    }
  }

  // Open form in Add mode
  openForm(username: string | null = null) {
    this.isEditMode = false;
    this.sampleRegisterForm.reset({
      MobileNo: '',
      Title: '',
      FirstName: '',
      MiddleName: '',
      LastName: '',
      DOB: '',
      Age: 0,
      Gender: '',
      EmailId: '',
      Address: '',
      CityId: 0,
      AreaId: 0,
      ServiceId: 0, // Reset ServiceId to 0 in Add mode
      isActive: true,
      TotalAmount:0,
      PaymentModeId:0,
      AmountPaid:'',
      ChequeNo:'',
      DateOfTransaction:'',
      CardNo:'',
      TransactionNo:'',
      CreatedBy: username || 'UnknownUser',
    });
    // Explicitly set SampleRegisterId to 0, since it's not included in the reset above
    this.sampleRegisterForm.get('SampleRegisterId')?.setValue(0);
    this.sampleRegisterForm.get('SampleRegisterId')?.disable(); // Disable SampleRegisterId in Add mode
    this.isFormVisible = true;
  }

  // Open form in Edit mode
  openFormEdit(sampleRegister: SampleRegisterModel, serviceData: any[], paymentData: SamplePaymentDetails[]) {
    console.log('Received Sample Data in Edit:', sampleRegister);
    console.log('Received Service Data in Edit:', serviceData);
    console.log('Received Payment Data in Edit:', paymentData);

    this.isEditMode = true;
    this.selectedServices = serviceData;
    this.selectedPaymentId=paymentData;
    
    
    // Extract Service and Payment IDs
    const extractedServiceIds = serviceData.map(service => service.ServiceId);
    //this.selectedServiceDetails = this.selectedServiceDetails.filter(service => this.selectedServiceDetails.includes(service.ServiceId));

    const extractedPaymentIds = paymentData.map(payment => payment.SamplePaymentId);

    // Extract PaymentModeId (if available)
    const extractedPaymentModeId = paymentData.length > 0 ? paymentData[0].PaymentModeId : 0;
    const extractedAmountPaid = paymentData.length > 0 ? paymentData[0].AmountPaid : 0;
    const extractedTransactionNo = paymentData.length > 0 ? paymentData[0].TransactionNo ?? '' : '';
    const extractedDateOfTransaction = paymentData.length > 0 ? paymentData[0].DateOfTransaction ?? '' : '';
    const extractedChequeNo = paymentData.length > 0 ? paymentData[0].ChequeNo ?? '' : '';
    const extractedCardNo = paymentData.length > 0 ? paymentData[0].CardNo ?? '' : '';

    // Set form values (including PaymentModeId and other fields)
    this.sampleRegisterForm.setValue({
      SampleRegisterId: sampleRegister.SampleRegisterId ,
      BranchId: sampleRegister.BranchId ?? 0,
      B2BId: sampleRegister.B2BId ?? 0,
      MobileNo: sampleRegister.MobileNo ?? '',
      Title: sampleRegister.Title ?? '',
      FirstName: sampleRegister.FirstName ?? '',
      MiddleName: sampleRegister.MiddleName ?? '',
      LastName: sampleRegister.LastName ?? '',
      DOB:sampleRegister.DOB? new Date(sampleRegister.DOB).toISOString().split('T')[0]: '',
      Age: sampleRegister.Age ?? 0,
      Gender: sampleRegister.Gender ?? '',
      EmailId: sampleRegister.EmailId ?? '',
      Address: sampleRegister.Address ?? '',
      CityId: sampleRegister.CityId ?? 0,
      AreaId: sampleRegister.AreaId ?? 0,
      ServiceId: extractedServiceIds.length > 0 ? extractedServiceIds : [], // Store all service IDs
      // SamplePaymentId: extractedPaymentIds.length > 0 ? extractedPaymentIds : [], // Store all payment IDs
      PaymentModeId: extractedPaymentModeId,  //  Ensures this field is always set
      AmountPaid: extractedAmountPaid,
      TransactionNo: extractedTransactionNo,
      DateOfTransaction: extractedDateOfTransaction,
      ChequeNo: extractedChequeNo,
      CardNo: extractedCardNo,
      isActive: sampleRegister.isActive ?? true,
      TotalAmount: sampleRegister.TotalAmount ?? 0,
      CreatedBy: sampleRegister.CreatedBy??'', 
      CreatedOn:sampleRegister.CreatedOn? new Date(sampleRegister.CreatedOn).toISOString().split('T')[0]: '',
    });
    // Populate selected services into the selectedServiceDetails
    this.selectedServiceDetails = serviceData.map(service => ({
      ServiceId: service.ServiceId,
      ServiceName: service.ServiceName,
      ServiceCode: service.ServiceCode,
      B2BAmount: this.isB2B ? service.Amount : service.Amount,
      B2CAmount: this.isB2B ? service.Amount : service.Amount,
    }));
    this.calculateTotal();
    console.log('Form Data:', this.sampleRegisterForm.value); // Log to ensure SampleRegisterId is set

      // Disable the SampleRegisterId field to prevent editing
      this.sampleRegisterForm.get('SampleRegisterId')?.disable(); // Disable to prevent editing
      this.sampleRegisterForm.get('SampleRegisterId')?.setValue(sampleRegister.SampleRegisterId);  // Re-set the value before disabling

    console.log('AFTER Form Data:', this.sampleRegisterForm.value); // Log to ensure SampleRegisterId is set



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
  onAddSubmit() {debugger
    
    const formData = this.sampleRegisterForm.getRawValue(); // Get all values, including disabled ones
    formData.TotalAMount = this.totalAmount; // Assign the calculated total to the formData
    // formData.CreatedBy = this.username;  

    console.log(formData);
      // Check if B2B is enabled and set B2BId accordingly
  if (this.isB2B) {
    formData.B2BId = this.sampleRegisterForm.get('B2BId')?.value; // Get B2BId value from the form
  } else {
    formData.B2BId = 0; // If toggle is off, pass null
  }

    this.sampleRegisterService.postSampleRegister(formData).subscribe({
      next: (response) => {
        console.log('Response:', response);
        console.log("Full Response:", response);
        const SampleRegisterId = response.SampleRegisterId; // Ensure correct casing
        console.log("Extracted SampleRegisterId:", SampleRegisterId);
  
        if (!SampleRegisterId) {
          console.error("Error: SampleRegisterId is missing!");
          return; // Stop execution if ID is not returned
        }

       const paymentData: SamplePaymentDetails = {
        SamplePaymentId: 0, // Assuming it's auto-generated by the database
        SampleRegisterId: SampleRegisterId,
        PaymentModeId: this.sampleRegisterForm.get('PaymentModeId')?.value || 0, // Default to 0 if not provided
        AmountPaid: this.sampleRegisterForm.get('AmountPaid')?.value || 0, // Default to 0 if empty
        TransactionNo: this.sampleRegisterForm.get('TransactionNo')?.value || null,
        DateOfTransaction: this.sampleRegisterForm.get('DateOfTransaction')?.value || null,
        ChequeNo: this.sampleRegisterForm.get('ChequeNo')?.value || null,
        CardNo: this.sampleRegisterForm.get('CardNo')?.value || null
      };
      console.log(paymentData);
         // After the SampleRegister is added, call the second API to save services
         const sampleServiceModel: SampleServiceModel = {
          SampleRegisterId: SampleRegisterId, // Assuming API returns the new SampleRegisterId
          ServiceId: this.selectedServiceDetails.map(service => service.ServiceId), // Extract the ServiceId array
          Amount: this.selectedServiceDetails.map(service => service.Amount), // Extract the ServiceId array

        };
        console.log(sampleServiceModel);

        // Call the second API to save the selected services
        this.sampleRegisterService.saveSelectedServices(sampleServiceModel).subscribe({
          next: (serviceResponse) => {
            console.log('Services saved:', serviceResponse);
            this.popupMessage = response.message;
            this.showPopup = true; // Show success popup
            this.isFormVisible = false;
          },
          error: (err) => {
            console.error('Error saving services:', err);
            this.popupMessage = response.message;
            this.showPopup = true; // Show success popup
          }
        });
        // Call the Third API to save the Payment Details 
        this.sampleRegisterService.saveSamplePaymentDetails(paymentData).subscribe({
          next: (serviceResponse) => {
            console.log('Services saved:', serviceResponse);
            this.popupMessage = response.message;
            this.showPopup = true; // Show success popup
            this.isFormVisible = false;
          },
          error: (err) => {
            console.error('Error saving Payment Details:', err);
            this.popupMessage = response.message;
            this.showPopup = true; // Show success popup
          }
        });
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

  
  onSubmit() {
    const formData = this.sampleRegisterForm.getRawValue(); // Include disabled fields
    console.log('Edit Mode Form Data:', formData);
  
    this.sampleRegisterService.editSampleRegister(formData).subscribe({
      next: (response) => {
        console.log('Sample Register Updated:', response);
        const sampleRegisterId = formData.SampleRegisterId;
         // Before sending, ensure Amount is populated
         const validServiceDetails = this.selectedServiceDetails.map(service => ({
          ...service,
          Amount: this.isB2B ? service.B2BAmount : service.B2CAmount  // Use B2BAmount if isB2B is true, else use B2CAmount
        }));
      
        const sampleServiceModel: SampleServiceModel = {
          SampleRegisterId: formData.SampleRegisterId,
          ServiceId: validServiceDetails.map(service => service.ServiceId),
          Amount: validServiceDetails.map(service => service.Amount),
        };
      
        console.log(sampleServiceModel);
        // Prepare payment data
        const paymentData: SamplePaymentDetails = {
          SamplePaymentId: 0, // Assuming it's auto-generated
          SampleRegisterId: sampleRegisterId,
          PaymentModeId: this.sampleRegisterForm.get('PaymentModeId')?.value || 0,
          AmountPaid: this.sampleRegisterForm.get('AmountPaid')?.value || 0,
          TransactionNo: this.sampleRegisterForm.get('TransactionNo')?.value || null,
          DateOfTransaction: this.sampleRegisterForm.get('DateOfTransaction')?.value || null,
          ChequeNo: this.sampleRegisterForm.get('ChequeNo')?.value || null,
          CardNo: this.sampleRegisterForm.get('CardNo')?.value || null
        };
        console.log(paymentData);
        // Step 2: Update/Add services
        this.sampleRegisterService.saveSelectedServices(sampleServiceModel).subscribe({
          next: (serviceResponse) => {
            console.log('Services Updated:', serviceResponse);
  
            // Step 3: Update/Add payment details
            this.sampleRegisterService.saveSamplePaymentDetails(paymentData).subscribe({
              next: (paymentResponse) => {
                console.log('Payment Updated:', paymentResponse);
                this.popupMessage = 'Sample Register, Services, and Payment updated successfully.';
                this.showPopup = true;
                this.isFormVisible = false;
              },
              error: (paymentError) => {
                console.error('Error updating Payment:', paymentError);
                this.popupMessage = paymentError;
                this.showPopup = true;
              }
            });
          },
          error: (serviceError) => {
            console.error('Error updating Services:', serviceError);
            this.popupMessage =serviceError;
            this.showPopup = true;
          }
        });
      },
      error: (err) => {
        console.error('Error updating Sample Register:', err);
        this.popupMessage = err;
        this.showPopup = true;
      }
    });
  }
  
}
