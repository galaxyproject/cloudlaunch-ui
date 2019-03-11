import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

// models
import { Credentials, GCPCredentials } from '../../../../shared/models/profile';

// services
import { ProfileService } from '../../../../shared/services/profile.service';


@Component({
    selector: 'clui-gce-cred-viewer',
    templateUrl: './gce-cred-viewer.component.html'
})
export class GCECredViewerComponent implements OnInit {
    @Input()
    credentials: GCPCredentials;

    @Output()
    credentialsChanged = new EventEmitter<Credentials>();

    editMode = false;
    currentObject: GCPCredentials;


    constructor(private _profileService: ProfileService) {
    }

    ngOnInit() {
        this.editMode = false;
        this.currentObject = new GCPCredentials();
    }

    groupBy(list: any) {
        const temp = {};
        const results: any[] = [];
        if (list) {
            for (const item of list) {
                if (item.cloud.id in temp) {
                    temp[item.cloud.id].push(item);
                } else {
                    temp[item.cloud.id] = [];
                    temp[item.cloud.id].push(item);
                }
            }
        }
        Object.keys(temp).forEach(key => { results.push({ 'cloud_id': key, 'clouds': temp[key] }); });
        return results;
    }

    addNew() {
        this.editMode = true;
        this.currentObject = new GCPCredentials();
    }

    editExisting(creds: GCPCredentials) {
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

    deleteCreds(creds: GCPCredentials) {
        this._profileService.deleteCredentials(creds)
            .subscribe(result => {
                this.credentialsChanged.emit(creds);
            });
    }

    handleCredentialsChanged(creds: GCPCredentials) {
        this.editMode = false;
        this.currentObject = null;
        this.credentialsChanged.emit(creds);
    }
}
