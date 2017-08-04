import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule, XHRBackend } from '@angular/http';
import { MarkdownModule } from 'angular2-markdown';

import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { AppRoutingModule }  from './app-routing.module';

import { RequestOptions } from '@angular/http';
import { CLAuthHttp } from './login/utils/cloudlaunch-http';


export function httpFactory(backend: XHRBackend) {
    return new CLAuthHttp(backend);
}

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
        LoginModule,
        MarkdownModule,
        BrowserAnimationsModule
    ],
    providers: [
        {
            provide: CLAuthHttp,
            useFactory: httpFactory,
            deps: [XHRBackend]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
