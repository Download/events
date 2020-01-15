// Copyright 2016 by Stijn de witt. Some rights reserved. License: CC-BY-4.0.
// Based on Node's `events` module. License: MIT
function EventEmitter(obj, options) {
	// for back. compat. with `events`
	if (!obj) {obj = (this instanceof EventEmitter ? this : {})}
	return (function(_events, _){

		// public API
		return Object.defineProperties(obj, {
			setMaxListeners: {value: setMaxListeners},
			maxListeners: {get:function(){return typeof _.maxListeners == 'undefined' ? EventEmitter.defaultMaxListeners : _.maxListeners}},
			setLogger: {value: setLogger},
			logger: {get:function(){return typeof _.logger == 'undefined' ? EventEmitter.logger : _.logger}},
			emit: {value: emit},
			on: {value: on},
			once: {value: once},
			off: {value: off},
			addListener: {value: on},
			prependListener: {value: prependListener},
			prependOnceListener: {value: prependOnceListener},
			removeListener: {value: off},
			removeAllListeners: {value: off},
			listeners: {value: listeners},
			listenerTypes: {value: listenerTypes},
			listenerCount: {value: listenerCount},
		})

		// ===== IMPLEMENTATION =====

		// Obviously not all Emitters should be limited to 10. This function allows
		// that to be increased. Set to zero for unlimited.
		function setMaxListeners(n) {
			_.maxListeners = n;
			return obj;
		}

		function setLogger(log) {
			_.logger = log;
			return obj;
		}

		function emit(type) {
			var args, er, listeners;
			// If there is no 'error' event listener then throw.
			if (type === 'error' && (!_events.error || !_events.error.length)) {
				if (arguments[1] instanceof Error) {er = arguments[1]}
				else {er = new Error('Unhandled error event: ' + arguments[1]); er.context=arguments[1]}
				throw er;
			}
			if (!_events[type]) return false;
			args = Array.prototype.slice.call(arguments, 1);
			_events[type].slice().forEach(function(fn){
				if (!fn._once || fn._once===1) {fn._once++; fn.apply(obj, args)}
				if (fn._once) {off(type, fn)}
			})
			return obj;
		}

		function on(type, fn) {
			if (_events.newListener) {obj.emit('newListener', type, fn)}
			_events[type] = _events[type] || []
			_events[type][fn._prepend ? 'unshift': 'push'](fn);
			// Check for listener leak
			if (!_events[type].warned) {
				var m = obj.maxListeners
				if (m && m > 0 && _events[type].length > m) {
					_events[type].warned = true;
					obj.logger.warn('Possible EventEmitter memory leak detected for \'%s\' event. %d listeners added. Use emitter.setMaxListeners() to increase limit.', type, _events[type].length)
					obj.logger.trace && obj.logger.trace()
				}
			}
			return obj;
		}

		function once(type, fn) {
			fn._once = 1
			return obj.on(type, fn)
		}

		function prependListener(type, fn) {
			fn._prepend = true;
			return obj.on(type, fn);
		}

		function prependOnceListener(type, fn) {
			fn._prepend = true;
			fn._once = 1;
			return obj.on(type, fn);
		}

		function off(type, fn) {
		  // bulk and not listening for removeListener -> no need to emit
		  if (!fn && !_events.removeListener) {
		    if (!type) {_events = {}}
		    else if (_events[type]) {delete _events[type]}
		    return obj
		  }

		  // emit removeListener for all listeners on all events
		  if (!type) {
				for (var key in _events) {if (key != 'removeListener') {off(key)}}
				off('removeListener');
				_events = {};
				return obj;
		  }

			if (! _events[type]) {return obj}

			if (! fn) {
				// LIFO order
				while (_events[type].length) {off(type, _events[type][_events[type].length - 1])}
				delete _events[type];
				return obj;
			}

			var pos = _events[type].indexOf(fn);
			if (pos < 0) {return obj}
			_events[type].splice(pos, 1);
			if (_events.removeListener) {emit('removeListener', type, fn)}
		  return obj;
		}

		function listeners(type) {
			return _events[type] ? _events[type].slice() : []
		}

		function listenerTypes() {
			return Object.keys(_events)
		}

		function listenerCount(type) {
			return (type && type.map && type.map(function(x) {return listenerCount(x)})) ||
					(!type && listenerTypes().reduce(function(prev, cur){return prev + _events[cur].length}, 0)) ||
					(_events[type] && _events[type].length) || 0
		}
	})({},{logger:options && options.logger, maxListeners: options && options.maxListeners})
}

EventEmitter.EventEmitter = EventEmitter
EventEmitter.defaultMaxListeners = 10
EventEmitter.logger = typeof console == 'object' && console || {warn:function(){}}
EventEmitter.setLogger = function setLogger(logger){EventEmitter.logger = logger}

module.exports = EventEmitter
