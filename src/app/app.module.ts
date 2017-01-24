import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule, XHRBackend } from '@angular/http';

import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { AppRoutingModule }  from './app-routing.module';

import { RequestOptions } from '@angular/http';
import { CLAuthHttp } from './login/utils/cloudlaunch-http';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        AppRoutingModule,
        LoginModule
    ],
    providers: [
        {
            provide: CLAuthHttp,
            useFactory: (backend: XHRBackend) => {
                return new CLAuthHttp(backend);
            },
            deps: [XHRBackend]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
