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
import { LoginService } from '../../../login/services/login/login.service';


@Component({
    selector: 'app-appliance-detail-control',
    templateUrl: './appliance-detail-control.component.html',
    styleUrls: ['./appliance-detail-control.component.css']
})
export class ApplianceDetailControlComponent implements OnInit {
    private _application: Application;

    @Input()
    set application(value: Application) {
        this._application = value;
        if (value && value.default_version)
            this.onVersionSelectById(value.default_version);
    }

    get application() : Application {
        return this._application;
    }

    selectedVersion: ApplicationVersion;
    selectedAppCloudConfig: ApplicationVersionCloudConfig;
    applianceLaunchForm: FormGroup;
    appConfigForm: FormGroup;
    clouds: any[] = [];
    private _targetCloud: Cloud;
    public errorMessage: string;
    private submitPending: boolean = false;
    page2: boolean = false;  // Wizard page 2

    constructor(
        fb: FormBuilder,
        private _router: Router,
        private _applicationService: ApplicationService,
        private _deploymentService: DeploymentService,
        private _loginService: LoginService,
        private _requestOptions: RequestOptions
        ) {
        this.appConfigForm = fb.group({});
        this.applianceLaunchForm = fb.group({
            'name': ['', Validators.required],
            'application_version': ['', Validators.required],
            'target_cloud': ['', Validators.required],
            'credentials': ['', Validators.required],
            'config_app': this.appConfigForm
        });
        (<FormControl>this.applianceLaunchForm.controls['credentials']).valueChanges.subscribe(creds => { this.setRequestCredentials(creds); });
    }

    ngOnInit() {
        // Generate a default name for the deployment
        let deployment_name = this._loginService.getCurrentUser().username + "'s-" + this.application.slug + "-" + new Date().toJSON().slice(0, 16);
        (<FormControl>this.applianceLaunchForm.controls['name']).setValue(deployment_name);
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

    onVersionSelectById(version_id: string) {
        let applicationVersion = this.getApplicationVersions().filter(v => { return v.version == version_id; })[0];
        this.onVersionSelect(applicationVersion);
    }

    getSelectedVersion() {
        let selected_version_id = (<FormControl>this.applianceLaunchForm.controls['application_version']).value;
        return this.getApplicationVersions().filter(v => { return v.version == selected_version_id; });
    }

    getCloudsForVersion(version: ApplicationVersion) {
        this.clouds = version.cloud_config.map(cfg => { let r = cfg.cloud; r.id = r.slug; r.text = r.name; return r; });
        if (version.default_cloud)
            this.onCloudSelectById(version.default_cloud);
    }

    onCloudSelect(cloud: any) {
        this._targetCloud = this.clouds.filter(c => { return c.id === cloud.id })[0];
        (<FormControl>this.applianceLaunchForm.controls['target_cloud']).setValue(cloud.id);
        (<FormControl>this.applianceLaunchForm.controls['credentials']).patchValue(null);
        this.selectedAppCloudConfig = this.selectedVersion.cloud_config.filter(v => { return v.cloud.slug === cloud.id; })[0];
    }

    onCloudSelectById(slug: string) {
        let cloud = this.clouds.filter(c => { return c.id === slug })[0];
        this.onCloudSelect(cloud);
    }

    getSelectedCloud() {
        let selected_cloud_id = (<FormControl>this.applianceLaunchForm.controls['target_cloud']).value;
        return this.clouds.filter(c => { return c.id === selected_cloud_id });
    }

    /* Set global request credentials based on user entered data */
    setRequestCredentials(creds: Credentials) {
        let customRequestOptions = <CustomRequestOptions>this._requestOptions;
        customRequestOptions.setCloudCredentials(creds);
    }

    pageChange() {
        this.page2 = !this.page2;
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
