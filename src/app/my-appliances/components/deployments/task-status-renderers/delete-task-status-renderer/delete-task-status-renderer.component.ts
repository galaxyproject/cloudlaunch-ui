import { Component, Input } from '@angular/core';

import { Task } from '../../../../../shared/models/task';

@Component({
    selector: 'delete-task-status-renderer',
    templateUrl: './delete-task-status-renderer.component.html',
})
export class DeleteTaskStatusRenderer {

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
