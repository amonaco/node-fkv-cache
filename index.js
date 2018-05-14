var cache = {}

function now() { return (new Date).getTime(); }

var debug = false;
var hitCount = 0;
var missCount = 0;

exports.data = cache

exports.put = function(family, key, value, time, timeoutCallback) {
    if (debug) console.log('caching: ' + family + ' / ' + key + ' = ' + value + ' (@' + time + ')');

    // initialize if undefined
    if (typeof(cache[family]) === "undefined") {
        if (debug) console.log('initializing family: ' + family);
            cache[family] = {};
    }

    // check if defined...
    var oldRecord = cache[family][key];
    if (oldRecord) {
        clearTimeout(oldRecord.timeout);
    }

    var expire = time + now();
    var record = {value: value, expire: expire};

    if (!isNaN(expire)) {
        var timeout = setTimeout(function() {
            exports.del(family, key);
            if (typeof timeoutCallback === 'function') {
                if (debug) console.log("adding default timeout callback.")
                timeoutCallback(family, key);
            }
        }, time);
        record.timeout = timeout;
    }
    cache[family][key] = record;
}

exports.del = function(family, key) {
    if (key) {
        delete cache[family][key];
    } else {
        delete cache[family];
    }
}

exports.clear = function() {
      cache = {};
}

exports.get = function(family, key) {

    if (typeof(cache[family]) !== "undefined" &&
        typeof(cache[family][key]) !== "undefined") {

        var data = cache[family][key];
    
        if (isNaN(data.expire) || data.expire >= now()) {
            if (debug) hitCount++;
            return data.value;
        } else {
            // free some space
            if (debug) missCount++;
            exports.del(family, key);
        }
    } else if (debug) {
        missCount++;
    }
    return null;
}

exports.expires = function(family, key) {
  var data = cache[key];
  return data.expire;
}

exports.exists = function(family, key) {

    if (typeof(cache[family]) !== "undefined" &&
        typeof(cache[family][key]) !== "undefined") {

        var data = cache[family][key];
        if (typeof data != "undefined") {
            return true;
        }
    }
    return false;
}

exports.size = function(family) { 
    var pool;

    if (typeof(cache[family]) != "undefined") {
        pool = cache[family];
    } else {
        pool = cache;
    }

    var size = 0, key;
    for (key in pool) {
        if (pool.hasOwnProperty(key)) 
            if (exports.get(family, key) !== null)
              size++;
    }
    return size;
}

exports.debug = function(bool) {
    debug = bool;
}

exports.hits = function() {
    return hitCount;
}

exports.misses = function() {
    return missCount;
}
