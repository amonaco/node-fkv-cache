var cache = require('./index');

cache.debug(false);

// single store
console.log("1 - single value");
cache.put('foo', 'bar', true);
console.log('true == ' + cache.get('foo', 'bar'));

// clear variables
console.log("2 - clear variable ");
cache.clear("foo");
console.log('null == ' + cache.get('foo', 'bar'));

// exists and timeout
console.log("3 - exists & timeout");
cache.put('quux', 'baz', true, 3000);

// before timeout
setTimeout(function() {
  console.log('true == ' + cache.exists('quux', 'baz'));
}, 2000);

// after timeout
setTimeout(function() {
  console.log('false == ' + cache.exists('quux', 'baz'));
}, 4000);
