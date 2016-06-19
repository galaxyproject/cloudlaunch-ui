import { provide } from '@angular/core';
import { Component, AfterViewChecked } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Router, RouterLink } from '@angular/router-deprecated';
import { HTTP_PROVIDERS } from '@angular/http';
import { RequestOptions, RequestOptionsArgs, BaseRequestOptions, Headers } from '@angular/http';

// Services
import { ApplicationService } from './services/application.service';
import { LoginService } from './services/login.service';
import { LoggedInRouterOutlet } from './directives/loggedinrouter.directive';

// Pages
import { LoginPageComponent } from './pages/login.page.component';
import { MarketplacePageComponent } from './pages/marketplace.page.component';
import { ApplianceDetailPageComponent } from './pages/appliance-detail.page.component';
import { HomeComponent } from './pages/home.component';

// Components
import { DashboardComponent } from './components/dashboard.component';
import { CloudLaunchComponent } from './components/cloudlaunch.component';

declare var $: any

class CustomRequestOptions extends BaseRequestOptions {

   merge(options?: RequestOptionsArgs): RequestOptions {
      let auth_header = "Token " + sessionStorage.getItem('token') || localStorage.getItem('token');
      if (!options.headers)
         options.headers = new Headers();
      options.headers.set('Authorization', auth_header);
      // Set the default content type to JSON
      if (!options.headers.get('Content-Type'))
         options.headers.set('Content-Type', 'application/json');
      return super.merge(options);
   }
}

@Component({
   selector: 'cloudlaunch-app',
   templateUrl: 'app/app.component.html',
   directives: [LoggedInRouterOutlet, RouterLink],
   providers: [
      ROUTER_PROVIDERS,
      HTTP_PROVIDERS,
      provide(RequestOptions, { useClass: CustomRequestOptions }),
      LoginService, ApplicationService
   ]
})

@RouteConfig([
   { path: '/home', name: 'Home', component: HomeComponent },
   { path: '/login', name: 'Login', component: LoginPageComponent },
   { path: '/dashboard', name: 'Dashboard', component: DashboardComponent },
   { path: '/marketplace', name: 'Marketplace', component: MarketplacePageComponent, useAsDefault: true },
   {
      path: '/marketplace/appliance/:slug/', name: 'ApplianceDetail',
      component: ApplianceDetailPageComponent
   },
   // { path: '/marketplace/appliance/:slug/launch', name: 'Launch',
   //   component: CloudLaunchComponent }
])

export class AppComponent implements AfterViewChecked {

  constructor(private router: Router) {
  }

  isActive(route_name: string): boolean {
      return this.router.isRouteActive(this.router.generate([route_name]));
  }
   
   ngAfterViewChecked() {
      // Unfortunately, there's no single place to apply material effects
      // and it's therefore done during this lifecycle method.
      $.material.init();
   }
}
