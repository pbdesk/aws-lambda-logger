const logger = require('./../index');

const Log = logger.config('WARN', ['Tag1','Tag2']);
let error = new Error('some error');
Log.error(error);
/*
const Log = logger.config('WARN', ['Tag1','Tag2']);
Log.warn('some message', {parameter: 'someValue'}, ['Tag3']);


let Log = logger.config('WARN', ['Tag1','Tag2']);
let error = new Error('some error');
Log.error(error, { parameter: 'some value' }, ['Tag3']);

Log.error(error);



Log = logger.config();
Log.debug('This is debug log');
Log.info('This is info log');
Log.warn('This is warn log');
Log.error('This is error log');

Log = logger.config('INFO', ['Tag1','Tag2']);

Log.info('Simple message', {info: 'testing'}, ['Tag2', 'Tag3']);
Log.warn('Simple message', {warn: 'testing'}, ['Tag3']);
Log.error('Simple message', {error: 'testing'}, ['Tag3']);
*/
