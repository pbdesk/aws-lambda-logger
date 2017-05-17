const EventEmitter = require('events');
const helper = require('./helper');

class AWSLambdaLogger extends EventEmitter {

  constructor(level = 'INFO', tags = []) {
    super();
    if (['DEBUG', 'INFO', 'WARN', 'ERROR', 'OFF'].indexOf(level) === -1) {
      throw new Error(`"${level}" is not a valid log level`);
    }
    if (helper.getType(tags) !== 'array') {
      throw new Error('tags is not of type array');
    }
    this.tags = tags;
    this.logLevel = this.getLogLevel(level);
  }

  getLogLevel(level) {
    if (!level) {
      return this.logLevel;
    }
    let levelValue;
    switch (level) {
      case 'DEBUG':
        levelValue = 1;
        break;
      case 'INFO':
        levelValue = 2;
        break;
      case 'WARN':
        levelValue = 3;
        break;
      case 'ERROR':
        levelValue = 4;
        break;
      default:
        levelValue = 100;
    }
    return levelValue;
  };

  setLogLevel(level = 'INFO') {
    if (['DEBUG', 'INFO', 'WARN', 'ERROR', 'OFF'].indexOf(level) === -1) {
      throw new Error(`"${level}" is not a valid log level`);
    }
    this.logLevel = this.getLogLevel(level);
  }

  setDefaultTags(tags = []) {
    if (helper.getType(tags) !== 'array') {
      throw new Error('tags is not of type array');
    }
    this.tags = [...(this.tags || []), ...tags];
  }

  writeLog(level, msg, pdata = {}, ptags = []) {
    try {
      if (['DEBUG', 'INFO', 'WARN', 'ERROR'].indexOf(level) === -1) {
        throw new Error(`"${level}" is not a valid log level`);
      }
      if ((level === 'DEBUG' && this.logLevel > 1)
        || (level === 'INFO' && this.logLevel > 2)
        || (level === 'WARN' && this.logLevel > 3)
        || (level === 'ERROR' && this.logLevel > 4)
      ) {
        return null;
      }
      if (helper.getType(pdata) !== 'object') {
        throw new Error('data is not of type object');
      }
      if (helper.getType(ptags) !== 'array') {
        throw new Error('tags is not of type array');
      }
      let dataOb;
      const tags = [level].concat(this.tags, ptags);
      const errorMeta = {};
      if (helper.isError(msg)) {
        errorMeta.stack = msg.stack;
        msg = msg.message;
      }
      const data = Object.assign({}, pdata, errorMeta);
      dataOb = {
        msg,
        data,
        tags: helper.dedupe(tags),
      };
      dataOb = JSON.stringify(dataOb, null, 4);
      console[level.toLowerCase()](dataOb);

      this.emit('log', dataOb);
      return dataOb;
    }
    catch (e) {
      console.error(`ERROR Writing Log - ${ex.message}`, e);
    }
  }


  debug(msg, data = {}, ptags = []) {
    this.writeLog('DEBUG', msg, data, ptags);
  }

  info(msg, data = {}, ptags = []) {
    this.writeLog('INFO', msg, data, ptags);
  }

  warn(msg, data = {}, ptags = []) {
    this.writeLog('WARN', msg, data, ptags);
  }

  error(msg, data = {}, ptags = []) {
    this.writeLog('ERROR', msg, data, ptags);
  }

}

module.exports = AWSLambdaLogger;
