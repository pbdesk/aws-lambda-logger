const AWSLambdaLogger = require('./lib/AWSLambdaLogger');

const setLogger = (level = 'INFO', tags = [], setGlobal = true) => {
  const logger = new AWSLambdaLogger(level, tags);
  if (setGlobal === true) {
    global.LOG = logger;
  }
  return logger;
};

module.exports = {
  config: setLogger,
};
