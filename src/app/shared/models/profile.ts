import { Cloud } from './cloud';

export class Credentials {
    id: string;
    name: string;
    default: boolean;
    resourcetype: string;
    cloud: Cloud;
    cloud_id: string; // only used when saving new record
}

export class AWSCredentials extends Credentials {
    access_key: string;
    secret_key: string;
}

export class OpenStackCredentials extends Credentials {
    username: string;
    password: string;
    project_name: string;
    project_domain_name: string;
    user_domain_name: string;
    identity_api_version: string;
}

export class AzureCredentials extends Credentials {
    subscription_id: string;
    client_id: string;
    secret: string;
    tenant: string;
    resource_group: string;
    storage_account: string;
    vm_default_username: string;
}

export class GCPCredentials extends Credentials {
    credentials: string;
}

export class UserProfile {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    credentials: Credentials[];
}

export class AuthToken {
    id: string;
    name: string;
    key: string;
}

export class CredVerificationResult {
    result: string;
    details: string;
}
