# Pony.JS

Tiny Framework to create HTML entirely in JavaScript.

It's small but fast like a pony.

I wanted a framework with a lean abstraction layer of the DOM, directly based on vanilla JS.
Also, I didn't want to rely too much on "ECMAScript 6th Edition"-Features. They're cool, but still not compatible with every browser out there.

Pony.JS has mobile and embedded applications in mind.
Low memory footprint, modularity and high speed are a must!

Some features are based on concepts from Qt/QML.

## Modules

Pony.JS consists of little seperate ponies - small libraries with a specific functionality.
To keep things small and simple, you only include those you need.

### Core

The DOM-Abstraction Layer serving the Pony-Prototype.

### Shedrow

All the little ponies ready to do the race!

This is a collection of aggregations of pony-objects, to help you build more complex DOM-Components (tables, navigations and lists).

#### Table

TODO...

#### List

TODO...

### Signals

A Qt/QML-inspired way to handle events and inter-object-communication.

#### Usage

```javascript
// Asume we have a Pony-Element

// DOM-Event based Signal
var sig = ponyButton.signal('onclick');
sig.connect(function() {
	alert("You clicked the button");
});

// Custom signal
var customSig = ponyElement.signal();
customSig.connect(function(someData) {
	alert(someData.toString());
});

someAjax(someOptions, function(someResponse) {
	customSig.emit(someResponse.text);
});

```

### Include

A simple (C-like) include solution, loading script files dynamically.

Based on ScriptInclude (https://github.com/EvanHahn/ScriptInclude/blob/master/include.js).
Adapted for Pony.JS and dropped support for loading multiple files at once. (didn't need it, didn't want the overhead).

#### Usage

```javascript
Pony.include("/path/to/file.js"); // Loading sync
Pony.File.doSomething();

Pony.include("/path/to/another.file.js", function() { // loading async
	Pony.AnotherFile.doSomething()
});
```
