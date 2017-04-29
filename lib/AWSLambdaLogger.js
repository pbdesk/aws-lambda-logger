const EventEmitter = require('events');
const helper = require('./helper');

class AWSLambdaLogger extends EventEmitter {

  constructor(level = 'INFO', data = {}, tags = []) {
    super();
    if (['DEBUG', 'INFO', 'WARN', 'ERROR', 'OFF'].indexOf(level) === -1) {
      throw new Error(`"${level}" is not a valid log level`);
    }
    if (helper.getType(data) !== 'object') {
      throw new Error('data is not of type object');
    }
    if (helper.getType(tags) !== 'array') {
      throw new Error('tags is not of type array');
    }
    this.data = data;
    this.tags = tags;
    this.logLevel = this.getLogLevel(level);
  }

  getLogLevel(level) {
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

  setDefaultData(data = {}) {
    this.data = Object.assign(this.data || {}, data);
  }

  setDefaultTags(tags = []) {
    this.tags = [...(this.tags || []), ...tags];
  }

  writeLog(level, msg, pdata = {}, ptags = []) {
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
    let isSimpleLog = false;
    if (!pdata && !ptags) {
      isSimpleLog = true;
    }
    else {
      pdata = pdata || {};
      ptags = ptags || [];
    }
    let dataOb;
    if (isSimpleLog === true) {
      dataOb = {
        msg,
        tags: [level],
      };
    }
    else {
      const tags = [level].concat(this.tags, ptags);
      const errorMeta = {};
      if (helper.isError(msg)) {
        errorMeta.stack = msg.stack;
        msg = msg.message;
      }
      const data = Object.assign({}, this.data, pdata, errorMeta);
      dataOb = {
        msg,
        data,
        tags: helper.dedupe(tags),
      };
    }
    dataOb = JSON.stringify(dataOb, null, 4);
    console[level.toLowerCase()](dataOb);

    if (isSimpleLog === false) {
      this.emit('log', dataOb);
    }
    return dataOb;
  }

  /**
   * Writes simple log with message and tag as log level only
   * @param level
   * @param msg
   */
  slog(level, msg) {
    return this.writeLog(level, msg, null, null);
  }

  log(level, msg, pdata = {}, ptags = []) {
    if (helper.getType(pdata) !== 'object') {
      throw new Error('data is not of type object');
    }
    if (helper.getType(ptags) !== 'array') {
      throw new Error('tags is not of type array');
    }
    return this.writeLog(level, msg, pdata, ptags);
  }

  sdebug(msg) {
    this.slog('DEBUG', msg);
  }

  sinfo(msg) {
    this.slog('INFO', msg);
  }

  swarn(msg) {
    this.slog('WARN', msg);
  }

  serror(msg) {
    this.slog('ERROR', msg);
  }

  debug(msg, data = {}, ptags = []) {
    this.log('DEBUG', msg, data, ptags);
  }

  info(msg, data = {}, ptags = []) {
    this.log('INFO', msg, data, ptags);
  }

  warn(msg, data = {}, ptags = []) {
    this.log('WARN', msg, data, ptags);
  }

  error(msg, data = {}, ptags = []) {
    this.log('ERROR', msg, data, ptags);
  }

}

module.exports = AWSLambdaLogger;
