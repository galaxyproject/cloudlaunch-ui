import { Component } from '@angular/core';
import { Router, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { AppSettings } from './app.settings'
import { LoginService } from './login/services/login/login.service';
import 'rxjs/add/operator/filter';

@Component({
    selector: 'app-root',
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

    updateLoggedInStatus(): void {
        this._loginService.isLoggedIn().then(loggedIn => this.loggedIn = loggedIn);
    }

    getDeveloperAPILink(): string {
        return AppSettings.CLOUDLAUNCH_API_ENDPOINT;
    }

    getSupportContactLink(): string {
        return AppSettings.CLOUDLAUNCH_SUPPORT_LINK;
    }
}
