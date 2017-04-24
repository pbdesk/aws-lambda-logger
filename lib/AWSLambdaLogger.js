/**
 *
 */

const EventEmitter = require('events');

const getLogLevel = (level) => {
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

const isError = val =>
  !!val && typeof val === 'object' && (
    val instanceof Error || (
      val.hasOwnProperty('message') && val.hasOwnProperty('stack')
    )
  );

const getType = (ob) => {
  let t = 'unknown';
  const firstShot = typeof ob;
  if (ob === null) {
    t = 'null';
  }
  else if (ob === undefined) {
    t = 'undefined';
  }
  else if (firstShot !== 'object') {
    t = firstShot;
  }
  else if (ob.constructor === [].constructor) {
    t = 'array';
  }
  else if (ob.constructor === {}.constructor) {
    t = 'object';
  }
  return t;
};

class AWSLambdaLogger extends EventEmitter {

  constructor(level = 'INFO', data = {}, tags = []) {
    super();
    if (['DEBUG', 'INFO', 'WARN', 'ERROR', 'OFF'].indexOf(level) === -1) {
      throw new Error(`"${level}" is not a valid log level`);
    }
    if (getType(data) !== 'object') {
      throw new Error('data is not of type object');
    }
    if (getType(tags) !== 'array') {
      throw new Error('tags is not of type array');
    }
    this.config = {
      data, // Global meta object to include with every log
      tags, // Global tags array to include with every log
      logLevel: getLogLevel(level),
    };
  }

  setLogLevel(level) {
    if (['DEBUG', 'INFO', 'WARN', 'ERROR', 'OFF'].indexOf(level) === -1) {
      throw new Error(`"${level}" is not a valid log level`);
    }
    this.config.logLevel = getLogLevel(level);
  }

  // region slog
  slog(level, msg) {
    if (['DEBUG', 'INFO', 'WARN', 'ERROR'].indexOf(level) === -1) {
      throw new Error(`"${level}" is not a valid log level`);
    }
    const ll = this.config.logLevel;
    if ((level === 'DEBUG' && ll > 1)
      || (level === 'INFO' && ll > 2)
      || (level === 'WARN' && ll > 3)
      || (level === 'ERROR' && ll > 4)
    ) {
      return null;
    }
    let dataOb = {
      msg,
      tags: [level],
    };
    dataOb = JSON.stringify(dataOb, null, 4);
    console[level.toLowerCase()](dataOb);
    return dataOb;
  }

  sdebug(msg) {
    if (this.config.logLevel <= 1) {
      this.slog('DEBUG', msg);
    }
  }

  sinfo(msg) {
    if (this.config.logLevel <= 2) {
      this.slog('INFO', msg);
    }
  }

  swarn(msg) {
    if (this.config.logLevel <= 3) {
      this.slog('WARN', msg);
    }
  }

  serror(msg) {
    if (this.config.logLevel <= 4) {
      this.slog('ERROR', msg);
    }
  }

  // endregion

  // region log
  log(level, msg, pdata = {}, ptags = []) {
    if (['DEBUG', 'INFO', 'WARN', 'ERROR'].indexOf(level) === -1) {
      throw new Error(`"${level}" is not a valid log level`);
    }
    if (getType(pdata) !== 'object') {
      throw new Error('data is not of type object');
    }
    if (getType(ptags) !== 'array') {
      throw new Error('tags is not of type array');
    }
    const ll = this.config.logLevel;
    if ((level === 'DEBUG' && ll > 1)
      || (level === 'INFO' && ll > 2)
      || (level === 'WARN' && ll > 3)
      || (level === 'ERROR' && ll > 4)
    ) {
      return null;
    }

    const tags = [level].concat(this.config.tags, ptags);
    const errorMeta = {};
    if (isError(msg)) {
      errorMeta.stack = msg.stack;
      msg = msg.message;
    }
    const data = Object.assign({}, this.config.data, pdata, errorMeta);
    let dataOb = {
      msg,
      data,
      tags,
    };
    dataOb = JSON.stringify(dataOb, null, 4);
    console[level.toLowerCase()](dataOb);

    /**
     * Emits log event after logging to console with the log data
     * @event log
     * @attribute data
     */
    this.emit('log', dataOb);
    return dataOb;
  }

  debug(msg, data = {}, ptags = []) {
    if (this.config.logLevel <= 1) {
      this.log('DEBUG', msg, data, ptags);
    }
  }

  info(msg, data = {}, ptags = []) {
    if (this.config.logLevel <= 2) {
      this.log('INFO', msg, data, ptags);
    }
  }

  warn(msg, data = {}, ptags = []) {
    if (this.config.logLevel <= 3) {
      this.log('WARN', msg, data, ptags);
    }
  }

  error(msg, data = {}, ptags = []) {
    if (this.config.logLevel <= 4) {
      this.log('ERROR', msg, data, ptags);
    }
  }

  // endregion
}

module.exports = AWSLambdaLogger;
