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
    aws_access_key: string;
    aws_secret_key: string;
}

export class OpenStackCredentials extends Credentials {
    os_username: string;
    os_password: string;
    os_project_name: string;
    os_project_domain_name: string;
    os_user_domain_name: string;
    os_identity_api_version: string;
}

export class AzureCredentials extends Credentials {
    azure_subscription_id: string;
    azure_client_id: string;
    azure_secret: string;
    azure_tenant: string;
    azure_resource_group: string;
    azure_storage_account: string;
    azure_vm_default_username: string;
}

export class GCPCredentials extends Credentials {
    gcp_service_creds_dict: string;
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
