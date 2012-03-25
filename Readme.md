# C Struct like object for JavaScript

## Struct.js provides more strict type checking.

* Throws error when **read undefined property**.
* Throws error when **write undefined property**.
* Throws error when **delete undefined property**.
* Throws error when **write with unmatched type**.
* Throws error when **write not writable property**.

## Example

    // Define struct
    Struct.define('ninja', {
      name: {type: 'string'}, 
      life: {type: 'number'},
      age:  {type: 'number', writable: false}
    });

    // Create struct object
    var sasuke = Struct.create('ninja', {
      name: 'Sasuke',
      life: 100,
      age: 20
    });

    sasuke.life = 50;       // works
    var name = sasuke.name; // works

    var bar = sasuke.undefProp; // Throws error (read undefined property)
    sasuke.life = '50';         // Throws error (type unmatch)
    sasuke.newProp = 'foo';     // Throws error (write undefined property)

    sasuke.age = 99; // Throws error (write not writable property)

    delete sasuke.life;  // works
    delete sasuke.life_; // Throws error (delete undefined property)

    //Check struct type name
    Struct.getType(sasuke); // => ninja

## Strict.js need Proxy API (ECMAScript6)

Now Struct.js works on Firefox4 or Chrome (need configure).
On the other browser, struct object doesn't throw errors.

## License

The MIT License

Copyright (c) 2012 hagino3000 (http://twitter.com/hagino3000)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
