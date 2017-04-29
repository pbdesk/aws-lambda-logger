const logger = require('./../index');

let Log = logger.config('WARN', {appName: 'Demo'}, ['Tag1','Tag2']);
let error = new Error('some error');
Log.error(error, {parameter: 'some value'}, ['Tag3']);

Log = logger.config();
Log.debug('This is debug log');
Log.info('This is debug log');
Log.warn('This is warn log');
Log.error('This is error log');
Log.sdebug('This is simple debug log');
Log.sinfo('This is simple debug log');
Log.swarn('This is simple warn log');
Log.serror('This is simple error log');


Log = logger.config('INFO', {appName: 'Demo'}, ['Tag1','Tag2']);

Log.info('Simple message', {info: 'testing'}, ['Tag2', 'Tag3']);
Log.warn('Simple message', {warn: 'testing'}, ['Tag3']);
Log.error('Simple message', {error: 'testing'}, ['Tag3']);

let sLog = logger.config('DEBUG');

sLog.sinfo('something simple');

