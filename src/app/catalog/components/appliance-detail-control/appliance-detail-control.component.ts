import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';

import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

import { AppPlaceHolderComponent } from './app-placeholder.component';

// Models
import { Application, ApplicationVersion, ApplicationVersionTargetConfig } from '../../../shared/models/application';
import { Deployment } from '../../../shared/models/deployment';
import { DeploymentTarget } from '../../../shared/models/deployment';
import { Credentials } from '../../../shared/models/profile';

// Services
import { ApplicationService } from '../../../shared/services/application.service';
import { DeploymentService } from '../../../shared/services/deployment.service';
import { LoginService } from '../../../login/services/login/login.service';


@Component({
    selector: 'clui-appliance-detail-control',
    templateUrl: './appliance-detail-control.component.html',
    styleUrls: ['./appliance-detail-control.component.css']
})
export class ApplianceDetailControlComponent implements OnInit {

    @Input()
    set application(value: Application) {
        this.appControl.patchValue(value);
    }

    get application(): Application {
        return this.appControl.value;
    }

    // Form controls
    applianceLaunchForm: FormGroup;
    appConfigForm: FormGroup;
    nameControl = new FormControl('', Validators.required);
    appControl = new FormControl('', Validators.required);
    appVerControl = new FormControl('', Validators.required);
    credentialsControl = new FormControl('', Validators.required);
    deploymentTargetControl = new FormControl('', Validators.required);

    showOnDirtyErrorStateMatcher = new ShowOnDirtyErrorStateMatcher();

    public errorMessage: string;
    public submitPending = false;

    constructor(
        fb: FormBuilder,
        private _router: Router,
        private _applicationService: ApplicationService,
        private _deploymentService: DeploymentService,
        private _loginService: LoginService) {
        this.appConfigForm = fb.group({});
        this.applianceLaunchForm = fb.group({
            'name': this.nameControl,
            'application': this.appControl,
            'application_version': this.appVerControl,
            'deployment_target': this.deploymentTargetControl,
            'credentials': this.credentialsControl,
            'config_app': this.appConfigForm
        });
        this.appControl.valueChanges.subscribe(app => { this.onApplicationChange(app); });
        this.appVerControl.valueChanges.subscribe(appVer => { this.onVersionChange(appVer); });
        this.deploymentTargetControl.valueChanges.subscribe(target => { this.onDeploymentTargetChange(target); });
        this.credentialsControl.valueChanges.subscribe(creds => { this.setRequestCredentials(creds); });
    }

    ngOnInit() {
        // Generate a default name for the deployment
        const deployment_name = (this._loginService.getCurrentUser().username + '-' +
                                 this.application.slug + '-' + new Date().toJSON()
                                 .slice(2, 16).replace(':', '-')).toLowerCase();
        this.nameControl.setValue(deployment_name);
    }

    /*
     * The fields have dependencies in the following order:
     * Application -> Version -> Target -> Credentials
     */
    onApplicationChange(app: Application) {
        this.onVersionSelectById(app ? app.default_version : null);
    }

    onVersionSelectById(version_id: string) {
        if (version_id) {
            const applicationVersion = this.application.versions.filter(v => v.version === version_id)[0];
            this.appVerControl.setValue(applicationVersion);
        } else {
            this.appVerControl.patchValue(null);
        }
    }

    onVersionChange(version: ApplicationVersion) {
        if (version && version.default_target) {
            const default_target = this.getVersionConfigForTarget(version.default_target).target;
            this.deploymentTargetControl.setValue(default_target);
        } else {
            this.deploymentTargetControl.patchValue(null);
        }
    }

    onDeploymentTargetChange(target: DeploymentTarget) {
        this.credentialsControl.patchValue(null);
    }

    getCurrentAppTargetConfig(): ApplicationVersionTargetConfig {
        const target = this.deploymentTargetControl.value;
        if (target) {
            return this.getVersionConfigForTarget(target.id);
        } else {
            return null;
        }
    }

    getVersionConfigForTarget(target_id: number): ApplicationVersionTargetConfig {
        return this.appVerControl.value.target_config.filter((v: ApplicationVersionTargetConfig) => v.target.id === target_id)[0];
    }

    getTargetsForSelectedVersion(): DeploymentTarget[] {
        return this.appVerControl.value.target_config.map((v: ApplicationVersionTargetConfig)  => v.target);
    }

    /* Set global request credentials based on user entered data */
    setRequestCredentials(creds: Credentials) {
        this._loginService.setCloudCredentials(creds);
    }

    onSubmit(formValues: any): void {
        this.errorMessage = null;
        this.submitPending = true;
        const deployment = this.formToDeployment(formValues);
        this._deploymentService.createDeployment(deployment).subscribe(
            data => this._router.navigate(['appliances']),
            error => this.handleErrors(error));
    }

    formToDeployment(formValues: any): Deployment {
        const d = new Deployment();
        d.name = formValues['name'];
        d.application = formValues['application'].slug;
        d.application_version = formValues['application_version'].version;
        d.deployment_target_id = formValues['deployment_target'].id;
        d.config_app = formValues['config_app'];
        return d;
    }

    handleErrors(errors: any) {
        this.submitPending = false;
        if (errors) {
            if (errors.hasOwnProperty('error')) {
                this.errorMessage = `${errors.error}`;
            } else if (typeof errors === 'string') {
                this.errorMessage = <string>errors;
            } else if (errors instanceof Array) {
                // Validation responses such as: ["Unknown error occurred"]
                this.errorMessage = '';
                errors.map(err => this.errorMessage += `${err}\n`);
            } else {
                // Validation responses such as: {"target_cloud":["This field is required."]}
                this.errorMessage = '';
                errors.map((err: any) => {
                    this.errorMessage += `${err}: ${errors[err]}\n`;
                    if (this.applianceLaunchForm.controls[err]) {
                        this.applianceLaunchForm.controls[err].setErrors({ remote: errors[err] });
                    }
                });
            }

        } else {
            this.errorMessage = `An unknown error occurred. No message was received from the server.`;
        }
    }

}
