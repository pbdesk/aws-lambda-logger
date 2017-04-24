const logger = require('./../index');

const Log = logger.set('INFO', {appName: 'Demo'}, ['Tag1','Tag2']);

Log.info('Simple message', {info: 'testing'}, ['Tag3']);

/* Output:
 {
  "msg": "Simple message",
  "appName": "Demo",
  "info": "testing",
  "_tags": [
    "INFO",
    "Tag1",
    "Tag2",
    "Tag3"
    ]
 }

 */

Log.debug('Some other message', 'meta as string', ['Tag4']);


Log.info('Some other message', ['ddd'], ['Tag4']);
