'use strict';

const { test, suite, before, after, beforeEach, afterEach } = require('internal/test_runner/harness');
const { run } = require('internal/test_runner/runner');
const { getOptionValue } = require('internal/options');

module.exports = test;
Object.assign(module.exports, {
  after,
  afterEach,
  before,
  beforeEach,
  describe: suite,
  it: test,
  run,
  suite,
  test,
});

let lazyMock;

Object.defineProperty(module.exports, 'mock', {
  __proto__: null,
  configurable: true,
  enumerable: true,
  get() {
    if (lazyMock === undefined) {
      const { MockTracker } = require('internal/test_runner/mock/mock');

      lazyMock = new MockTracker();
    }

    return lazyMock;
  },
});

if (getOptionValue('--experimental-test-snapshots')) {
  let lazySnapshot;

  Object.defineProperty(module.exports, 'snapshot', {
    __proto__: null,
    configurable: true,
    enumerable: true,
    get() {
      if (lazySnapshot === undefined) {
        const {
          setDefaultSnapshotSerializers,
          setResolveSnapshotPath,
        } = require('internal/test_runner/snapshot');

        lazySnapshot = {
          __proto__: null,
          setDefaultSnapshotSerializers,
          setResolveSnapshotPath,
        };
      }

      return lazySnapshot;
    },
  });
}
