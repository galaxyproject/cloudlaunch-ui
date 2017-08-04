import { ɵgetDOM as getDOM } from '@angular/platform-browser';
import { RequestOptions, RequestOptionsArgs, BaseRequestOptions, Headers } from '@angular/http';
import { Cloud } from '../../shared/models/cloud';
import { Credentials, OpenStackCredentials, AWSCredentials, AzureCredentials } from '../../shared/models/profile';

export class CustomRequestOptions extends BaseRequestOptions {
    // Partially based on: http://stackoverflow.com/questions/34494876/what-is-the-right-way-to-use-angular2-http-requests-with-django-csrf-protection
    credentials: Credentials = null;

    setCloudCredentials(credentials: Credentials) {
        this.credentials = credentials;
    }
    
    addCredentialHeaders(options: RequestOptionsArgs) {
        if (this.credentials && this.credentials.cloud) {
            if (this.credentials.id) {
                // Must be a saved set or credentials. Retrieve using ID
                options.headers.set('cl-credentials-id', this.credentials.id);
                return;
            }
            // Must be an unsaved set of credentials
            switch (this.credentials.cloud.cloud_type) {
                case 'openstack':
                    let os_creds = <OpenStackCredentials>this.credentials;
                    options.headers.set('cl-os-username', os_creds.username);
                    options.headers.set('cl-os-password', os_creds.password);
                    options.headers.set('cl-os-project-name', os_creds.project_name);
                    options.headers.set('cl-os-project-domain-name', os_creds.project_domain_name);
                    options.headers.set('cl-os-user-domain-name', os_creds.user_domain_name);
                    break;
                case 'aws':
                    let aws_creds = <AWSCredentials>this.credentials;
                    options.headers.set('cl-aws-access-key', aws_creds.access_key);
                    options.headers.set('cl-aws-secret-key', aws_creds.secret_key);
                    break;
                case 'azure':
                    let azure_creds = <AzureCredentials>this.credentials;
                    options.headers.set('cl-azure-subscription-id', azure_creds.subscription_id);
                    options.headers.set('cl-azure-client-id', azure_creds.client_id);
                    options.headers.set('cl-azure-secret', azure_creds.secret);
                    options.headers.set('cl-azure-tenant', azure_creds.tenant);
                    break;
            }
        }
    }

    getCookie(name) {
        return getDOM().getCookie(name);
    }

    merge(options?: RequestOptionsArgs): RequestOptions {
        if (!options.headers)
            options.headers = new Headers();

        if (sessionStorage.getItem('token') || localStorage.getItem('token')) {
            let auth_header = "Token " + sessionStorage.getItem('token') || localStorage.getItem('token');
            options.headers.set('Authorization', auth_header);
        }
        
        this.addCredentialHeaders(options);

        options.headers.set('X-CSRFToken', this.getCookie('csrftoken'));
        // Set the default content type to JSON
        if (!options.headers.get('Content-Type'))
            options.headers.set('Content-Type', 'application/json');
        return super.merge(options);
    }
}