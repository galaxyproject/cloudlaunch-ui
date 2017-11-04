import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material'
import { MatButtonModule } from '@angular/material'
import { MatSelectModule } from '@angular/material'
import { MatIconModule } from '@angular/material'
import { MatTooltipModule } from '@angular/material'
import { MatRadioModule } from '@angular/material'

import { SelectModule } from 'ng2-select-compat';

import { LayoutModule } from '../shared/layout.module';
import { MyProfileRoutingModule } from './my-profile-routing.module';

// Components
import { UserProfileComponent } from './components/userprofile/userprofile.component';
import { MyProfilePageComponent } from './components/my-profile-page/my-profile-page.component';

import { CloudCredentialsViewerComponent } from './components/cloud-credentials-viewer/cloud-credentials-viewer.component';
import { OpenStackCredViewerComponent } from './components/cloud-credentials-viewer/openstack-cred-viewer/openstack-cred-viewer.component';
import { AWSCredViewerComponent } from './components/cloud-credentials-viewer/aws-cred-viewer/aws-cred-viewer.component';
import { AzureCredViewerComponent } from './components/cloud-credentials-viewer/azure-cred-viewer/azure-cred-viewer.component';

import { CloudCredentialsEditorComponent } from './components/cloud-credentials-editor/cloud-credentials-editor.component';
import { OpenStackCredEditorComponent } from './components/cloud-credentials-editor/openstack-cred-editor/openstack-cred-editor.component';
import { AWSCredEditorComponent } from './components/cloud-credentials-editor/aws-cred-editor/aws-cred-editor.component';
import { AzureCredEditorComponent } from './components/cloud-credentials-editor/azure-cred-editor/azure-cred-editor.component';

import { CloudCredentialsSelectorComponent } from './components/cloud-credentials-selector/cloud-credentials-selector.component';

// Services
import { ProfileService } from '../shared/services/profile.service';
import { CloudService } from '../shared/services/cloud.service';


@NgModule({
    imports: [
        CommonModule,
        LayoutModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule,
        MatTooltipModule,
        MatRadioModule,
        SelectModule,
        MyProfileRoutingModule
    ],
    declarations: [
        MyProfilePageComponent, UserProfileComponent,
        CloudCredentialsViewerComponent, OpenStackCredViewerComponent, AWSCredViewerComponent, AzureCredViewerComponent,
        CloudCredentialsEditorComponent, OpenStackCredEditorComponent, AWSCredEditorComponent, AzureCredEditorComponent,
        CloudCredentialsSelectorComponent
    ],
    exports: [CloudCredentialsViewerComponent, CloudCredentialsEditorComponent, CloudCredentialsSelectorComponent],
    providers: [CloudService, ProfileService]
})
export class MyProfileModule { }
