import { Cloud } from './cloud';

export class Credentials {
   id: string;
   name: string;
   default: boolean;
   cloud: Cloud;
}

export class AWSCredentials extends Credentials {
   id: string;
   access_key: string;
   secret_key: string;
}

export class OpenStackCredentials extends Credentials {
   id: string;
   username: string;
   password: string;
   tenant_name: string;
   project_name: string;
   project_domain_name: string;
   user_domain_name: string;
   identity_api_version: string;
}

export interface UserProfile {
   username: string;
   email: string;
   first_name: string;
   last_name: string;
   aws_creds: AWSCredentials[];
   openstack_creds: OpenStackCredentials[];
}
