# uevents <sup><sub>1.0.0</sub></sup>

## Microscopically small universal event emitter

[![npm](https://img.shields.io/npm/v/uevents.svg)](https://npmjs.com/package/uevents)
[![license](https://img.shields.io/npm/l/uevents.svg)](https://creativecommons.org/licenses/by/4.0/)
[![travis](https://img.shields.io/travis/Download/uevents.svg)](https://travis-ci.org/Download/uevents)
[![greenkeeper](https://img.shields.io/david/Download/uevents.svg)](https://greenkeeper.io/)
![mind BLOWN](https://img.shields.io/badge/mind-BLOWN-ff69b4.svg)

**Slim version of Node's event emitter for all modern engines.**

This is a microscopically small (just over 1kB) version of Node's
popular `events` module that has no dependencies and works in 
Node and in the browser.

## Install ##

```
npm install --save uevents
```

## Require ##

```js
const EventEmitter = require('uevents')
// or
const EventEmitter = require('uevents').EventEmitter
```

## Import

```js
import EventEmitter from 'uevents'
// or
import { EventEmitter } from 'uevents'
```
## Why
Node's EventEmitter module is pretty good, but I would like it more if it:

* Did not leak internal state
* Did not depend on inheritance so much
* Did not depend on `util` (which is pretty big)
* Did not implement [deprecated methods](https://nodejs.org/api/events.html#events_eventemitter_listenercount_emitter_eventname)
* Was microscopically small

Hence this module. It's mostly compatible with the original and passes all
tests (though I had to make some modifications,
see [the diffs](https://github.com/Download/uevents/commit/5183787756773699e92180018ece0d786bca1087)
for more info).
It ditches some legacy and some validation and the dependency on `util` so
we end up with a lean library that doesn't bloat our web bundle.

## Usage ##
`uevents` is based on Node's `events` module. The API is a close match.
The `EventEmitter` function from `events` is a constructor function with methods
on it's prototype, whereas the one here is a regular function that only adds
events functions to individual objects. Emitter objects created with Node's
`events` module will get a member `_events`, whereas with `uevents` they remain
clean of that.

For the most part, you can use Node's
[documentation on `events`](http://nodejs.org/api/events.html) to get specifics
on each function. Methods marked as *deprecated* are not implemented.

Documented below you will find some examples where the differences with Node's
`events` module are highlighted.

### Create a new emitter
```js
const emitter = EventEmitter() // preferred
// also supported for back. compat with `events`
const emitter = new EventEmitter()
```
### Enhance an existing object to be an emitter
```js
const myObject = {my: 'object'}
EventEmitter(myObject)
// or
const myObject = EventEmitter({my: 'object'})
```
### Enhance all instances of a class
```js
// const util = require('util') // not needed
// util.inherits(MyClass, EventEmitter) // not needed
function MyClass(){
	EventEmitter(this) // simpler huh?
	// this.on(...)
}
// or
class MyClass {
	constructor() {
		EventEmitter(this)
		// this.on(...)
	}
}
```
### Get listener count
```js
emitter.on('test', function(){})
emitter.listenerCount('test') // 1
emitter.on('test', function(){})
emitter.listenerCount('test') // 2
// or (not implemented in `uevents`):
// EventEmitter.listenerCount(emitter, 'test')
// or (not implemented in `events`)
emitter.on('wow', function(){})
emitter.listenerCount() // 3  (sum of all listeners)
// or (not implemented in `events`)
emitter.listenerCount(['test', 'wow']) // [2,1]  (array with counts)
```

### Get listener types
Strangely, this is not implemented in `events`, meaning you would need to
resort to peeking at private state if you didn't know which event type to
look for.
```js
emitter.listenerTypes() // ['test', 'wow']
```

### Get maxListeners
Again strangely not implemented in `events`:
```js
emitter.maxListeners // no braces, it's an accessor property
```

### Set logger
Just like `events`, `uevents` logs a warning when a suspected memory leak
is detected. But unlike `events`, in `uevents` you can easily set a custom
logger without having to overwrite the global `console`:

```js
// Set a custom logger for all emitters
EventEmitter.setLogger({warn:function(){console.warn('minimal logger implementation')}})
// Set a custom logger for a specific emitter
emitter.setLogger(myLogger)
// or at creation time
const emitter = EventEmitter({}, {logger:myLogger})
```

## Get logger
An accessor property, like `maxListeners`:
```js
emitter.logger // no braces
```

### Listen for events
```js
// same in `uevents` as in `events`
emitter.on('greeting', function(message, subject){
	console.log(message, subject)
})
// or
emitter.on('greeting', (message, subject) => console.log(message, subject))
```
### Emitting events
```js
// same in `uevents` as in `events`
emitter.emit('greeting', 'Hello, %s!', 'world')
// 'Hello, world!'
```

## Issues

Add an issue in this project's [issue tracker](https://github.com/download/uevents/issues)
to let me know of any problems you find, or questions you may have.


## Copyright

Copyright 2016 by [Stijn de Witt](http://StijnDeWitt.com). Some rights reserved.
Based on Node's [events] module, authored by and copyright by [Irakli Gozalishvili](http://jeditoolkit.com),
licensed under the [MIT license](https://github.com/download/uevents/blob/master/LICENSE-events.md)).

## License

[Creative Commons Attribution 4.0 (CC-BY-4.0)](https://creativecommons.org/licenses/by/4.0/)
