export interface Deployment {
  name: string;
  id: string;
  text: string;
  application_version: string;
  application_config: any;
  target_cloud: string;
  config_app: any;
}
