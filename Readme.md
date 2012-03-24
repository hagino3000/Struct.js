# C Struct like object for JavaScript

## Strict.js provides more strict type checking.

* Throws error when **read undefined property**.
* Throws error when **write undefined property**.
* Throws error when **delete undefined property**.
* Throws error when **write unmatched type**.

## Example

    Struct.reg('ninja', {
      name: {
        type: 'string'
      }, 
      life: {
        type: 'number'
      },
      age: {
        type: 'number',
        writable: false
      }
    });

    var sasuke = Struct.create('ninja', {
      name: 'Sasuke',
      life: 100,
      age: 20
    });

    sasuke.life = 50; // works
    var name = sasuke.name; // works

    var bar = sasuke.undefProp; // Throws error (read undefined property)
    sasuke.life = '50'; // Throws error (type unmatch)
    sasuke.newProp = 'foo'; // Throws error (write undefined property)

    delete sasuke.life; // works
    delete sasuke.life_; // Throws error (undefined property)

## Strict.js need Proxy API (ECMAScript6)

Now Strict.js works on Firefox4 or Chrome (need configure).
