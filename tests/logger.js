var assert = require('assert');
var EventEmitter = require('../');

var defaultLogger = EventEmitter.logger
var warned = 0
var traced = 0
var e = EventEmitter()
e.setLogger({warn: function(){warned++}});
e.setMaxListeners(1);
assert(!warned)
e.on('test', function() {});
assert(!warned)
e.on('test', function() {})
assert(warned)
assert(!traced)
warned = 0
e.setLogger({warn: function(){warned++}, trace:function(){traced++}});
assert(!warned)
assert(!traced)
assert(e.listenerCount('test2') === 0)
e.on('test2', function() {})
assert(e.listenerCount('test2') === 1)
assert(!warned)
assert(!traced)
e.on('test2', function() {})
assert(e.listenerCount('test2') === 2)
assert(warned)
assert(traced)
