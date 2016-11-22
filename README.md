# cloudlaunch-ui
A user interface for the [CloudLaunch app](https://github.com/galaxyproject/cloudlaunch/tree/dev).

### Setup development environment

To install dependencies and start a development server:

    # install typescript development support if necessary
    npm install tsd -g
    # install angular-cli
    npm install angular-cli -g
    # install dependencies
    npm install
    # start server
    ng serve

Alongside this development server, it's necessary to run the CloudLaunch app
(see [README](https://github.com/galaxyproject/cloudlaunch/blob/dev/README.rst)
for the app); current code assumes the CloudLaunch app runs on `127.0.0.1:8000`.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/). 
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.