import { Cloud } from './cloud';

export interface ApplicationVersionCloudConfig {
    cloud: Cloud;
    image: any;
    default_launch_config: any;
}

export interface ApplicationVersion {
    version: string;
    id: string;
    text: string;
    cloud_config: ApplicationVersionCloudConfig[];
    frontend_component_path: string;
    frontend_component_name: string;
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
}
