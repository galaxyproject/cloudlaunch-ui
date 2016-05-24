import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { LoginService } from '../services/login.service';
import { StandardLayoutComponent } from '../layouts/standard-layout.component';

@Component({
   selector: 'login',
   templateUrl: 'app/components/login.component.html',
   styleUrls: ['app/components/login.component.css'],
   directives: [StandardLayoutComponent]
})
export class LoginComponent implements OnInit {
   public email: string;
   public password: string;
   public rememberMe: boolean = false;
   public errorMessage: string;

   constructor(
      private _router: Router,
      private _loginService: LoginService) { }

   ngOnInit() {
   }

   onSubmit() {
      this.errorMessage = null;
      this._loginService.login(this.email, this.password, this.rememberMe).subscribe(
         data  => this._router.parent.navigate(['Marketplace']),
         error => this.errorMessage = <any>error);
   }
}
