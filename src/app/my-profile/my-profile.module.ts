import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { SelectModule } from 'ng2-select';

import { LayoutModule } from '../shared/layout.module';
import { MyProfileRoutingModule } from './my-profile-routing.module';

// Components
import { UserProfileComponent } from './components/userprofile/userprofile.component';
import { MyProfilePageComponent } from './components/my-profile-page/my-profile-page.component';

import { CloudCredentialsViewerComponent } from './components/cloud-credentials-viewer/cloud-credentials-viewer.component';
import { OpenStackCredViewerComponent } from './components/cloud-credentials-viewer/openstack-cred-viewer/openstack-cred-viewer.component';
import { AWSCredViewerComponent } from './components/cloud-credentials-viewer/aws-cred-viewer/aws-cred-viewer.component';

import { CloudCredentialsEditorComponent } from './components/cloud-credentials-editor/cloud-credentials-editor.component';
import { OpenStackCredEditorComponent } from './components/cloud-credentials-editor/openstack-cred-editor/openstack-cred-editor.component';
import { AWSCredEditorComponent } from './components/cloud-credentials-editor/aws-cred-editor/aws-cred-editor.component';

// Services
import { ProfileService } from '../shared/services/profile.service';
import { CloudService } from '../shared/services/cloud.service';


@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    MyProfileRoutingModule
  ],
  declarations: [
    MyProfilePageComponent, UserProfileComponent,
    CloudCredentialsViewerComponent, OpenStackCredViewerComponent, AWSCredViewerComponent,
    CloudCredentialsEditorComponent, OpenStackCredEditorComponent, AWSCredEditorComponent
  ],
  exports: [CloudCredentialsViewerComponent, CloudCredentialsEditorComponent],
  providers: [CloudService, ProfileService]
})
export class MyProfileModule { }
