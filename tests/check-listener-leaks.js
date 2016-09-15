// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var assert = require('assert');
var events = require('../');

var e = new events.EventEmitter();

// default
for (var i = 0; i < 10; i++) {
  e.on('default', function() {});
}

// Don't rely on private state in tests
// assert.ok(!e._events['default'].hasOwnProperty('warned'));
assert.ok(log.lastWarning === undefined)
e.on('default', function() {});
assert.ok(log.lastWarning !== undefined)
log.reset()

// specific
e.setMaxListeners(5);
for (var i = 0; i < 5; i++) {
  e.on('specific', function() {});
}
// Don't rely on private state in tests
// assert.ok(!e._events['specific'].hasOwnProperty('warned'));
assert.ok(log.lastWarning === undefined)
e.on('specific', function() {});
// Don't rely on private state in tests
// assert.ok(e._events['specific'].warned);
assert.ok(log.lastWarning !== undefined)
log.reset()

// only one
e.setMaxListeners(1);
e.on('only one', function() {});
// Don't rely on private state in tests
// assert.ok(!e._events['only one'].hasOwnProperty('warned'));
assert.ok(log.lastWarning === undefined)
e.on('only one', function() {});
// Don't rely on private state in tests
// assert.ok(e._events['only one'].hasOwnProperty('warned'));
assert.ok(log.lastWarning !== undefined)
log.reset()

// unlimited
e.setMaxListeners(0);
// 50 is enough to prove the point. this test takes > 200ms with 1000 listeners
for (var i = 0; i < 50; i++) {
  e.on('unlimited', function() {});
}
// Don't rely on private state in tests
// assert.ok(!e._events['unlimited'].hasOwnProperty('warned'));
assert.ok(log.lastWarning === undefined)

// process-wide
events.EventEmitter.defaultMaxListeners = 42;
e = new events.EventEmitter();

for (var i = 0; i < 42; ++i) {
  e.on('fortytwo', function() {});
}
// Don't rely on private state in tests
// assert.ok(!e._events['fortytwo'].hasOwnProperty('warned'));
assert.ok(log.lastWarning === undefined)

e.on('fortytwo', function() {});
// Don't rely on private state in tests
// assert.ok(e._events['fortytwo'].hasOwnProperty('warned'));
assert.ok(log.lastWarning !== undefined)

events.EventEmitter.defaultMaxListeners = 44;

// Don't rely on private state in tests
// delete e._events['fortytwo'].warned;
e.off('fortytwo')
for (var i = 0; i < 43; ++i) {
  e.on('fortytwo', function() {});
}
log.reset()

e.on('fortytwo', function() {});
// Don't rely on private state in tests
// assert.ok(!e._events['fortytwo'].hasOwnProperty('warned'));
assert.ok(log.lastWarning === undefined)
e.on('fortytwo', function() {});
// Don't rely on private state in tests
// assert.ok(e._events['fortytwo'].hasOwnProperty('warned'));
assert.ok(log.lastWarning !== undefined)
log.reset()

// but _maxListeners still has precedence over defaultMaxListeners
events.EventEmitter.defaultMaxListeners = 42;
e = new events.EventEmitter();
e.setMaxListeners(1);
e.on('uno', function() {});
// Don't rely on private state in tests
// assert.ok(!e._events['uno'].hasOwnProperty('warned'));
assert.ok(log.lastWarning === undefined)
e.on('uno', function() {});
// Don't rely on private state in tests
//assert.ok(e._events['uno'].hasOwnProperty('warned'));
assert.ok(log.lastWarning !== undefined)
log.reset()

// chainable
assert.strictEqual(e, e.setMaxListeners(1));
