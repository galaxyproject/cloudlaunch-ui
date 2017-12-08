import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings } from '../../../app.settings';

@Component({
    selector: 'clui-login-box',
    templateUrl: './login-box.component.html',
    styleUrls: ['./login-box.component.css']
})
export class LoginBoxComponent implements OnInit {
    redirectUrl: string;

    constructor(private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.redirectUrl = this.route.snapshot.queryParams['next'] || '/catalog';
    }

    getApiRoot(): string {
        return AppSettings.CLOUDLAUNCH_SERVER_ROOT;
    }
}
