import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

// models
import { Credentials, GCECredentials } from '../../../../shared/models/profile';

// services
import { ProfileService } from '../../../../shared/services/profile.service';


@Component({
    selector: 'gce-cred-viewer',
    templateUrl: './gce-cred-viewer.component.html'
})
export class GCECredViewerComponent implements OnInit {
    @Input()
    credentials: GCECredentials;

    @Output()
    onCredentialsChanged = new EventEmitter<Credentials>();

    editMode: boolean = false;
    currentObject: GCECredentials;


    constructor(private _profileService: ProfileService) {
    }

    ngOnInit() {
        this.editMode = false;
        this.currentObject = new GCECredentials();
    }

    groupBy(list: any) {
        let temp = {};
        let results: any[] = [];
        if (list) {
            for (let item of list) {
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
        this.currentObject = new GCECredentials();
    }

    editExisting(creds: GCECredentials) {
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

    deleteCreds(creds: GCECredentials) {
        this._profileService.deleteCredentialsGCE(creds)
            .subscribe(result => {
                this.onCredentialsChanged.emit(creds);
            });
    }

    handleCredentialsChanged(creds: GCECredentials) {
        this.editMode = false;
        this.currentObject = null;
        this.onCredentialsChanged.emit(creds);
    }
}
