import { ApplicationVersion } from './application';
import { Credentials } from './profile';
import { Task } from './task';
import { PlacementZone } from './cloud';

export class Deployment {
    name: string;
    id: string;
    added: string;
    application: string;
    application_version: string;
    app_version_details: ApplicationVersion;
    application_config: any;
    deployment_target: DeploymentTarget;
    // Only used during creates
    deployment_target_id: number;
    config_app: any;
    launch_task: Task;
    latest_task: Task;
    tasks: Task[];
    archived: boolean;
    credentials: string;
}

export class DeploymentTarget {
    id: number;
    resourcetype: string;
}

export class CloudDeploymentTarget extends DeploymentTarget {
    target_zone: PlacementZone;
}
