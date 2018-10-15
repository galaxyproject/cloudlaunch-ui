import { Injectable, Injector } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HttpResponse } from '@angular/common/http';
import { LoginService } from './login/login.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private injector: Injector,
        private router: Router) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const loginService = this.injector.get(LoginService);
        // Get the auth header from the service.
        const authHeaders = loginService.getDefaultHeaders();
        // Preserve existing headers and add missing ones
        const missingHeaders = {};
        for (const key in authHeaders) {
            if (!req.headers.has(key)) {
                // Make sure these are strings or an exception occurs: CreateListFromArrayLike
                missingHeaders[key] = String( authHeaders[key] );
            }
        }
        // Clone the request to add the new headers.
        const authReq = req.clone({ setHeaders: missingHeaders });
        // Pass on the cloned request instead of the original request.
        return next.handle(authReq);
//
//        .do(
//            (event: HttpEvent<any>) => {},
//            (err: any) => {
//                // Redirect to login page if any response returns an Unauthorized or Forbidden
//                if (err instanceof HttpErrorResponse && authReq.url != '/api/v1/auth/user/') {
//                    if (err.status === 401 || err.status === 403) {
//                        this.router.navigate(['/auth/login'], { queryParams: { next: this.router.routerState.snapshot.url }});
//                    }
//                }
//            }
//        );
    }
}
