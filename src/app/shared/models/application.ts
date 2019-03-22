import { Cloud } from './cloud';
import { DeploymentTarget } from './deployment';

export interface ApplicationVersionTargetConfig {
    target: DeploymentTarget;
    default_launch_config: any;
}

export interface ApplicationVersionCloudConfig extends ApplicationVersionTargetConfig {
    image: any;
}

export interface ApplicationVersion {
    version: string;
    id: string;
    application: Application;
    target_config: ApplicationVersionTargetConfig[];
    frontend_component_path: string;
    frontend_component_name: string;
    default_target: number;
}

export interface Application {
    slug: string;
    name: string;
    summary: string;
    description: string;
    maintainer: string;
    info_url: string;
    icon_url: string;
    versions: ApplicationVersion[];
    default_version: string;
}
