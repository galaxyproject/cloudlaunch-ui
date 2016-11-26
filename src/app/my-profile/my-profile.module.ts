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
import { AWSCredentialsComponent } from './components/credentials-aws/aws-credentials.component';
import { OpenStackCredentialsComponent } from './components/credentials-openstack/openstack-credentials.component';

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
  declarations: [MyProfilePageComponent, UserProfileComponent, AWSCredentialsComponent, OpenStackCredentialsComponent],
  providers: [CloudService, ProfileService]
})
export class MyProfileModule { }
