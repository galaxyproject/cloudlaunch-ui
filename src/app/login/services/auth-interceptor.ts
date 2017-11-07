import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { LoginService } from './login/login.service';
import { Observable } from 'rxjs/Rx';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let loginService = this.injector.get(LoginService);
    // Get the auth header from the service.
    const authHeaders = loginService.getDefaultHeaders();
    // Preserve existing headers and add new ones
    let missingHeaders = {};
    for (let key in authHeaders) {
        if (!req.headers.has(key))
            // Make sure these are strings or an exception occurs: CreateListFromArrayLike
            missingHeaders[key] = String(authHeaders[key]);
    }
    // Clone the request to add the new headers.
    const authReq = req.clone({setHeaders: missingHeaders});
    // Pass on the cloned request instead of the original request.
    return next.handle(authReq);
  }
}