# Daily-habit-tracker

## Best Practices

* For v0, we never care about time, so everything should be truncated to MM/DD/YYYY when used as a key.
* Will call everything a DATE instead of a day, also pass around a Moment() object instead of a time string whenever possible to allow for verbosity of formatting