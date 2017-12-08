import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { MarkdownModule } from 'angular2-markdown';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { MyAppliancesModule } from './my-appliances/my-appliances.module';
import { ArchiveDeleteConfirmDlgComponent } from './my-appliances/components/deployments/dialogs/archive-delete-confirm.component';
import { AuthInterceptor } from './login/services/auth-interceptor';

// Remove once plugin system is in place
import { PluginsModule } from './catalog/plugins/plugins.module';
import { UbuntuConfigComponent } from './catalog/plugins/ubuntu/ubuntu.component';
import { CloudManConfigComponent } from './catalog/plugins/cloudman/cloudman.component';
import { GVLConfigComponent } from './catalog/plugins/gvl/gvl.component';
import { DockerConfigComponent } from './catalog/plugins/docker/docker.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
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
        MyAppliancesModule,
        PluginsModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        }
    ],
    entryComponents: [ArchiveDeleteConfirmDlgComponent, UbuntuConfigComponent, CloudManConfigComponent, GVLConfigComponent,
                      DockerConfigComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
