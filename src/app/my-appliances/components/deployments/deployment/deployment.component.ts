import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgSwitch, NgSwitchDefault } from '@angular/common';
import { FormControl } from '@angular/forms';

import { Observable, Subscription, combineLatest } from 'rxjs';
import { map, mergeMap, filter, shareReplay } from 'rxjs/operators';

import * as moment from 'moment';

import { Deployment } from '../../../../shared/models/deployment';
import { Credentials, UserProfile } from '../../../../shared/models/profile';
import { Task } from '../../../../shared/models/task';
import { DeploymentService } from '../../../../shared/services/deployment.service';

import { MatDialog } from '@angular/material';
import { ArchiveDeleteConfirmDlgComponent } from '../dialogs/archive-delete-confirm.component';

const AUTOMATIC_HEALTH_CHECK_MINUTES = 7;

@Component({
    // tslint:disable-next-line:component-selector
    selector: '[clui-deployment-component]',
    templateUrl: './deployment.component.html',
    styleUrls: ['./deployment.component.css']
})
export class DeploymentComponent implements OnInit, OnDestroy {
    defaultCreds: Observable<Credentials>;
    deploymentCtrl = new FormControl();
    profileCtrl = new FormControl();
    healthCheckSubscription: Subscription;

    @Input()
    set deployment(deployment: Deployment) {
        this.deploymentCtrl.patchValue(deployment);
    }
    get deployment(): Deployment {
        return this.deploymentCtrl.value;
    }

    @Input()
    public currentTimer: Observable<moment.Moment>;

    @Input()
    set profile(profile: UserProfile) {
        this.profileCtrl.patchValue(profile);
    }
    get profile(): UserProfile {
        return this.deploymentCtrl.value;
    }

    constructor(private deploymentService: DeploymentService,
                private sanitizer: DomSanitizer,
                private dialog: MatDialog) {
        this.defaultCreds = combineLatest(this.deploymentCtrl.valueChanges.pipe(shareReplay(1)),
                                          this.profileCtrl.valueChanges.pipe(shareReplay(1)))
                            .pipe(
                                    filter(([deployment, profile]) => !!deployment && !!profile),
                                    mergeMap(([deployment, profile]) => this.deploymentService.getCredsForDeployment(deployment, profile)));
    }

    ngOnInit() {
        this.healthCheckSubscription = this.initializeAutomaticHealthCheck();
    }

    ngOnDestroy() {
        if (this.healthCheckSubscription) {
            this.healthCheckSubscription.unsubscribe();
        }
    }

    // If deployment has default credentials and latest task with status
    // information was over 10 minutes ago, then automatically kick off a
    // HEALTH_CHECK task
    initializeAutomaticHealthCheck() {
        return this.defaultCreds.subscribe(credentials => {
            if (credentials) {
                const latest_task = this.deployment.latest_task;
                if (latest_task.status !== 'PENDING' && latest_task.status !== 'PROGRESSING' && latest_task.action !== 'DELETE') {
                    const addedMoment = moment(latest_task.added);
                    if (addedMoment.isBefore(moment().subtract(AUTOMATIC_HEALTH_CHECK_MINUTES, 'minutes'))) {
                        this.runTask(this.deployment, 'HEALTH_CHECK');
                    }
                }
            }
        });
    }

    calculateUptime(dep: Deployment, currentTime: moment.Moment) {
        const launchTime = moment(dep.added);
        return moment.duration(currentTime.diff(launchTime)).humanize();
    }

    runTask(deployment: Deployment, action: string) {
        this.deploymentService.createTask(deployment.id, action).subscribe(newTask => {
            this.deployment.latest_task = newTask;
        });
    }

    isLatestTaskRunning() {
        // Pending tasks should not have a task result. Sometimes, tasks are stuck in pending
        // because they have errored out prior to launch - so check for the result too.
        return (this.deployment.latest_task.status === 'PENDING' && !this.deployment.latest_task.result) ||
                this.deployment.latest_task.status === 'PROGRESSING';
    }

    getKPDownloadLink(material: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`data:text/plain,${material}`);
    }

    openArchiveConfirmDialog(deployment: Deployment): void {
        const dialogRef = this.dialog.open(ArchiveDeleteConfirmDlgComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result === 'delete') {
                this.runTask(deployment, 'DELETE');
            } else if (result === 'archive') {
                this.archiveDeployment();
            }
          });
    }

    archiveDeployment() {
        const deploymentCopy = Object.assign({}, this.deployment);
        deploymentCopy.archived = true;
        this.deploymentService.updateDeployment(deploymentCopy)
          .subscribe(deployment => this.deployment.archived = deployment.archived);
    }
}
