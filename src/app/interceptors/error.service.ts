import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ErrorService } from '../Service/error.service';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((error) => {
      console.log('Error Interceptor Triggered:', error); // Debug log

      if (error.status === 403) {
        errorService.setError(error.error.message || 'Access denied. You do not have permission.');
      }
      return throwError(() => error);
    })
  );
};