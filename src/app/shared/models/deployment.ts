import { ApplicationVersion } from './application';

export interface Deployment {
    name: string;
    id: string;
    text: string;
    added: string;
    application_version: string;
    app_version_details: ApplicationVersion;
    application_config: any;
    target_cloud: string;
    config_app: any;
    latest_task: any;
}
