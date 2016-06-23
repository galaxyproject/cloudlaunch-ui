// Based on: https://github.com/auth0/angular2-authentication-sample/blob/master/src/app/LoggedInOutlet.ts
import { Directive, Attribute, ViewContainerRef, DynamicComponentLoader } from '@angular/core';
import { Router, RouterOutlet, ComponentInstruction } from '@angular/router-deprecated';
import { LoginService } from '../services/login.service';

@Directive({
   selector: 'router-outlet'
})
export class LoggedInRouterOutlet extends RouterOutlet {
   publicRoutes: any;
   private parentRouter: Router;

   constructor(_viewContainerRef: ViewContainerRef, _loader: DynamicComponentLoader,
      _parentRouter: Router, @Attribute('name') nameAttr: string,
      private _loginService: LoginService) {
      super(_viewContainerRef, _loader, _parentRouter, nameAttr);

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
         let loginPromise: any = this._loginService.isLoggedIn().then((loggedIn) => {
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
