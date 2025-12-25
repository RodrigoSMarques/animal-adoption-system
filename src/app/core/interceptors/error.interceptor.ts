import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocorreu um erro desconhecido';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Erro: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = `Código: ${error.status}\nMensagem: ${error.message}`;
      }

      if (error.status === 401) {
        // Unauthorized - redirect to login
        router.navigate(['/login']);
      }

      console.error(errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};
