import { Component, ElementRef, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { NgSwitch, NgSwitchDefault } from '@angular/common';
import { Observable } from 'rxjs/Rx';

import { Deployment } from '../../../../shared/models/deployment';
import { Credentials } from '../../../../shared/models/profile';
import { Task } from '../../../../shared/models/task';
import { DeploymentService } from '../../../../shared/services/deployment.service';
import { ProfileService } from '../../../../shared/services/profile.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { ArchiveDeleteConfirmDialog } from '../dialogs/archive-delete-confirm.component';

const AUTOMATIC_HEALTH_CHECK_MINUTES = 10;

@Component({
    selector: '.deployment',
    templateUrl: './deployment.component.html',
    styleUrls: ['./deployment.component.css']
})
export class DeploymentComponent implements OnInit {

    _deployment: Deployment;
    _currentTimer: Observable<any>;
    credentials: Credentials;
    isLatestTaskRunning: boolean;
    launchTask: Task;
    _hostElement: ElementRef;

    @ViewChild('kpLink') a;

    constructor(
        private elRef:ElementRef,
        private _deploymentService: DeploymentService,
        private _profileService: ProfileService,
        private dialog: MatDialog) {
        this._hostElement = elRef;
    }

    ngOnInit() {
        let cred = this.initializeCloudCredentialsObservable(this.deployment);
        this.initializeCloudCredentials(cred);
        this.initializeAutomaticHealthCheck(cred);
        this.currentTimer = this.initializeClock();
        this.initializeLaunchTask();
    }

    @Input()
    set deployment(deployment: Deployment) {
        this._deployment = deployment;
        this.isLatestTaskRunning = this.computeIsLatestTaskRunning();
    }
    get deployment(): Deployment {
        return this._deployment;
    }

    @Input()
    set currentTimer(currentTimer: Observable<any>) {
        this._currentTimer = currentTimer;
    }
    get currentTimer(): Observable<any> {
        return this._currentTimer;
    }

    initializeCloudCredentialsObservable(deployment: Deployment): Observable<Credentials> {
        return this._profileService.getCredentialsForCloud(deployment.target_cloud)
            .flatMap(credentialsArray => Observable.from(credentialsArray))
            .filter(credential => credential.default);
    }

    initializeCloudCredentials(cred: Observable<Credentials>) {
        cred.subscribe(credentials => this.credentials = credentials);
    }

    // If deployment has default credentials and latest task with status
    // information was over 10 minutes ago, then automatically kick off a
    // HEALTH_CHECK task
    initializeAutomaticHealthCheck(cred: Observable<Credentials>) {
        cred.subscribe(credentials => {
            if (credentials) {
                let latest_task = this.deployment.latest_task;
                if (latest_task.action == 'LAUNCH' || latest_task.action == 'HEALTH_CHECK') {
                    let addedMoment = moment(latest_task.added);
                    if (addedMoment.isBefore(moment().subtract(AUTOMATIC_HEALTH_CHECK_MINUTES, 'minutes'))) {
                        this.runTask(this.deployment, 'HEALTH_CHECK');
                    }
                }
            }
        });
    }

    calculateUptime(dep: Deployment, currentTime) {
        const launchTime = moment(dep.added);
        return moment.duration(currentTime.diff(launchTime)).humanize();
    }

    initializeClock(): Observable<any> {
        const self = this;
        return Observable
            .interval(1000)
            .startWith(0)
            .map(() => {
                return moment();
            });
    }

    runTask(deployment: Deployment, action: string) {
        this._deploymentService.createTask(deployment.id, action).subscribe(newTask => {
            this.isLatestTaskRunning = true;
            this.deployment.latest_task = newTask;
        });
    }

    computeIsLatestTaskRunning() {
        return this.deployment.latest_task.status == 'PENDING' || this.deployment.latest_task.status == 'PROGRESSING';
    }

    getKP(launchTask: Task) {
        const data = [];
        // Only LAUNCH tasks can have the key pair data
        data.push(launchTask.result.cloudLaunch.keyPair.material);
        const properties = {type: 'plain/text'};
        const file = new Blob(data, properties);
        const url = URL.createObjectURL(file);
        this.a.nativeElement.href = url;
    }

    initializeLaunchTask() {
        this._deploymentService.getTasks(this.deployment.id)
            .flatMap(tasksArray => Observable.from(tasksArray))
            .filter(task => task.action == 'LAUNCH')
            .subscribe(launchTask => this.launchTask = launchTask);
    }

    openArchiveConfirmDialog(deployment: Deployment): void {
        let dialogRef = this.dialog.open(ArchiveDeleteConfirmDialog);

        dialogRef.afterClosed().subscribe(result => {
            if (result == 'delete')
                this.runTask(deployment, 'DELETE')
            else if (result == 'archive')
                this.archiveDeployment();
          });
    }

    archiveDeployment() {
        // Put a translucent grey mask over view while archive operation is running
        this._hostElement.nativeElement.classList.add('archived');

        let deploymentCopy = Object.assign({}, this.deployment);
        deploymentCopy.archived = true;
        this._deploymentService.updateDeployment(deploymentCopy)
          .subscribe(deployment => this.deployment.archived = deployment.archived,
              null,
              () => this._hostElement.nativeElement.classList.remove('archived'));
    }
}
