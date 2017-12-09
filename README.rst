.. image:: https://travis-ci.org/galaxyproject/cloudlaunch-ui.svg?branch=master
    :target: https://travis-ci.org/galaxyproject/cloudlaunch-ui

cloudlaunch-ui
==============

A user interface for the `CloudLaunch app`_.

A public server can be accessed at https://beta.launch.usegalaxy.org/.

Setup development environment
-----------------------------

Make sure you have ``node`` (version 6.*) installed. Then install
dependencies with the following commands:

.. code-block:: bash

    # Install typescript development support if necessary
    npm install -g tsd
    # Install angular-cli
    npm install -g @angular/cli
    # Install dependencies
    npm install

Start the development server
----------------------------

To start the dev server, run:

.. code-block:: bash

    npm start

Or if you use yarn as your preferred package manager, ``yarn start``.

Access the server at ``http://localhost:4200/``. The app will
automatically reload if you change any of the source files.

Alongside this development server, it’s necessary to run the CloudLaunch
app (see `README`_ for the app); default assumes the CloudLaunch app
runs on ``127.0.0.1:8000``.

Code scaffolding
----------------

Run ``ng generate component component-name`` to generate a new
component. You can also use
``ng generate directive/pipe/service/class``.

Build
-----

Run ``ng build`` to build the project. The build artifacts will be
stored in the ``dist/`` directory. Use the ``-prod`` flag for a
production build.

Running unit tests
------------------

Run ``ng test`` to execute the unit tests via `Karma`_.

Running end-to-end tests
------------------------

Run ``ng e2e`` to execute the end-to-end tests via `Protractor`_. Before
running the tests make sure you are serving the app via ``ng serve``.


.. _CloudLaunch app: https://github.com/galaxyproject/cloudlaunch/
.. _README: https://github.com/galaxyproject/cloudlaunch/blob/dev/README.rst
.. _Karma: https://karma-runner.github.io
.. _Protractor: http://www.protractortest.org/