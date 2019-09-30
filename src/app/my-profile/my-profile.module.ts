import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';

import { LayoutModule } from '../shared/layout.module';
import { MyProfileRoutingModule } from './my-profile-routing.module';

// Components
import { UserProfileComponent } from './components/userprofile/userprofile.component';
import { MyProfilePageComponent } from './components/my-profile-page/my-profile-page.component';

import { CloudCredentialsViewerComponent } from './components/cloud-credentials-viewer/cloud-credentials-viewer.component';
import { OpenStackCredViewerComponent } from './components/cloud-credentials-viewer/openstack-cred-viewer/openstack-cred-viewer.component';
import { AWSCredViewerComponent } from './components/cloud-credentials-viewer/aws-cred-viewer/aws-cred-viewer.component';
import { AzureCredViewerComponent } from './components/cloud-credentials-viewer/azure-cred-viewer/azure-cred-viewer.component';
import { GCPCredViewerComponent } from './components/cloud-credentials-viewer/gcp-cred-viewer/gcp-cred-viewer.component';

import { CloudCredentialsEditorComponent } from './components/cloud-credentials-editor/cloud-credentials-editor.component';
import { OpenStackCredEditorComponent } from './components/cloud-credentials-editor/openstack-cred-editor/openstack-cred-editor.component';
import { AWSCredEditorComponent } from './components/cloud-credentials-editor/aws-cred-editor/aws-cred-editor.component';
import { AzureCredEditorComponent } from './components/cloud-credentials-editor/azure-cred-editor/azure-cred-editor.component';
import { GCPCredEditorComponent } from './components/cloud-credentials-editor/gcp-cred-editor/gcp-cred-editor.component';

import { CloudCredentialsSelectorComponent } from './components/cloud-credentials-selector/cloud-credentials-selector.component';

import { ApiTokenEditorComponent } from './components/api-token-editor/api-token-editor.component';

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
        MatCheckboxModule,
        MatTableModule,
        MatExpansionModule,
        MyProfileRoutingModule
    ],
    declarations: [
        MyProfilePageComponent, UserProfileComponent,
        CloudCredentialsViewerComponent,
        OpenStackCredViewerComponent, AWSCredViewerComponent, AzureCredViewerComponent, GCPCredViewerComponent,
        CloudCredentialsEditorComponent,
        OpenStackCredEditorComponent, AWSCredEditorComponent, AzureCredEditorComponent, GCPCredEditorComponent,
        CloudCredentialsSelectorComponent,
        ApiTokenEditorComponent
    ],
    exports: [CloudCredentialsViewerComponent, CloudCredentialsEditorComponent, CloudCredentialsSelectorComponent],
    providers: [CloudService, ProfileService]
})
export class MyProfileModule { }
