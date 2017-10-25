import { Component, Host, Input } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
    FormGroupDirective } from '@angular/forms';

import { BasePluginComponent } from '../base-plugin.component';
import { Cloud, CloudManCluster } from '../../../shared/models/cloud';
import { CloudService } from '../../../shared/services/cloud.service';

@Component({
    selector: 'cloudman-config',
    templateUrl: './cloudman.component.html',
    providers: [CloudService]
})

export class CloudManConfigComponent extends BasePluginComponent {

    @Input()
    set password (value: string) { this.hidePassword = true; this.clusterPasswordCtrl.setValue(value); }
    get password(): string { return this.clusterPasswordCtrl.value; }

    hidePassword = false;
    showAdvanced: boolean = false;
    showSavedClusters: boolean = false;
    savedClustersHelp: string = "Select a saved cluster";
    savedClusters: CloudManCluster[] = [];
    errorMessage: string;

    // Form controls
    cmClusterForm: FormGroup;
    restartClusterCtrl = new FormControl();
    clusterPasswordCtrl = new FormControl(null, Validators.required);
    storageTypeCtrl = new FormControl('', Validators.required);
    clusterTypeCtrl = new FormControl('Galaxy');

    get form(): FormGroup {
        return this.cmClusterForm;
    }

    get configName(): string {
        return "config_cloudman";
    }

    constructor(fb: FormBuilder, @Host() parentContainer: FormGroupDirective,
                private _cloudService: CloudService) {
        super(fb, parentContainer);
        this.cmClusterForm = fb.group({
            'restartCluster': this.restartClusterCtrl,
            'clusterPassword': this.clusterPasswordCtrl,
            'storageType': this.storageTypeCtrl,
            'storageSize': [null],
            'clusterType': this.clusterTypeCtrl,
            'defaultBucket': [null, Validators.required],
            'masterPostStartScript': [null],
            'workerPostStartScript': [null],
            'clusterSharedString': [null],
            'extraUserData': [null]
        });
        this.restartClusterCtrl.valueChanges.subscribe(cluster => { this.storageTypeCtrl.setValue('volume'); });
    }

    toggleAdvanced() {
        this.showAdvanced = !this.showAdvanced;
    }

    fetchSavedClusters() {
        this.savedClustersHelp = "Retrieving saved clusters..."
        this.savedClusters = []
        this.showSavedClusters = true;
        this._cloudService.getSavedClusters(this.cloud.slug)
            .subscribe(savedClusters => this.savedClusters = savedClusters,
            error => this.errorMessage = <any>error,
            () => { this.savedClustersHelp = 'Select a saved cluster'; });
    }
}
