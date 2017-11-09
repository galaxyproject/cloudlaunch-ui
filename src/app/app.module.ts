import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { MarkdownModule } from 'angular2-markdown';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { AppRoutingModule }  from './app-routing.module';

import { RequestOptions } from '@angular/http';

import { MyAppliancesModule } from './my-appliances/my-appliances.module';
import { ArchiveDeleteConfirmDialog } from './my-appliances/components/deployments/dialogs/archive-delete-confirm.component';
import { AuthInterceptor } from './login/services/auth-interceptor';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'csrftoken',
            headerName: 'X-CSRFToken',
        }),
        AppRoutingModule,
        LoginModule,
        MarkdownModule,
        BrowserAnimationsModule,
        MyAppliancesModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        }
    ],
    entryComponents: [ArchiveDeleteConfirmDialog],
    bootstrap: [AppComponent]
})
export class AppModule { }
