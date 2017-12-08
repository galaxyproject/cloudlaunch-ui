import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { NgSwitch, NgSwitchDefault } from '@angular/common';

import { Task } from '../../../../shared/models/task';

@Component({
    selector: 'clui-launch-task-status',
    templateUrl: './launch-task-status.component.html',
})
export class LaunchTaskStatusComponent {

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
}
