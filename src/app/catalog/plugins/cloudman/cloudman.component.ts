import { Component, Host, Input, OnDestroy } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
    FormGroupDirective } from '@angular/forms';

import { Observable ,  Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { BasePluginComponent } from '../base-plugin.component';
import { CloudManCluster } from '../../../shared/models/cloud';
import { CloudService } from '../../../shared/services/cloud.service';
import { CloudDeploymentTarget } from '../../../shared/models/deployment';

@Component({
    selector: 'clui-cloudman-config',
    templateUrl: './cloudman.component.html',
    providers: [CloudService],
    // tslint:disable-next-line:use-input-property-decorator
    inputs: ['target', 'initialConfig']
})

export class CloudManConfigComponent extends BasePluginComponent implements OnDestroy {

    @Input()
    set password (value: string) { this.hidePassword = true; this.clusterPasswordCtrl.setValue(value); }
    get password(): string { return this.clusterPasswordCtrl.value; }

    hidePassword = false;
    showAdvanced = false;
    showSavedClusters = false;
    savedClustersHelp = 'Select a saved cluster';
    errorMessage: string;

    // Form controls
    cmClusterForm: FormGroup;
    restartClusterCtrl = new FormControl();
    clusterPasswordCtrl = new FormControl(null, Validators.required);
    storageTypeCtrl = new FormControl('transient', Validators.required);
    clusterTypeCtrl = new FormControl('Galaxy');

    // Observables
    savedClustersObservable: Observable<CloudManCluster[]>;
    targetCtrlSubscription: Subscription;
    restartCtrlSubscription: Subscription;

    get form(): FormGroup {
        return this.cmClusterForm;
    }

    get configName(): string {
        return 'config_cloudman';
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
        this.targetCtrlSubscription = this.targetCtrl.valueChanges
                                     .subscribe(cluster => { this.showSavedClusters = false; this.restartClusterCtrl.patchValue(null); });
        this.restartCtrlSubscription = this.restartClusterCtrl.valueChanges
                                       .subscribe(cluster => { if (cluster) { this.storageTypeCtrl.setValue('volume'); } });
    }

    toggleAdvanced() {
        this.showAdvanced = !this.showAdvanced;
    }

    fetchSavedClusters() {
        this.showSavedClusters = true;
        this.savedClustersHelp = 'Retrieving saved clusters...';
        const zone = (<CloudDeploymentTarget>this.target).target_zone;
        this.savedClustersObservable = this._cloudService.getSavedClusters(zone.cloud.id, zone.region.region_id, zone.zone_id)
                                       .pipe(tap(clusters => { this.savedClustersHelp = 'Select a saved cluster'; },
                                                 error => { this.errorMessage = <any>error; }));
    }

    ngOnDestroy() {
        if (this.restartCtrlSubscription) {
            this.restartCtrlSubscription.unsubscribe();
        }
        if (this.targetCtrlSubscription) {
            this.targetCtrlSubscription.unsubscribe();
        }
    }
}
