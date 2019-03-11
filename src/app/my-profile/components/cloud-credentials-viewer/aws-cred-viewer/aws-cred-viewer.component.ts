import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

// models
import { Credentials, AWSCredentials } from '../../../../shared/models/profile';

// services
import { ProfileService } from '../../../../shared/services/profile.service';


@Component({
    selector: 'clui-aws-cred-viewer',
    templateUrl: './aws-cred-viewer.component.html'
})
export class AWSCredViewerComponent implements OnInit {
    @Input()
    credentials: AWSCredentials;

    @Output()
    credentialsChanged = new EventEmitter<Credentials>();

    editMode = false;
    currentObject: AWSCredentials;

    constructor(private _profileService: ProfileService) {
    }

    ngOnInit() {
        this.editMode = false;
        this.currentObject = new AWSCredentials();
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
        this.currentObject = new AWSCredentials();
    }

    editExisting(creds: AWSCredentials) {
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

    deleteCreds(creds: AWSCredentials) {
        this._profileService.deleteCredentials(creds)
            .subscribe(result => {
                this.credentialsChanged.emit(creds);
            });
    }

    handleCredentialsChanged(creds: AWSCredentials) {
        this.editMode = false;
        this.currentObject = null;
        this.credentialsChanged.emit(creds);
    }
}
