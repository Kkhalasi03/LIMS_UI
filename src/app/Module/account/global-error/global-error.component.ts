import { Component } from '@angular/core';
import { ErrorService } from '../../../Service/error.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-global-error',
  imports: [CommonModule],
  templateUrl: './global-error.component.html',
  styleUrl: './global-error.component.css'
})
export class GlobalErrorComponent {

  errorMessage$!: Observable<string | null>;

  constructor(private errorService: ErrorService) {}

  ngOnInit() {
    this.errorMessage$ = this.errorService.errorMessage$;
  }  

}
