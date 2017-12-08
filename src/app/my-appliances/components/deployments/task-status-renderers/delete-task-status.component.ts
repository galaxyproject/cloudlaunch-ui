import { Component, Input } from '@angular/core';

import { Task } from '../../../../shared/models/task';

@Component({
    selector: 'clui-delete-task-status',
    templateUrl: './delete-task-status.component.html',
})
export class DeleteTaskStatusComponent {

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

}
