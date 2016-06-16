export interface Deployment {
  name: string;
  id: string;
  text: string;
  application_version: string;
  target_cloud: string;
  config_cloudlaunch: any;
  config_app: any;
}
   