import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { NgSwitch, NgSwitchDefault } from '@angular/common';

import { Task } from '../../../../shared/models/task';

@Component({
    selector: 'clui-health-check-task-status',
    templateUrl: './health-check-task-status.component.html',
})
export class HealthCheckTaskStatusComponent {

    _task: Task;

    constructor() {
    }

    @Input()
    set task(task: Task) {
        this._task = task;
    }
    get task(): Task {
        return this._task;
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
