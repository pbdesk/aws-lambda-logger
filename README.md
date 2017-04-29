# aws-lambda-logger
Logger for AWS Lambda with NodeJS 6.10.
The simple lambda logger that logs with pretty JSON and add tags (log level and custom) to improve log filtering in CloudWatch.
The module includes functionality to include custom metadata and tags for each log, allowing increased filtering capabilities within Cloudwatch.

### Install
Install via NPM:

```bash
$ npm i -S @pbdesk/aws-lambda-logger
```


### Usage
Here is a basic usage example, read the API documentation below to learn more.

```js
const logger = require('@pbdesk/aws-lambda-logger');
// Default settings
const Log = logger.config();
Log.debug('This is debug log');
Log.info('This is debug log')
Log.warn('This is warn log')
Log.error('This is error log')
Log.sdebug('This is simple debug log');
Log.sinfo('This is simple debug log');
Log.swarn('This is simple warn log');
Log.serror('This is simple error log');


// Custom Settings
const Log = logger.config('WARN', {appName: 'Demo'}, ['Tag1','Tag2']);
Log.warn('some message', {parameter: 'someValue'}, ['Tag3']);
//Output
{
    "msg": "some message",
    "data": {
        "appName": "Demo",
        "parameter": "someValue"
    },
    "tags": [
        "WARN",
        "Tag1",
        "Tag2",
        "Tag3"
    ]
}
---
const Log = logger.config('WARN', {appName: 'Demo'}, ['Tag1','Tag2']);
let error = new Error('some error');
Log.error(error, {parameter: 'some value'}, ['Tag3']);
// output
{
    "msg": "some error",
    "data": {
        "appName": "Demo",
        "parameter": "some value",
        "stack": "..."
    },
    "tags": [
        "ERROR",
        "Tag1",
        "Tag2",
        "Tag3"
    ]
}

```
---

## API Documentation

WIP...
