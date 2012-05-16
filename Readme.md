# Object with strict type checking for JavaScript.

## Struct.js provides more strict type checking.

* Throws error when **read undefined property**.
* Throws error when **write undefined property**.
* Throws error when **delete undefined property**.
* Throws error when **write with unmatched type**.
* Throws error when **write not writable property**.

## Example

    // Define struct
    Struct.define('Position', {
      x: {type: 'number', nullable: false, cond: 'v >= 0'}, 
      y: {type: 'number', nullable: false, cond: 'v >= 0'}
    });

    Struct.define('Ninja', {
      name: {type: 'string', writable: false}, 
      life: {type: 'number'},
      pos:  {type: 'struct:Position'},
      createdAt: {type: 'date'}
    });

    // Create struct object
    var sasuke = Struct.create('Ninja', {
      name: 'Sasuke',
      life: 100,
      pos: {x: 10, y: 20},
      createdAt: new Date()
    });

    sasuke.life = 50; // works
    sasuke.pos.x = 100; // works

    var name = sasuke.name;     // works
    var bar = sasuke.undefProp; // Throws error (read undefined property)

    sasuke.life = '50';         // Throws error (type unmatch)
    sasuke.pos.y = [];          // Throws error (type unmatch)
    sasuke.pos.y = -1;           // Throws error (condition unmatch)
    sasuke.pos = {x:0,y:0,z:0}; // Throws error (type unmatch)
    sasuke.newProp = 'foo';     // Throws error (write undefined property)
    sasuke.name = 'hanzo';      // Throws error (write readonly property)
    sasuke.pos.x = null;        // Throws error (write not-nullable field by null)

    delete sasuke.life;  // works
    delete sasuke.life_; // Throws error (delete undefined property)

    //Check struct type name
    Struct.getType(sasuke); // => Ninja

## Type Check

Supported types are string, number, boolean, function, array, arraylike(array like object), object, anyobject, regexp, date, domnode.

## Production mode

Struct.configure provides no-check-mode. It is good for performance.

    Struct.configure({
      "disable any check": true
    });

## Struct.js needs Proxy API (ECMAScript 6 Harmony)

Now Struct.js works on Firefox4 or Chrome (need configure) with es6-shim.js.
On the other browser, struct object doesn't throw errors.

@see https://github.com/paulmillr/es6-shim

## License

The MIT License

Copyright (c) 2012 hagino3000 (http://twitter.com/hagino3000)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
