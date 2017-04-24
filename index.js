const AWSLambdaLogger = require('./lib/AWSLambdaLogger');

const setLogger = (level = 'INFO', meta = {}, tags = [], setGlobal = true) => {
  const logger = new AWSLambdaLogger(level, meta, tags);
  if (setGlobal === true) {
    global.LOG = logger;
  }
  return logger;
};

module.exports = {
  set: setLogger,
};
