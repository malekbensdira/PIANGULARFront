import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../Service/service.service';
import { PolicyType } from '../models/policy-type.enum';
import { ClaimStatus } from '../models/claim-status.enum'; // Import ClaimStatus

@Component({
  selector: 'app-subscribe-insurance',
  templateUrl: './subscribe-insurance.component.html',
  styleUrls: ['./subscribe-insurance.component.css']
})
export class SubscribeInsuranceComponent implements OnInit {
  subscriptionData = {
    name: '',
    email: '',
    policyType: PolicyType.AUTO_INSURANCE,
    carSeries: '',
    milesDriven: null as number | null,
    vehicleAge: null as number | null,
    medicalHistory: '',
    age: null as number | null,
    coverageLevel: '',
    propertyValue: null as number | null,
    locationRisk: '',
    yearBuilt: null as number | null,
    userId: 0, // Add default or placeholder value
    premium: 0, // Add default or placeholder value
    coverageAmount: 0, // Add default or placeholder value
    startDate: new Date(), // Add default or placeholder value
    endDate: new Date(), // Add default or placeholder value
    claimStatus: ClaimStatus.PENDING, // Replace with a valid ClaimStatus value
  };
  errorMessage: string | null = null;
  policyTypes = PolicyType;
  isDarkMode: boolean = false;

  constructor(private insuranceService: ServiceService) {}

  ngOnInit(): void {
    this.loadDarkMode();
  }
  onSubscribe(): void {
    const formattedData = {
      ...this.subscriptionData,
      claimStatus: ClaimStatus.PENDING, // Ensure claimStatus is a valid ClaimStatus value
      startDate: this.subscriptionData.startDate.toISOString().split('T')[0], // 'YYYY-MM-DD'
      endDate: this.subscriptionData.endDate.toISOString().split('T')[0]
    };
  
    this.insuranceService.submitSubscription(formattedData).subscribe({
      next: (response) => {
        this.errorMessage = '✅ Subscription submitted successfully! An admin will review it.';
        this.resetForm();
      },
      error: (err) => {
        console.error('Subscription submission error:', err);
        this.errorMessage = err?.error?.message || '❌ Error submitting subscription. Please try again.';
      }
    });
  }
  
  onPolicyTypeChange(): void {
    // Reset policy-specific fields when policy type changes
    this.subscriptionData.carSeries = '';
    this.subscriptionData.milesDriven = null;
    this.subscriptionData.vehicleAge = null;
    this.subscriptionData.medicalHistory = '';
    this.subscriptionData.age = null;
    this.subscriptionData.coverageLevel = '';
    this.subscriptionData.propertyValue = null;
    this.subscriptionData.locationRisk = '';
    this.subscriptionData.yearBuilt = null;
  }

  resetForm(): void {
    this.subscriptionData = {
      name: '',
      email: '',
      policyType: PolicyType.AUTO_INSURANCE,
      carSeries: '',
      milesDriven: null,
      vehicleAge: null,
      medicalHistory: '',
      age: null,
      coverageLevel: '',
      propertyValue: null,
      locationRisk: '',
      yearBuilt: null,
      userId: 0, // Reset to default or placeholder value
      premium: 0, // Reset to default or placeholder value
      coverageAmount: 0, // Reset to default or placeholder value
      startDate: new Date(), // Reset to default or placeholder value
      endDate: new Date(), // Reset to default or placeholder value
      claimStatus: ClaimStatus.PENDING // Reset to default or placeholder value
    };
  }

  // Load dark mode preference from localStorage
  loadDarkMode(): void {
    const darkModePref = localStorage.getItem('darkMode');
    this.isDarkMode = darkModePref === 'true';
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Toggle dark mode and save preference to localStorage
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
    console.log('Dark mode toggled to:', this.isDarkMode);
    console.log('HTML classes:', document.documentElement.classList.toString());
  }
}