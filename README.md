# node-cache

Family/key/value format minimal cache for Node.js

## Usage

```javascript
var cache = require('memory-cache');

// now just use the cache

cache.put('foo', 'bar', 'baz');
console.log(cache.get('foo', 'bar'))
console.del(cache.get('foo', 'bar'))
console.del(cache.get('foo')

// there's also some timeout support to expire a key on a given time

cache.put('family', 'key', 'value', 100) // 3rd arguments is ttl in milliseconds
````
