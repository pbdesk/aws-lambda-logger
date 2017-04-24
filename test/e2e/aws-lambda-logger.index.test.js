const logger = require('./../../index');

const Log = logger.set();

describe('t', () => {
  it('t', () => {
    expect(Log).to.not.be.null;
    Log.warn('x');
    LOG.error(new Error('xxx'));
  })
});

