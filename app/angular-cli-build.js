var Angular2App = require('angular-cli/lib/broccoli/angular2-app');

module.exports = function (defaults) {
    return new Angular2App(defaults, {
        vendorNpmFiles: [
        'angular2-google-maps/**/*.+(js|js.map)'
    ]
})
    ;
};