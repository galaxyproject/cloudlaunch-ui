import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

// models
import { Credentials, AzureCredentials } from '../../../../shared/models/profile';

// services
import { ProfileService } from '../../../../shared/services/profile.service';


@Component({
    selector: 'clui-azure-cred-viewer',
    templateUrl: './azure-cred-viewer.component.html'
})
export class AzureCredViewerComponent implements OnInit {
    @Input()
    credentials: AzureCredentials;

    @Output()
    credentialsChanged = new EventEmitter<Credentials>();

    editMode = false;
    currentObject: AzureCredentials;

    constructor(private _profileService: ProfileService) {
    }

    ngOnInit() {
        this.editMode = false;
        this.currentObject = new AzureCredentials();
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
        this.currentObject = new AzureCredentials();
    }

    editExisting(creds: AzureCredentials) {
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

    deleteCreds(creds: AzureCredentials) {
        this._profileService.deleteCredentialsAzure(creds)
            .subscribe(result => {
                this.credentialsChanged.emit(creds);
            });
    }

    handleCredentialsChanged(creds: AzureCredentials) {
        this.editMode = false;
        this.currentObject = null;
        this.credentialsChanged.emit(creds);
    }
}
