import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { NgSwitch, NgSwitchDefault } from '@angular/common';
import { Observable } from 'rxjs/Rx';

import { Task } from '../../../../../shared/models/task';

@Component({
    selector: 'health-check-task-status-renderer',
    templateUrl: './health-check-task-status-renderer.component.html',
})
export class HealthCheckTaskStatusRenderer {

    _task: Task;
    _hasCredentials: boolean;

    constructor() {
    }

    @Input()
    set task(task: Task) {
        this._task = task;
    }
    get task(): Task {
        return this._task;
    }

    @Input()
    set hasCredentials(hasCredentials: boolean) {
        this._hasCredentials = hasCredentials;
    }
    get hasCredentials():boolean {
        return this._hasCredentials;
    }

    getInstanceStatus():string {
        try {
          return this.task.result.instance_status;
        } catch (e) {
          return null;
        }
    }
}
