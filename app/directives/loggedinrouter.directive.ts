// Based on: https://github.com/auth0/angular2-authentication-sample/blob/master/src/app/LoggedInOutlet.ts
import { Directive, Attribute, ElementRef, DynamicComponentLoader } from 'angular2/core';
import { Router, RouterOutlet, ComponentInstruction } from 'angular2/router';
import { LoginService } from '../services/login.service';

@Directive({
   selector: 'router-outlet'
})
export class LoggedInRouterOutlet extends RouterOutlet {
   publicRoutes: any;
   private parentRouter: Router;

   constructor(_elementRef: ElementRef, _loader: DynamicComponentLoader,
      _parentRouter: Router, @Attribute('name') nameAttr: string,
      private _loginService: LoginService) {
      super(_elementRef, _loader, _parentRouter, nameAttr);

      this.parentRouter = _parentRouter;
      this.publicRoutes = {
         '/login': true,
         '/signup': true
      };
   }

   activate(instruction: ComponentInstruction) {
      let url = this.parentRouter.lastNavigationAttempt;
      let outlet = this;
      if (!this.publicRoutes[url]) {
         let loginPromise = this._loginService.isLoggedIn().then((loggedIn) => {
            if (loggedIn) {
               return super.activate(instruction);
            }
            else {
               this.parentRouter.navigateByUrl('/login');
            }
         });
         return loginPromise;
      }
      return super.activate(instruction);
   }
}