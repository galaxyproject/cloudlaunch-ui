import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

// models
import { Credentials, OpenStackCredentials } from '../../../../shared/models/profile';

// services
import { ProfileService } from '../../../../shared/services/profile.service';


@Component({
    selector: 'clui-openstack-cred-viewer',
    templateUrl: './openstack-cred-viewer.component.html'
})
export class OpenStackCredViewerComponent implements OnInit {
    @Input()
    credentials: OpenStackCredentials;

    @Output()
    credentialsChanged = new EventEmitter<Credentials>();

    editMode = false;
    currentObject: OpenStackCredentials;

    constructor(private _profileService: ProfileService) {
    }

    ngOnInit() {
        this.editMode = false;
        this.currentObject = new OpenStackCredentials();
    }

    groupBy(list: any) {
        const temp = {};
        const results: any[] = [];
        if (list) {
            for (const item of list) {
                if (item.cloud.slug in temp) {
                    temp[item.cloud.slug].push(item);
                } else {
                    temp[item.cloud.slug] = [];
                    temp[item.cloud.slug].push(item);
                }
            }
        }
        Object.keys(temp).forEach(key => { results.push({ 'cloud_id': key, 'clouds': temp[key] }); });
        return results;
    }

    addNew() {
        this.editMode = true;
        this.currentObject = null;
    }

    editExisting(creds: OpenStackCredentials) {
        this.editMode = true;
        this.currentObject = creds;
    }

    cancelEdit() {
        this.editMode = false;
        this.currentObject = null;
    }

    isEditing(): boolean {
        return this.editMode && this.currentObject != null;
    }

    deleteCreds(creds: OpenStackCredentials) {
        this._profileService.deleteCredentialsOpenStack(creds)
            .subscribe(result => {
                this.credentialsChanged.emit(creds);
            });
    }

    handleCredentialsChanged(creds: OpenStackCredentials) {
        this.editMode = false;
        this.currentObject = null;
        this.credentialsChanged.emit(creds);
    }
}
