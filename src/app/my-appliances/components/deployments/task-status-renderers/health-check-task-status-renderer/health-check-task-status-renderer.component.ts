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
    get hasCredentials(): boolean {
        return this._hasCredentials;
    }

    getInstanceStatus(): string {
        try {
          if (this.task.action === 'HEALTH_CHECK') {
            return this.task.result.instance_status;
           } else if (this.task.action === 'DELETE' && this.task.result.result === true) {
            // We may want to actually run a separate HEALTH_CHECK task instead?
            return 'deleted';
           }
        } catch (e) {
          return null;
        }
    }
}
