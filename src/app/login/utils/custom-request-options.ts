import { RequestOptions, RequestOptionsArgs, BaseRequestOptions, Headers } from '@angular/http';

export class CustomRequestOptions extends BaseRequestOptions {
    // Partially based on: http://stackoverflow.com/questions/34494876/what-is-the-right-way-to-use-angular2-http-requests-with-django-csrf-protection

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

        options.headers.set('X-CSRFToken', this.getCookie('csrftoken'));
        // Set the default content type to JSON
        if (!options.headers.get('Content-Type'))
            options.headers.set('Content-Type', 'application/json');
        return super.merge(options);
    }
}