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

class AWSLambdaLogger extends EventEmitter {

  constructor(level = 'INFO', meta = {}, tags = []) {
    super();
    if (['DEBUG', 'INFO', 'WARN', 'ERROR', 'OFF'].indexOf(level) === -1) {
      throw new Error(`"${level}" is not a valid log level`);
    }
    this.config = {
      meta, // Global meta object to include with every log
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

  log(level, msg, pmeta = {}, ptags = []) {
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

    const tags = [level].concat(this.config.tags, ptags);
    const errorMeta = {};
    if (isError(msg)) {
      errorMeta.stack = msg.stack;
      msg = msg.message;
    }
    const meta = Object.assign({}, this.config.meta, pmeta, errorMeta);
    let data = Object.assign({ msg }, meta, { _tags: tags });
    data = JSON.stringify(data, null, 4);
    console[level.toLowerCase()](data);

    /**
     * Emits log event after logging to console with the log data
     * @event log
     * @attribute data
     */
    this.emit('log', data);
    return data;
  }

  debug(msg, pmeta = {}, ptags = []) {
    if (this.config.logLevel <= 1) {
      this.log('DEBUG', msg, pmeta, ptags);
    }
  }

  info(msg, pmeta = {}, ptags = []) {
    if (this.config.logLevel <= 2) {
      this.log('INFO', msg, pmeta, ptags);
    }
  }

  warn(msg, pmeta = {}, ptags = []) {
    if (this.config.logLevel <= 3) {
      this.log('WARN', msg, pmeta, ptags);
    }
  }

  error(msg, pmeta = {}, ptags = []) {
    if (this.config.logLevel <= 4) {
      this.log('ERROR', msg, pmeta, ptags);
    }
  }
}

module.exports = AWSLambdaLogger;
