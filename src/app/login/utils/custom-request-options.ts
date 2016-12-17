import { RequestOptions, RequestOptionsArgs, BaseRequestOptions, Headers } from '@angular/http';
import { Cloud } from '../../shared/models/cloud';
import { Credentials, OpenStackCredentials, AWSCredentials } from '../../shared/models/profile';

export class CustomRequestOptions extends BaseRequestOptions {
    // Partially based on: http://stackoverflow.com/questions/34494876/what-is-the-right-way-to-use-angular2-http-requests-with-django-csrf-protection
    credentials: Credentials = null;

    setCloudCredentials(credentials: Credentials) {
        this.credentials = credentials;
    }
    
    addCredentialHeaders(options: RequestOptionsArgs) {
        if (this.credentials && this.credentials.cloud) {
            switch (this.credentials.cloud.cloud_type) {
                case 'openstack':
                    let os_creds = <OpenStackCredentials>this.credentials;
                    options.headers.set('cl-os-username', os_creds.username);
                    options.headers.set('cl-os-password', os_creds.password);
                    options.headers.set('cl-os-tenant-name', os_creds.tenant_name);
                    break;
                case 'aws':
                    let aws_creds = <AWSCredentials>this.credentials;
                    options.headers.set('cl-aws-access_key', aws_creds.access_key);
                    options.headers.set('cl-aws-secret_key', aws_creds.secret_key);
                    break;
            }
        }
    }

    getCookie(name) {
        let value = "; " + document.cookie;
        let parts = value.split("; " + name + "=");
        if (parts.length == 2)
            return parts.pop().split(";").shift();
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