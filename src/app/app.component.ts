import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { routerTransition } from './app.routing.animations';
import { AppSettings } from './app.settings';
import { LoginService } from './login/services/login/login.service';
import { User } from './shared/models/user';

import 'rxjs/add/operator/filter';


@Component({
    selector: 'clui-root',
    animations: [ routerTransition ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private _loginService: LoginService, private router: Router) {
        router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe((event: NavigationEvent) => {
                this.updateLoggedInStatus();
            });
    }

    loggedIn: boolean;
    currentUser: User = null;

    updateLoggedInStatus(): void {
        this._loginService.isLoggedIn().then(loggedIn => {
            this.loggedIn = loggedIn;
            this.currentUser = this._loginService.getCurrentUser();
        });
    }

    getDeveloperAPILink(): string {
        return AppSettings.CLOUDLAUNCH_API_ENDPOINT;
    }

    getSupportContactLink(): string {
        return AppSettings.CLOUDLAUNCH_SUPPORT_LINK;
    }

    logout() {
        this._loginService.logout().subscribe();
    }

    getState(outlet: RouterOutlet) {
        return outlet.activatedRouteData.state;
    }
}
