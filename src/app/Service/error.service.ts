import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorMessage = new BehaviorSubject<string | null>(null);
  errorMessage$ = this.errorMessage.asObservable();

  setError(message: string) {
    console.log('ErrorService Received Error:', message); // Debug log
    this.errorMessage.next(message);
    setTimeout(() => this.clearError(), 5000,); // Auto-hide after 5 seconds
  }

  clearError() {
    this.errorMessage.next(null);
  }
}