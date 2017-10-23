import { ApplicationVersion } from './application';
import { Task } from './task';

export class Deployment {
    name: string;
    id: string;
    added: string;
    application: string;
    application_version: string;
    app_version_details: ApplicationVersion;
    application_config: any;
    target_cloud: string;
    config_app: any;
    latest_task: Task;
    tasks: Task[];
    archived: boolean;
}
