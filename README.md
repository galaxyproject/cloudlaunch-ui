# cloudlaunch-ui
A user interface for the [CloudLaunch app](https://github.com/galaxyproject/cloudlaunch/tree/dev).

### Setup development environment

To install dependencies and start a development server:

    # install typescript development support if necessary
    npm install tsd -g
    # install dependencies
    npm install
    # start server
    npm start

Alongside this development server, it's necessary to run the CloudLaunch app
(see [README](https://github.com/galaxyproject/cloudlaunch/blob/dev/README.rst)
for the app); current code assumes the CloudLaunch app runs on `127.0.0.1:8000`.
