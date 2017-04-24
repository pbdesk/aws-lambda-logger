const logger = require('./../index');

let Log = logger.set('INFO', {appName: 'Demo'}, ['Tag1','Tag2']);

Log.info('Simple message', {info: 'testing'}, ['Tag3']);
Log.warn('Simple message', {warn: 'testing'}, ['Tag3']);
Log.error('Simple message', {error: 'testing'}, ['Tag3']);


let sLog = logger.set('DEBUG');

sLog.sinfo('something simple');
