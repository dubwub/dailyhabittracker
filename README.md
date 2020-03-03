# Daily-habit-tracker

## Installation and Setup

`web-server` is the backend, run `yarn` to install dependencies, then `yarn run app` to start the webserver. You will need to connect it to a MongoDB instance (I have been using MongoDB Atlas and load the connect string in via the `config` package)

`web-app` is the frontend, run `yarn` to install dependencies then `yarn start` to start the react-app, then you should be able to view things at `localhost:3000`.

## Best Practices

* For v0, we never care about time, so everything should be truncated to MM/DD/YYYY when used as a key.
* Will call everything a DATE instead of a day, also pass around a Moment() object instead of a time string whenever possible to allow for verbosity of formatting