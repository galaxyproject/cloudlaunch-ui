import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators
} from '@angular/forms';

// models
import { Credentials, UserProfile } from '../../../shared/models/profile';

@Component({
    selector: 'clui-cloud-credentials-viewer',
    templateUrl: './cloud-credentials-viewer.component.html',
})
export class CloudCredentialsViewerComponent {
    @Input()
    profile: UserProfile;

    @Output()
    credentialsChanged = new EventEmitter<Credentials>();

    handleCredentialsChanged(creds: Credentials) {
        this.credentialsChanged.emit(creds);
    }

    getCredentials(resourcetype: string): Credentials[] {
        return this.profile.credentials.filter(creds => creds.resourcetype == resourcetype)
    }

}
