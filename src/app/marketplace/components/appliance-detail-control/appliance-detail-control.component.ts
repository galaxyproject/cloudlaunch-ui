import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { RequestOptions } from '@angular/http';

import { CustomRequestOptions } from '../../../login/utils/custom-request-options';
import { AppPlaceHolderComponent } from './app-placeholder.component';

// Models
import { Application, ApplicationVersion, ApplicationVersionCloudConfig } from '../../../shared/models/application';
import { Cloud } from '../../../shared/models/cloud';
import { Credentials } from '../../../shared/models/profile';

//Services
import { ApplicationService } from '../../../shared/services/application.service';
import { DeploymentService } from '../../../shared/services/deployment.service';
import { ProfileService } from '../../../shared/services/profile.service';


@Component({
    selector: 'app-appliance-detail-control',
    templateUrl: './appliance-detail-control.component.html',
    styleUrls: ['./appliance-detail-control.component.css']
})
export class ApplianceDetailControlComponent implements OnInit {
    @Input()
    application: Application;

    selectedVersion: ApplicationVersion;
    selectedAppCloudConfig: ApplicationVersionCloudConfig;
    applianceLaunchForm: FormGroup;
    appConfigForm: FormGroup;
    clouds: any[] = [];
    private _targetCloud: Cloud;
    public errorMessage: string;
    private submitPending: boolean = false;

    storedCredentials: Credentials[] = [];
    storedCredentialsHelp: string = 'Select a target cloud first';
    
    constructor(
        fb: FormBuilder,
        private _router: Router,
        private _applicationService: ApplicationService,
        private _deploymentService: DeploymentService,
        private _profileService: ProfileService,
        private _requestOptions: RequestOptions
        ) {
        this.appConfigForm = fb.group({});
        this.applianceLaunchForm = fb.group({
            'name': ['', Validators.required],
            'application_version': ['', Validators.required],
            'target_cloud': ['', Validators.required],
            'credentials': [''],
            'temporary_credentials': ['', Validators.required],
            'config_app': this.appConfigForm
        });
        (<FormControl>this.applianceLaunchForm.controls['temporary_credentials']).registerOnChange(this.setRequestCredentials);
    }

    ngOnInit() {
        // Generate a default name for the deployment
        (<FormControl>this.applianceLaunchForm.controls['name']).setValue(this.application.slug + "-" + new Date().toJSON());
    }

    getApplicationVersions() {
        return this.application.versions.map(v => { v.id = v.version; v.text = v.version; return v; });
    }

    onVersionSelect(version: ApplicationVersion) {
        let applicationVersion = this.application.versions.filter(v => { return v.version == version.id; })[0];
        (<FormControl>this.applianceLaunchForm.controls['application_version']).setValue(applicationVersion.id);
        this.selectedVersion = applicationVersion;
        this.getCloudsForVersion(applicationVersion);
    }

    getCloudsForVersion(version: ApplicationVersion) {
        this.clouds = version.cloud_config.map(cfg => { let r = cfg.cloud; r.id = r.slug; r.text = r.name; return r; });
    }

    onCloudSelect(cloud: any) {
        this._targetCloud = this.clouds.filter(c => { return c.id === cloud.id })[0];
        (<FormControl>this.applianceLaunchForm.controls['target_cloud']).setValue(cloud.id);
        this.selectedAppCloudConfig = this.selectedVersion.cloud_config.filter(v => { return v.cloud.slug === cloud.id; })[0];
        this.getStoredCredentials(this._targetCloud);
    }

    /* Set global request credentials based on user entered data */
    setRequestCredentials() {
        let customRequestOptions = <CustomRequestOptions>this._requestOptions;
        let existingCreds = (<FormControl>this.applianceLaunchForm.controls['credentials']);
        let tempCreds = (<FormControl>this.applianceLaunchForm.controls['temporary_credentials']);
        if (existingCreds.value) {
            customRequestOptions.setCloudCredentials(existingCreds.value);
        } else if (tempCreds.value) {
            customRequestOptions.setCloudCredentials(tempCreds.value);
        }
        else {
            throw new Error("Assertion Failure: Either credentials or temporary_credentials must have a value");
        }
    }

    getStoredCredentials(cloud: Cloud) {
        this.storedCredentialsHelp = 'Retrieving stored credentials...';
        this.storedCredentials = [];
        this._profileService.getCredentialsForCloud(cloud.slug)
            .subscribe(creds => this.storedCredentials = creds.map((c: any) => { c.text = c.name; return c; }),
            error => this.errorMessage = <any>error,
            () => { this.storedCredentialsHelp = 'Use Temporary Credentials'; });
    }

    onCredentialsSelect(creds: Credentials) {
        if (this.storedCredentials && creds) {
            creds = this.storedCredentials.filter(c => c.id === creds.id)[0];
        }
        (<FormControl>this.applianceLaunchForm.controls['credentials']).setValue(creds);
        if (creds) {
            (<FormControl>this.applianceLaunchForm.controls['temporary_credentials']).disable();
        } else {
            (<FormControl>this.applianceLaunchForm.controls['temporary_credentials']).enable();
        }
        this.setRequestCredentials();
    }


    goBack() {
        window.history.back();
    }

    onSubmit(formValues: any): void {
        this.errorMessage = null;
        this.submitPending = true;
        formValues['application'] = this.application.slug;
        console.log(JSON.stringify(formValues));
        this._deploymentService.createDeployment(formValues).subscribe(
            data => this._router.navigate(['appliances']),
            error => this.handleErrors(error));
    }

    handleErrors(errors) {
        this.submitPending = false;
        if (errors) {
            if (errors.hasOwnProperty("error")) {
                this.errorMessage = `${errors.error}`;
            }

            for (let err of errors) {
                alert(err);
                //this.applianceLaunchForm.controls[error].setErrors({ remote: error });
            }
        }
        else {
            this.errorMessage = `${errors.reasonPhrase} (${errors.code})`;
        }
    }

}
