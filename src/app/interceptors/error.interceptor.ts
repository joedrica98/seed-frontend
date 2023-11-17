import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error) {
          switch (error.status) {
            case 400:
              let errorMessages = ""; // Join array elements into a string
              if (error.error && Array.isArray(error.error)) {
                errorMessages = error.error.join(", "); // Join array elements into a string
              } else if (error.error && typeof error.error === "object") {
                // Extract the first value from the error object
                errorMessages = Object.values(error.error)[0] as string;
              }
              Swal.fire("Hay un problema", errorMessages, "error");
              break;
            case 401:
              Swal.fire("No tienes permisos", error.error, "error");
              break;
            case 403:
              Swal.fire("No tienes permisos", error.error, "error");
              break;
            case 404:
              Swal.fire("Algo salio mal", error.error, "error");
              break;
            case 500:
              Swal.fire("Algo salio mal", error.error, "error");
              break;
            default:
              Swal.fire("Algo salio mal", error.error, "error");
              break;
          }
        }
        throw error;
      })
    );
  }
}
