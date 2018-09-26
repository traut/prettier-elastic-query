// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"h15N":[function(require,module,exports) {
var global = arguments[3];
var define;
//     Underscore.js 1.9.1
//     http://underscorejs.org
//     (c) 2009-2018 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this ||
            {};

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `_` as a global object.
  // (`nodeType` is checked to ensure that `module`
  // and `exports` are not HTML elements.)
  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.9.1';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-argument case is omitted because we’re not using it.
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  var builtinIteratee;

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    return _.property(value);
  };

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only argCount argument.
  _.iteratee = builtinIteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  var restArguments = function(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var shallowProperty = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  var has = function(obj, path) {
    return obj != null && hasOwnProperty.call(obj, path);
  }

  var deepGet = function(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = shallowProperty('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  var createReduce = function(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = restArguments(function(obj, path, args) {
    var contextPath, func;
    if (_.isFunction(path)) {
      func = path;
    } else if (_.isArray(path)) {
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return _.map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection.
  _.shuffle = function(obj) {
    return _.sample(obj, Infinity);
  };

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = _.random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (has(result, key)) result[key]++; else result[key] = 1;
  });

  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (_.isString(obj)) {
      // Keep surrogate pair characters together
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, Boolean);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    output = output || [];
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        // Flatten current level of array or arguments object.
        if (shallow) {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        } else {
          flatten(value, shallow, strict, output);
          idx = output.length;
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = restArguments(function(array, otherArrays) {
    return _.difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = restArguments(function(arrays) {
    return _.uniq(flatten(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = restArguments(function(array, rest) {
    rest = flatten(rest, true, true);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  });

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = restArguments(_.unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of _.pairs.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions.
  var createPredicateIndexFinder = function(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  };

  // Returns the first index on an array-like that passes a predicate test.
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions.
  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  _.chunk = function(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = restArguments(function(func, context, args) {
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArguments(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  _.partial = restArguments(function(func, boundArgs) {
    var placeholder = _.partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  _.partial.placeholder = _;

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = restArguments(function(obj, keys) {
    keys = flatten(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = keys[index];
      obj[key] = _.bind(obj[key], obj);
    }
  });

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;

    var later = function(context, args) {
      timeout = null;
      if (args) result = func.apply(context, args);
    };

    var debounced = restArguments(function(args) {
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(this, args);
      } else {
        timeout = _.delay(later, wait, this, args);
      }

      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  _.restArguments = restArguments;

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  var collectNonEnumProps = function(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  };

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object.
  // In contrast to _.map it returns an object.
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = _.keys(obj),
        length = keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of _.object.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`.
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test.
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Internal pick helper function to determine if `obj` has key `key`.
  var keyInObj = function(value, key, obj) {
    return key in obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = restArguments(function(obj, keys) {
    var result = {}, iteratee = keys[0];
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = _.allKeys(obj);
    } else {
      iteratee = keyInObj;
      keys = flatten(keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the blacklisted properties.
  _.omit = restArguments(function(obj, keys) {
    var iteratee = keys[0], context;
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = _.map(flatten(keys, false, false), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  });

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq, deepEq;
  eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  };

  // Internal recursive comparison function for `isEqual`.
  deepEq = function(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, path) {
    if (!_.isArray(path)) {
      return has(obj, path);
    }
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (obj == null || !hasOwnProperty.call(obj, key)) {
        return false;
      }
      obj = obj[key];
    }
    return !!length;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indexes.
  _.property = function(path) {
    if (!_.isArray(path)) {
      return shallowProperty(path);
    }
    return function(obj) {
      return deepGet(obj, path);
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    if (obj == null) {
      return function(){};
    }
    return function(path) {
      return !_.isArray(path) ? obj[path] : deepGet(obj, path);
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  _.result = function(obj, path, fallback) {
    if (!_.isArray(path)) path = [path];
    var length = path.length;
    if (!length) {
      return _.isFunction(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = _.isFunction(prop) ? prop.call(obj) : prop;
    }
    return obj;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var chainResult = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return chainResult(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return chainResult(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return String(this._wrapped);
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define == 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}());

},{}],"KCN3":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pipe2U = pipe2U;
exports.seq = seq;
exports.seqPartial = seqPartial;
exports.whereEqU = whereEqU;
exports.hasKeysOfU = hasKeysOfU;
exports.acyclicEqualsU = acyclicEqualsU;
exports.unzipObjIntoU = unzipObjIntoU;
exports.keys = keys;
exports.values = values;
exports.assocPartialU = assocPartialU;
exports.dissocPartialU = dissocPartialU;
exports.inherit = exports.acyclicEqualsObject = exports.identicalU = exports.compose2U = exports.isObject = exports.isArray = exports.isNumber = exports.isString = exports.isFunction = exports.constructorOf = exports.prototypeOf = exports.hasU = exports.isDefined = exports.object0 = exports.array0 = exports.freeze = exports.sndU = exports.applyU = exports.always = exports.toObject = exports.assign = exports.curry = exports.arityN = exports.curryN = exports.defineNameU = exports.id = void 0;

var id = function id(x) {
  return x;
}; //


exports.id = id;

function _defineNameU(fn, value) {
  return Object.defineProperty(fn, 'name', {
    value: value,
    configurable: true
  });
}

var defineNameU =
/*#__PURE__*/
function () {
  try {
    return _defineNameU(_defineNameU, 'defineNameU');
  } catch (_) {
    return function (fn, _) {
      return fn;
    };
  }
}();

exports.defineNameU = defineNameU;
var copyName = "production" === 'production' ? function (f) {
  return f;
} : function (to, from) {
  return defineNameU(to, from.name);
};
var withName = "production" === 'production' ? id : function (ary) {
  return function (fn) {
    return copyName(ary(fn), fn);
  };
};
var ary1of2 =
/*#__PURE__*/
withName(function (fn) {
  return function (x0, x1) {
    return arguments.length < 2 ? fn(x0) : fn(x0)(x1);
  };
});
var ary2of2 =
/*#__PURE__*/
withName(function (fn) {
  return function (x0, x1) {
    return arguments.length < 2 ? copyName(function (x1) {
      return fn(x0, x1);
    }, fn) : fn(x0, x1);
  };
});
var ary1of3 =
/*#__PURE__*/
withName(function (fn) {
  return function (x0, x1, x2) {
    switch (arguments.length) {
      case 0:
      case 1:
        return curryN(2, fn(x0));

      case 2:
        return curryN(2, fn(x0))(x1);

      default:
        return curryN(2, fn(x0))(x1, x2);
    }
  };
});
var ary2of3 =
/*#__PURE__*/
withName(function (fn) {
  return function (x0, x1, x2) {
    switch (arguments.length) {
      case 0:
      case 1:
        return ary1of2(copyName(function (x1) {
          return fn(x0, x1);
        }, fn));

      case 2:
        return fn(x0, x1);

      default:
        return fn(x0, x1)(x2);
    }
  };
});
var ary3of3 =
/*#__PURE__*/
withName(function (fn) {
  return function (x0, x1, x2) {
    switch (arguments.length) {
      case 0:
      case 1:
        return ary2of2(copyName(function (x1, x2) {
          return fn(x0, x1, x2);
        }, fn));

      case 2:
        return copyName(function (x2) {
          return fn(x0, x1, x2);
        }, fn);

      default:
        return fn(x0, x1, x2);
    }
  };
});
var ary1of4 =
/*#__PURE__*/
withName(function (fn) {
  return function (x0, x1, x2, x3) {
    switch (arguments.length) {
      case 0:
      case 1:
        return curryN(3, fn(x0));

      case 2:
        return curryN(3, fn(x0))(x1);

      case 3:
        return curryN(3, fn(x0))(x1, x2);

      default:
        return curryN(3, fn(x0))(x1, x2, x3);
    }
  };
});
var ary2of4 =
/*#__PURE__*/
withName(function (fn) {
  return function (x0, x1, x2, x3) {
    switch (arguments.length) {
      case 0:
      case 1:
        return ary1of3(copyName(function (x1) {
          return fn(x0, x1);
        }, fn));

      case 2:
        return curryN(2, fn(x0, x1));

      case 3:
        return curryN(2, fn(x0, x1))(x2);

      default:
        return curryN(2, fn(x0, x1))(x2, x3);
    }
  };
});
var ary3of4 =
/*#__PURE__*/
withName(function (fn) {
  return function (x0, x1, x2, x3) {
    switch (arguments.length) {
      case 0:
      case 1:
        return ary2of3(copyName(function (x1, x2) {
          return fn(x0, x1, x2);
        }, fn));

      case 2:
        return ary1of2(copyName(function (x2) {
          return fn(x0, x1, x2);
        }, fn));

      case 3:
        return fn(x0, x1, x2);

      default:
        return fn(x0, x1, x2)(x3);
    }
  };
});
var ary4of4 =
/*#__PURE__*/
withName(function (fn) {
  return function (x0, x1, x2, x3) {
    switch (arguments.length) {
      case 0:
      case 1:
        return ary3of3(copyName(function (x1, x2, x3) {
          return fn(x0, x1, x2, x3);
        }, fn));

      case 2:
        return ary2of2(copyName(function (x2, x3) {
          return fn(x0, x1, x2, x3);
        }, fn));

      case 3:
        return copyName(function (x3) {
          return fn(x0, x1, x2, x3);
        }, fn);

      default:
        return fn(x0, x1, x2, x3);
    }
  };
});

var ary0of0 = function ary0of0(fn) {
  return fn.length === 0 ? fn : copyName(function () {
    return fn();
  }, fn);
};

var ary1of1 = function ary1of1(fn) {
  return fn.length === 1 ? fn : copyName(function (x) {
    return fn(x);
  }, fn);
};

var C = [[ary0of0], [ary1of1, ary1of1], [void 0, ary1of2, ary2of2], [void 0, ary1of3, ary2of3, ary3of3], [void 0, ary1of4, ary2of4, ary3of4, ary4of4]];

var curryN = function curryN(n, f) {
  return C[n][Math.min(n, f.length)](f);
};

exports.curryN = curryN;

var arityN = function arityN(n, f) {
  return C[n][n](f);
};

exports.arityN = arityN;

var curry = function curry(f) {
  return arityN(f.length, f);
}; //


exports.curry = curry;
var assign = Object.assign;
exports.assign = assign;

var toObject = function toObject(x) {
  return assign({}, x);
}; //


exports.toObject = toObject;

var always = function always(x) {
  return function (_) {
    return x;
  };
};

exports.always = always;

var applyU = function applyU(x2y, x) {
  return x2y(x);
};

exports.applyU = applyU;

var sndU = function sndU(_, y) {
  return y;
}; //


exports.sndU = sndU;

var freeze = function freeze(x) {
  return x && Object.freeze(x);
};

exports.freeze = freeze;
var array0 =
/*#__PURE__*/
freeze([]);
exports.array0 = array0;
var object0 =
/*#__PURE__*/
freeze({}); //

exports.object0 = object0;

var isDefined = function isDefined(x) {
  return void 0 !== x;
}; //


exports.isDefined = isDefined;

var hasU = function hasU(p, x) {
  return Object.prototype.hasOwnProperty.call(x, p);
}; //


exports.hasU = hasU;

var prototypeOf = function prototypeOf(x) {
  return null == x ? x : Object.getPrototypeOf(x);
};

exports.prototypeOf = prototypeOf;

var constructorOf = function constructorOf(x) {
  return null == x ? x : (hasU('constructor', x) ? prototypeOf(x) : x).constructor;
}; //


exports.constructorOf = constructorOf;

var isFunction = function isFunction(x) {
  return typeof x === 'function';
};

exports.isFunction = isFunction;

var isString = function isString(x) {
  return typeof x === 'string';
};

exports.isString = isString;

var isNumber = function isNumber(x) {
  return typeof x === 'number';
};

exports.isNumber = isNumber;
var isArray = Array.isArray;
exports.isArray = isArray;
var object =
/*#__PURE__*/
prototypeOf({});

var isObject = function isObject(x) {
  return null != x && typeof x === 'object' && (hasU('constructor', x) ? prototypeOf(x) === object : x.constructor === Object);
}; //


exports.isObject = isObject;

function pipe2U(fn1, fn2) {
  var n = fn1.length;
  return n === 1 ? function (x) {
    return fn2(fn1(x));
  } : arityN(n, function () {
    return fn2(fn1.apply(undefined, arguments));
  });
}

var compose2U = function compose2U(fn1, fn2) {
  return pipe2U(fn2, fn1);
}; //


exports.compose2U = compose2U;

function seq(x) {
  for (var _len = arguments.length, fns = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    fns[_key - 1] = arguments[_key];
  }

  for (var i = 0, n = fns.length; i < n; ++i) {
    x = fns[i](x);
  }

  return x;
}

function seqPartial(x) {
  for (var _len2 = arguments.length, fns = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    fns[_key2 - 1] = arguments[_key2];
  }

  for (var i = 0, n = fns.length; isDefined(x) && i < n; ++i) {
    x = fns[i](x);
  }

  return x;
} //


var identicalU = function identicalU(a, b) {
  return a === b && (a !== 0 || 1 / a === 1 / b) || a !== a && b !== b;
}; //


exports.identicalU = identicalU;

function whereEqU(t, o) {
  for (var k in t) {
    var bk = o[k];
    if (!isDefined(bk) && !hasU(k, o) || !acyclicEqualsU(t[k], bk)) return false;
  }

  return true;
} //


function hasKeysOfU(t, o) {
  for (var k in t) {
    if (!hasU(k, o)) return false;
  }

  return true;
} //


var acyclicEqualsObject = function acyclicEqualsObject(a, b) {
  return whereEqU(a, b) && hasKeysOfU(b, a);
};

exports.acyclicEqualsObject = acyclicEqualsObject;

function acyclicEqualsArray(a, b) {
  var n = a.length;
  if (n !== b.length) return false;

  for (var i = 0; i < n; ++i) {
    if (!acyclicEqualsU(a[i], b[i])) return false;
  }

  return true;
}

function acyclicEqualsU(a, b) {
  if (identicalU(a, b)) return true;
  if (!a || !b) return false;
  var c = constructorOf(a);
  if (c !== constructorOf(b)) return false;

  switch (c) {
    case Array:
      return acyclicEqualsArray(a, b);

    case Object:
      return acyclicEqualsObject(a, b);

    default:
      return isFunction(a.equals) && a.equals(b);
  }
} //


function unzipObjIntoU(o, ks, vs) {
  for (var k in o) {
    if (ks) ks.push(k);
    if (vs) vs.push(o[k]);
  }
}

function keys(o) {
  if (o instanceof Object) {
    if (isObject(o)) {
      var ks = [];
      unzipObjIntoU(o, ks, 0);
      return ks;
    } else {
      return Object.keys(o);
    }
  }
}

function values(o) {
  if (o instanceof Object) {
    if (isObject(o)) {
      var vs = [];
      unzipObjIntoU(o, 0, vs);
      return vs;
    } else {
      var xs = Object.keys(o),
          n = xs.length;

      for (var i = 0; i < n; ++i) {
        xs[i] = o[xs[i]];
      }

      return xs;
    }
  }
} //


function assocPartialU(k, v, o) {
  var r = {};

  if (o instanceof Object) {
    if (!isObject(o)) o = toObject(o);

    for (var l in o) {
      if (l !== k) {
        r[l] = o[l];
      } else {
        r[k] = v;
        k = void 0;
      }
    }
  }

  if (isDefined(k)) r[k] = v;
  return r;
}

function dissocPartialU(k, o) {
  var r = void 0;

  if (o instanceof Object) {
    if (!isObject(o)) o = toObject(o);

    for (var l in o) {
      if (l !== k) {
        if (!r) r = {};
        r[l] = o[l];
      } else {
        k = void 0;
      }
    }
  }

  return r;
} //


var inherit = function inherit(Derived, Base, protos, statics) {
  return assign(Derived.prototype = Object.create(Base.prototype), protos).constructor = assign(Derived, statics);
};

exports.inherit = inherit;
},{}],"/gqh":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compose = compose;
exports.flat = flat;
exports.lazy = lazy;
exports.getLog = getLog;
exports.log = log;
exports.branches = branches;
exports.elems = elems;
exports.matches = matches;
exports.children = children;
exports.flatten = flatten;
exports.query = query;
exports.get = get;
exports.defaults = defaults;
exports.define = define;
exports.required = required;
exports.append = append;
exports.find = find;
exports.findWith = findWith;
exports.props = props;
exports.removable = removable;
exports.getInverse = getInverse;
exports.mapping = mapping;
exports.mappings = mappings;
exports.subset = subset;
exports.prop = exports.pickIn = exports.suffix = exports.slice = exports.prefix = exports.last = exports.index = exports.first = exports.filter = exports.cross = exports.rewrite = exports.reread = exports.normalize = exports.setter = exports.partsOf = exports.lens = exports.getter = exports.foldTraversalLens = exports.sum = exports.sumAs = exports.selectAs = exports.select = exports.product = exports.productAs = exports.or = exports.none = exports.minimum = exports.minimumBy = exports.mean = exports.meanAs = exports.maximum = exports.maximumBy = exports.join = exports.joinAs = exports.isEmpty = exports.isDefined = exports.getAs = exports.forEachWith = exports.forEach = exports.foldr = exports.foldl = exports.counts = exports.countsAs = exports.count = exports.countIf = exports.concat = exports.concatAs = exports.collectTotal = exports.collectTotalAs = exports.collect = exports.collectAs = exports.any = exports.and1 = exports.all1 = exports.and = exports.all = exports.leafs = exports.satisfying = exports.values = exports.keys = exports.entries = exports.elemsTotal = exports.branch = exports.branchOr = exports.removeOp = exports.setOp = exports.modifyOp = exports.assignOp = exports.seq = exports.transformAsync = exports.transform = exports.skipIx = exports.joinIx = exports.tieIx = exports.setIx = exports.mapIx = exports.zero = exports.optional = exports.when = exports.unless = exports.choice = exports.chain = exports.orElse = exports.ifElse = exports.condOf = exports.cond = exports.choose = exports.choices = exports.traverse = exports.set = exports.remove = exports.modifyAsync = exports.modify = exports.disperse = exports.assign = exports.toFunction = exports.Select = exports.IdentityAsync = exports.Identity = exports.seemsArrayLike = void 0;
exports.pointer = exports.fromFantasyMonad = exports.fromFantasyApplicative = exports.fromFantasy = exports.FantasyFunctor = exports.subtract = exports.negate = exports.multiply = exports.divide = exports.add = exports.querystring = exports.uncouple = exports.split = exports.replaces = exports.dropSuffix = exports.dropPrefix = exports.uriComponent = exports.uri = exports.json = exports.multikeyed = exports.keyed = exports.disjoint = exports.singleton = exports.reverse = exports.indexed = exports.is = exports.identity = exports.complement = exports.orAlternatively = exports.iterate = exports.inverse = exports.conjugate = exports.array = exports.applyAt = exports.alternatives = exports._ = exports.iso = exports.replace = exports.pick = exports.valueOr = exports.propsOf = void 0;

var _infestines = require("infestines");

var addU = function addU(x, y) {
  return x + y;
};

var multiplyU = function multiplyU(x, y) {
  return x * y;
};

var add =
/*#__PURE__*/
(0, _infestines.curry)(addU);
var multiply =
/*#__PURE__*/
(0, _infestines.curry)(multiplyU);
var divideBy =
/*#__PURE__*/
(0, _infestines.curry)(function (d, n) {
  return n / d;
});

var negate = function negate(x) {
  return -x;
};

var ltU = function ltU(x, y) {
  return x < y;
};

var gtU = function gtU(x, y) {
  return x > y;
};

var isInstanceOf =
/*#__PURE__*/
(0, _infestines.curry)(function (Class, x) {
  return x instanceof Class;
});
var create = Object.create;

var protoless = function protoless(o) {
  return (0, _infestines.assign)(create(null), o);
};

var protoless0 =
/*#__PURE__*/
(0, _infestines.freeze)(
/*#__PURE__*/
protoless(_infestines.object0));
var replace =
/*#__PURE__*/
(0, _infestines.curry)(function (p, r, s) {
  return s.replace(p, r);
});

function isPrimitiveData(x) {
  switch (typeof x) {
    case 'boolean':
    case 'number':
    case 'string':
      return true;

    default:
      return false;
  }
}

var iterator = Symbol.iterator;

var length = function length(x) {
  return x.length;
};

var dep = function dep(xs2xsyC) {
  return function (xsy) {
    return (0, _infestines.arityN)(xsy.length, (0, _infestines.defineNameU)(function () {
      return xs2xsyC.apply(undefined, arguments)(xsy).apply(undefined, arguments);
    }, xsy.name));
  };
};

var fn = function fn(xsC, yC) {
  return function (xsy) {
    return (0, _infestines.arityN)(xsy.length, (0, _infestines.defineNameU)(function () {
      for (var _len = arguments.length, xs = Array(_len), _key = 0; _key < _len; _key++) {
        xs[_key] = arguments[_key];
      }

      return yC(xsy.apply(null, xsC(xs)));
    }, xsy.name));
  };
};

var res = function res(yC) {
  return fn(_infestines.id, yC);
};

var args = function args(xsC) {
  return fn(xsC, _infestines.id);
};

var nth = function nth(i, xC) {
  return function (xs) {
    var ys = xs.slice(0);
    ys[i] = xC(ys[i]);
    return ys;
  };
};

var par = function par(i, xC) {
  return args(nth(i, xC));
};

var and = function and() {
  for (var _len2 = arguments.length, xCs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    xCs[_key2] = arguments[_key2];
  }

  return function (x) {
    for (var i = 0, n = xCs.length; i < n; ++i) {
      x = xCs[i](x);
    }

    return x;
  };
};

var or = function or() {
  for (var _len3 = arguments.length, xCs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    xCs[_key3] = arguments[_key3];
  }

  return function (x) {
    var es = null;

    for (var i = 0, n = xCs.length; i < n; ++i) {
      try {
        return xCs[i](x);
      } catch (e) {
        es = e;
      }
    }

    throw es;
  };
};

var ef = function ef(xE) {
  return (0, _infestines.defineNameU)(function (x) {
    xE(x);
    return x;
  }, xE.name);
};

var tup = function tup() {
  for (var _len4 = arguments.length, xCs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    xCs[_key4] = arguments[_key4];
  }

  return function (xs) {
    if (xs.length !== xCs.length) throw Error('Expected array of ' + xCs.length + ' elements, but got ' + xs.length);
    return and.apply(null, xCs.map(function (xC, i) {
      return nth(i, xC);
    }))(xs);
  };
};

var arr = function arr(xC) {
  return function (xs) {
    return xs.map(xC);
  };
}; //


var id$1 = function id$$1(x) {
  return x;
};

var setName = "production" === 'production' ? function (x) {
  return x;
} : function (to, name) {
  return (0, _infestines.defineNameU)(to, name);
};
var copyName = "production" === 'production' ? function (x) {
  return x;
} : function (to, from) {
  return (0, _infestines.defineNameU)(to, from.name);
};

var toRegExpU = function toRegExpU(str, flags) {
  return (0, _infestines.isString)(str) ? new RegExp(replace(/[|\\{}()[\]^$+*?.]/g, '\\$&', str), flags) : str;
}; //


var tryCatch = function tryCatch(fn$$1) {
  return copyName(function (x) {
    try {
      return fn$$1(x);
    } catch (e) {
      return e;
    }
  }, fn$$1);
}; //


var returnAsync = function returnAsync(x) {
  return Promise.resolve(x);
};

var chainAsync = function chainAsync(xyP, xP) {
  return null != xP && (0, _infestines.isFunction)(xP.then) ? xP.then(xyP) : xyP(xP);
}; //


var toStringPartial = function toStringPartial(x) {
  return void 0 !== x ? String(x) : '';
};

var sliceIndex = function sliceIndex(m, l, d, i) {
  return void 0 !== i ? Math.min(Math.max(m, i < 0 ? l + i : i), l) : d;
};

var cpair = function cpair(xs) {
  return function (x) {
    return [x, xs];
  };
};

var unto = function unto(c) {
  return function (x) {
    return void 0 !== x ? x : c;
  };
};

var unto0 =
/*#__PURE__*/
unto(0);
var toTrue =
/*#__PURE__*/
(0, _infestines.always)(true);

var notPartial = function complement(x) {
  return void 0 !== x ? !x : x;
};

var expect = function expect(p, f) {
  return copyName(function (x) {
    return p(x) ? f(x) : void 0;
  }, f);
};

var freezeInDev = "production" === 'production' ? id$1 : _infestines.freeze;
var freezeResultInDev = "production" === 'production' ? id$1 :
/*#__PURE__*/
res(_infestines.freeze);
var deepFreezeInDev = "production" === 'production' ? id$1 : function deepFreezeInDev(x) {
  if ((0, _infestines.isArray)(x)) {
    x.forEach(deepFreezeInDev);
    (0, _infestines.freeze)(x);
  } else if ((0, _infestines.isObject)(x)) {
    for (var k in x) {
      deepFreezeInDev(x[k]);
    }

    (0, _infestines.freeze)(x);
  }

  return x;
};

function freezeObjectOfObjects(xs) {
  if (xs) for (var k in xs) {
    (0, _infestines.freeze)(xs[k]);
  }
  return (0, _infestines.freeze)(xs);
}

var isArrayOrPrimitive = function isArrayOrPrimitive(x) {
  return !(x instanceof Object) || (0, _infestines.isArray)(x);
};

var rev =
/*#__PURE__*/
("production" === 'production' ? id$1 : res(_infestines.freeze))(function reverse(xs) {
  if (seemsArrayLike(xs)) {
    var n = xs.length;
    var ys = Array(n);
    var i = 0;

    while (n) {
      ys[i++] = xs[--n];
    }

    return ys;
  }
}); //

var mapPartialIndexU =
/*#__PURE__*/
("production" === 'production' ? id$1 : function (fn$$1) {
  return function (xi2y, xs, skip) {
    var ys = fn$$1(xi2y, xs, skip);
    if (xs !== ys) (0, _infestines.freeze)(ys);
    return ys;
  };
})(function (xi2y, xs, skip) {
  var n = xs.length;
  var ys = Array(n);
  var j = 0;
  var same = true;

  for (var i = 0; i < n; ++i) {
    var x = xs[i];
    var y = xi2y(x, i);

    if (skip !== y) {
      ys[j++] = y;
      if (same) same = x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
    }
  }

  if (j !== n) {
    ys.length = j;
    return ys;
  } else if (same) {
    return xs;
  } else {
    return ys;
  }
});

var mapIfArrayLike = function mapIfArrayLike(xi2y, xs) {
  return seemsArrayLike(xs) ? mapPartialIndexU(xi2y, xs, void 0) : void 0;
};

var copyToFrom =
/*#__PURE__*/
("production" === 'production' ? id$1 : function (fn$$1) {
  return function (ys, k, xs, i, j) {
    return ys.length === k + j - i ? (0, _infestines.freeze)(fn$$1(ys, k, xs, i, j)) : fn$$1(ys, k, xs, i, j);
  };
})(function (ys, k, xs, i, j) {
  while (i < j) {
    ys[k++] = xs[i++];
  }

  return ys;
}); //

function selectInArrayLike(xi2v, xs) {
  for (var i = 0, n = xs.length; i < n; ++i) {
    var v = xi2v(xs[i], i);
    if (void 0 !== v) return v;
  }
} //


function Functor(map) {
  if (!this) return freezeInDev(new Functor(map));
  this.map = map;
}

var Applicative =
/*#__PURE__*/
(0, _infestines.inherit)(function Applicative(map, of, ap) {
  if (!this) return freezeInDev(new Applicative(map, of, ap));
  Functor.call(this, map);
  this.of = of;
  this.ap = ap;
}, Functor);
var Monad =
/*#__PURE__*/
(0, _infestines.inherit)(function Monad(map, of, ap, chain) {
  if (!this) return freezeInDev(new Monad(map, of, ap, chain));
  Applicative.call(this, map, of, ap);
  this.chain = chain;
}, Applicative); //

var fantasyLand = 'fantasy-land/';
var fantasyLandOf = fantasyLand + 'of';
var fantasyLandMap = fantasyLand + 'map';
var fantasyLandAp = fantasyLand + 'ap';
var fantasyLandChain = fantasyLand + 'chain';

var fantasyBop = function fantasyBop(m) {
  return setName(function (f, x) {
    return x[m](f);
  }, m);
};

var fantasyMap =
/*#__PURE__*/
fantasyBop(fantasyLandMap);
var fantasyAp =
/*#__PURE__*/
fantasyBop(fantasyLandAp);
var fantasyChain =
/*#__PURE__*/
fantasyBop(fantasyLandChain);
var FantasyFunctor =
/*#__PURE__*/
Functor(fantasyMap);
exports.FantasyFunctor = FantasyFunctor;

var fromFantasyApplicative = function fromFantasyApplicative(Type) {
  return Applicative(fantasyMap, Type[fantasyLandOf], fantasyAp);
};

exports.fromFantasyApplicative = fromFantasyApplicative;

var fromFantasyMonad = function fromFantasyMonad(Type) {
  return Monad(fantasyMap, Type[fantasyLandOf], fantasyAp, fantasyChain);
};

exports.fromFantasyMonad = fromFantasyMonad;

var fromFantasy = function fromFantasy(Type) {
  return Type.prototype[fantasyLandChain] ? fromFantasyMonad(Type) : Type[fantasyLandOf] ? fromFantasyApplicative(Type) : FantasyFunctor;
}; //


exports.fromFantasy = fromFantasy;

var ConstantWith = function ConstantWith(ap, empty) {
  return Applicative(_infestines.sndU, (0, _infestines.always)(empty), ap);
};

var ConstantOf = function ConstantOf(_ref) {
  var concat = _ref.concat,
      empty = _ref.empty;
  return ConstantWith(concat, empty());
};

var Sum =
/*#__PURE__*/
ConstantWith(addU, 0);

var mumBy = function mumBy(ord) {
  return (0, _infestines.curry)(function mumBy(xi2y, t, s) {
    var minX = void 0;
    var minY = void 0;
    getAsU(function (x, i) {
      var y = xi2y(x, i);

      if (void 0 !== y && (void 0 === minY || ord(y, minY))) {
        minX = x;
        minY = y;
      }
    }, t, s);
    return minX;
  });
}; //


var traverseU = function traverse(C, xi2yC, t, s) {
  return toFunction(t)(s, void 0, C, xi2yC);
}; //


var expectedOptic = 'Expecting an optic';
var opticIsEither = 'An optic can be either\n- a string,\n- a non-negative integer,\n- a quaternary optic function,\n- an ordinary unary or binary function, or\n- an array of optics.\nSee documentation of `toFunction` and `compose` for details.';
var header = 'partial.lenses: ';

function warn(f, m) {
  if (!f.warned) {
    f.warned = 1;
    console.warn(header + m);
  }
}

function errorGiven(m, o, e) {
  m = header + m + '.';
  e = e ? '\n' + e : '';
  console.error(m, 'Given:', o, e);
  throw Error(m + e);
}

var reqIndex = function index(x) {
  if (!Number.isInteger(x) || x < 0) errorGiven('`index` expects a non-negative integer', x);
};

function reqFunction(o) {
  if (!((0, _infestines.isFunction)(o) && (o.length === 4 || o.length <= 2))) errorGiven(expectedOptic, o, opticIsEither);
}

function reqFn(x) {
  if (!(0, _infestines.isFunction)(x)) errorGiven('Expected a function', x);
}

function reqArray(o) {
  if (!(0, _infestines.isArray)(o)) errorGiven(expectedOptic, o, opticIsEither);
}

function reqOptic(o) {
  switch (typeof o) {
    case 'string':
      break;

    case 'number':
      reqIndex(o);
      break;

    case 'object':
      reqArray(o);

      for (var i = 0, n = o.length; i < n; ++i) {
        reqOptic(o[i]);
      }

      break;

    default:
      reqFunction(o);
      break;
  }
} //


var reqString = function reqString(msg) {
  return function (x) {
    if (!(0, _infestines.isString)(x)) errorGiven(msg, x);
  };
};

var reqMaybeArray = function reqMaybeArray(msg) {
  return function (zs) {
    if (!(void 0 === zs || seemsArrayLike(zs))) errorGiven(msg, zs);
  };
}; //


var reqMonad = function reqMonad(name) {
  return function (C) {
    if (!C.chain) errorGiven('`' + name + '` requires a monad', C, 'Note that you can only `modify`, `remove`, `set`, and `traverse` a transform.');
  };
}; //


var mkTraverse = function mkTraverse(after, toC) {
  return (0, _infestines.curryN)(4, copyName(function (xi2yC, m) {
    return m = toC(m), function (t, s) {
      return after(traverseU(m, xi2yC, t, s));
    };
  }, toC));
}; //


var consExcept = function consExcept(skip) {
  return function (t) {
    return function (h) {
      return skip !== h ? [h, t] : t;
    };
  };
};

var pushTo = function pushTo(n, xs) {
  while (consExcept !== n) {
    xs.push(n[0]);
    n = n[1];
  }

  return xs;
};

var consTo =
/*#__PURE__*/
("production" === 'production' ? id$1 : res(_infestines.freeze))(function (n) {
  return pushTo(n, []).reverse();
});

function traversePartialIndex(A, xi2yA, xs, skip) {
  var map = A.map,
      ap = A.ap;
  var xsA = A.of(consExcept);
  var n = xs.length;

  if (map === _infestines.sndU) {
    for (var i = 0; i < n; ++i) {
      xsA = ap(xsA, xi2yA(xs[i], i));
    }

    return xsA;
  } else {
    var cons = consExcept(skip);

    for (var _i2 = 0; _i2 < n; ++_i2) {
      xsA = ap(map(cons, xsA), xi2yA(xs[_i2], _i2));
    }

    return map(consTo, xsA);
  }
} //


var SelectLog =
/*#__PURE__*/
Applicative(function (f, _ref2) {
  var p = _ref2.p,
      x = _ref2.x,
      c = _ref2.c;
  x = f(x);
  if (!(0, _infestines.isFunction)(x)) p = [x, p];
  return {
    p: p,
    x: x,
    c: c
  };
}, function (x) {
  return {
    p: [],
    x: x,
    c: undefined
  };
}, function (l, r) {
  var v = undefined !== l.c ? l : r;
  return {
    p: v.p,
    x: l.x(r.x),
    c: v.c
  };
}); //

var lensFrom = function lensFrom(get, set) {
  return function (i) {
    return function (x, _i, F, xi2yF) {
      return F.map(function (v) {
        return set(i, v, x);
      }, xi2yF(get(i, x), i));
    };
  };
}; //


var getProp = function getProp(k, o) {
  return o instanceof Object ? o[k] : void 0;
};

var setProp =
/*#__PURE__*/
("production" === 'production' ? id$1 : res(_infestines.freeze))(function (k, v, o) {
  return void 0 !== v ? (0, _infestines.assocPartialU)(k, v, o) : (0, _infestines.dissocPartialU)(k, o) || _infestines.object0;
});
var funProp =
/*#__PURE__*/
lensFrom(getProp, setProp); //

var getIndex = function getIndex(i, xs) {
  return seemsArrayLike(xs) ? xs[i] : void 0;
};

var setIndex =
/*#__PURE__*/
("production" === 'production' ? id$1 : fn(nth(0, ef(reqIndex)), _infestines.freeze))(function (i, x, xs) {
  if (!seemsArrayLike(xs)) xs = '';
  var n = xs.length;

  if (void 0 !== x) {
    var m = Math.max(i + 1, n);
    var ys = Array(m);

    for (var j = 0; j < m; ++j) {
      ys[j] = xs[j];
    }

    ys[i] = x;
    return ys;
  } else {
    if (n <= i) return copyToFrom(Array(n), 0, xs, 0, n);

    var _ys = Array(n - 1);

    for (var _j = 0; _j < i; ++_j) {
      _ys[_j] = xs[_j];
    }

    for (var _j2 = i + 1; _j2 < n; ++_j2) {
      _ys[_j2 - 1] = xs[_j2];
    }

    return _ys;
  }
});
var funIndex =
/*#__PURE__*/
lensFrom(getIndex, setIndex); //

var composedMiddle = function composedMiddle(o, r) {
  return function (F, xi2yF) {
    return xi2yF = r(F, xi2yF), function (x, i) {
      return o(x, i, F, xi2yF);
    };
  };
};

function composed(oi0, os) {
  var n = os.length - oi0;

  if (n < 2) {
    return n ? toFunction(os[oi0]) : identity;
  } else {
    var _last = toFunction(os[oi0 + --n]);

    var r = function r(F, xi2yF) {
      return function (x, i) {
        return _last(x, i, F, xi2yF);
      };
    };

    while (--n) {
      r = composedMiddle(toFunction(os[oi0 + n]), r);
    }

    var _first = toFunction(os[oi0]);

    return function (x, i, F, xi2yF) {
      return _first(x, i, F, r(F, xi2yF));
    };
  }
}

var disperseU = function disperse(traversal, values, data) {
  if (!seemsArrayLike(values)) values = '';
  var i = 0;
  return modifyU(traversal, function () {
    return values[i++];
  }, data);
};

var setU =
/*#__PURE__*/
("production" === 'production' ? id$1 : par(0, ef(reqOptic)))(function set(o, x, s) {
  switch (typeof o) {
    case 'string':
      return setProp(o, x, s);

    case 'number':
      return setIndex(o, x, s);

    case 'object':
      return modifyComposed(o, 0, s, x);

    default:
      return o.length === 4 ? o(s, void 0, Identity, (0, _infestines.always)(x)) : s;
  }
});
var modifyU =
/*#__PURE__*/
("production" === 'production' ? id$1 : par(0, ef(reqOptic)))(function modify(o, xi2x, s) {
  switch (typeof o) {
    case 'string':
      return setProp(o, xi2x(getProp(o, s), o), s);

    case 'number':
      return setIndex(o, xi2x(getIndex(o, s), o), s);

    case 'object':
      return modifyComposed(o, xi2x, s);

    default:
      return o.length === 4 ? o(s, void 0, Identity, xi2x) : (xi2x(o(s, void 0), void 0), s);
  }
});

var modifyAsyncU = function modifyAsyncU(o, f, s) {
  return returnAsync(toFunction(o)(s, void 0, IdentityAsync, f));
};

var getAsU =
/*#__PURE__*/
("production" === 'production' ? id$1 : par(1, ef(reqOptic)))(function getAs(xi2y, l, s) {
  switch (typeof l) {
    case 'string':
      return xi2y(getProp(l, s), l);

    case 'number':
      return xi2y(getIndex(l, s), l);

    case 'object':
      {
        var n = l.length;

        for (var i = 0, o; i < n; ++i) {
          switch (typeof (o = l[i])) {
            case 'string':
              s = getProp(o, s);
              break;

            case 'number':
              s = getIndex(o, s);
              break;

            default:
              return composed(i, l)(s, l[i - 1], Select, xi2y);
          }
        }

        return xi2y(s, l[n - 1]);
      }

    default:
      return xi2y !== id$1 && l.length !== 4 ? xi2y(l(s, void 0), void 0) : l(s, void 0, Select, xi2y);
  }
});

var getU = function getU(l, s) {
  return getAsU(id$1, l, s);
};

function modifyComposed(os, xi2y, x, y) {
  var n = os.length;
  var xs = Array(n);

  for (var i = 0, o; i < n; ++i) {
    xs[i] = x;

    switch (typeof (o = os[i])) {
      case 'string':
        x = getProp(o, x);
        break;

      case 'number':
        x = getIndex(o, x);
        break;

      default:
        x = composed(i, os)(x, os[i - 1], Identity, xi2y || (0, _infestines.always)(y));
        n = i;
        break;
    }
  }

  if (n === os.length) x = xi2y ? xi2y(x, os[n - 1]) : y;

  for (var _o; 0 <= --n;) {
    x = (0, _infestines.isString)(_o = os[n]) ? setProp(_o, x, xs[n]) : setIndex(_o, x, xs[n]);
  }

  return x;
} //


var lensU = function lens(get, set) {
  return copyName(function (x, i, F, xi2yF) {
    return F.map(function (y) {
      return set(y, x, i);
    }, xi2yF(get(x, i), i));
  }, get);
};

var isoU = function iso(bwd, fwd) {
  return copyName(function (x, i, F, xi2yF) {
    return F.map(fwd, xi2yF(bwd(x), i));
  }, bwd);
};

var stringIsoU = function stringIsoU(bwd, fwd) {
  return isoU(expect(_infestines.isString, bwd), expect(_infestines.isString, fwd));
};

var numberIsoU = function numberIsoU(bwd, fwd) {
  return isoU(expect(_infestines.isNumber, bwd), expect(_infestines.isNumber, fwd));
}; //


var getPick =
/*#__PURE__*/
("production" === 'production' ? id$1 : res(_infestines.freeze))(function (template, x) {
  var r = void 0;

  for (var k in template) {
    var t = template[k];
    var v = (0, _infestines.isObject)(t) ? getPick(t, x) : getAsU(id$1, t, x);

    if (void 0 !== v) {
      if (!r) r = {};
      r[k] = v;
    }
  }

  return r;
});

var reqTemplate = function reqTemplate(name) {
  return function (template) {
    if (!(0, _infestines.isObject)(template)) errorGiven('`' + name + '` expects a plain Object template', template);
  };
};

var reqObject = function reqObject(msg) {
  return function (value) {
    if (!(void 0 === value || value instanceof Object)) errorGiven(msg, value);
  };
};

var setPick =
/*#__PURE__*/
("production" === 'production' ? id$1 : par(1, ef(reqObject('`pick` must be set with undefined or an object'))))(function (template, value, x) {
  for (var k in template) {
    var v = value && value[k];
    var t = template[k];
    x = (0, _infestines.isObject)(t) ? setPick(t, v, x) : setU(t, v, x);
  }

  return x;
}); //

var toObject$1 = function toObject$$1(x) {
  return (0, _infestines.constructorOf)(x) !== Object ? (0, _infestines.toObject)(x) : x;
}; //


var identity = function identity(x, i, _F, xi2yF) {
  return xi2yF(x, i);
}; //


exports.identity = identity;
var branchAssemble =
/*#__PURE__*/
("production" === 'production' ? id$1 : res(res(_infestines.freeze)))(function (ks) {
  return function (xs) {
    var r = {};
    var i = ks.length;

    while (i--) {
      var v = xs[0];

      if (void 0 !== v) {
        r[ks[i]] = v;
      }

      xs = xs[1];
    }

    return r;
  };
});
var branchOr1LevelIdentity =
/*#__PURE__*/
("production" === 'production' ? id$1 : function (fn$$1) {
  return function (otherwise, k2o, xO, x, A, xi2yA) {
    var y = fn$$1(otherwise, k2o, xO, x, A, xi2yA);
    if (x !== y) (0, _infestines.freeze)(y);
    return y;
  };
})(function (otherwise, k2o, xO, x, A, xi2yA) {
  var written = void 0;
  var same = true;
  var r = {};

  for (var k in k2o) {
    written = 1;
    var _x2 = xO[k];
    var y = k2o[k](_x2, k, A, xi2yA);

    if (void 0 !== y) {
      r[k] = y;
      if (same) same = _x2 === y && (_x2 !== 0 || 1 / _x2 === 1 / y) || _x2 !== _x2 && y !== y;
    } else {
      same = false;
    }
  }

  var t = written;

  for (var _k in xO) {
    if (void 0 === (t && k2o[_k])) {
      written = 1;
      var _x3 = xO[_k];

      var _y = otherwise(_x3, _k, A, xi2yA);

      if (void 0 !== _y) {
        r[_k] = _y;
        if (same) same = _x3 === _y && (_x3 !== 0 || 1 / _x3 === 1 / _y) || _x3 !== _x3 && _y !== _y;
      } else {
        same = false;
      }
    }
  }

  return written ? same && xO === x ? x : r : x;
});

var branchOr1Level = function branchOr1Level(otherwise, k2o) {
  return function (x, _i, A, xi2yA) {
    var xO = x instanceof Object ? toObject$1(x) : _infestines.object0;

    if (Identity === A) {
      return branchOr1LevelIdentity(otherwise, k2o, xO, x, A, xi2yA);
    } else if (Select === A) {
      for (var k in k2o) {
        var y = k2o[k](xO[k], k, A, xi2yA);
        if (void 0 !== y) return y;
      }

      for (var _k2 in xO) {
        if (void 0 === k2o[_k2]) {
          var _y2 = otherwise(xO[_k2], _k2, A, xi2yA);

          if (void 0 !== _y2) return _y2;
        }
      }
    } else {
      var map = A.map,
          ap = A.ap,
          of = A.of;
      var xsA = of(cpair);
      var ks = [];

      for (var _k3 in k2o) {
        ks.push(_k3);
        xsA = ap(map(cpair, xsA), k2o[_k3](xO[_k3], _k3, A, xi2yA));
      }

      var t = ks.length ? true : void 0;

      for (var _k4 in xO) {
        if (void 0 === (t && k2o[_k4])) {
          ks.push(_k4);
          xsA = ap(map(cpair, xsA), otherwise(xO[_k4], _k4, A, xi2yA));
        }
      }

      return ks.length ? map(branchAssemble(ks), xsA) : of(x);
    }
  };
};

function branchOrU(otherwise, template) {
  var k2o = create(null);

  for (var k in template) {
    var v = template[k];
    k2o[k] = (0, _infestines.isObject)(v) ? branchOrU(otherwise, v) : toFunction(v);
  }

  return branchOr1Level(otherwise, k2o);
}

var replaced = function replaced(inn, out, x) {
  return (0, _infestines.acyclicEqualsU)(x, inn) ? out : x;
};

function findIndexHint(hint, xi2b, xs) {
  var u = hint.hint;
  var n = xs.length;
  if (n <= u) u = n - 1;
  if (u < 0) u = 0;
  var d = u - 1;

  for (; 0 <= d && u < n; ++u, --d) {
    if (xi2b(xs[u], u, hint)) return u;
    if (xi2b(xs[d], d, hint)) return d;
  }

  for (; u < n; ++u) {
    if (xi2b(xs[u], u, hint)) return u;
  }

  for (; 0 <= d; --d) {
    if (xi2b(xs[d], d, hint)) return d;
  }

  return n;
}

var partitionIntoIndex =
/*#__PURE__*/
("production" === 'production' ? id$1 : dep(function (_xi2b, _xs, ts, fs) {
  return res(ef(function () {
    (0, _infestines.freeze)(ts);
    (0, _infestines.freeze)(fs);
  }));
}))(function (xi2b, xs, ts, fs) {
  for (var i = 0, n = xs.length, x; i < n; ++i) {
    (xi2b(x = xs[i], i) ? ts : fs).push(x);
  }
});

var fromReader = function fromReader(wi2x) {
  return copyName(function (w, i, F, xi2yF) {
    return F.map((0, _infestines.always)(w), xi2yF(wi2x(w, i), i));
  }, wi2x);
}; //


var reValue = function reValue(m) {
  return m[0];
};

var reIndex = function reIndex(m) {
  return m.index;
};

var reLastIndex = function reLastIndex(m) {
  return reIndex(m) + m[0].length;
};

var reNext =
/*#__PURE__*/
("production" === 'production' ? id$1 : function (fn$$1) {
  return function (m, re) {
    var res$$1 = fn$$1(m, re);
    if ('' === res$$1) warn(reNext, '`matches(' + re + ')` traversal terminated due to empty match.  `matches` traversal shouldn\'t be used with regular expressions that can produce empty matches.');
    return res$$1;
  };
})(function (m, re) {
  var lastIndex = re.lastIndex;
  re.lastIndex = reLastIndex(m);
  var n = re.exec(m.input);
  re.lastIndex = lastIndex;
  return n && n[0] && n;
}); //

var iterCollect = function iterCollect(s) {
  return function (xs) {
    return function (x) {
      return [s, x, xs];
    };
  };
};

var iterToArray = function iterToArray(xs) {
  var ys = [];

  while (iterCollect !== xs) {
    ys.push(xs[0], xs[1]);
    xs = xs[2];
  }

  return ys;
};

function iterSelect(xi2y, t, s) {
  while (s = reNext(s, t)) {
    var y = xi2y(reValue(s), reIndex(s));
    if (void 0 !== y) return y;
  }
}

function iterEager(map, ap, of, xi2yA, t, s) {
  var r = of(iterCollect);

  while (s = reNext(s, t)) {
    r = ap(ap(map(iterCollect, of(s)), r), xi2yA(reValue(s), reIndex(s)));
  }

  return r;
} //


var keyed =
/*#__PURE__*/
isoU(
/*#__PURE__*/
expect(
/*#__PURE__*/
isInstanceOf(Object),
/*#__PURE__*/
("production" === 'production' ? id$1 : res(freezeObjectOfObjects))(function keyed(x) {
  x = toObject$1(x);
  var es = [];

  for (var key in x) {
    es.push([key, x[key]]);
  }

  return es;
})),
/*#__PURE__*/
expect(_infestines.isArray,
/*#__PURE__*/
("production" === 'production' ? id$1 : res(_infestines.freeze))(function (es) {
  var o = {};

  for (var i = 0, n = es.length; i < n; ++i) {
    var entry = es[i];
    if (entry.length === 2) o[entry[0]] = entry[1];
  }

  return o;
}))); //

exports.keyed = keyed;

var matchesJoin = function matchesJoin(input) {
  return function (matchesIn) {
    var result = '';
    var lastIndex = 0;
    var matches = iterToArray(matchesIn);
    var n = matches.length;

    for (var j = n - 2; j !== -2; j += -2) {
      var m = matches[j];
      result += input.slice(lastIndex, reIndex(m));
      var s = matches[j + 1];
      if (void 0 !== s) result += s;
      lastIndex = reLastIndex(m);
    }

    result += input.slice(lastIndex);
    return result;
  };
}; //


var disjointBwd =
/*#__PURE__*/
("production" === 'production' ? id$1 : res(freezeObjectOfObjects))(function (groupOf, x) {
  if (x instanceof Object) {
    var y = {};
    x = toObject$1(x);

    for (var key in x) {
      var group = groupOf(key);
      var g = y[group];
      if (undefined === g) y[group] = g = {};
      g[key] = x[key];
    }

    return y;
  }
});
var disjointFwd =
/*#__PURE__*/
("production" === 'production' ? id$1 : res(res(_infestines.freeze)))(function (groupOf) {
  return function (y) {
    if (y instanceof Object) {
      var x = {};
      y = toObject$1(y);

      for (var group in y) {
        var g = y[group];

        if (g instanceof Object) {
          g = toObject$1(g);

          for (var key in g) {
            if (groupOf(key) === group) {
              x[key] = g[key];
            }
          }
        }
      }

      return x;
    }
  };
}); //

var isDefinedAtU = function isDefinedAtU(o, x, i) {
  return void 0 !== o(x, i, Select, id$1);
};

var isDefinedAt = function isDefinedAt(o) {
  return function (x, i) {
    return isDefinedAtU(o, x, i);
  };
};

var eitherU = function eitherU(t, e) {
  return function either(c) {
    return function either(x, i, C, xi2yC) {
      return (c(x, i) ? t : e)(x, i, C, xi2yC);
    };
  };
};

var orElseU = function orElse(back, prim) {
  prim = toFunction(prim);
  back = toFunction(back);
  return function orElse(x, i, C, xi2yC) {
    return (isDefinedAtU(prim, x, i) ? prim : back)(x, i, C, xi2yC);
  };
};

var orAlternativelyU = function orAlternatively(back, prim) {
  prim = toFunction(prim);
  back = toFunction(back);

  var fwd = function fwd(y) {
    y = (0, _infestines.always)(y);
    var yP = prim(void 0, void 0, Identity, y);
    return void 0 === yP ? back(void 0, void 0, Identity, y) : yP;
  };

  return function orAlternatively(x, i, F, xi2yF) {
    var xP = prim(x, i, Select, id$1);
    return F.map(fwd, xi2yF(void 0 === xP ? back(x, i, Select, id$1) : xP, i));
  };
};

var makeSemi = function makeSemi(op) {
  return copyName(function (_) {
    var n = arguments.length;
    var r = arguments[--n];

    while (n) {
      r = op(r, arguments[--n]);
    }

    return r;
  }, op);
};

var zero = function zero(x, _i, C, _xi2yC) {
  return C.of(x);
}; //


exports.zero = zero;

var elemsI = function elemsI(xs, _i, A, xi2yA) {
  return A === Identity ? mapPartialIndexU(xi2yA, xs, void 0) : A === Select ? selectInArrayLike(xi2yA, xs) : traversePartialIndex(A, xi2yA, xs, void 0);
}; //


var seq2U = function seq2U(l, r) {
  return function (x, i, M, xi2yM) {
    return M.chain(function (x) {
      return r(x, i, M, xi2yM);
    }, l(x, i, M, xi2yM));
  };
}; //


var pickInAux = function pickInAux(t, k) {
  return [k, pickIn(t)];
}; //


var iteratePartial = function iteratePartial(aa) {
  return function (a) {
    var r = a;

    while (a !== undefined) {
      r = a;
      a = aa(a);
    }

    return r;
  };
};

var crossPartial = function crossPartial(op, ls, or$$1) {
  return function (xs, ss) {
    var n = ls.length;
    if (!seemsArrayLike(xs)) return;
    if (!seemsArrayLike(ss)) ss = '';
    var m = Math.max(n, xs.length, ss.length);
    var ys = Array(m);

    for (var i = 0; i < m; ++i) {
      if (void 0 === (ys[i] = op(i < n ? ls[i] : or$$1, xs[i], ss[i]))) return;
    }

    return ys;
  };
};

var crossOr =
/*#__PURE__*/
("production" === 'production' ? _infestines.curry : function (fn$$1) {
  return (0, _infestines.curry)(function crossOr(or$$1, ls) {
    return toFunction([isoU(id$1, _infestines.freeze), fn$$1(or$$1, ls), isoU(_infestines.freeze, id$1)]);
  });
})(function crossOr(or$$1, ls) {
  return lensU(crossPartial(getU, ls, or$$1), crossPartial(setU, ls, or$$1));
});

var subsetPartial = function subsetPartial(p) {
  return function subset(x) {
    return p(x) ? x : undefined;
  };
}; //


var PAYLOAD = '珳襱댎纚䤤鬖罺좴';

var isPayload = function isPayload(k) {
  return (0, _infestines.isString)(k) && k.indexOf(PAYLOAD) === 0;
};

function Spread(i) {
  this[PAYLOAD] = i;
  (0, _infestines.freeze)(this);
}

var isSpread =
/*#__PURE__*/
isInstanceOf(Spread);
var Variable =
/*#__PURE__*/
(0, _infestines.inherit)(function Variable(i) {
  this[PAYLOAD + i] = this[PAYLOAD] = (0, _infestines.freeze)([new Spread(i)]);
  (0, _infestines.freeze)(this);
}, Object,
/*#__PURE__*/
(0, _infestines.assocPartialU)(iterator, function () {
  return this[PAYLOAD][iterator]();
}));
var isVariable =
/*#__PURE__*/
isInstanceOf(Variable);
var vars = [];

function nVars(n) {
  while (length(vars) < n) {
    vars.push(new Variable(length(vars)));
  }

  return vars;
}

var isPrimitive = function isPrimitive(x) {
  return x == null || typeof x !== 'object';
};

function match1(kinds, i, e, x) {
  if (void 0 !== x) {
    if (i in e) return (0, _infestines.acyclicEqualsU)(e[i], x);
    e[i] = x;
    var k = kinds[i];
    return !k || k(x);
  }
}

function checkKind(kinds, i, kind) {
  if (0 <= i) {
    if (kinds[i]) {
      if (kinds[i] !== kind) throw Error('Spread patterns must be used consistently either as arrays or as objects.');
    } else {
      kinds[i] = kind;
    }
  }
}

var arrayKind = function arrayKind(x) {
  return void 0 === x || (0, _infestines.isArray)(x);
};

var objectKind = function objectKind(x) {
  return void 0 === x || isInstanceOf(Object);
};

function checkPattern(kinds, p) {
  if (isSpread(p)) {
    throw Error('Spread patterns must be inside objects or arrays.');
  } else if ((0, _infestines.isArray)(p)) {
    var nSpread = 0;

    for (var i = 0, n = length(p); i < n; ++i) {
      var pi = p[i];

      if (isSpread(pi)) {
        if (nSpread++) throw Error('At most one spread is allowed in an array or object.');
        checkKind(kinds, pi[PAYLOAD], arrayKind);
      } else {
        checkPattern(kinds, pi);
      }
    }
  } else if ((0, _infestines.isObject)(p)) {
    var spread = p[PAYLOAD];

    if (spread) {
      spread = spread[0][PAYLOAD];
      checkKind(kinds, spread, objectKind);
    }

    var _n = 0;

    for (var k in p) {
      if (isPayload(k)) {
        if (2 < ++_n) throw Error('At most one spread is allowed in an array or object.');
      } else {
        checkPattern(kinds, p[k]);
      }
    }
  } else if (!isPrimitive(p) && !isVariable(p)) {
    throw Error('Only plain arrays and objects are allowed in patterns.');
  }
}

var checkPatternPairInDev = "production" === 'production' ? id$1 : function (ps) {
  var kinds = [];
  checkPattern(kinds, ps[0]);
  checkPattern(kinds, ps[1]);
  return deepFreezeInDev(ps);
};

var setDefined = function setDefined(o, k, x) {
  if (void 0 !== x) o[k] = x;
};

var pushDefined = function pushDefined(xs, x) {
  if (void 0 !== x) xs.push(x);
};

function toMatch(kinds, p) {
  if (all1(isPrimitive, leafs, p)) {
    return function (e, x) {
      return (0, _infestines.acyclicEqualsU)(p, x);
    };
  } else if (isVariable(p)) {
    var i = p[PAYLOAD][0][PAYLOAD];
    return i < 0 ? id$1 : function (e, x) {
      return match1(kinds, i, e, x);
    };
  } else if ((0, _infestines.isArray)(p)) {
    var init = [];
    var rest = [];
    var spread = void 0;
    var n = length(p);

    for (var _i3 = 0; _i3 < n; ++_i3) {
      var x = p[_i3];

      if (isSpread(x)) {
        spread = x[PAYLOAD];
        kinds[spread] = arrayKind;
      } else {
        var side = void 0 !== spread ? rest : init;
        side.push(toMatch(kinds, x));
      }
    }

    return function (e, x) {
      if (!seemsArrayLike(x)) return;
      var l = x.length;
      if (void 0 !== spread ? l < n - 1 : l !== n) return;
      var j = init.length;

      for (var _i4 = 0; _i4 < j; ++_i4) {
        if (!init[_i4](e, x[_i4])) return;
      }

      var k = rest.length;
      l -= k;

      for (var _i5 = 0; _i5 < k; ++_i5) {
        if (!rest[_i5](e, x[l + _i5])) return;
      }

      return !(0 <= spread) || match1(kinds, spread, e, copyToFrom(Array(l - j), 0, x, j, l));
    };
  } else {
    var _spread = p[PAYLOAD];

    if (_spread) {
      _spread = _spread[0][PAYLOAD];
      kinds[_spread] = objectKind;
    }

    p = modify(values, function (p, k) {
      return isPayload(k) ? void 0 : toMatch(kinds, p);
    }, p);

    var _n2 = count(values, p);

    return function (e, x) {
      if (isPrimitive(x) || (0, _infestines.isArray)(x)) return;
      x = toObject$1(x);
      var rest = 0 <= _spread && {};
      var i = 0;

      for (var k in x) {
        var m = p[k];

        if (m) {
          if (!m(e, x[k])) return;
          i++;
        } else if (void 0 !== _spread) {
          if (rest) rest[k] = x[k];
        } else {
          return;
        }
      }

      return i === _n2 && (!rest || match1(kinds, _spread, e, freezeInDev(rest)));
    };
  }
}

function toSubst(p, k) {
  if (isPayload(k)) {
    return void 0;
  } else if (all1(isPrimitive, leafs, p)) {
    return (0, _infestines.always)(p);
  } else if (isVariable(p)) {
    var i = p[PAYLOAD][0][PAYLOAD];
    return function (e) {
      return e[i];
    };
  } else if ((0, _infestines.isArray)(p)) {
    var init = [];
    var rest = [];
    var spread = void 0;
    var n = length(p);

    for (var _i6 = 0; _i6 < n; ++_i6) {
      var x = p[_i6];

      if (isSpread(x)) {
        spread = x[PAYLOAD];
      } else {
        var side = void 0 !== spread ? rest : init;
        side.push(toSubst(x));
      }
    }

    return freezeResultInDev(function (e) {
      var r = [];

      for (var _i7 = 0, _n3 = init.length; _i7 < _n3; ++_i7) {
        pushDefined(r, init[_i7](e));
      }

      if (0 <= spread) {
        var xs = e[spread];
        if (xs) for (var _i8 = 0, _n4 = xs.length; _i8 < _n4; ++_i8) {
          pushDefined(r, xs[_i8]);
        }
      }

      for (var _i9 = 0, _n5 = rest.length; _i9 < _n5; ++_i9) {
        pushDefined(r, rest[_i9](e));
      }

      return r;
    });
  } else {
    var _spread2 = p[PAYLOAD];
    if (_spread2) _spread2 = _spread2[0][PAYLOAD];
    p = modify(values, toSubst, p);
    return freezeResultInDev(function (e) {
      var r = {};

      for (var _k5 in p) {
        setDefined(r, _k5, p[_k5](e));
      }

      if (0 <= _spread2) {
        var _x4 = e[_spread2];
        if (_x4) for (var _k6 in _x4) {
          setDefined(r, _k6, _x4[_k6]);
        }
      }

      return r;
    });
  }
}

var oneway = function oneway(n, m, s) {
  return function (x) {
    var e = Array(n);
    if (m(e, x)) return s(e);
  };
}; // Auxiliary


var seemsArrayLike = function seemsArrayLike(x) {
  return x instanceof Object && (x = x.length, x === x >> 0 && 0 <= x) || (0, _infestines.isString)(x);
}; // Internals


exports.seemsArrayLike = seemsArrayLike;
var Identity =
/*#__PURE__*/
Monad(_infestines.applyU, id$1, _infestines.applyU, _infestines.applyU);
exports.Identity = Identity;
var IdentityAsync =
/*#__PURE__*/
Monad(chainAsync, id$1, function (xyP, xP) {
  return chainAsync(function (xP) {
    return chainAsync(function (xyP) {
      return xyP(xP);
    }, xyP);
  }, xP);
}, chainAsync);
exports.IdentityAsync = IdentityAsync;
var Select =
/*#__PURE__*/
ConstantWith(function (l, r) {
  return void 0 !== l ? l : r;
});
exports.Select = Select;
var toFunction =
/*#__PURE__*/
("production" === 'production' ? id$1 : par(0, ef(reqOptic)))(function toFunction(o) {
  switch (typeof o) {
    case 'string':
      return funProp(o);

    case 'number':
      return funIndex(o);

    case 'object':
      return composed(0, o);

    default:
      return o.length === 4 ? o : fromReader(o);
  }
}); // Operations on optics

exports.toFunction = toFunction;
var assign$1 =
/*#__PURE__*/
(0, _infestines.curry)(function assign$$1(o, x, s) {
  return setU([o, propsOf(x)], x, s);
});
exports.assign = assign$1;
var disperse =
/*#__PURE__*/
(0, _infestines.curry)(disperseU);
exports.disperse = disperse;
var modify =
/*#__PURE__*/
(0, _infestines.curry)(modifyU);
exports.modify = modify;
var modifyAsync =
/*#__PURE__*/
(0, _infestines.curry)(modifyAsyncU);
exports.modifyAsync = modifyAsync;
var remove =
/*#__PURE__*/
(0, _infestines.curry)(function remove(o, s) {
  return setU(o, void 0, s);
});
exports.remove = remove;
var set =
/*#__PURE__*/
(0, _infestines.curry)(setU);
exports.set = set;
var traverse =
/*#__PURE__*/
(0, _infestines.curry)(traverseU); // Nesting

exports.traverse = traverse;

function compose() {
  var n = arguments.length;

  if (n < 2) {
    return n ? arguments[0] : identity;
  } else {
    var os = Array(n);

    while (n--) {
      os[n] = arguments[n];
    }

    return os;
  }
}

function flat() {
  var r = [flatten];

  for (var i = 0, n = arguments.length; i < n; ++i) {
    r.push(arguments[i], flatten);
  }

  return r;
} // Recursing


function lazy(o2o) {
  var _memo = function memo(x, i, C, xi2yC) {
    return (_memo = toFunction(o2o(rec)))(x, i, C, xi2yC);
  };

  function rec(x, i, C, xi2yC) {
    return _memo(x, i, C, xi2yC);
  }

  return rec;
} // Adapting


var choices =
/*#__PURE__*/
makeSemi(orElseU);
exports.choices = choices;

var choose = function choose(xiM2o) {
  return copyName(function (x, i, C, xi2yC) {
    return toFunction(xiM2o(x, i))(x, i, C, xi2yC);
  }, xiM2o);
};

exports.choose = choose;
var cond =
/*#__PURE__*/
("production" === 'production' ? id$1 : function (fn$$1) {
  return function cond() {
    var pair = tup(ef(reqFn), ef(reqOptic));

    for (var _len = arguments.length, cs = Array(_len), _key = 0; _key < _len; _key++) {
      cs[_key] = arguments[_key];
    }

    arr(pair)(cs.slice(0, -1));
    arr(or(tup(ef(reqOptic)), pair))(cs.slice(-1));
    return fn$$1.apply(undefined, cs);
  };
})(function cond() {
  var n = arguments.length;
  var r = zero;

  while (n--) {
    var c = arguments[n];
    r = c.length < 2 ? toFunction(c[0]) : eitherU(toFunction(c[1]), r)(c[0]);
  }

  return r;
});
exports.cond = cond;
var condOf =
/*#__PURE__*/
("production" === 'production' ? id$1 : function (fn$$1) {
  return function condOf(of) {
    var pair = tup(ef(reqFn), ef(reqOptic));

    for (var _len2 = arguments.length, cs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      cs[_key2 - 1] = arguments[_key2];
    }

    arr(pair)(cs.slice(0, -1));
    arr(or(tup(ef(reqOptic)), pair))(cs.slice(-1));
    return fn$$1.apply(undefined, [of].concat(cs));
  };
})(function condOf(of) {
  of = toFunction(of);
  var n = arguments.length - 1;
  if (!n) return zero;
  var def = arguments[n];

  if (def.length === 1) {
    --n;
    def = toFunction(def[0]);
  } else {
    def = zero;
  }

  var ps = Array(n);
  var os = Array(n + 1);

  for (var i = 0; i < n; ++i) {
    var c = arguments[i + 1];
    ps[i] = c[0];
    os[i] = toFunction(c[1]);
  }

  os[n] = def;
  return function condOf(x, i, F, xi2yF) {
    var min = n;
    of(x, i, Select, function (y, j) {
      for (var _i10 = 0; _i10 < min; ++_i10) {
        if (ps[_i10](y, j)) {
          min = _i10;
          if (_i10 === 0) return 0;else break;
        }
      }
    });
    return os[min](x, i, F, xi2yF);
  };
});
exports.condOf = condOf;
var ifElse =
/*#__PURE__*/
(0, _infestines.curry)(function ifElse(c, t, e) {
  return eitherU(toFunction(t), toFunction(e))(c);
});
exports.ifElse = ifElse;
var orElse =
/*#__PURE__*/
(0, _infestines.curry)(orElseU); // Querying

exports.orElse = orElse;
var chain =
/*#__PURE__*/
(0, _infestines.curry)(function chain(xi2yO, xO) {
  return [xO, choose(function (xM, i) {
    return void 0 !== xM ? xi2yO(xM, i) : zero;
  })];
});
exports.chain = chain;

var choice = function choice() {
  for (var _len3 = arguments.length, os = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    os[_key3] = arguments[_key3];
  }

  return os.reduceRight(orElseU, zero);
};

exports.choice = choice;
var unless =
/*#__PURE__*/
eitherU(zero, identity);
exports.unless = unless;
var when =
/*#__PURE__*/
eitherU(identity, zero);
exports.when = when;
var optional =
/*#__PURE__*/
when(_infestines.isDefined); // Indices

exports.optional = optional;

var mapIx = function mapIx(ix2j) {
  return function mapIx(x, i, F, xj2yF) {
    return xj2yF(x, ix2j(i, x));
  };
};

exports.mapIx = mapIx;

var setIx = function setIx(j) {
  return function setIx(x, _i, _F, xj2yF) {
    return xj2yF(x, j);
  };
};

exports.setIx = setIx;
var tieIx =
/*#__PURE__*/
(0, _infestines.curry)(function tieIx(ij2k, o) {
  o = toFunction(o);
  return copyName(function (x, i, F, yk2zF) {
    return o(x, i, F, function (y, j) {
      return yk2zF(y, ij2k(j, i));
    });
  }, o);
});
exports.tieIx = tieIx;
var joinIx =
/*#__PURE__*/
setName(
/*#__PURE__*/
tieIx(function (j, i) {
  return void 0 !== i ? void 0 !== j ? [i, j] : i : j;
}), 'joinIx');
exports.joinIx = joinIx;
var skipIx =
/*#__PURE__*/
setName(
/*#__PURE__*/
tieIx(_infestines.sndU), 'skipIx'); // Debugging

exports.skipIx = skipIx;

function getLog(l, s) {
  var _traverseU = traverseU(SelectLog, function (x) {
    return {
      p: [x, consExcept],
      x: x,
      c: x
    };
  }, l, s),
      p = _traverseU.p,
      c = _traverseU.c;

  p = pushTo(p, ['%O']);

  for (var i = 2; i < p.length; ++i) {
    p[0] += ' <= %O';
  }

  console.log.apply(console, p);
  return c;
}

function log() {
  var show = (0, _infestines.curry)(function log(dir, x) {
    console.log.apply(console, copyToFrom([], 0, arguments, 0, arguments.length).concat([dir, x]));
    return x;
  });
  return isoU(show('get'), show('set'));
} // Operations on transforms


var transform =
/*#__PURE__*/
(0, _infestines.curry)(function transform(o, s) {
  return modifyU(o, id$1, s);
});
exports.transform = transform;
var transformAsync =
/*#__PURE__*/
(0, _infestines.curry)(function transformAsync(o, s) {
  return modifyAsyncU(o, id$1, s);
}); // Sequencing

exports.transformAsync = transformAsync;
var seq =
/*#__PURE__*/
("production" === 'production' ? id$1 : function (fn$$1) {
  return function seq() {
    return par(2, ef(reqMonad('seq')))(fn$$1.apply(undefined, arguments));
  };
})(function seq() {
  var n = arguments.length;
  var r = zero;

  if (n) {
    r = toFunction(arguments[--n]);

    while (n) {
      r = seq2U(toFunction(arguments[--n]), r);
    }
  }

  return r;
}); // Transforming

exports.seq = seq;

var assignOp = function assignOp(x) {
  return [propsOf(x), setOp(x)];
};

exports.assignOp = assignOp;

var modifyOp = function modifyOp(xi2y) {
  return function modifyOp(x, i, C, _xi2yC) {
    return C.of(xi2y(x, i));
  };
};

exports.modifyOp = modifyOp;

var setOp = function setOp(y) {
  return function setOp(_x, _i, C, _xi2yC) {
    return C.of(y);
  };
};

exports.setOp = setOp;
var removeOp =
/*#__PURE__*/
setOp(); // Creating new traversals

exports.removeOp = removeOp;
var branchOr =
/*#__PURE__*/
("production" === 'production' ? id$1 : par(1, ef(reqTemplate('branchOr'))))(
/*#__PURE__*/
(0, _infestines.curryN)(2, function branchOr(otherwise) {
  otherwise = toFunction(otherwise);
  return function branchOr(template) {
    return branchOrU(otherwise, template);
  };
}));
exports.branchOr = branchOr;
var branch =
/*#__PURE__*/
branchOr(zero);
exports.branch = branch;

function branches() {
  var n = arguments.length;
  var template = {};

  for (var i = 0; i < n; ++i) {
    template[arguments[i]] = identity;
  }

  return branch(template);
} // Traversals and combinators


function elems(xs, i, A, xi2yA) {
  return seemsArrayLike(xs) ? elemsI(xs, i, A, xi2yA) : A.of(xs);
}

var elemsTotal = function elemsTotal(xs, i, A, xi2yA) {
  return seemsArrayLike(xs) ? A === Identity ? mapPartialIndexU(xi2yA, xs, mapPartialIndexU) : A === Select ? selectInArrayLike(xi2yA, xs) : traversePartialIndex(A, xi2yA, xs, traversePartialIndex) : A.of(xs);
};

exports.elemsTotal = elemsTotal;
var entries =
/*#__PURE__*/
setName(
/*#__PURE__*/
toFunction([keyed, elems]), 'entries');
exports.entries = entries;
var keys$1 =
/*#__PURE__*/
setName(
/*#__PURE__*/
toFunction([keyed, elems, 0]), 'keys');
exports.keys = keys$1;

function matches(re) {
  return function matches(x, _i, C, xi2yC) {
    if ((0, _infestines.isString)(x)) {
      var map = C.map;

      if (re.global) {
        var m0 = [''];
        m0.input = x;
        m0.index = 0;

        if (Select === C) {
          return iterSelect(xi2yC, re, m0);
        } else {
          var ap = C.ap,
              of = C.of;
          return map(matchesJoin(x), iterEager(map, ap, of, xi2yC, re, m0));
        }
      } else {
        var m = x.match(re);
        if (m) return map(function (y) {
          return x.replace(re, void 0 !== y ? y : '');
        }, xi2yC(m[0], reIndex(m)));
      }
    }

    return C.of(x);
  };
}

var values =
/*#__PURE__*/
setName(
/*#__PURE__*/
branchOr1Level(identity, protoless0), 'values');
exports.values = values;

function children(x, i, C, xi2yC) {
  return (0, _infestines.isArray)(x) ? elemsI(x, i, C, xi2yC) : (0, _infestines.isObject)(x) ? values(x, i, C, xi2yC) : C.of(x);
}

function flatten(x, i, C, xi2yC) {
  var rec = function rec(x, i) {
    return (0, _infestines.isArray)(x) ? elemsI(x, i, C, rec) : void 0 !== x ? xi2yC(x, i) : C.of(x);
  };

  return rec(x, i);
}

function query() {
  var r = [];

  for (var i = 0, n = arguments.length; i < n; ++i) {
    var o = toFunction(arguments[i]);
    r.push(satisfying(isDefinedAt(o)), o);
  }

  return r;
}

var satisfying = function satisfying(p) {
  return function satisfying(x, i, C, xi2yC) {
    var rec = function rec(x, i) {
      return p(x, i) ? xi2yC(x, i) : children(x, i, C, rec);
    };

    return rec(x, i);
  };
};

exports.satisfying = satisfying;
var leafs =
/*#__PURE__*/
satisfying(function (x) {
  return void 0 !== x && !(0, _infestines.isArray)(x) && !(0, _infestines.isObject)(x);
}); // Folds over traversals

exports.leafs = leafs;
var all =
/*#__PURE__*/
(0, _infestines.curry)(function all(xi2b, t, s) {
  return !getAsU(function (x, i) {
    if (!xi2b(x, i)) return true;
  }, t, s);
});
exports.all = all;
var and$1 =
/*#__PURE__*/
all(id$1);
exports.and = and$1;
var all1 =
/*#__PURE__*/
(0, _infestines.curry)(function all1(xi2b, t, s) {
  var result = false;
  getAsU(function (x, i) {
    if (xi2b(x, i)) result = true;else return result = false;
  }, t, s);
  return result;
});
exports.all1 = all1;
var and1 =
/*#__PURE__*/
all1(id$1);
exports.and1 = and1;
var any =
/*#__PURE__*/
(0, _infestines.curry)(function any(xi2b, t, s) {
  return !!getAsU(function (x, i) {
    if (xi2b(x, i)) return true;
  }, t, s);
});
exports.any = any;
var collectAs =
/*#__PURE__*/
("production" === 'production' ? _infestines.curry : res(_infestines.freeze))(function collectAs(xi2y, t, s) {
  var results = [];
  getAsU(function (x, i) {
    var y = xi2y(x, i);
    if (void 0 !== y) results.push(y);
  }, t, s);
  return results;
});
exports.collectAs = collectAs;
var collect =
/*#__PURE__*/
collectAs(id$1);
exports.collect = collect;
var collectTotalAs =
/*#__PURE__*/
("production" === 'production' ? _infestines.curry : res(_infestines.freeze))(function collectTotalAs(xi2y, t, s) {
  var results = [];
  getAsU(function (x, i) {
    results.push(xi2y(x, i));
  }, t, s);
  return results;
});
exports.collectTotalAs = collectTotalAs;
var collectTotal =
/*#__PURE__*/
collectTotalAs(id$1);
exports.collectTotal = collectTotal;
var concatAs =
/*#__PURE__*/
mkTraverse(id$1, ConstantOf);
exports.concatAs = concatAs;
var concat =
/*#__PURE__*/
concatAs(id$1);
exports.concat = concat;
var countIf =
/*#__PURE__*/
(0, _infestines.curry)(function countIf(p, t, s) {
  return traverseU(Sum, function (x, i) {
    return p(x, i) ? 1 : 0;
  }, t, s);
});
exports.countIf = countIf;
var count =
/*#__PURE__*/
countIf(_infestines.isDefined);
exports.count = count;
var countsAs =
/*#__PURE__*/
(0, _infestines.curry)(function countsAs(xi2k, t, s) {
  var counts = new Map();
  getAsU(function (x, i) {
    var k = xi2k(x, i);
    var n = counts.get(k);
    counts.set(k, void 0 !== n ? n + 1 : 1);
  }, t, s);
  return counts;
});
exports.countsAs = countsAs;
var counts =
/*#__PURE__*/
countsAs(id$1);
exports.counts = counts;
var foldl =
/*#__PURE__*/
(0, _infestines.curry)(function foldl(f, r, t, s) {
  getAsU(function (x, i) {
    r = f(r, x, i);
  }, t, s);
  return r;
});
exports.foldl = foldl;
var foldr =
/*#__PURE__*/
(0, _infestines.curry)(function foldr(f, r, t, s) {
  var is = [];
  var xs = [];
  getAsU(function (x, i) {
    xs.push(x);
    is.push(i);
  }, t, s);

  for (var i = xs.length - 1; 0 <= i; --i) {
    r = f(r, xs[i], is[i]);
  }

  return r;
});
exports.foldr = foldr;
var forEach =
/*#__PURE__*/
(0, _infestines.curry)(function forEach(f, t, s) {
  return getAsU(function (x, i) {
    f(x, i);
  }, t, s);
});
exports.forEach = forEach;
var forEachWith =
/*#__PURE__*/
(0, _infestines.curry)(function forEachWith(newC, ef$$1, t, s) {
  var c = newC();
  getAsU(function (x, i) {
    ef$$1(c, x, i);
  }, t, s);
  return c;
});
exports.forEachWith = forEachWith;

function get(l, s) {
  return 1 < arguments.length ? getAsU(id$1, l, s) : function (s) {
    return getAsU(id$1, l, s);
  };
}

var getAs =
/*#__PURE__*/
(0, _infestines.curry)(getAsU);
exports.getAs = getAs;
var isDefined$1 =
/*#__PURE__*/
(0, _infestines.curry)(function isDefined$$1(t, s) {
  return void 0 !== getAsU(id$1, t, s);
});
exports.isDefined = isDefined$1;
var isEmpty =
/*#__PURE__*/
(0, _infestines.curry)(function isEmpty(t, s) {
  return !getAsU(toTrue, t, s);
});
exports.isEmpty = isEmpty;
var joinAs =
/*#__PURE__*/
mkTraverse(toStringPartial,
/*#__PURE__*/
("production" === 'production' ? id$1 : par(0, ef(reqString('`join` and `joinAs` expect a string delimiter'))))(function joinAs(d) {
  return ConstantWith(function (x, y) {
    return void 0 !== x ? void 0 !== y ? x + d + y : x : y;
  });
}));
exports.joinAs = joinAs;
var join =
/*#__PURE__*/
joinAs(id$1);
exports.join = join;
var maximumBy =
/*#__PURE__*/
mumBy(gtU);
exports.maximumBy = maximumBy;
var maximum =
/*#__PURE__*/
maximumBy(id$1);
exports.maximum = maximum;
var meanAs =
/*#__PURE__*/
(0, _infestines.curry)(function meanAs(xi2y, t, s) {
  var sum = 0;
  var num = 0;
  getAsU(function (x, i) {
    var y = xi2y(x, i);

    if (void 0 !== y) {
      num += 1;
      sum += y;
    }
  }, t, s);
  return sum / num;
});
exports.meanAs = meanAs;
var mean =
/*#__PURE__*/
meanAs(id$1);
exports.mean = mean;
var minimumBy =
/*#__PURE__*/
mumBy(ltU);
exports.minimumBy = minimumBy;
var minimum =
/*#__PURE__*/
minimumBy(id$1);
exports.minimum = minimum;
var none =
/*#__PURE__*/
(0, _infestines.curry)(function none(xi2b, t, s) {
  return !getAsU(function (x, i) {
    if (xi2b(x, i)) return true;
  }, t, s);
});
exports.none = none;
var or$1 =
/*#__PURE__*/
any(id$1);
exports.or = or$1;
var productAs =
/*#__PURE__*/
traverse(
/*#__PURE__*/
ConstantWith(multiplyU, 1));
exports.productAs = productAs;
var product =
/*#__PURE__*/
productAs(
/*#__PURE__*/
unto(1));
exports.product = product;
var select = "production" === 'production' ? get :
/*#__PURE__*/
(0, _infestines.curry)(function select(l, s) {
  warn(select, '`select` has been obsoleted.  Just use `get`.  See CHANGELOG for details.');
  return get(l, s);
});
exports.select = select;
var selectAs = "production" === 'production' ? getAs :
/*#__PURE__*/
(0, _infestines.curry)(function selectAs(f, l, s) {
  warn(selectAs, '`selectAs` has been obsoleted.  Just use `getAs`.  See CHANGELOG for details.');
  return getAs(f, l, s);
});
exports.selectAs = selectAs;
var sumAs =
/*#__PURE__*/
traverse(Sum);
exports.sumAs = sumAs;
var sum =
/*#__PURE__*/
sumAs(unto0); // Creating new lenses

exports.sum = sum;
var foldTraversalLens =
/*#__PURE__*/
(0, _infestines.curry)(function foldTraversalLens(fold, traversal) {
  return lensU(fold(traversal), set(traversal));
});
exports.foldTraversalLens = foldTraversalLens;

var getter = function getter(get) {
  return function (x, i, F, xi2yF) {
    return xi2yF(get(x, i), i);
  };
};

exports.getter = getter;
var lens =
/*#__PURE__*/
(0, _infestines.curry)(lensU);
exports.lens = lens;

var partsOf = function partsOf(t) {
  return function (x, i, F, xi2yF) {
    return F.map(function (y) {
      return disperseU(t, y, x);
    }, xi2yF(collectTotal(t, x), i));
  };
};

exports.partsOf = partsOf;
var setter =
/*#__PURE__*/
lens(id$1); // Enforcing invariants

exports.setter = setter;

function defaults(out) {
  function o2u(x) {
    return replaced(out, void 0, x);
  }

  return function defaults(x, i, F, xi2yF) {
    return F.map(o2u, xi2yF(void 0 !== x ? x : out, i));
  };
}

function define(v) {
  var untoV = unto(v);
  return function define(x, i, F, xi2yF) {
    return F.map(untoV, xi2yF(void 0 !== x ? x : v, i));
  };
}

var normalize = function normalize(xi2x) {
  return [reread(xi2x), rewrite(xi2x)];
};

exports.normalize = normalize;

function required(inn) {
  return replace$1(inn, void 0);
}

var reread = function reread(xi2x) {
  return function (x, i, _F, xi2yF) {
    return xi2yF(void 0 !== x ? xi2x(x, i) : x, i);
  };
};

exports.reread = reread;

var rewrite = function rewrite(yi2y) {
  return function (x, i, F, xi2yF) {
    return F.map(function (y) {
      return void 0 !== y ? yi2y(y, i) : y;
    }, xi2yF(x, i));
  };
}; // Lensing arrays


exports.rewrite = rewrite;

function append(xs, _, F, xi2yF) {
  var i = seemsArrayLike(xs) ? xs.length : 0;
  return F.map(function (x) {
    return setIndex(i, x, xs);
  }, xi2yF(void 0, i));
}

var cross =
/*#__PURE__*/
setName(
/*#__PURE__*/
crossOr(removeOp), 'cross');
exports.cross = cross;
var filter =
/*#__PURE__*/
("production" === 'production' ? id$1 : res(function (lens) {
  return toFunction([lens, isoU(id$1, ef(reqMaybeArray('`filter` must be set with undefined or an array-like object')))]);
}))(function filter(xi2b) {
  return function filter(xs, i, F, xi2yF) {
    var ts = void 0;
    var fs = _infestines.array0;
    if (seemsArrayLike(xs)) partitionIntoIndex(xi2b, xs, ts = [], fs = []);
    return F.map(function (ts) {
      var tsN = ts ? ts.length : 0;
      var fsN = fs.length;
      var n = tsN + fsN;
      return n === fsN ? fs : copyToFrom(copyToFrom(Array(n), 0, ts, 0, tsN), tsN, fs, 0, fsN);
    }, xi2yF(ts, i));
  };
});
exports.filter = filter;

function find(xih2b) {
  var hint = arguments.length > 1 ? arguments[1] : {
    hint: 0
  };
  return function find(xs, _i, F, xi2yF) {
    var ys = seemsArrayLike(xs) ? xs : '';
    var i = hint.hint = findIndexHint(hint, xih2b, ys);
    return F.map(function (v) {
      return setIndex(i, v, ys);
    }, xi2yF(ys[i], i));
  };
}

function findWith(o) {
  var oo = toFunction(o);
  var p = isDefinedAt(oo);
  return [arguments.length > 1 ? find(p, arguments[1]) : find(p), oo];
}

var first = 0;
exports.first = first;
var index = "production" !== 'production' ?
/*#__PURE__*/
ef(reqIndex) : id$1;
exports.index = index;
var last =
/*#__PURE__*/
choose(function last(maybeArray) {
  return seemsArrayLike(maybeArray) && maybeArray.length ? maybeArray.length - 1 : 0;
});
exports.last = last;

var prefix = function prefix(n) {
  return slice(0, n);
};

exports.prefix = prefix;
var slice =
/*#__PURE__*/
("production" === 'production' ? _infestines.curry : res(function (lens) {
  return toFunction([lens, isoU(id$1, ef(reqMaybeArray('`slice` must be set with undefined or an array-like object')))]);
}))(function slice(begin, end) {
  return function slice(xs, i, F, xsi2yF) {
    var seems = seemsArrayLike(xs);
    var xsN = seems && xs.length;
    var b = sliceIndex(0, xsN, 0, begin);
    var e = sliceIndex(b, xsN, xsN, end);
    return F.map(function (zs) {
      var zsN = zs ? zs.length : 0;
      var bPzsN = b + zsN;
      var n = xsN - e + bPzsN;
      return copyToFrom(copyToFrom(copyToFrom(Array(n), 0, xs, 0, b), b, zs, 0, zsN), bPzsN, xs, e, xsN);
    }, xsi2yF(seems ? copyToFrom(Array(Math.max(0, e - b)), 0, xs, b, e) : void 0, i));
  };
});
exports.slice = slice;

var suffix = function suffix(n) {
  return slice(0 === n ? Infinity : !n ? 0 : -n, void 0);
}; // Lensing objects


exports.suffix = suffix;

var pickIn = function pickIn(t) {
  return (0, _infestines.isObject)(t) ? pick(modify(values, pickInAux, t)) : t;
};

exports.pickIn = pickIn;
var prop = "production" === 'production' ? id$1 : function (x) {
  if (!(0, _infestines.isString)(x)) errorGiven('`prop` expects a string', x);
  return x;
};
exports.prop = prop;

function props() {
  var n = arguments.length;
  var template = {};

  for (var i = 0, k; i < n; ++i) {
    template[k = arguments[i]] = k;
  }

  return pick(template);
}

var propsOf = function propsOf(o) {
  return props.apply(null, (0, _infestines.keys)(o));
};

exports.propsOf = propsOf;

function removable() {
  for (var _len4 = arguments.length, ps = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    ps[_key4] = arguments[_key4];
  }

  function drop(y) {
    if (!(y instanceof Object)) return y;

    for (var i = 0, n = ps.length; i < n; ++i) {
      if ((0, _infestines.hasU)(ps[i], y)) return y;
    }
  }

  return function (x, i, F, xi2yF) {
    return F.map(drop, xi2yF(x, i));
  };
} // Providing defaults


var valueOr = function valueOr(v) {
  return function (x, i, _F, xi2yF) {
    return xi2yF(x != null ? x : v, i);
  };
}; // Transforming data


exports.valueOr = valueOr;
var pick =
/*#__PURE__*/
("production" === 'production' ? id$1 : par(0, ef(reqTemplate('pick'))))(function pick(template) {
  return function (x, i, F, xi2yF) {
    return F.map(function (v) {
      return setPick(template, v, x);
    }, xi2yF(getPick(template, x), i));
  };
});
exports.pick = pick;
var replace$1 =
/*#__PURE__*/
(0, _infestines.curry)(function replace$$1(inn, out) {
  function o2i(x) {
    return replaced(out, inn, x);
  }

  return function replace$$1(x, i, F, xi2yF) {
    return F.map(o2i, xi2yF(replaced(inn, out, x), i));
  };
}); // Operations on isomorphisms

exports.replace = replace$1;

function getInverse(o, s) {
  return 1 < arguments.length ? setU(o, s, void 0) : function (s) {
    return setU(o, s, void 0);
  };
} // Creating new isomorphisms


var iso =
/*#__PURE__*/
(0, _infestines.curry)(isoU);
exports.iso = iso;

var _ =
/*#__PURE__*/
new Variable(-1);

exports._ = _;

function mapping(ps) {
  var n = 0;
  if ((0, _infestines.isFunction)(ps)) ps = ps.apply(null, nVars(n = ps.length));
  checkPatternPairInDev(ps);
  var kinds = Array(n);
  var ms = ps.map(function (p) {
    return toMatch(kinds, p);
  });
  var ss = ps.map(toSubst);
  return isoU(oneway(n, ms[0], ss[1]), oneway(n, ms[1], ss[0]));
}

function mappings(ps) {
  if ((0, _infestines.isFunction)(ps)) ps = ps.apply(null, nVars(ps.length));
  return alternatives.apply(null, ps.map(mapping));
} // Isomorphism combinators


var alternatives =
/*#__PURE__*/
makeSemi(orAlternativelyU);
exports.alternatives = alternatives;
var applyAt =
/*#__PURE__*/
(0, _infestines.curry)(function applyAt(elements, transform) {
  return isoU(modify(elements, get(transform)), modify(elements, getInverse(transform)));
});
exports.applyAt = applyAt;

var array = function array(elem) {
  var fwd = getInverse(elem);
  var bwd = get(elem);

  var mapFwd = function mapFwd(x) {
    return mapIfArrayLike(fwd, x);
  };

  return function (x, i, F, xi2yF) {
    return F.map(mapFwd, xi2yF(mapIfArrayLike(bwd, x), i));
  };
};

exports.array = array;
var conjugate =
/*#__PURE__*/
(0, _infestines.curry)(function conjugate(outer, inner) {
  return [outer, inner, inverse(outer)];
});
exports.conjugate = conjugate;

var inverse = function inverse(iso) {
  return function (x, i, F, xi2yF) {
    return F.map(function (x) {
      return getAsU(id$1, iso, x);
    }, xi2yF(setU(iso, x, void 0), i));
  };
};

exports.inverse = inverse;

var iterate = function iterate(aIa) {
  return isoU(iteratePartial(get(aIa)), iteratePartial(getInverse(aIa)));
};

exports.iterate = iterate;
var orAlternatively =
/*#__PURE__*/
(0, _infestines.curry)(orAlternativelyU); // Basic isomorphisms

exports.orAlternatively = orAlternatively;
var complement =
/*#__PURE__*/
isoU(notPartial, notPartial);
exports.complement = complement;

var is = function is(v) {
  return isoU(function is(x) {
    return (0, _infestines.acyclicEqualsU)(v, x);
  }, function (b) {
    return true === b ? v : void 0;
  });
};

exports.is = is;

function subset(predicate) {
  var subsetFn = subsetPartial(predicate);
  return isoU(subsetFn, subsetFn);
} // Array isomorphisms


var indexed =
/*#__PURE__*/
isoU(
/*#__PURE__*/
expect(seemsArrayLike,
/*#__PURE__*/
("production" === 'production' ? id$1 : res(freezeObjectOfObjects))(function indexed(xs) {
  var n = xs.length;
  var xis = Array(n);

  for (var i = 0; i < n; ++i) {
    xis[i] = [i, xs[i]];
  }

  return xis;
})),
/*#__PURE__*/
expect(_infestines.isArray,
/*#__PURE__*/
("production" === 'production' ? id$1 : res(_infestines.freeze))(function (xis) {
  var n = xis.length;
  var xs = Array(n);

  for (var i = 0; i < n; ++i) {
    var xi = xis[i];
    if (xi.length === 2) xs[xi[0]] = xi[1];
  }

  n = xs.length;
  var j = 0;

  for (var _i11 = 0; _i11 < n; ++_i11) {
    var x = xs[_i11];

    if (void 0 !== x) {
      if (_i11 !== j) xs[j] = x;
      ++j;
    }
  }

  xs.length = j;
  return xs;
})));
exports.indexed = indexed;
var reverse =
/*#__PURE__*/
isoU(rev, rev);
exports.reverse = reverse;
var singleton =
/*#__PURE__*/
mapping(function (x) {
  return [[x], x];
});
exports.singleton = singleton;

var disjoint = function disjoint(groupOf) {
  return function disjoint(x, i, F, xi2yF) {
    var fwd = disjointFwd(groupOf);
    return F.map(fwd, xi2yF(disjointBwd(groupOf, x), i));
  };
};

exports.disjoint = disjoint;
var multikeyed =
/*#__PURE__*/
isoU(
/*#__PURE__*/
expect(
/*#__PURE__*/
isInstanceOf(Object),
/*#__PURE__*/
("production" === 'production' ? id$1 : res(freezeObjectOfObjects))(function multikeyed(o) {
  o = toObject$1(o);
  var ps = [];

  for (var k in o) {
    var v = o[k];
    if ((0, _infestines.isArray)(v)) for (var i = 0, n = v.length; i < n; ++i) {
      ps.push([k, v[i]]);
    } else ps.push([k, v]);
  }

  return ps;
})),
/*#__PURE__*/
expect(_infestines.isArray,
/*#__PURE__*/
("production" === 'production' ? id$1 : res(freezeObjectOfObjects))(function (ps) {
  var o = create(null);

  for (var i = 0, n = ps.length; i < n; ++i) {
    var entry = ps[i];

    if (entry.length === 2) {
      var k = entry[0];
      var v = entry[1];
      var was = o[k];
      if (was === void 0) o[k] = v;else if ((0, _infestines.isArray)(was)) was.push(v);else o[k] = [was, v];
    }
  }

  return (0, _infestines.assign)({}, o);
}))); // Standard isomorphisms

exports.multikeyed = multikeyed;
var json =
/*#__PURE__*/
("production" === 'production' ? id$1 : res(function (iso) {
  return toFunction([iso, isoU(deepFreezeInDev, id$1)]);
}))(function json(options) {
  var _ref3 = options || _infestines.object0,
      reviver = _ref3.reviver,
      replacer = _ref3.replacer,
      space = _ref3.space;

  return isoU(expect(_infestines.isString, tryCatch(function json(text) {
    return JSON.parse(text, reviver);
  })), expect(_infestines.isDefined, function (value) {
    return JSON.stringify(value, replacer, space);
  }));
});
exports.json = json;
var uri =
/*#__PURE__*/
stringIsoU(
/*#__PURE__*/
tryCatch(decodeURI), encodeURI);
exports.uri = uri;
var uriComponent =
/*#__PURE__*/
isoU(
/*#__PURE__*/
expect(_infestines.isString,
/*#__PURE__*/
tryCatch(decodeURIComponent)),
/*#__PURE__*/
expect(isPrimitiveData, encodeURIComponent)); // String isomorphisms

exports.uriComponent = uriComponent;

var dropPrefix = function dropPrefix(pfx) {
  return stringIsoU(function dropPrefix(x) {
    return x.startsWith(pfx) ? x.slice(pfx.length) : undefined;
  }, function (x) {
    return pfx + x;
  });
};

exports.dropPrefix = dropPrefix;

var dropSuffix = function dropSuffix(sfx) {
  return stringIsoU(function dropSuffix(x) {
    return x.endsWith(sfx) ? x.slice(0, x.length - sfx.length) : undefined;
  }, function (x) {
    return x + sfx;
  });
};

exports.dropSuffix = dropSuffix;
var replaces =
/*#__PURE__*/
(0, _infestines.curry)(function replaces(i, o) {
  return stringIsoU(replace(toRegExpU(i, 'g'), o), replace(toRegExpU(o, 'g'), i));
});
exports.replaces = replaces;
var split =
/*#__PURE__*/
("production" === 'production' ? id$1 : function (fn$$1) {
  return function split(_sep) {
    return toFunction([fn$$1.apply(null, arguments), isoU(_infestines.freeze, id$1)]);
  };
})(function split(sep) {
  var re = arguments.length > 1 ? arguments[1] : sep;
  return isoU(expect(_infestines.isString, function (x) {
    return x.split(re);
  }), expect(_infestines.isArray, function (xs) {
    return xs.join(sep);
  }));
});
exports.split = split;
var uncouple =
/*#__PURE__*/
("production" === 'production' ? id$1 : function (fn$$1) {
  return function uncouple(_sep) {
    return toFunction([fn$$1.apply(null, arguments), isoU(_infestines.freeze, id$1)]);
  };
})(function uncouple(sep) {
  var re = toRegExpU(arguments.length > 1 ? arguments[1] : sep, '');
  return isoU(expect(_infestines.isString, function (x) {
    var m = re.exec(x);
    return m ? [x.slice(0, reIndex(m)), x.slice(reLastIndex(m))] : [x, ''];
  }), function (kv) {
    if ((0, _infestines.isArray)(kv) && kv.length === 2) {
      var k = kv[0];
      var v = kv[1];
      return v ? k + sep + v : k;
    }
  });
}); // Standardish isomorphisms

exports.uncouple = uncouple;
var querystring =
/*#__PURE__*/
toFunction([
/*#__PURE__*/
reread(function (s) {
  return (0, _infestines.isString)(s) ? s.replace(/\+/g, '%20') : s;
}),
/*#__PURE__*/
split('&'),
/*#__PURE__*/
array([
/*#__PURE__*/
uncouple('='),
/*#__PURE__*/
array(uriComponent)]),
/*#__PURE__*/
inverse(multikeyed)]); // Arithmetic isomorphisms

exports.querystring = querystring;

var add$1 = function add$$1(c) {
  return numberIsoU(add(c), add(-c));
};

exports.add = add$1;

var divide = function divide(c) {
  return numberIsoU(divideBy(c), multiply(c));
};

exports.divide = divide;

var multiply$1 = function multiply$$1(c) {
  return numberIsoU(multiply(c), divideBy(c));
};

exports.multiply = multiply$1;
var negate$1 =
/*#__PURE__*/
numberIsoU(negate, negate);
exports.negate = negate$1;

var subtract = function subtract(c) {
  return numberIsoU(add(-c), add(c));
};

exports.subtract = subtract;

var pointer = function pointer(s) {
  if (s[0] === '#') s = decodeURIComponent(s);
  var ts = s.split('/');
  var n = ts.length;

  for (var i = 1; i < n; ++i) {
    var t = ts[i];
    ts[i - 1] = /^(0|[1-9]\d*)$/.test(t) ? ifElse(isArrayOrPrimitive, Number(t), t) : '-' === t ? ifElse(isArrayOrPrimitive, append, t) : t.replace('~1', '/').replace('~0', '~');
  }

  ts.length = n - 1;
  return ts;
};

exports.pointer = pointer;
},{"infestines":"KCN3"}],"IKxj":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upgradesOf = exports.upgrades = exports.promote = exports.lazy = exports.casesOf = exports.ifElse = exports.cases = exports.choose = exports.props = exports.propsOr = exports.optional = exports.keep = exports.freeFn = exports.dependentFn = exports.tuple = exports.args = exports.arrayIx = exports.arrayId = exports.or = exports.either = exports.not = exports.and = exports.both = exports.removeAfter = exports.setAfter = exports.modifyAfter = exports.setError = exports.modifyError = exports.where = exports.validateAsync = exports.tryValidateAsyncNow = exports.errorsAsync = exports.acceptsAsync = exports.validate = exports.errors = exports.accepts = exports.run = exports.remove = exports.reject = exports.rejectAs = exports.rejectWith = exports.acceptWith = exports.acceptAs = exports.accept = void 0;

var _infestines = require("infestines");

var _partial = require("partial.lenses");

var isThenable = function isThenable(x) {
  return null != x && (0, _infestines.isFunction)(x.then);
};

var length = function length(x) {
  return x.length;
};

var lte =
/*#__PURE__*/
(0, _infestines.curry)(function (l, r) {
  return l <= r;
});
var gte =
/*#__PURE__*/
(0, _infestines.curry)(function (l, r) {
  return l >= r;
});
var identical =
/*#__PURE__*/
(0, _infestines.curry)(_infestines.identicalU);
var isInstanceOf =
/*#__PURE__*/
(0, _infestines.curry)(function (Class, x) {
  return x instanceof Class;
});
var isInstanceOfObject =
/*#__PURE__*/
isInstanceOf(Object);

var isBoolean = function isBoolean(x) {
  return typeof x === 'boolean';
};

var o =
/*#__PURE__*/
(0, _infestines.curry)(function (f, g) {
  return function (x) {
    return f(g(x));
  };
});
var both =
/*#__PURE__*/
(0, _infestines.curry)(function (p1, p2) {
  return function (x) {
    return p1(x) && p2(x);
  };
});

var ignore = function ignore(_) {}; //


var copyName = "production" === 'production' ? function (x) {
  return x;
} : function (to, from) {
  return (0, _infestines.defineNameU)(to, from.name);
}; //

var throwAsync = function throwAsync(x) {
  return Promise.reject(x);
};

var returnAsync = function returnAsync(x) {
  return Promise.resolve(x);
}; //


function Rejected(value) {
  this.value = undefined !== value ? value : null;
}

var isRejected =
/*#__PURE__*/
isInstanceOf(Rejected);
var rejected =
/*#__PURE__*/
("production" === 'production' ? _infestines.id : o(_infestines.freeze))(function (value) {
  return new Rejected(value);
});

var value = function value(x) {
  return x.value;
};

var fromRejected = function fromRejected(x) {
  return isRejected(x) ? value(x) : undefined;
};

var fromRejectedOrNull = function fromRejectedOrNull(x) {
  return isRejected(x) ? value(x) : null;
}; //


var trickle = function trickle(optic, from) {
  return function (r) {
    return (0, _partial.any)(isRejected, optic, r) ? rejected((0, _partial.modify)(optic, from, r)) : r;
  };
};

var arrayIxTrickle =
/*#__PURE__*/
(0, _partial.rewrite)(
/*#__PURE__*/
trickle(_partial.elems, fromRejectedOrNull));
var arrayIdTrickle =
/*#__PURE__*/
(0, _partial.rewrite)(
/*#__PURE__*/
trickle(_partial.elems, fromRejected));
var propsTrickle =
/*#__PURE__*/
(0, _partial.rewrite)(
/*#__PURE__*/
trickle(_partial.values, fromRejected)); //

function toError(errors) {
  var error = Error(JSON.stringify(errors, null, 2));
  error.errors = errors;
  return error;
}

function raise(errors) {
  throw toError(errors);
}

var raiseRejected = function raiseRejected(r) {
  return isRejected(r) ? raise(toError(value(r))) : r;
}; //


var getEither = function getEither(k, r, x) {
  return r = (0, _partial.get)(k, r), undefined !== r ? r : (0, _partial.get)(k, x);
};

var sumRight = function sumRight(zero$$1, one, plus) {
  return copyName(function () {
    var n = arguments.length;
    var r = zero$$1;

    if (n) {
      r = one(arguments[--n], r);

      while (n) {
        r = plus(arguments[--n], r);
      }
    }

    return r;
  }, plus);
}; //


var toRule = function toRule(rule) {
  if ((0, _infestines.isFunction)(rule)) {
    return length(rule) < 3 ? where(rule) : rule;
  } else {
    var error = rule[1];
    return (0, _infestines.isFunction)(error) ? modifyError(error, rule[0]) : setError(error, rule[0]);
  }
};

var toRules =
/*#__PURE__*/
(0, _partial.modify)(_partial.elems, toRule); //

var andCompose = function andCompose(p, o$$1) {
  return (0, _partial.ifElse)(p, compose(o$$1), reject);
};

var compose =
/*#__PURE__*/
o(_partial.toFunction, toRules); //

var tupleOr = function tupleOr(_ref) {
  var less = _ref.less,
      rest = _ref.rest;
  return rest = toRule(rest), function tupleOr() {
    var n = arguments.length;
    var rules = Array(n);

    for (var i = 0; i < n; ++i) {
      rules[i] = toRule(arguments[i]);
    }

    return andCompose(less ? _infestines.isArray : both(_infestines.isArray, o(lte(n), length)), [arrayIxTrickle, less ? function (xs, i, M, xi2yM) {
      var m = length(xs);

      if (m < n) {
        xs = xs.slice();
        xs.length = n;
        return M.map(function (ys) {
          return (0, _partial.any)(isRejected, _partial.elems, ys) ? ys : ys.slice(0, m);
        }, (0, _partial.elemsTotal)(xs, i, M, xi2yM));
      } else {
        return (0, _partial.elemsTotal)(xs, i, M, xi2yM);
      }
    } : _partial.elemsTotal, (0, _partial.choose)(function (_, i) {
      return rules[i] || rest;
    })]);
  };
};

var runWith = function runWith(Monad, onAccept, onReject) {
  return run({
    Monad: Monad,
    onAccept: onAccept,
    onReject: onReject
  });
}; //


var unique = {};
var raised = unique;

function rejectRaisedOr(M, x) {
  var r = raised;
  if (r === unique) r = x;else raised = unique;
  return M.of(rejected(r));
}

var protect = function protect(predicate, orElse) {
  return function (x, i) {
    try {
      return predicate(x, i);
    } catch (e) {
      raised = e;
      return orElse;
    }
  };
}; // Primitive


var accept = _partial.zero;

var acceptAs = function acceptAs(value) {
  return function acceptAs(x, i, M, xi2yM) {
    return xi2yM(value, i);
  };
};

var acceptWith = function acceptWith(fn) {
  return function (x, i, M, xi2yM) {
    return M.chain(function (x) {
      return xi2yM(x, i);
    }, fn(x, i));
  };
};

var rejectWith = function rejectWith(fn) {
  return function rejectWith(x, i, M, _xi2yM) {
    return M.map(rejected, fn(x, i));
  };
};

var rejectAs =
/*#__PURE__*/
o(_partial.setOp, rejected);
var reject =
/*#__PURE__*/
(0, _partial.modifyOp)(rejected);
var remove =
/*#__PURE__*/
acceptAs(undefined); //

var ruleBinOp = function ruleBinOp(op) {
  return (0, _infestines.curryN)(2, copyName(function (l) {
    return l = toRule(l), function (r) {
      return r = toRule(r), op(l, r);
    };
  }, op));
}; //


var upgradesCase = function upgradesCase(revalidate) {
  return function (c) {
    return length(c) === 3 ? [c[0], both$1(modifyAfter(c[1], c[2]), revalidate)] : c;
  };
}; // General


var run =
/*#__PURE__*/
(0, _infestines.curryN)(3, function run(c) {
  var M = c.Monad || _partial.Identity;
  var onAccept = c.onAccept || _infestines.id;
  var onReject = c.onReject || raise;

  var handler = function handler(r) {
    return isRejected(r) ? onReject(value(r)) : onAccept(r);
  };

  return function run(rule) {
    rule = toRule(rule);
    return function run(data) {
      return M.chain(handler, (0, _partial.traverse)(M, _infestines.id, rule, data));
    };
  };
}); // Synchronous

var accepts =
/*#__PURE__*/
runWith(0,
/*#__PURE__*/
(0, _infestines.always)(true),
/*#__PURE__*/
(0, _infestines.always)(false));
var errors =
/*#__PURE__*/
runWith(0, ignore, _infestines.id);
var validate =
/*#__PURE__*/
runWith(); // Asynchronous

var acceptsAsync =
/*#__PURE__*/
runWith(_partial.IdentityAsync,
/*#__PURE__*/
(0, _infestines.always)(
/*#__PURE__*/
returnAsync(true)),
/*#__PURE__*/
(0, _infestines.always)(
/*#__PURE__*/
returnAsync(false)));
var errorsAsync =
/*#__PURE__*/
runWith(_partial.IdentityAsync,
/*#__PURE__*/
(0, _infestines.always)(
/*#__PURE__*/
returnAsync()), returnAsync);
var tryValidateAsyncNow =
/*#__PURE__*/
runWith(_partial.IdentityAsync, 0,
/*#__PURE__*/
o(raise, toError));
var validateAsync =
/*#__PURE__*/
runWith(_partial.IdentityAsync, returnAsync,
/*#__PURE__*/
o(throwAsync, toError)); // Predicates

var where = function where(predicate) {
  return predicate = protect(predicate), function (x, i, M, _xi2yM) {
    return M.chain(function (b) {
      return b ? M.of(x) : rejectRaisedOr(M, x);
    }, predicate(x, i));
  };
}; // Elaboration


var modifyError =
/*#__PURE__*/
(0, _infestines.curry)(function modifyError(fn, rule) {
  rule = toRule(rule);
  return function modifyError(x, i, M, xi2yM) {
    return M.chain(function (r) {
      return isRejected(r) ? M.map(rejected, fn(x, value(r), i)) : M.of(r);
    }, rule(x, i, M, xi2yM));
  };
});
var setError =
/*#__PURE__*/
(0, _infestines.curry)(function setError(error, rule) {
  return compose([(0, _partial.rewrite)(function (r) {
    return isRejected(r) ? rejected(error) : r;
  }), rule]);
}); // Ad-hoc

var modifyAfter =
/*#__PURE__*/
(0, _infestines.curryN)(2, function modifyAfter(rule) {
  return o(both$1(rule), acceptWith);
});
var setAfter =
/*#__PURE__*/
(0, _infestines.curryN)(2, function setAfter(rule) {
  return o(both$1(rule), acceptAs);
});

var removeAfter = function removeAfter(rule) {
  return both$1(rule, remove);
}; // Logical


var both$1 =
/*#__PURE__*/
ruleBinOp(function both$$1(rule, rest) {
  return function both$$1(x, i, M, xi2yM) {
    return M.chain(function (r) {
      return isRejected(r) ? M.of(r) : rest(r, i, M, xi2yM);
    }, rule(x, i, M, xi2yM));
  };
});
var and =
/*#__PURE__*/
sumRight(accept, toRule, both$1);

var not = function not(rule) {
  return compose([(0, _partial.setter)(function (r, x) {
    return isRejected(r) ? x : rejected(x);
  }), rule]);
};

var either =
/*#__PURE__*/
ruleBinOp(function either(rule, rest) {
  return function either(x, i, M, xi2yM) {
    return M.chain(function (r) {
      return isRejected(r) ? rest(x, i, M, xi2yM) : M.of(r);
    }, rule(x, i, M, xi2yM));
  };
});
var or =
/*#__PURE__*/
sumRight(reject, toRule, either); // Uniform

var arrayId = function arrayId(rule) {
  return andCompose(_infestines.isArray, [arrayIdTrickle, _partial.elems, rule]);
};

var arrayIx = function arrayIx(rule) {
  return andCompose(_infestines.isArray, [arrayIxTrickle, _partial.elems, rule]);
}; // Varying


var args =
/*#__PURE__*/
tupleOr({
  less: true,
  rest: accept
});
var tuple =
/*#__PURE__*/
tupleOr({
  less: false,
  rest: reject
}); // Functions

var dependentFn =
/*#__PURE__*/
(0, _infestines.curry)(function dependentFn(argsRule, toResRule) {
  argsRule = toRule(argsRule);
  return function (fn, i, M, _xi2yM) {
    return M.of((0, _infestines.isFunction)(fn) ? copyName(function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return M.chain(function (args) {
        return isRejected(args) ? raise(toError(value(args))) : M.chain(function (res) {
          return M.map(raiseRejected, (0, _partial.traverse)(M, _infestines.id, toRule(toResRule.apply(null, args)), res));
        }, fn.apply(null, args));
      }, (0, _partial.traverse)(M, _infestines.id, argsRule, args));
    }, fn) : rejected(fn));
  };
});
var freeFn =
/*#__PURE__*/
(0, _infestines.curry)(function freeFn(argsRule, resRule) {
  return dependentFn(argsRule, (0, _infestines.always)(resRule));
}); // Objects

var keep =
/*#__PURE__*/
(0, _infestines.curry)(function keep(key, rule) {
  return andCompose(isInstanceOfObject, [(0, _partial.setter)(function (r, x) {
    return isRejected(r) ? rejected((0, _partial.set)(key, getEither(key, value(r), x), value(r))) : r;
  }), rule]);
});

var optional$1 = function optional$$1(rule) {
  return compose([_partial.optional, rule]);
};

var propsOr =
/*#__PURE__*/
(0, _infestines.curry)(function propsOr(onOthers, template) {
  return andCompose(isInstanceOfObject, [propsTrickle, (0, _partial.branchOr)(toRule(onOthers), (0, _partial.modify)(_partial.values, toRule, template))]);
});
var props =
/*#__PURE__*/
propsOr(reject); // Dependent

var choose$1 = function choose$$1(xi2r) {
  return xi2r = protect(xi2r), copyName(function (x, i, M, xi2yM) {
    var r = xi2r(x, i);
    return r ? toRule(r)(x, i, M, xi2yM) : rejectRaisedOr(M, x);
  }, xi2r);
}; // Conditional


var cases =
/*#__PURE__*/
sumRight(reject, function (alt, rest) {
  return length(alt) === 1 ? alt[0] : ifElse$1(alt[0], alt[1], rest);
}, function cases(alt, rest) {
  return ifElse$1(alt[0], alt[1], rest);
});
var ifElse$1 =
/*#__PURE__*/
(0, _infestines.curry)(function ifElse$$1(p, c, a) {
  p = protect(p);
  c = toRule(c);
  a = toRule(a);
  return function ifElse$$1(x, i, M, xi2yM) {
    var b = p(x, i);
    return b ? c(x, i, M, xi2yM) : undefined !== b || raised === unique ? a(x, i, M, xi2yM) : rejectRaisedOr(M, x);
  };
});

function casesOf(of) {
  of = (0, _partial.toFunction)(of);
  var n = arguments.length - 1;
  if (!n) return reject;
  var def = arguments[n];

  if (def.length === 1) {
    --n;
    def = toRule(def[0]);
  } else {
    def = reject;
  }

  var ps = Array(n);
  var os = Array(n + 1);

  for (var i = 0; i < n; ++i) {
    var c = arguments[i + 1];
    ps[i] = protect(c[0]);
    os[i] = toRule(c[1]);
  }

  os[n] = def;
  return function casesOf(x, i, M, xi2yM) {
    var min = n;
    var r = of(x, i, _partial.Select, function (y, j) {
      for (var _i = 0; _i < min; ++_i) {
        var b = ps[_i](y, j);

        if (b) {
          min = _i;
          if (_i === 0) return 0;else break;
        } else if (undefined === b && raised !== unique) {
          var _r = raised;
          raised = unique;
          return M.of(rejected(_r));
        }
      }
    });
    return r ? r : os[min](x, i, M, xi2yM);
  };
} // Recursive


var lazy$1 =
/*#__PURE__*/
o(_partial.lazy,
/*#__PURE__*/
o(toRule)); // Promotion

var promote = function promote() {
  for (var _len2 = arguments.length, cs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    cs[_key2] = arguments[_key2];
  }

  return lazy$1(function (rec) {
    return or.apply(null, cs.map(function (c) {
      return length(c) === 2 ? both$1(modifyAfter(c[0], c[1]), rec) : c[0];
    }));
  });
};

var upgrades = function upgrades() {
  for (var _len3 = arguments.length, cs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    cs[_key3] = arguments[_key3];
  }

  return lazy$1(function (rec) {
    return cases.apply(null, cs.map(upgradesCase(rec)));
  });
};

var upgradesOf = function upgradesOf(of) {
  for (var _len4 = arguments.length, cs = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    cs[_key4 - 1] = arguments[_key4];
  }

  return lazy$1(function (rec) {
    return casesOf.apply(null, [of].concat(cs.map(upgradesCase(rec))));
  });
}; // Contract helpers


var any$1 = accept;

var thenable = function thenable(t) {
  return modifyAfter(isThenable, function (p) {
    return p.then(validate(t));
  });
};

var monad =
/*#__PURE__*/
propsOr(accept, {
  map: _infestines.isFunction,
  ap: _infestines.isFunction,
  of: _infestines.isFunction,
  chain: _infestines.isFunction
});
var fn = [_infestines.isFunction, function (x) {
  return 'Expected function, but got ' + x;
}];

var fnMaxN = function fnMaxN(n) {
  return and(fn, [o(gte(n), length), function (x) {
    return 'Expected function of max arity ' + n + ', but got arity ' + length(x);
  }]);
};

var fnN = function fnN(n) {
  return and(fn, [o(identical(n), length), function (x) {
    return 'Expected function of arity ' + n + ', but got arity ' + length(x);
  }]);
};

var runCallback =
/*#__PURE__*/
fnMaxN(1);
var predicateFn =
/*#__PURE__*/
fnMaxN(2);
var transformFn =
/*#__PURE__*/
fnMaxN(2);
var errorTransformFn =
/*#__PURE__*/
fnMaxN(3);
var opticFn =
/*#__PURE__*/
fnN(4);
var rule =
/*#__PURE__*/
lazy$1(function (rule) {
  return or(predicateFn, opticFn, tuple(rule, accept));
});
var traversal =
/*#__PURE__*/
lazy$1(function (traversal) {
  return or(_infestines.isString, _infestines.isNumber, transformFn, opticFn, arrayIx(traversal));
});

var tagError = function tagError(tag, rule) {
  return modifyError(function (_, e) {
    return [tag, e];
  }, rule);
};

var tagArgs = function tagArgs(name, rule) {
  return tagError('partial.lenses.validation: `' + name + '` given invalid arguments', rule);
};

var curriedFn = function curriedFn(name, ps, r) {
  return choose$1(function (fn) {
    return modifyAfter(freeFn(tagArgs(name, tuple.apply(null, ps)), r), function (f) {
      return (0, _infestines.arityN)(length(fn), f);
    });
  });
};

var fml = function fml(firsts, middle, lasts) {
  return choose$1(function (xs) {
    return arrayIx(casesOf.apply(null, [_infestines.sndU].concat(firsts.map(function (rule, i) {
      return [identical(i), rule];
    }), lasts.map(function (rule, i) {
      return [identical(length(xs) - length(lasts) + i), rule];
    }), [[middle]])));
  });
};

var variadicFn1 = function variadicFn1(fn) {
  return copyName(function (x) {
    for (var _len = arguments.length, xs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      xs[_key - 1] = arguments[_key];
    }

    return fn.apply(undefined, [x].concat(xs));
  }, fn);
};

var caseR =
/*#__PURE__*/
tuple(rule);
var casePR =
/*#__PURE__*/
tuple(predicateFn, rule);
var caseRT =
/*#__PURE__*/
tuple(rule, transformFn);
var casePRT =
/*#__PURE__*/
tuple(predicateFn, rule, transformFn);
var caseR_casePR =
/*#__PURE__*/
or(caseR, casePR);
var caseR_caseRT =
/*#__PURE__*/
or(caseR, caseRT);
var casePR_casePRT =
/*#__PURE__*/
or(casePR, casePRT);
var C = "production" === 'production' ? function (x) {
  return x;
} : function (x, c) {
  return validate(c, x);
}; // Primitive

var accept$1 =
/*#__PURE__*/
C(accept, rule);
exports.accept = accept$1;
var acceptAs$1 =
/*#__PURE__*/
C(acceptAs,
/*#__PURE__*/
curriedFn('acceptAs', [any$1], rule));
exports.acceptAs = acceptAs$1;
var acceptWith$1 =
/*#__PURE__*/
C(acceptWith,
/*#__PURE__*/
curriedFn('acceptWith', [transformFn], rule));
exports.acceptWith = acceptWith$1;
var rejectWith$1 =
/*#__PURE__*/
C(rejectWith,
/*#__PURE__*/
curriedFn('rejectWith', [transformFn], rule));
exports.rejectWith = rejectWith$1;
var rejectAs$1 =
/*#__PURE__*/
C(rejectAs,
/*#__PURE__*/
curriedFn('rejectAs', [any$1], rule));
exports.rejectAs = rejectAs$1;
var reject$1 =
/*#__PURE__*/
C(reject, rule);
exports.reject = reject$1;
var remove$1 =
/*#__PURE__*/
C(remove, rule); // General

exports.remove = remove$1;
var run$1 =
/*#__PURE__*/
C(run,
/*#__PURE__*/
curriedFn('run', [
/*#__PURE__*/
props({
  monad:
  /*#__PURE__*/
  optional$1(monad),
  onAccept:
  /*#__PURE__*/
  optional$1(runCallback),
  onReject:
  /*#__PURE__*/
  optional$1(runCallback)
}), rule, any$1], any$1)); // Synchronous

exports.run = run$1;
var accepts$1 =
/*#__PURE__*/
C(accepts,
/*#__PURE__*/
curriedFn('accepts', [rule, any$1], isBoolean));
exports.accepts = accepts$1;
var errors$1 =
/*#__PURE__*/
C(errors,
/*#__PURE__*/
curriedFn('errors', [rule, any$1], any$1));
exports.errors = errors$1;
var validate$1 =
/*#__PURE__*/
C(validate,
/*#__PURE__*/
curriedFn('validate', [rule, any$1], any$1)); // Asynchronous

exports.validate = validate$1;
var acceptsAsync$1 =
/*#__PURE__*/
C(acceptsAsync,
/*#__PURE__*/
curriedFn('acceptsAsync', [rule, any$1],
/*#__PURE__*/
thenable(isBoolean)));
exports.acceptsAsync = acceptsAsync$1;
var errorsAsync$1 =
/*#__PURE__*/
C(errorsAsync,
/*#__PURE__*/
curriedFn('errorsAsync', [rule, any$1], isThenable));
exports.errorsAsync = errorsAsync$1;
var tryValidateAsyncNow$1 =
/*#__PURE__*/
C(tryValidateAsyncNow,
/*#__PURE__*/
curriedFn('tryValidateAsyncNow', [rule, any$1], any$1));
exports.tryValidateAsyncNow = tryValidateAsyncNow$1;
var validateAsync$1 =
/*#__PURE__*/
C(validateAsync,
/*#__PURE__*/
curriedFn('validateAsync', [rule, any$1], isThenable)); // Predicates

exports.validateAsync = validateAsync$1;
var where$1 =
/*#__PURE__*/
C(where,
/*#__PURE__*/
curriedFn('where', [predicateFn], rule)); // Elaboration

exports.where = where$1;
var modifyError$1 =
/*#__PURE__*/
C(modifyError,
/*#__PURE__*/
curriedFn('modifyError', [errorTransformFn, rule], rule));
exports.modifyError = modifyError$1;
var setError$1 =
/*#__PURE__*/
C(setError,
/*#__PURE__*/
curriedFn('setError', [any$1, rule], rule)); // Ad-hoc

exports.setError = setError$1;
var modifyAfter$1 =
/*#__PURE__*/
C(modifyAfter,
/*#__PURE__*/
curriedFn('modifyAfter', [rule, transformFn], rule));
exports.modifyAfter = modifyAfter$1;
var setAfter$1 =
/*#__PURE__*/
C(setAfter,
/*#__PURE__*/
curriedFn('setAfter', [rule, any$1], rule));
exports.setAfter = setAfter$1;
var removeAfter$1 =
/*#__PURE__*/
C(removeAfter, rule); // Logical

exports.removeAfter = removeAfter$1;
var both$2 =
/*#__PURE__*/
C(both$1,
/*#__PURE__*/
curriedFn('both', [rule, rule], rule));
exports.both = both$2;
var and$1 =
/*#__PURE__*/
C(and,
/*#__PURE__*/
freeFn(
/*#__PURE__*/
tagArgs('and',
/*#__PURE__*/
arrayIx(rule)), rule));
exports.and = and$1;
var not$1 =
/*#__PURE__*/
C(not,
/*#__PURE__*/
curriedFn('not', [rule], rule));
exports.not = not$1;
var either$1 =
/*#__PURE__*/
C(either,
/*#__PURE__*/
curriedFn('either', [rule, rule], rule));
exports.either = either$1;
var or$1 =
/*#__PURE__*/
C(or,
/*#__PURE__*/
freeFn(
/*#__PURE__*/
tagArgs('or',
/*#__PURE__*/
arrayIx(rule)), rule)); // Uniform

exports.or = or$1;
var arrayId$1 =
/*#__PURE__*/
C(arrayId,
/*#__PURE__*/
curriedFn('arrayId', [rule], rule));
exports.arrayId = arrayId$1;
var arrayIx$1 =
/*#__PURE__*/
C(arrayIx,
/*#__PURE__*/
curriedFn('arrayIx', [rule], rule)); // Varying

exports.arrayIx = arrayIx$1;
var args$1 =
/*#__PURE__*/
C(args,
/*#__PURE__*/
freeFn(
/*#__PURE__*/
tagArgs('args',
/*#__PURE__*/
arrayIx(rule)), rule));
exports.args = args$1;
var tuple$1 =
/*#__PURE__*/
C(tuple,
/*#__PURE__*/
freeFn(
/*#__PURE__*/
tagArgs('tuple',
/*#__PURE__*/
arrayIx(rule)), rule)); // Functions

exports.tuple = tuple$1;
var dependentFn$1 =
/*#__PURE__*/
C(dependentFn,
/*#__PURE__*/
curriedFn('dependentFn', [rule,
/*#__PURE__*/
freeFn(
/*#__PURE__*/
arrayIx(any$1), rule)], rule));
exports.dependentFn = dependentFn$1;
var freeFn$1 =
/*#__PURE__*/
C(freeFn,
/*#__PURE__*/
curriedFn('freeFn', [rule, rule], rule)); // Objects

exports.freeFn = freeFn$1;
var keep$1 =
/*#__PURE__*/
C(keep,
/*#__PURE__*/
curriedFn('keep', [_infestines.isString, rule], rule));
exports.keep = keep$1;
var optional$2 =
/*#__PURE__*/
C(optional$1,
/*#__PURE__*/
curriedFn('optional', [rule], rule));
exports.optional = optional$2;
var propsOr$1 =
/*#__PURE__*/
C(propsOr,
/*#__PURE__*/
curriedFn('propsOr', [rule,
/*#__PURE__*/
propsOr(rule, {})], rule));
exports.propsOr = propsOr$1;
var props$1 =
/*#__PURE__*/
C(props,
/*#__PURE__*/
curriedFn('props', [
/*#__PURE__*/
propsOr(rule, {})], rule)); // Dependent

exports.props = props$1;
var choose$2 =
/*#__PURE__*/
C(choose$1,
/*#__PURE__*/
curriedFn('choose', [
/*#__PURE__*/
freeFn(
/*#__PURE__*/
tuple(any$1, any$1), rule)], rule)); // Conditional

exports.choose = choose$2;
var cases$1 =
/*#__PURE__*/
C(cases,
/*#__PURE__*/
freeFn(
/*#__PURE__*/
tagArgs('cases',
/*#__PURE__*/
fml([], casePR, [caseR_casePR])), rule));
exports.cases = cases$1;
var ifElse$2 =
/*#__PURE__*/
C(ifElse$1,
/*#__PURE__*/
curriedFn('ifElse', [predicateFn, rule, rule], rule));
exports.ifElse = ifElse$2;
var casesOf$1 =
/*#__PURE__*/
C(casesOf,
/*#__PURE__*/
modifyAfter(
/*#__PURE__*/
freeFn(
/*#__PURE__*/
tagArgs('casesOf',
/*#__PURE__*/
fml([traversal], casePR, [caseR_casePR])), rule), variadicFn1)); // Recursive

exports.casesOf = casesOf$1;
var lazy$2 =
/*#__PURE__*/
C(lazy$1,
/*#__PURE__*/
curriedFn('lazy', [
/*#__PURE__*/
freeFn(
/*#__PURE__*/
tuple$1(rule), rule)], rule)); // Promotion

exports.lazy = lazy$2;
var promote$1 =
/*#__PURE__*/
C(promote,
/*#__PURE__*/
freeFn(
/*#__PURE__*/
tagArgs('promote',
/*#__PURE__*/
arrayIx(caseR_caseRT)), rule));
exports.promote = promote$1;
var upgrades$1 =
/*#__PURE__*/
C(upgrades,
/*#__PURE__*/
freeFn(
/*#__PURE__*/
tagArgs('upgrades',
/*#__PURE__*/
fml([], casePR_casePRT, [caseR_casePR])), rule));
exports.upgrades = upgrades$1;
var upgradesOf$1 =
/*#__PURE__*/
C(upgradesOf,
/*#__PURE__*/
modifyAfter(
/*#__PURE__*/
freeFn(
/*#__PURE__*/
tagArgs('upgradesOf',
/*#__PURE__*/
fml([traversal], casePR_casePRT, [caseR_casePR])), rule), variadicFn1));
exports.upgradesOf = upgradesOf$1;
},{"infestines":"KCN3","partial.lenses":"/gqh"}],"2fpi":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indent = exports.hang = exports.align = exports.nesting = exports.column = exports.nest = exports.group = exports.choice = exports.squotes = exports.spaces = exports.parens = exports.lines = exports.lineBreaks = exports.dquotes = exports.brackets = exports.braces = exports.angles = exports.enclose = exports.lazy = exports.punctuate = exports.intersperse = exports.prepend = exports.append = exports.softBreak = exports.softLine = exports.lineBreak = exports.line = exports.renderWith = exports.render = void 0;

var _infestines = require("infestines");

var _partialLenses = require("partial.lenses.validation");

var length = function length(x) {
  return x.length;
};

var reduceRight =
/*#__PURE__*/
(0, _infestines.curry)(function (fn, z, xs) {
  return xs.reduceRight(fn, z);
});
var repeat =
/*#__PURE__*/
(0, _infestines.curry)(function (n, s) {
  return s.repeat(n);
});
var identical =
/*#__PURE__*/
(0, _infestines.curry)(_infestines.identicalU);
var test =
/*#__PURE__*/
(0, _infestines.curry)(function (re, s) {
  return (0, _infestines.isString)(s) && re.test(s);
});

var fn = function fn(args$$1, res) {
  return (0, _partialLenses.freeFn)(_partialLenses.args.apply(null, args$$1), res);
};

var sq = function sq(t) {
  return (0, _partialLenses.tuple)(t, t);
};

var padding = function padding(n) {
  return (0, _infestines.isString)(n) ? n : repeat(n, ' ');
};

var Delay = function lazy$$1(thunk) {
  return {
    c: 0,
    v: thunk
  };
};

var Eager = function Eager(value) {
  return {
    c: 1,
    v: value
  };
};

function force(x) {
  if (x.c !== 0) return x.v;
  var th = x.v;
  x.v = undefined;
  x.c = 1;
  return x.v = th();
}

var Nest = function nest(prefix, doc) {
  return {
    c: 3,
    p: prefix,
    d: doc
  };
};

var Choice = function Choice(wide, narrow) {
  return {
    c: 5,
    w: wide,
    n: narrow
  };
};

var With = function With(fn) {
  return {
    c: 6,
    f: fn
  };
};

var conOf = function conOf(doc) {
  return typeof doc === 'object' ? (0, _infestines.isArray)(doc) ? 2 : doc.c : 4;
};

function flatten(doc) {
  switch (conOf(doc)) {
    case 0:
      return Delay(function () {
        return flatten(force(doc));
      });

    case 1:
      return flatten(doc.v);

    case 2:
      {
        var loop = function loop(i) {
          switch (length(doc) - i) {
            case 0:
              return '';

            case 1:
              return flatten(doc[i]);

            default:
              return [flatten(doc[i]), Delay(function () {
                return loop(i + 1);
              })];
          }
        };

        return loop(0);
      }

    case 3:
      return Nest(doc.p, flatten(doc.d));

    case 4:
      switch (doc) {
        case '\n':
          return ' ';

        case '\r':
          return '';

        default:
          return doc;
      }

    case 5:
      return doc.w;

    default:
      return With((0, _infestines.pipe2U)(doc.f, flatten));
  }
}

var Nil = [0];

var Linefeed = function Linefeed(prefix, rest) {
  return [1, prefix, rest];
};

var Print = function Print(text, rest) {
  return [2, text, rest];
};

function output(_ref, state, print) {
  var text = _ref.text,
      line = _ref.line;

  for (;;) {
    print = force(print);

    switch (print[0]) {
      case 0:
        return state;

      case 1:
        state = text(line(state), print[1]);
        print = print[2];
        break;

      default:
        state = text(state, print[1]);
        print = print[2];
        break;
    }
  }
}

function fits(maxCols, usedCols, print) {
  for (;;) {
    if (maxCols < usedCols) return false;
    print = force(print);

    if (print[0] < 2) {
      return true;
    } else {
      usedCols += length(print[1]);
      print = print[2];
    }
  }
}

var layoutDelay = function layoutDelay(maxCols, usedCols, docs) {
  return Delay(function () {
    return layout(maxCols, usedCols, docs);
  });
};

function layout(maxCols, usedCols, docs) {
  if (undefined === docs) return Nil;
  var prefix = docs[0];
  var doc = docs[1];
  var rest = docs[2];

  switch (conOf(doc)) {
    case 0:
      return layout(maxCols, usedCols, [prefix, force(doc), rest]);

    case 1:
      return layout(maxCols, usedCols, [prefix, doc.v, rest]);

    case 2:
      return layout(maxCols, usedCols, reduceRight(function (rest, doc) {
        return [prefix, doc, rest];
      }, rest, doc));

    case 3:
      return layout(maxCols, usedCols, [prefix + padding(doc.p), doc.d, rest]);

    case 4:
      switch (doc) {
        case '\n':
        case '\r':
          return Linefeed(prefix, layoutDelay(maxCols, length(prefix), rest));

        case '':
          return layout(maxCols, usedCols, rest);

        default:
          return Print(doc, layoutDelay(maxCols, usedCols + length(doc), rest));
      }

    case 5:
      {
        var wide = layout(maxCols, usedCols, [prefix, doc.w, rest]);
        return !maxCols || fits(maxCols, usedCols, Eager(wide)) ? wide : layout(maxCols, usedCols, [prefix, doc.n, rest]);
      }

    default:
      return layout(maxCols, usedCols, [prefix, doc.f(usedCols, prefix), rest]);
  }
} //


var line = '\n';
var lineBreak = '\r';
var softLine =
/*#__PURE__*/
Choice(' ', line);
var softBreak =
/*#__PURE__*/
Choice('', lineBreak); //

var prepend =
/*#__PURE__*/
(0, _infestines.curry)(function prepend(lhs, rhs) {
  return [lhs, rhs];
});
var append =
/*#__PURE__*/
(0, _infestines.curry)(function append(rhs, lhs) {
  return [lhs, rhs];
}); //

var intersperse =
/*#__PURE__*/
(0, _infestines.curry)(function intersperse(sep, docs) {
  var result = [];
  var n = length(docs);
  if (n) result.push(docs[0]);

  for (var i = 1; i < n; ++i) {
    result.push(sep, docs[i]);
  }

  return result;
});
var punctuate =
/*#__PURE__*/
(0, _infestines.curry)(function punctuate(sep, docs) {
  var r = [];
  var n = length(docs);
  var nm1 = n - 1;

  for (var i = 0; i < nm1; ++i) {
    r.push([docs[i], sep]);
  }

  if (n) r.push(docs[nm1]);
  return r;
}); //

var lazy$1 = Delay; //

var pair = function pair(l, r) {
  return (0, _infestines.freeze)([l, r]);
};

var sq$1 = function sq(d) {
  return pair(d, d);
};

var angles =
/*#__PURE__*/
pair('<', '>');
var braces =
/*#__PURE__*/
pair('{', '}');
var brackets =
/*#__PURE__*/
pair('[', ']');
var dquotes =
/*#__PURE__*/
sq$1('"');
var lineBreaks =
/*#__PURE__*/
sq$1(lineBreak);
var lines =
/*#__PURE__*/
sq$1(line);
var parens =
/*#__PURE__*/
pair('(', ')');
var spaces =
/*#__PURE__*/
sq$1(' ');
var squotes =
/*#__PURE__*/
sq$1("'");
var enclose =
/*#__PURE__*/
(0, _infestines.curry)(function enclose(pair, doc) {
  return [pair[0], doc, pair[1]];
}); //

var choice =
/*#__PURE__*/
(0, _infestines.curry)(function choice(wide, narrow) {
  return Choice(flatten(wide), narrow);
});

var group = function group(doc) {
  return choice(doc, doc);
}; //


var nest =
/*#__PURE__*/
(0, _infestines.curry)(Nest); //

var column = function column(withColumn) {
  return With(function column(column) {
    return withColumn(column);
  });
};

var nesting = function nesting(withNesting) {
  return With(function nesting(_, prefix) {
    return withNesting(length(prefix));
  });
};

var align = function align(doc) {
  return With(function align(column, prefix) {
    return Nest(column - length(prefix), doc);
  });
};

var hang =
/*#__PURE__*/
(0, _infestines.curry)(function hang(indent, doc) {
  return align(Nest(indent, doc));
});
var indent =
/*#__PURE__*/
(0, _infestines.curry)(function indent(prefix, doc) {
  return hang(prefix, [padding(prefix), doc]);
}); //

var renderWith =
/*#__PURE__*/
(0, _infestines.curry)(function renderWith(actions, zero, maxCols, doc) {
  return output(actions, zero, Eager(layout(maxCols, 0, ['', doc, undefined])));
});
var render =
/*#__PURE__*/
renderWith({
  line: function line(result) {
    return result + '\n';
  },
  text: function text(result, _text) {
    return result + _text;
  }
}, '');
var doc =
/*#__PURE__*/
(0, _partialLenses.lazy)(function (doc) {
  return (0, _partialLenses.cases)([_infestines.isString, test(/^([\n\r]|[^\n\r]*)$/)], [_infestines.isArray, (0, _partialLenses.arrayIx)(doc)], [(0, _partialLenses.or)((0, _partialLenses.props)({
    c: identical(0),
    v: _infestines.isFunction
  }), (0, _partialLenses.props)({
    c: identical(1),
    v: _partialLenses.accept
  }), (0, _partialLenses.props)({
    c: identical(3),
    p: (0, _partialLenses.or)(_infestines.isString, _infestines.isNumber),
    d: _partialLenses.accept
  }), (0, _partialLenses.props)({
    c: identical(5),
    w: _partialLenses.accept,
    n: _partialLenses.accept
  }), (0, _partialLenses.props)({
    c: identical(6),
    f: _infestines.isFunction
  }))]);
});
var C = "production" === 'production' ? function (x) {
  return x;
} : function (x, c) {
  var v = (0, _partialLenses.validate)(c, x);
  return (0, _infestines.isFunction)(x) ? (0, _infestines.arityN)(length(x), v) : v;
}; // Rendering documents

var render$1 =
/*#__PURE__*/
C(render,
/*#__PURE__*/
fn([_infestines.isNumber, doc], _infestines.isString));
exports.render = render$1;
var renderWith$1 =
/*#__PURE__*/
C(renderWith,
/*#__PURE__*/
fn([
/*#__PURE__*/
(0, _partialLenses.props)({
  text: _infestines.isFunction,
  line: _infestines.isFunction
}), _partialLenses.accept, _infestines.isNumber, doc], _partialLenses.accept)); // Document constants

exports.renderWith = renderWith$1;
var line$1 =
/*#__PURE__*/
C(line, doc);
exports.line = line$1;
var lineBreak$1 =
/*#__PURE__*/
C(lineBreak, doc);
exports.lineBreak = lineBreak$1;
var softLine$1 =
/*#__PURE__*/
C(softLine, doc);
exports.softLine = softLine$1;
var softBreak$1 =
/*#__PURE__*/
C(softBreak, doc); // Concatenating documents

exports.softBreak = softBreak$1;
var append$1 =
/*#__PURE__*/
C(append,
/*#__PURE__*/
fn([doc, doc], doc));
exports.append = append$1;
var prepend$1 =
/*#__PURE__*/
C(prepend,
/*#__PURE__*/
fn([doc, doc], doc)); // Lists of documents

exports.prepend = prepend$1;
var intersperse$1 =
/*#__PURE__*/
C(intersperse,
/*#__PURE__*/
fn([doc,
/*#__PURE__*/
(0, _partialLenses.arrayId)(doc)],
/*#__PURE__*/
(0, _partialLenses.arrayId)(doc)));
exports.intersperse = intersperse$1;
var punctuate$1 =
/*#__PURE__*/
C(punctuate,
/*#__PURE__*/
fn([doc,
/*#__PURE__*/
(0, _partialLenses.arrayId)(doc)],
/*#__PURE__*/
(0, _partialLenses.arrayId)(doc))); // Lazy documents

exports.punctuate = punctuate$1;
var lazy$2 =
/*#__PURE__*/
C(lazy$1,
/*#__PURE__*/
fn([
/*#__PURE__*/
fn([], doc)], doc)); // Enclosing documents

exports.lazy = lazy$2;
var enclose$1 =
/*#__PURE__*/
C(enclose,
/*#__PURE__*/
fn([
/*#__PURE__*/
sq(doc), doc], doc)); // Document pair constants

exports.enclose = enclose$1;
var angles$1 =
/*#__PURE__*/
C(angles,
/*#__PURE__*/
sq(doc));
exports.angles = angles$1;
var braces$1 =
/*#__PURE__*/
C(braces,
/*#__PURE__*/
sq(doc));
exports.braces = braces$1;
var brackets$1 =
/*#__PURE__*/
C(brackets,
/*#__PURE__*/
sq(doc));
exports.brackets = brackets$1;
var dquotes$1 =
/*#__PURE__*/
C(dquotes,
/*#__PURE__*/
sq(doc));
exports.dquotes = dquotes$1;
var lineBreaks$1 =
/*#__PURE__*/
C(lineBreaks,
/*#__PURE__*/
sq(doc));
exports.lineBreaks = lineBreaks$1;
var lines$1 =
/*#__PURE__*/
C(lines,
/*#__PURE__*/
sq(doc));
exports.lines = lines$1;
var parens$1 =
/*#__PURE__*/
C(parens,
/*#__PURE__*/
sq(doc));
exports.parens = parens$1;
var spaces$1 =
/*#__PURE__*/
C(spaces,
/*#__PURE__*/
sq(doc));
exports.spaces = spaces$1;
var squotes$1 =
/*#__PURE__*/
C(squotes,
/*#__PURE__*/
sq(doc)); // Alternative documents

exports.squotes = squotes$1;
var choice$1 =
/*#__PURE__*/
C(choice,
/*#__PURE__*/
fn([doc, doc], doc));
exports.choice = choice$1;
var group$1 =
/*#__PURE__*/
C(group,
/*#__PURE__*/
fn([doc], doc)); // Nested documents

exports.group = group$1;
var nest$1 =
/*#__PURE__*/
C(nest,
/*#__PURE__*/
fn([
/*#__PURE__*/
(0, _partialLenses.or)(_infestines.isString, _infestines.isNumber), doc], doc)); // Layout dependent documents

exports.nest = nest$1;
var column$1 =
/*#__PURE__*/
C(column,
/*#__PURE__*/
fn([
/*#__PURE__*/
fn([_infestines.isNumber], doc)], doc));
exports.column = column$1;
var nesting$1 =
/*#__PURE__*/
C(nesting,
/*#__PURE__*/
fn([
/*#__PURE__*/
fn([_infestines.isNumber], doc)], doc)); // Aligned documents

exports.nesting = nesting$1;
var align$1 =
/*#__PURE__*/
C(align,
/*#__PURE__*/
fn([doc], doc));
exports.align = align$1;
var hang$1 =
/*#__PURE__*/
C(hang,
/*#__PURE__*/
fn([
/*#__PURE__*/
(0, _partialLenses.or)(_infestines.isString, _infestines.isNumber), doc], doc));
exports.hang = hang$1;
var indent$1 =
/*#__PURE__*/
C(indent,
/*#__PURE__*/
fn([
/*#__PURE__*/
(0, _partialLenses.or)(_infestines.isString, _infestines.isNumber), doc], doc));
exports.indent = indent$1;
},{"infestines":"KCN3","partial.lenses.validation":"IKxj"}],"6hKA":[function(require,module,exports) {
var global = arguments[3];

/* **********************************************
     Begin prism-core.js
********************************************** */

var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(){

// Private helper vars
var lang = /\blang(?:uage)?-([\w-]+)\b/i;
var uniqueId = 0;

var _ = _self.Prism = {
	manual: _self.Prism && _self.Prism.manual,
	disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (_.util.type(tokens) === 'Array') {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},

		objId: function (obj) {
			if (!obj['__id']) {
				Object.defineProperty(obj, '__id', { value: ++uniqueId });
			}
			return obj['__id'];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function (o, visited) {
			var type = _.util.type(o);
			visited = visited || {};

			switch (type) {
				case 'Object':
					if (visited[_.util.objId(o)]) {
						return visited[_.util.objId(o)];
					}
					var clone = {};
					visited[_.util.objId(o)] = clone;

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key], visited);
						}
					}

					return clone;

				case 'Array':
					if (visited[_.util.objId(o)]) {
						return visited[_.util.objId(o)];
					}
					var clone = [];
					visited[_.util.objId(o)] = clone;

					o.forEach(function (v, i) {
						clone[i] = _.util.clone(v, visited);
					});

					return clone;
			}

			return o;
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		/**
		 * Insert a token before another token in a language literal
		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
		 * we cannot just provide an object, we need anobject and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before. If not provided, the function appends instead.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];

			if (arguments.length == 2) {
				insert = arguments[1];

				for (var newToken in insert) {
					if (insert.hasOwnProperty(newToken)) {
						grammar[newToken] = insert[newToken];
					}
				}

				return grammar;
			}

			var ret = {};

			for (var token in grammar) {

				if (grammar.hasOwnProperty(token)) {

					if (token == before) {

						for (var newToken in insert) {

							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					ret[token] = grammar[token];
				}
			}

			// Update references in other language definitions
			_.languages.DFS(_.languages, function(key, value) {
				if (value === root[inside] && key != inside) {
					this[key] = ret;
				}
			});

			return root[inside] = ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function(o, callback, type, visited) {
			visited = visited || {};
			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, null, visited);
					}
					else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, i, visited);
					}
				}
			}
		}
	},
	plugins: {},

	highlightAll: function(async, callback) {
		_.highlightAllUnder(document, async, callback);
	},

	highlightAllUnder: function(container, async, callback) {
		var env = {
			callback: callback,
			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
		};

		_.hooks.run("before-highlightall", env);

		var elements = env.elements || container.querySelectorAll(env.selector);

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, env.callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,''])[1].toLowerCase();
			grammar = _.languages[language];
		}

		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

		if (element.parentNode) {
			// Set language on the parent, for styling
			parent = element.parentNode;

			if (/pre/i.test(parent.nodeName)) {
				parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
			}
		}

		var code = element.textContent;

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		_.hooks.run('before-sanity-check', env);

		if (!env.code || !env.grammar) {
			if (env.code) {
				_.hooks.run('before-highlight', env);
				env.element.textContent = env.code;
				_.hooks.run('after-highlight', env);
			}
			_.hooks.run('complete', env);
			return;
		}

		_.hooks.run('before-highlight', env);

		if (async && _self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				env.highlightedCode = evt.data;

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(env.element);
				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code,
				immediateClose: true
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			callback && callback.call(element);

			_.hooks.run('after-highlight', env);
			_.hooks.run('complete', env);
		}
	},

	highlight: function (text, grammar, language) {
		var env = {
			code: text,
			grammar: grammar,
			language: language
		};
		_.hooks.run('before-tokenize', env);
		env.tokens = _.tokenize(env.code, env.grammar);
		_.hooks.run('after-tokenize', env);
		return Token.stringify(_.util.encode(env.tokens), env.language);
	},

	matchGrammar: function (text, strarr, grammar, index, startPos, oneshot, target) {
		var Token = _.Token;

		for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			if (token == target) {
				return;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					greedy = !!pattern.greedy,
					lookbehindLength = 0,
					alias = pattern.alias;

				if (greedy && !pattern.pattern.global) {
					// Without the global flag, lastIndex won't work
					var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
					pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
				}

				pattern = pattern.pattern || pattern;

				// Don’t cache length as it changes during the loop
				for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						return;
					}

					if (str instanceof Token) {
						continue;
					}

					if (greedy && i != strarr.length - 1) {
						pattern.lastIndex = pos;
						var match = pattern.exec(text);
						if (!match) {
							break;
						}

						var from = match.index + (lookbehind ? match[1].length : 0),
						    to = match.index + match[0].length,
						    k = i,
						    p = pos;

						for (var len = strarr.length; k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy)); ++k) {
							p += strarr[k].length;
							// Move the index i to the element in strarr that is closest to from
							if (from >= p) {
								++i;
								pos = p;
							}
						}

						// If strarr[i] is a Token, then the match starts inside another Token, which is invalid
						if (strarr[i] instanceof Token) {
							continue;
						}

						// Number of tokens to delete and replace with the new match
						delNum = k - i;
						str = text.slice(pos, p);
						match.index -= pos;
					} else {
						pattern.lastIndex = 0;

						var match = pattern.exec(str),
							delNum = 1;
					}

					if (!match) {
						if (oneshot) {
							break;
						}

						continue;
					}

					if(lookbehind) {
						lookbehindLength = match[1] ? match[1].length : 0;
					}

					var from = match.index + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    to = from + match.length,
					    before = str.slice(0, from),
					    after = str.slice(to);

					var args = [i, delNum];

					if (before) {
						++i;
						pos += before.length;
						args.push(before);
					}

					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

					args.push(wrapped);

					if (after) {
						args.push(after);
					}

					Array.prototype.splice.apply(strarr, args);

					if (delNum != 1)
						_.matchGrammar(text, strarr, grammar, i, pos, true, token);

					if (oneshot)
						break;
				}
			}
		}
	},

	tokenize: function(text, grammar, language) {
		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		_.matchGrammar(text, strarr, grammar, 0, 0, false);

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
	this.type = type;
	this.content = content;
	this.alias = alias;
	// Copy of the full string this token was created from
	this.length = (matchedStr || "").length|0;
	this.greedy = !!greedy;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (_.util.type(o) === 'Array') {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (o.alias) {
		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = Object.keys(env.attributes).map(function(name) {
		return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
	}).join(' ');

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';

};

if (!_self.document) {
	if (!_self.addEventListener) {
		// in Node.js
		return _self.Prism;
	}

	if (!_.disableWorkerMessageHandler) {
		// In worker
		_self.addEventListener('message', function (evt) {
			var message = JSON.parse(evt.data),
				lang = message.language,
				code = message.code,
				immediateClose = message.immediateClose;

			_self.postMessage(_.highlight(code, _.languages[lang], lang));
			if (immediateClose) {
				_self.close();
			}
		}, false);
	}

	return _self.Prism;
}

//Get current script and highlight
var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

if (script) {
	_.filename = script.src;

	if (!_.manual && !script.hasAttribute('data-manual')) {
		if(document.readyState !== "loading") {
			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(_.highlightAll);
			} else {
				window.setTimeout(_.highlightAll, 16);
			}
		}
		else {
			document.addEventListener('DOMContentLoaded', _.highlightAll);
		}
	}
}

return _self.Prism;

})();

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
	global.Prism = Prism;
}


/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
	'comment': /<!--[\s\S]*?-->/,
	'prolog': /<\?[\s\S]+?\?>/,
	'doctype': /<!DOCTYPE[\s\S]+?>/i,
	'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
	'tag': {
		pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		greedy: true,
		inside: {
			'tag': {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[^\s>\/:]+:/
				}
			},
			'attr-value': {
				pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,
				inside: {
					'punctuation': [
						/^=/,
						{
							pattern: /(^|[^\\])["']/,
							lookbehind: true
						}
					]
				}
			},
			'punctuation': /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: {
					'namespace': /^[^\s>\/:]+:/
				}
			}

		}
	},
	'entity': /&#?[\da-z]{1,8};/i
};

Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
	Prism.languages.markup['entity'];

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;


/* **********************************************
     Begin prism-css.js
********************************************** */

Prism.languages.css = {
	'comment': /\/\*[\s\S]*?\*\//,
	'atrule': {
		pattern: /@[\w-]+?.*?(?:;|(?=\s*\{))/i,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	'url': /url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	'selector': /[^{}\s][^{};]*?(?=\s*\{)/,
	'string': {
		pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'property': /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
	'important': /\B!important\b/i,
	'function': /[-a-z0-9]+(?=\()/i,
	'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
			lookbehind: true,
			inside: Prism.languages.css,
			alias: 'language-css',
			greedy: true
		}
	});

	Prism.languages.insertBefore('inside', 'attr-value', {
		'style-attr': {
			pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
			inside: {
				'attr-name': {
					pattern: /^\s*style/i,
					inside: Prism.languages.markup.tag.inside
				},
				'punctuation': /^\s*=\s*['"]|['"]\s*$/,
				'attr-value': {
					pattern: /.+/i,
					inside: Prism.languages.css
				}
			},
			alias: 'language-css'
		}
	}, Prism.languages.markup.tag);
}

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true,
			greedy: true
		}
	],
	'string': {
		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'class-name': {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
		lookbehind: true,
		inside: {
			punctuation: /[.\\]/
		}
	},
	'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	'boolean': /\b(?:true|false)\b/,
	'function': /[a-z0-9_]+(?=\()/i,
	'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	'number': /\b(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/i,
	'operator': /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[[^\]\r\n]+]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,
		lookbehind: true,
		greedy: true
	},
	// This must be declared before keyword because we use "function" inside the look-forward
	'function-variable': {
		pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,
		alias: 'function'
	},
	'constant': /\b[A-Z][A-Z\d_]*\b/
});

Prism.languages.insertBefore('javascript', 'string', {
	'template-string': {
		pattern: /`(?:\\[\s\S]|\${[^}]+}|[^\\`])*`/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\${[^}]+}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\${|}$/,
						alias: 'punctuation'
					},
					rest: null // See below
				}
			},
			'string': /[\s\S]+/
		}
	}
});
Prism.languages.javascript['template-string'].inside['interpolation'].inside.rest = Prism.languages.javascript;

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: Prism.languages.javascript,
			alias: 'language-javascript',
			greedy: true
		}
	});
}

Prism.languages.js = Prism.languages.javascript;


/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}

	self.Prism.fileHighlight = function() {

		var Extensions = {
			'js': 'javascript',
			'py': 'python',
			'rb': 'ruby',
			'ps1': 'powershell',
			'psm1': 'powershell',
			'sh': 'bash',
			'bat': 'batch',
			'h': 'c',
			'tex': 'latex'
		};

		Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
			var src = pre.getAttribute('data-src');

			var language, parent = pre;
			var lang = /\blang(?:uage)?-([\w-]+)\b/i;
			while (parent && !lang.test(parent.className)) {
				parent = parent.parentNode;
			}

			if (parent) {
				language = (pre.className.match(lang) || [, ''])[1];
			}

			if (!language) {
				var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
				language = Extensions[extension] || extension;
			}

			var code = document.createElement('code');
			code.className = 'language-' + language;

			pre.textContent = '';

			code.textContent = 'Loading…';

			pre.appendChild(code);

			var xhr = new XMLHttpRequest();

			xhr.open('GET', src, true);

			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {

					if (xhr.status < 400 && xhr.responseText) {
						code.textContent = xhr.responseText;

						Prism.highlightElement(code);
					}
					else if (xhr.status >= 400) {
						code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
					}
					else {
						code.textContent = '✖ Error: File does not exist or is empty';
					}
				}
			};

			xhr.send(null);
		});

		if (Prism.plugins.toolbar) {
			Prism.plugins.toolbar.registerButton('download-file', function (env) {
				var pre = env.element.parentNode;
				if (!pre || !/pre/i.test(pre.nodeName) || !pre.hasAttribute('data-src') || !pre.hasAttribute('data-download-link')) {
					return;
				}
				var src = pre.getAttribute('data-src');
				var a = document.createElement('a');
				a.textContent = pre.getAttribute('data-download-link-label') || 'Download';
				a.setAttribute('download', '');
				a.href = src;
				return a;
			});
		}

	};

	document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);

})();
},{}],"8tZR":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

/*
  `Failure`s represent expressions that weren't matched while parsing. They are used to generate
  error messages automatically. The interface of `Failure`s includes the collowing methods:

  - getText() : String
  - getType() : String  (one of {"description", "string", "code"})
  - isDescription() : bool
  - isStringTerminal() : bool
  - isCode() : bool
  - isFluffy() : bool
  - makeFluffy() : void
  - subsumes(Failure) : bool
*/

function isValidType(type) {
  return type === 'description' || type === 'string' || type === 'code';
}

function Failure(pexpr, text, type) {
  if (!isValidType(type)) {
    throw new Error('invalid Failure type: ' + type);
  }

  this.pexpr = pexpr;
  this.text = text;
  this.type = type;
  this.fluffy = false;
}

Failure.prototype.getPExpr = function () {
  return this.pexpr;
};

Failure.prototype.getText = function () {
  return this.text;
};

Failure.prototype.getType = function () {
  return this.type;
};

Failure.prototype.isDescription = function () {
  return this.type === 'description';
};

Failure.prototype.isStringTerminal = function () {
  return this.type === 'string';
};

Failure.prototype.isCode = function () {
  return this.type === 'code';
};

Failure.prototype.isFluffy = function () {
  return this.fluffy;
};

Failure.prototype.makeFluffy = function () {
  this.fluffy = true;
};

Failure.prototype.clearFluffy = function () {
  this.fluffy = false;
};

Failure.prototype.subsumes = function (that) {
  return this.getText() === that.getText() && this.type === that.type && (!this.isFluffy() || this.isFluffy() && that.isFluffy());
};

Failure.prototype.toString = function () {
  return this.type === 'string' ? JSON.stringify(this.getText()) : this.getText();
};

Failure.prototype.clone = function () {
  var failure = new Failure(this.pexpr, this.text, this.type);

  if (this.isFluffy()) {
    failure.makeFluffy();
  }

  return failure;
};

Failure.prototype.toKey = function () {
  return this.toString() + '#' + this.type;
}; // --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------


module.exports = Failure;
},{}],"4Bm0":[function(require,module,exports) {
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],"WLkt":[function(require,module,exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = extend;
function extend(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || typeof add !== 'object') return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
}

},{}],"g606":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var extend = require('util-extend'); // --------------------------------------------------------------------
// Private Stuff
// --------------------------------------------------------------------
// Helpers


var escapeStringFor = {};

for (var c = 0; c < 128; c++) {
  escapeStringFor[c] = String.fromCharCode(c);
}

escapeStringFor["'".charCodeAt(0)] = "\\'";
escapeStringFor['"'.charCodeAt(0)] = '\\"';
escapeStringFor['\\'.charCodeAt(0)] = '\\\\';
escapeStringFor['\b'.charCodeAt(0)] = '\\b';
escapeStringFor['\f'.charCodeAt(0)] = '\\f';
escapeStringFor['\n'.charCodeAt(0)] = '\\n';
escapeStringFor['\r'.charCodeAt(0)] = '\\r';
escapeStringFor['\t'.charCodeAt(0)] = '\\t';
escapeStringFor['\u000b'.charCodeAt(0)] = '\\v'; // --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.abstract = function (optMethodName) {
  var methodName = optMethodName || '';
  return function () {
    throw new Error('this method ' + methodName + ' is abstract! ' + '(it has no implementation in class ' + this.constructor.name + ')');
  };
};

exports.assert = function (cond, message) {
  if (!cond) {
    throw new Error(message);
  }
}; // Define a lazily-computed, non-enumerable property named `propName`
// on the object `obj`. `getterFn` will be called to compute the value the
// first time the property is accessed.


exports.defineLazyProperty = function (obj, propName, getterFn) {
  var memo;
  Object.defineProperty(obj, propName, {
    get: function () {
      if (!memo) {
        memo = getterFn.call(this);
      }

      return memo;
    }
  });
};

exports.clone = function (obj) {
  if (obj) {
    return extend({}, obj);
  }

  return obj;
};

exports.extend = extend;

exports.repeatFn = function (fn, n) {
  var arr = [];

  while (n-- > 0) {
    arr.push(fn());
  }

  return arr;
};

exports.repeatStr = function (str, n) {
  return new Array(n + 1).join(str);
};

exports.repeat = function (x, n) {
  return exports.repeatFn(function () {
    return x;
  }, n);
};

exports.getDuplicates = function (array) {
  var duplicates = [];

  for (var idx = 0; idx < array.length; idx++) {
    var x = array[idx];

    if (array.lastIndexOf(x) !== idx && duplicates.indexOf(x) < 0) {
      duplicates.push(x);
    }
  }

  return duplicates;
};

exports.copyWithoutDuplicates = function (array) {
  var noDuplicates = [];
  array.forEach(function (entry) {
    if (noDuplicates.indexOf(entry) < 0) {
      noDuplicates.push(entry);
    }
  });
  return noDuplicates;
};

exports.isSyntactic = function (ruleName) {
  var firstChar = ruleName[0];
  return firstChar === firstChar.toUpperCase();
};

exports.isLexical = function (ruleName) {
  return !exports.isSyntactic(ruleName);
};

exports.padLeft = function (str, len, optChar) {
  var ch = optChar || ' ';

  if (str.length < len) {
    return exports.repeatStr(ch, len - str.length) + str;
  }

  return str;
}; // StringBuffer


exports.StringBuffer = function () {
  this.strings = [];
};

exports.StringBuffer.prototype.append = function (str) {
  this.strings.push(str);
};

exports.StringBuffer.prototype.contents = function () {
  return this.strings.join('');
}; // Character escaping and unescaping


exports.escapeChar = function (c, optDelim) {
  var charCode = c.charCodeAt(0);

  if ((c === '"' || c === "'") && optDelim && c !== optDelim) {
    return c;
  } else if (charCode < 128) {
    return escapeStringFor[charCode];
  } else if (128 <= charCode && charCode < 256) {
    return '\\x' + exports.padLeft(charCode.toString(16), 2, '0');
  } else {
    return '\\u' + exports.padLeft(charCode.toString(16), 4, '0');
  }
};

exports.unescapeChar = function (s) {
  if (s.charAt(0) === '\\') {
    switch (s.charAt(1)) {
      case 'b':
        return '\b';

      case 'f':
        return '\f';

      case 'n':
        return '\n';

      case 'r':
        return '\r';

      case 't':
        return '\t';

      case 'v':
        return '\v';

      case 'x':
        return String.fromCharCode(parseInt(s.substring(2, 4), 16));

      case 'u':
        return String.fromCharCode(parseInt(s.substring(2, 6), 16));

      default:
        return s.charAt(1);
    }
  } else {
    return s;
  }
}; // Helper for producing a description of an unknown object in a safe way.
// Especially useful for error messages where an unexpected type of object was encountered.


exports.unexpectedObjToString = function (obj) {
  if (obj == null) {
    return String(obj);
  }

  var baseToString = Object.prototype.toString.call(obj);

  try {
    var typeName;

    if (obj.constructor && obj.constructor.name) {
      typeName = obj.constructor.name;
    } else if (baseToString.indexOf('[object ') === 0) {
      typeName = baseToString.slice(8, -1); // Extract e.g. "Array" from "[object Array]".
    } else {
      typeName = _typeof(obj);
    }

    return typeName + ': ' + JSON.stringify(String(obj));
  } catch (e) {
    return baseToString;
  }
};
},{"util-extend":"WLkt"}],"m4FS":[function(require,module,exports) {
'use strict';

var inherits = require('inherits');

var common = require('./common'); // --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------


function Node(grammar, ctorName, matchLength) {
  this.grammar = grammar;
  this.ctorName = ctorName;
  this.matchLength = matchLength;
}

Node.prototype.numChildren = function () {
  return this.children ? this.children.length : 0;
};

Node.prototype.childAt = function (idx) {
  if (this.children) {
    return this.children[idx];
  }
};

Node.prototype.indexOfChild = function (arg) {
  return this.children.indexOf(arg);
};

Node.prototype.hasChildren = function () {
  return this.numChildren() > 1;
};

Node.prototype.hasNoChildren = function () {
  return !this.hasChildren();
};

Node.prototype.onlyChild = function () {
  if (this.numChildren() !== 1) {
    throw new Error('cannot get only child of a node of type ' + this.ctorName + ' (it has ' + this.numChildren() + ' children)');
  } else {
    return this.firstChild();
  }
};

Node.prototype.firstChild = function () {
  if (this.hasNoChildren()) {
    throw new Error('cannot get first child of a ' + this.ctorName + ' node, which has no children');
  } else {
    return this.childAt(0);
  }
};

Node.prototype.lastChild = function () {
  if (this.hasNoChildren()) {
    throw new Error('cannot get last child of a ' + this.ctorName + ' node, which has no children');
  } else {
    return this.childAt(this.numChildren() - 1);
  }
};

Node.prototype.childBefore = function (child) {
  var childIdx = this.indexOfChild(child);

  if (childIdx < 0) {
    throw new Error('Node.childBefore() called w/ an argument that is not a child');
  } else if (childIdx === 0) {
    throw new Error('cannot get child before first child');
  } else {
    return this.childAt(childIdx - 1);
  }
};

Node.prototype.childAfter = function (child) {
  var childIdx = this.indexOfChild(child);

  if (childIdx < 0) {
    throw new Error('Node.childAfter() called w/ an argument that is not a child');
  } else if (childIdx === this.numChildren() - 1) {
    throw new Error('cannot get child after last child');
  } else {
    return this.childAt(childIdx + 1);
  }
};

Node.prototype.isTerminal = function () {
  return false;
};

Node.prototype.isNonterminal = function () {
  return false;
};

Node.prototype.isIteration = function () {
  return false;
};

Node.prototype.isOptional = function () {
  return false;
};

Node.prototype.toJSON = function () {
  var r = {};
  r[this.ctorName] = this.children;
  return r;
}; // Terminals


function TerminalNode(grammar, value) {
  var matchLength = value ? value.length : 0;
  Node.call(this, grammar, '_terminal', matchLength);
  this.primitiveValue = value;
}

inherits(TerminalNode, Node);

TerminalNode.prototype.isTerminal = function () {
  return true;
};

TerminalNode.prototype.toJSON = function () {
  var r = {};
  r[this.ctorName] = this.primitiveValue;
  return r;
}; // Nonterminals


function NonterminalNode(grammar, ruleName, children, childOffsets, matchLength) {
  Node.call(this, grammar, ruleName, matchLength);
  this.children = children;
  this.childOffsets = childOffsets;
}

inherits(NonterminalNode, Node);

NonterminalNode.prototype.isNonterminal = function () {
  return true;
};

NonterminalNode.prototype.isLexical = function () {
  return common.isLexical(this.ctorName);
};

NonterminalNode.prototype.isSyntactic = function () {
  return common.isSyntactic(this.ctorName);
}; // Iterations


function IterationNode(grammar, children, childOffsets, matchLength, isOptional) {
  Node.call(this, grammar, '_iter', matchLength);
  this.children = children;
  this.childOffsets = childOffsets;
  this.optional = isOptional;
}

inherits(IterationNode, Node);

IterationNode.prototype.isIteration = function () {
  return true;
};

IterationNode.prototype.isOptional = function () {
  return this.optional;
}; // --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------


module.exports = {
  Node: Node,
  TerminalNode: TerminalNode,
  NonterminalNode: NonterminalNode,
  IterationNode: IterationNode
};
},{"inherits":"4Bm0","./common":"g606"}],"4prn":[function(require,module,exports) {
// Based on https://github.com/mathiasbynens/unicode-9.0.0.
// These are just categories that are used in ES5/ES2015.
// The full list of Unicode categories is here: http://www.fileformat.info/info/unicode/category/index.htm.
module.exports = {
  // Letters
  Lu: /[A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AE\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A]|\uD801[\uDC00-\uDC27\uDCB0-\uDCD3]|\uD803[\uDC80-\uDCB2]|\uD806[\uDCA0-\uDCBF]|\uD835[\uDC00-\uDC19\uDC34-\uDC4D\uDC68-\uDC81\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB5\uDCD0-\uDCE9\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD38\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD6C-\uDD85\uDDA0-\uDDB9\uDDD4-\uDDED\uDE08-\uDE21\uDE3C-\uDE55\uDE70-\uDE89\uDEA8-\uDEC0\uDEE2-\uDEFA\uDF1C-\uDF34\uDF56-\uDF6E\uDF90-\uDFA8\uDFCA]|\uD83A[\uDD00-\uDD21]/,
  Ll: /[a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1C80-\u1C88\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A]|\uD801[\uDC28-\uDC4F\uDCD8-\uDCFB]|\uD803[\uDCC0-\uDCF2]|\uD806[\uDCC0-\uDCDF]|\uD835[\uDC1A-\uDC33\uDC4E-\uDC54\uDC56-\uDC67\uDC82-\uDC9B\uDCB6-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDCEA-\uDD03\uDD1E-\uDD37\uDD52-\uDD6B\uDD86-\uDD9F\uDDBA-\uDDD3\uDDEE-\uDE07\uDE22-\uDE3B\uDE56-\uDE6F\uDE8A-\uDEA5\uDEC2-\uDEDA\uDEDC-\uDEE1\uDEFC-\uDF14\uDF16-\uDF1B\uDF36-\uDF4E\uDF50-\uDF55\uDF70-\uDF88\uDF8A-\uDF8F\uDFAA-\uDFC2\uDFC4-\uDFC9\uDFCB]|\uD83A[\uDD22-\uDD43]/,
  Lt: /[\u01C5\u01C8\u01CB\u01F2\u1F88-\u1F8F\u1F98-\u1F9F\u1FA8-\u1FAF\u1FBC\u1FCC\u1FFC]/,
  Lm: /[\u02B0-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0374\u037A\u0559\u0640\u06E5\u06E6\u07F4\u07F5\u07FA\u081A\u0824\u0828\u0971\u0E46\u0EC6\u10FC\u17D7\u1843\u1AA7\u1C78-\u1C7D\u1D2C-\u1D6A\u1D78\u1D9B-\u1DBF\u2071\u207F\u2090-\u209C\u2C7C\u2C7D\u2D6F\u2E2F\u3005\u3031-\u3035\u303B\u309D\u309E\u30FC-\u30FE\uA015\uA4F8-\uA4FD\uA60C\uA67F\uA69C\uA69D\uA717-\uA71F\uA770\uA788\uA7F8\uA7F9\uA9CF\uA9E6\uAA70\uAADD\uAAF3\uAAF4\uAB5C-\uAB5F\uFF70\uFF9E\uFF9F]|\uD81A[\uDF40-\uDF43]|\uD81B[\uDF93-\uDF9F\uDFE0]/,
  Lo: /[\xAA\xBA\u01BB\u01C0-\u01C3\u0294\u05D0-\u05EA\u05F0-\u05F2\u0620-\u063F\u0641-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u0800-\u0815\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0972-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E45\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10D0-\u10FA\u10FD-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17DC\u1820-\u1842\u1844-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C77\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u2135-\u2138\u2D30-\u2D67\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3006\u303C\u3041-\u3096\u309F\u30A1-\u30FA\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA014\uA016-\uA48C\uA4D0-\uA4F7\uA500-\uA60B\uA610-\uA61F\uA62A\uA62B\uA66E\uA6A0-\uA6E5\uA78F\uA7F7\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9E0-\uA9E4\uA9E7-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA6F\uAA71-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB\uAADC\uAAE0-\uAAEA\uAAF2\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF66-\uFF6F\uFF71-\uFF9D\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC50-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,
  // Numbers
  Nl: /[\u16EE-\u16F0\u2160-\u2182\u2185-\u2188\u3007\u3021-\u3029\u3038-\u303A\uA6E6-\uA6EF]|\uD800[\uDD40-\uDD74\uDF41\uDF4A\uDFD1-\uDFD5]|\uD809[\uDC00-\uDC6E]/,
  Nd: /[0-9\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]|\uD801[\uDCA0-\uDCA9]|\uD804[\uDC66-\uDC6F\uDCF0-\uDCF9\uDD36-\uDD3F\uDDD0-\uDDD9\uDEF0-\uDEF9]|[\uD805\uD807][\uDC50-\uDC59\uDCD0-\uDCD9\uDE50-\uDE59\uDEC0-\uDEC9\uDF30-\uDF39]|\uD806[\uDCE0-\uDCE9]|\uD81A[\uDE60-\uDE69\uDF50-\uDF59]|\uD835[\uDFCE-\uDFFF]|\uD83A[\uDD50-\uDD59]/,
  // Marks
  Mn: /[\u0300-\u036F\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D4-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C00\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC6\u0CCC\u0CCD\u0CE2\u0CE3\u0D01\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ABD\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFB-\u1DFF\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA8C4\uA8C5\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD804[\uDC01\uDC38-\uDC46\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDCA-\uDDCC\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDE3E\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3C\uDF40\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDCB3-\uDCB8\uDCBA\uDCBF\uDCC0\uDCC2\uDCC3\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7\uDF1D-\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF8F-\uDF92]|\uD82F[\uDC9D\uDC9E]|\uD834[\uDD67-\uDD69\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uDB40[\uDD00-\uDDEF]/,
  Mc: /[\u0903-\u0903]|[\u093E-\u0940]|[\u0949-\u094C]|[\u0982-\u0983]|[\u09BE-\u09C0]|[\u09C7-\u09C8]|[\u09CB-\u09CC]|[\u09D7-\u09D7]|[\u0A3E-\u0A40]|[\u0A83-\u0A83]|[\u0ABE-\u0AC0]|[\u0AC9-\u0AC9]|[\u0ACB-\u0ACC]|[\u0B02-\u0B03]|[\u0B3E-\u0B3E]|[\u0B40-\u0B40]|[\u0B47-\u0B48]|[\u0B4B-\u0B4C]|[\u0B57-\u0B57]|[\u0B83-\u0B83]|[\u0BBE-\u0BBF]|[\u0BC1-\u0BC2]|[\u0BC6-\u0BC8]|[\u0BCA-\u0BCC]|[\u0BD7-\u0BD7]|[\u0C01-\u0C03]|[\u0C41-\u0C44]|[\u0C82-\u0C83]|[\u0CBE-\u0CBE]|[\u0CC0-\u0CC4]|[\u0CC7-\u0CC8]|[\u0CCA-\u0CCB]|[\u0CD5-\u0CD6]|[\u0D02-\u0D03]|[\u0D3E-\u0D40]|[\u0D46-\u0D48]|[\u0D4A-\u0D4C]|[\u0D57-\u0D57]|[\u0F3E-\u0F3F]|[\u0F7F-\u0F7F]/,
  // Punctuation, Connector
  Pc: /[_\u203F\u2040\u2054\uFE33\uFE34\uFE4D-\uFE4F\uFF3F]/,
  // Separator, Space
  Zs: /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/,
  // These two are not real Unicode categories, but our useful for Ohm.
  // L is a combination of all the letter categories.
  // Ltmo is a combination of Lt, Lm, and Lo.
  L: /[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,
  Ltmo: /[\u01C5\u01C8\u01CB\u01F2\u1F88-\u1F8F\u1F98-\u1F9F\u1FA8-\u1FAF\u1FBC\u1FCC\u1FFC]|[\u02B0-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0374\u037A\u0559\u0640\u06E5\u06E6\u07F4\u07F5\u07FA\u081A\u0824\u0828\u0971\u0E46\u0EC6\u10FC\u17D7\u1843\u1AA7\u1C78-\u1C7D\u1D2C-\u1D6A\u1D78\u1D9B-\u1DBF\u2071\u207F\u2090-\u209C\u2C7C\u2C7D\u2D6F\u2E2F\u3005\u3031-\u3035\u303B\u309D\u309E\u30FC-\u30FE\uA015\uA4F8-\uA4FD\uA60C\uA67F\uA69C\uA69D\uA717-\uA71F\uA770\uA788\uA7F8\uA7F9\uA9CF\uA9E6\uAA70\uAADD\uAAF3\uAAF4\uAB5C-\uAB5F\uFF70\uFF9E\uFF9F]|\uD81A[\uDF40-\uDF43]|\uD81B[\uDF93-\uDF9F\uDFE0]|[\xAA\xBA\u01BB\u01C0-\u01C3\u0294\u05D0-\u05EA\u05F0-\u05F2\u0620-\u063F\u0641-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u0800-\u0815\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0972-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E45\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10D0-\u10FA\u10FD-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17DC\u1820-\u1842\u1844-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C77\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u2135-\u2138\u2D30-\u2D67\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3006\u303C\u3041-\u3096\u309F\u30A1-\u30FA\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA014\uA016-\uA48C\uA4D0-\uA4F7\uA500-\uA60B\uA610-\uA61F\uA62A\uA62B\uA66E\uA6A0-\uA6E5\uA78F\uA7F7\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9E0-\uA9E4\uA9E7-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA6F\uAA71-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB\uAADC\uAAE0-\uAAEA\uAAF2\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF66-\uFF6F\uFF71-\uFF9D\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC50-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/
};
},{}],"1NN1":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');

var pexprs = require('./pexprs'); // --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  Return true if we should skip spaces preceding this expression in a syntactic context.
*/


pexprs.PExpr.prototype.allowsSkippingPrecedingSpace = common.abstract('allowsSkippingPrecedingSpace');
/*
  Generally, these are all first-order expressions and (with the exception of Apply)
  directly read from the input stream.
*/

pexprs.any.allowsSkippingPrecedingSpace = pexprs.end.allowsSkippingPrecedingSpace = pexprs.Apply.prototype.allowsSkippingPrecedingSpace = pexprs.Terminal.prototype.allowsSkippingPrecedingSpace = pexprs.Range.prototype.allowsSkippingPrecedingSpace = pexprs.UnicodeChar.prototype.allowsSkippingPrecedingSpace = function () {
  return true;
};
/*
  Higher-order expressions that don't directly consume input.
*/


pexprs.Alt.prototype.allowsSkippingPrecedingSpace = pexprs.Iter.prototype.allowsSkippingPrecedingSpace = pexprs.Lex.prototype.allowsSkippingPrecedingSpace = pexprs.Lookahead.prototype.allowsSkippingPrecedingSpace = pexprs.Not.prototype.allowsSkippingPrecedingSpace = pexprs.Param.prototype.allowsSkippingPrecedingSpace = pexprs.Seq.prototype.allowsSkippingPrecedingSpace = function () {
  return false;
};
},{"./common":"g606","./pexprs":"RYLI"}],"JhPb":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var extend = require('util-extend'); // --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------


function Namespace() {}

Namespace.prototype = Object.create(null);

Namespace.asNamespace = function (objOrNamespace) {
  if (objOrNamespace instanceof Namespace) {
    return objOrNamespace;
  }

  return Namespace.createNamespace(objOrNamespace);
}; // Create a new namespace. If `optProps` is specified, all of its properties
// will be copied to the new namespace.


Namespace.createNamespace = function (optProps) {
  return Namespace.extend(Namespace.prototype, optProps);
}; // Create a new namespace which extends another namespace. If `optProps` is
// specified, all of its properties will be copied to the new namespace.


Namespace.extend = function (namespace, optProps) {
  if (namespace !== Namespace.prototype && !(namespace instanceof Namespace)) {
    throw new TypeError('not a Namespace object: ' + namespace);
  }

  var ns = Object.create(namespace, {
    constructor: {
      value: Namespace,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  return extend(ns, optProps);
}; // TODO: Should this be a regular method?


Namespace.toString = function (ns) {
  return Object.prototype.toString.call(ns);
}; // --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------


module.exports = Namespace;
},{"util-extend":"WLkt"}],"+7+5":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Namespace = require('./Namespace'); // --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------


function createError(message, optInterval) {
  var e;

  if (optInterval) {
    e = new Error(optInterval.getLineAndColumnMessage() + message);
    e.shortMessage = message;
    e.interval = optInterval;
  } else {
    e = new Error(message);
  }

  return e;
} // ----------------- errors about intervals -----------------


function intervalSourcesDontMatch() {
  return createError("Interval sources don't match");
} // ----------------- errors about grammars -----------------
// Grammar syntax error


function grammarSyntaxError(matchFailure) {
  var e = new Error();
  Object.defineProperty(e, 'message', {
    get: function () {
      return matchFailure.message;
    }
  });
  Object.defineProperty(e, 'shortMessage', {
    get: function () {
      return 'Expected ' + matchFailure.getExpectedText();
    }
  });
  e.interval = matchFailure.getInterval();
  return e;
} // Undeclared grammar


function undeclaredGrammar(grammarName, namespace, interval) {
  var message = namespace ? 'Grammar ' + grammarName + ' is not declared in namespace ' + Namespace.toString(namespace) : 'Undeclared grammar ' + grammarName;
  return createError(message, interval);
} // Duplicate grammar declaration


function duplicateGrammarDeclaration(grammar, namespace) {
  return createError('Grammar ' + grammar.name + ' is already declared in this namespace');
} // ----------------- rules -----------------
// Undeclared rule


function undeclaredRule(ruleName, grammarName, optInterval) {
  return createError('Rule ' + ruleName + ' is not declared in grammar ' + grammarName, optInterval);
} // Cannot override undeclared rule


function cannotOverrideUndeclaredRule(ruleName, grammarName, optSource) {
  return createError('Cannot override rule ' + ruleName + ' because it is not declared in ' + grammarName, optSource);
} // Cannot extend undeclared rule


function cannotExtendUndeclaredRule(ruleName, grammarName, optSource) {
  return createError('Cannot extend rule ' + ruleName + ' because it is not declared in ' + grammarName, optSource);
} // Duplicate rule declaration


function duplicateRuleDeclaration(ruleName, grammarName, declGrammarName, optSource) {
  var message = "Duplicate declaration for rule '" + ruleName + "' in grammar '" + grammarName + "'";

  if (grammarName !== declGrammarName) {
    message += " (originally declared in '" + declGrammarName + "')";
  }

  return createError(message, optSource);
} // Wrong number of parameters


function wrongNumberOfParameters(ruleName, expected, actual, source) {
  return createError('Wrong number of parameters for rule ' + ruleName + ' (expected ' + expected + ', got ' + actual + ')', source);
} // Wrong number of arguments


function wrongNumberOfArguments(ruleName, expected, actual, expr) {
  return createError('Wrong number of arguments for rule ' + ruleName + ' (expected ' + expected + ', got ' + actual + ')', expr.source);
} // Duplicate parameter names


function duplicateParameterNames(ruleName, duplicates, source) {
  return createError('Duplicate parameter names in rule ' + ruleName + ': ' + duplicates.join(', '), source);
} // Invalid parameter expression


function invalidParameter(ruleName, expr) {
  return createError('Invalid parameter to rule ' + ruleName + ': ' + expr + ' has arity ' + expr.getArity() + ', but parameter expressions must have arity 1', expr.source);
} // Application of syntactic rule from lexical rule


function applicationOfSyntacticRuleFromLexicalContext(ruleName, applyExpr) {
  return createError('Cannot apply syntactic rule ' + ruleName + ' from here (inside a lexical context)', applyExpr.source);
} // Incorrect argument type


function incorrectArgumentType(expectedType, expr) {
  return createError('Incorrect argument type: expected ' + expectedType, expr.source);
} // ----------------- Kleene operators -----------------


function kleeneExprHasNullableOperand(kleeneExpr) {
  return createError('Nullable expression ' + kleeneExpr.expr.source.contents + " is not allowed inside '" + kleeneExpr.operator + "' (possible infinite loop)", kleeneExpr.expr.source);
} // ----------------- arity -----------------


function inconsistentArity(ruleName, expected, actual, expr) {
  return createError('Rule ' + ruleName + ' involves an alternation which has inconsistent arity ' + '(expected ' + expected + ', got ' + actual + ')', expr.source);
} // ----------------- properties -----------------


function duplicatePropertyNames(duplicates) {
  return createError('Object pattern has duplicate property names: ' + duplicates.join(', '));
} // ----------------- constructors -----------------


function invalidConstructorCall(grammar, ctorName, children) {
  return createError('Attempt to invoke constructor ' + ctorName + ' with invalid or unexpected arguments');
} // ----------------- convenience -----------------


function multipleErrors(errors) {
  var messages = errors.map(function (e) {
    return e.message;
  });
  return createError(['Errors:'].concat(messages).join('\n- '), errors[0].interval);
} // ----------------- semantic -----------------


function missingSemanticAction(ctorName, name, type, stack) {
  var stackTrace = stack.slice(0, -1).map(function (info) {
    var ans = '  ' + info[0].name + ' > ' + info[1];
    return info.length === 3 ? ans + " for '" + info[2] + "'" : ans;
  }).join('\n');
  stackTrace += '\n  ' + name + ' > ' + ctorName;
  var where = type + " '" + name + "'";
  var message = "Missing semantic action for '" + ctorName + "' in " + where + '\n' + 'Action stack (most recent call last):\n' + stackTrace;
  var e = createError(message);
  e.name = 'missingSemanticAction';
  return e;
} // --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------


module.exports = {
  applicationOfSyntacticRuleFromLexicalContext: applicationOfSyntacticRuleFromLexicalContext,
  cannotExtendUndeclaredRule: cannotExtendUndeclaredRule,
  cannotOverrideUndeclaredRule: cannotOverrideUndeclaredRule,
  duplicateGrammarDeclaration: duplicateGrammarDeclaration,
  duplicateParameterNames: duplicateParameterNames,
  duplicatePropertyNames: duplicatePropertyNames,
  duplicateRuleDeclaration: duplicateRuleDeclaration,
  inconsistentArity: inconsistentArity,
  incorrectArgumentType: incorrectArgumentType,
  intervalSourcesDontMatch: intervalSourcesDontMatch,
  invalidConstructorCall: invalidConstructorCall,
  invalidParameter: invalidParameter,
  grammarSyntaxError: grammarSyntaxError,
  kleeneExprHasNullableOperand: kleeneExprHasNullableOperand,
  missingSemanticAction: missingSemanticAction,
  undeclaredGrammar: undeclaredGrammar,
  undeclaredRule: undeclaredRule,
  wrongNumberOfArguments: wrongNumberOfArguments,
  wrongNumberOfParameters: wrongNumberOfParameters,
  throwErrors: function (errors) {
    if (errors.length === 1) {
      throw errors[0];
    }

    if (errors.length > 1) {
      throw multipleErrors(errors);
    }
  }
};
},{"./Namespace":"JhPb"}],"NOPz":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common'); // --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
// Given an array of numbers `arr`, return an array of the numbers as strings,
// right-justified and padded to the same length.


function padNumbersToEqualLength(arr) {
  var maxLen = 0;
  var strings = arr.map(function (n) {
    var str = n.toString();
    maxLen = Math.max(maxLen, str.length);
    return str;
  });
  return strings.map(function (s) {
    return common.padLeft(s, maxLen);
  });
} // Produce a new string that would be the result of copying the contents
// of the string `src` onto `dest` at offset `offest`.


function strcpy(dest, src, offset) {
  var origDestLen = dest.length;
  var start = dest.slice(0, offset);
  var end = dest.slice(offset + src.length);
  return (start + src + end).substr(0, origDestLen);
} // --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------


var builtInRulesCallbacks = []; // Since Grammar.BuiltInRules is bootstrapped, most of Ohm can't directly depend it.
// This function allows modules that do depend on the built-in rules to register a callback
// that will be called later in the initialization process.

exports.awaitBuiltInRules = function (cb) {
  builtInRulesCallbacks.push(cb);
};

exports.announceBuiltInRules = function (grammar) {
  builtInRulesCallbacks.forEach(function (cb) {
    cb(grammar);
  });
  builtInRulesCallbacks = null;
}; // Return an object with the line and column information for the given
// offset in `str`.


exports.getLineAndColumn = function (str, offset) {
  var lineNum = 1;
  var colNum = 1;
  var currOffset = 0;
  var lineStartOffset = 0;
  var nextLine = null;
  var prevLine = null;
  var prevLineStartOffset = -1;

  while (currOffset < offset) {
    var c = str.charAt(currOffset++);

    if (c === '\n') {
      lineNum++;
      colNum = 1;
      prevLineStartOffset = lineStartOffset;
      lineStartOffset = currOffset;
    } else if (c !== '\r') {
      colNum++;
    }
  } // Find the end of the target line.


  var lineEndOffset = str.indexOf('\n', lineStartOffset);

  if (lineEndOffset === -1) {
    lineEndOffset = str.length;
  } else {
    // Get the next line.
    var nextLineEndOffset = str.indexOf('\n', lineEndOffset + 1);
    nextLine = nextLineEndOffset === -1 ? str.slice(lineEndOffset) : str.slice(lineEndOffset, nextLineEndOffset); // Strip leading and trailing EOL char(s).

    nextLine = nextLine.replace(/^\r?\n/, '').replace(/\r$/, '');
  } // Get the previous line.


  if (prevLineStartOffset >= 0) {
    prevLine = str.slice(prevLineStartOffset, lineStartOffset).replace(/\r?\n$/, ''); // Strip trailing EOL char(s).
  } // Get the target line, stripping a trailing carriage return if necessary.


  var line = str.slice(lineStartOffset, lineEndOffset).replace(/\r$/, '');
  return {
    lineNum: lineNum,
    colNum: colNum,
    line: line,
    prevLine: prevLine,
    nextLine: nextLine
  };
}; // Return a nicely-formatted string describing the line and column for the
// given offset in `str`.


exports.getLineAndColumnMessage = function (str, offset
/* ...ranges */
) {
  var repeatStr = common.repeatStr;
  var lineAndCol = exports.getLineAndColumn(str, offset);
  var sb = new common.StringBuffer();
  sb.append('Line ' + lineAndCol.lineNum + ', col ' + lineAndCol.colNum + ':\n'); // An array of the previous, current, and next line numbers as strings of equal length.

  var lineNumbers = padNumbersToEqualLength([lineAndCol.prevLine == null ? 0 : lineAndCol.lineNum - 1, lineAndCol.lineNum, lineAndCol.nextLine == null ? 0 : lineAndCol.lineNum + 1]); // Helper for appending formatting input lines to the buffer.

  function appendLine(num, content, prefix) {
    sb.append(prefix + lineNumbers[num] + ' | ' + content + '\n');
  } // Include the previous line for context if possible.


  if (lineAndCol.prevLine != null) {
    appendLine(0, lineAndCol.prevLine, '  ');
  } // Line that the error occurred on.


  appendLine(1, lineAndCol.line, '> '); // Build up the line that points to the offset and possible indicates one or more ranges.
  // Start with a blank line, and indicate each range by overlaying a string of `~` chars.

  var lineLen = lineAndCol.line.length;
  var indicationLine = repeatStr(' ', lineLen + 1);
  var ranges = Array.prototype.slice.call(arguments, 2);

  for (var i = 0; i < ranges.length; ++i) {
    var startIdx = ranges[i][0];
    var endIdx = ranges[i][1];
    common.assert(startIdx >= 0 && startIdx <= endIdx, 'range start must be >= 0 and <= end');
    var lineStartOffset = offset - lineAndCol.colNum + 1;
    startIdx = Math.max(0, startIdx - lineStartOffset);
    endIdx = Math.min(endIdx - lineStartOffset, lineLen);
    indicationLine = strcpy(indicationLine, repeatStr('~', endIdx - startIdx), startIdx);
  }

  var gutterWidth = 2 + lineNumbers[1].length + 3;
  sb.append(repeatStr(' ', gutterWidth));
  indicationLine = strcpy(indicationLine, '^', lineAndCol.colNum - 1);
  sb.append(indicationLine.replace(/ +$/, '') + '\n'); // Include the next line for context if possible.

  if (lineAndCol.nextLine != null) {
    appendLine(2, lineAndCol.nextLine, '  ');
  }

  return sb.contents();
};
},{"./common":"g606"}],"kX7V":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');

var errors = require('./errors');

var pexprs = require('./pexprs');

var util = require('./util');

var BuiltInRules;
util.awaitBuiltInRules(function (g) {
  BuiltInRules = g;
}); // --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

var lexifyCount;

pexprs.PExpr.prototype.assertAllApplicationsAreValid = function (ruleName, grammar) {
  lexifyCount = 0;

  this._assertAllApplicationsAreValid(ruleName, grammar);
};

pexprs.PExpr.prototype._assertAllApplicationsAreValid = common.abstract('_assertAllApplicationsAreValid');

pexprs.any._assertAllApplicationsAreValid = pexprs.end._assertAllApplicationsAreValid = pexprs.Terminal.prototype._assertAllApplicationsAreValid = pexprs.Range.prototype._assertAllApplicationsAreValid = pexprs.Param.prototype._assertAllApplicationsAreValid = pexprs.UnicodeChar.prototype._assertAllApplicationsAreValid = function (ruleName, grammar) {// no-op
};

pexprs.Lex.prototype._assertAllApplicationsAreValid = function (ruleName, grammar) {
  lexifyCount++;

  this.expr._assertAllApplicationsAreValid(ruleName, grammar);

  lexifyCount--;
};

pexprs.Alt.prototype._assertAllApplicationsAreValid = function (ruleName, grammar) {
  for (var idx = 0; idx < this.terms.length; idx++) {
    this.terms[idx]._assertAllApplicationsAreValid(ruleName, grammar);
  }
};

pexprs.Seq.prototype._assertAllApplicationsAreValid = function (ruleName, grammar) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx]._assertAllApplicationsAreValid(ruleName, grammar);
  }
};

pexprs.Iter.prototype._assertAllApplicationsAreValid = pexprs.Not.prototype._assertAllApplicationsAreValid = pexprs.Lookahead.prototype._assertAllApplicationsAreValid = function (ruleName, grammar) {
  this.expr._assertAllApplicationsAreValid(ruleName, grammar);
};

pexprs.Apply.prototype._assertAllApplicationsAreValid = function (ruleName, grammar) {
  var ruleInfo = grammar.rules[this.ruleName]; // Make sure that the rule exists...

  if (!ruleInfo) {
    throw errors.undeclaredRule(this.ruleName, grammar.name, this.source);
  } // ...and that this application is allowed


  if (common.isSyntactic(this.ruleName) && (!common.isSyntactic(ruleName) || lexifyCount > 0)) {
    throw errors.applicationOfSyntacticRuleFromLexicalContext(this.ruleName, this);
  } // ...and that this application has the correct number of arguments


  var actual = this.args.length;
  var expected = ruleInfo.formals.length;

  if (actual !== expected) {
    throw errors.wrongNumberOfArguments(this.ruleName, expected, actual, this.source);
  } // ...and that all of the argument expressions only have valid applications and have arity 1.


  var self = this;
  this.args.forEach(function (arg) {
    arg._assertAllApplicationsAreValid(ruleName, grammar);

    if (arg.getArity() !== 1) {
      throw errors.invalidParameter(self.ruleName, arg);
    }
  }); // Extra checks for "special" applications
  // If it's an application of 'caseInsensitive', ensure that the argument is a Terminal.

  if (BuiltInRules && ruleInfo === BuiltInRules.rules.caseInsensitive) {
    if (!(this.args[0] instanceof pexprs.Terminal)) {
      throw errors.incorrectArgumentType('a Terminal (e.g. \"abc\")', this.args[0]);
    }
  }
};
},{"./common":"g606","./errors":"+7+5","./pexprs":"RYLI","./util":"NOPz"}],"vDLb":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');

var errors = require('./errors');

var pexprs = require('./pexprs'); // --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------


pexprs.PExpr.prototype.assertChoicesHaveUniformArity = common.abstract('assertChoicesHaveUniformArity');

pexprs.any.assertChoicesHaveUniformArity = pexprs.end.assertChoicesHaveUniformArity = pexprs.Terminal.prototype.assertChoicesHaveUniformArity = pexprs.Range.prototype.assertChoicesHaveUniformArity = pexprs.Param.prototype.assertChoicesHaveUniformArity = pexprs.Lex.prototype.assertChoicesHaveUniformArity = pexprs.UnicodeChar.prototype.assertChoicesHaveUniformArity = function (ruleName) {// no-op
};

pexprs.Alt.prototype.assertChoicesHaveUniformArity = function (ruleName) {
  if (this.terms.length === 0) {
    return;
  }

  var arity = this.terms[0].getArity();

  for (var idx = 0; idx < this.terms.length; idx++) {
    var term = this.terms[idx];
    term.assertChoicesHaveUniformArity();
    var otherArity = term.getArity();

    if (arity !== otherArity) {
      throw errors.inconsistentArity(ruleName, arity, otherArity, term);
    }
  }
};

pexprs.Extend.prototype.assertChoicesHaveUniformArity = function (ruleName) {
  // Extend is a special case of Alt that's guaranteed to have exactly two
  // cases: [extensions, origBody].
  var actualArity = this.terms[0].getArity();
  var expectedArity = this.terms[1].getArity();

  if (actualArity !== expectedArity) {
    throw errors.inconsistentArity(ruleName, expectedArity, actualArity, this.terms[0]);
  }
};

pexprs.Seq.prototype.assertChoicesHaveUniformArity = function (ruleName) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx].assertChoicesHaveUniformArity(ruleName);
  }
};

pexprs.Iter.prototype.assertChoicesHaveUniformArity = function (ruleName) {
  this.expr.assertChoicesHaveUniformArity(ruleName);
};

pexprs.Not.prototype.assertChoicesHaveUniformArity = function (ruleName) {// no-op (not required b/c the nested expr doesn't show up in the CST)
};

pexprs.Lookahead.prototype.assertChoicesHaveUniformArity = function (ruleName) {
  this.expr.assertChoicesHaveUniformArity(ruleName);
};

pexprs.Apply.prototype.assertChoicesHaveUniformArity = function (ruleName) {// The arities of the parameter expressions is required to be 1 by
  // `assertAllApplicationsAreValid()`.
};
},{"./common":"g606","./errors":"+7+5","./pexprs":"RYLI"}],"FEmm":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');

var errors = require('./errors');

var pexprs = require('./pexprs'); // --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------


pexprs.PExpr.prototype.assertIteratedExprsAreNotNullable = common.abstract('assertIteratedExprsAreNotNullable');

pexprs.any.assertIteratedExprsAreNotNullable = pexprs.end.assertIteratedExprsAreNotNullable = pexprs.Terminal.prototype.assertIteratedExprsAreNotNullable = pexprs.Range.prototype.assertIteratedExprsAreNotNullable = pexprs.Param.prototype.assertIteratedExprsAreNotNullable = pexprs.UnicodeChar.prototype.assertIteratedExprsAreNotNullable = function (grammar, ruleName) {// no-op
};

pexprs.Alt.prototype.assertIteratedExprsAreNotNullable = function (grammar, ruleName) {
  for (var idx = 0; idx < this.terms.length; idx++) {
    this.terms[idx].assertIteratedExprsAreNotNullable(grammar, ruleName);
  }
};

pexprs.Seq.prototype.assertIteratedExprsAreNotNullable = function (grammar, ruleName) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx].assertIteratedExprsAreNotNullable(grammar, ruleName);
  }
};

pexprs.Iter.prototype.assertIteratedExprsAreNotNullable = function (grammar, ruleName) {
  // Note: this is the implementation of this method for `Star` and `Plus` expressions.
  // It is overridden for `Opt` below.
  this.expr.assertIteratedExprsAreNotNullable(grammar, ruleName);

  if (this.expr.isNullable(grammar)) {
    throw errors.kleeneExprHasNullableOperand(this, ruleName);
  }
};

pexprs.Opt.prototype.assertIteratedExprsAreNotNullable = pexprs.Not.prototype.assertIteratedExprsAreNotNullable = pexprs.Lookahead.prototype.assertIteratedExprsAreNotNullable = pexprs.Lex.prototype.assertIteratedExprsAreNotNullable = function (grammar, ruleName) {
  this.expr.assertIteratedExprsAreNotNullable(grammar, ruleName);
};

pexprs.Apply.prototype.assertIteratedExprsAreNotNullable = function (grammar, ruleName) {
  this.args.forEach(function (arg) {
    arg.assertIteratedExprsAreNotNullable(grammar, ruleName);
  });
};
},{"./common":"g606","./errors":"+7+5","./pexprs":"RYLI"}],"13B8":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var common = require('./common');

var nodes = require('./nodes');

var pexprs = require('./pexprs'); // --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------


pexprs.PExpr.prototype.check = common.abstract('check');

pexprs.any.check = function (grammar, vals) {
  return vals.length >= 1;
};

pexprs.end.check = function (grammar, vals) {
  return vals[0] instanceof nodes.Node && vals[0].isTerminal() && vals[0].primitiveValue === undefined;
};

pexprs.Terminal.prototype.check = function (grammar, vals) {
  return vals[0] instanceof nodes.Node && vals[0].isTerminal() && vals[0].primitiveValue === this.obj;
};

pexprs.Range.prototype.check = function (grammar, vals) {
  return vals[0] instanceof nodes.Node && vals[0].isTerminal() && _typeof(vals[0].primitiveValue) === _typeof(this.from);
};

pexprs.Param.prototype.check = function (grammar, vals) {
  return vals.length >= 1;
};

pexprs.Alt.prototype.check = function (grammar, vals) {
  for (var i = 0; i < this.terms.length; i++) {
    var term = this.terms[i];

    if (term.check(grammar, vals)) {
      return true;
    }
  }

  return false;
};

pexprs.Seq.prototype.check = function (grammar, vals) {
  var pos = 0;

  for (var i = 0; i < this.factors.length; i++) {
    var factor = this.factors[i];

    if (factor.check(grammar, vals.slice(pos))) {
      pos += factor.getArity();
    } else {
      return false;
    }
  }

  return true;
};

pexprs.Iter.prototype.check = function (grammar, vals) {
  var arity = this.getArity();
  var columns = vals.slice(0, arity);

  if (columns.length !== arity) {
    return false;
  }

  var rowCount = columns[0].length;
  var i;

  for (i = 1; i < arity; i++) {
    if (columns[i].length !== rowCount) {
      return false;
    }
  }

  for (i = 0; i < rowCount; i++) {
    var row = [];

    for (var j = 0; j < arity; j++) {
      row.push(columns[j][i]);
    }

    if (!this.expr.check(grammar, row)) {
      return false;
    }
  }

  return true;
};

pexprs.Not.prototype.check = function (grammar, vals) {
  return true;
};

pexprs.Lookahead.prototype.check = pexprs.Lex.prototype.check = function (grammar, vals) {
  return this.expr.check(grammar, vals);
};

pexprs.Apply.prototype.check = function (grammar, vals) {
  if (!(vals[0] instanceof nodes.Node && vals[0].grammar === grammar && vals[0].ctorName === this.ruleName)) {
    return false;
  } // TODO: think about *not* doing the following checks, i.e., trusting that the rule
  // was correctly constructed.


  var ruleNode = vals[0];
  var body = grammar.rules[this.ruleName].body;
  return body.check(grammar, ruleNode.children) && ruleNode.numChildren() === body.getArity();
};

pexprs.UnicodeChar.prototype.check = function (grammar, vals) {
  return vals[0] instanceof nodes.Node && vals[0].isTerminal() && typeof vals[0].primitiveValue === 'string';
};
},{"./common":"g606","./nodes":"m4FS","./pexprs":"RYLI"}],"VvGz":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var assert = require('./common').assert;

var errors = require('./errors');

var util = require('./util'); // --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------


function Interval(sourceString, startIdx, endIdx) {
  this.sourceString = sourceString;
  this.startIdx = startIdx;
  this.endIdx = endIdx;
}

Interval.coverage = function ()
/* interval1, interval2, ... */
{
  var sourceString = arguments[0].sourceString;
  var startIdx = arguments[0].startIdx;
  var endIdx = arguments[0].endIdx;

  for (var idx = 1; idx < arguments.length; idx++) {
    var interval = arguments[idx];

    if (interval.sourceString !== sourceString) {
      throw errors.intervalSourcesDontMatch();
    } else {
      startIdx = Math.min(startIdx, arguments[idx].startIdx);
      endIdx = Math.max(endIdx, arguments[idx].endIdx);
    }
  }

  return new Interval(sourceString, startIdx, endIdx);
};

Interval.prototype = {
  coverageWith: function ()
  /* interval1, interval2, ... */
  {
    var intervals = Array.prototype.slice.call(arguments);
    intervals.push(this);
    return Interval.coverage.apply(undefined, intervals);
  },
  collapsedLeft: function () {
    return new Interval(this.sourceString, this.startIdx, this.startIdx);
  },
  collapsedRight: function () {
    return new Interval(this.sourceString, this.endIdx, this.endIdx);
  },
  getLineAndColumnMessage: function () {
    var range = [this.startIdx, this.endIdx];
    return util.getLineAndColumnMessage(this.sourceString, this.startIdx, range);
  },
  // Returns an array of 0, 1, or 2 intervals that represents the result of the
  // interval difference operation.
  minus: function (that) {
    if (this.sourceString !== that.sourceString) {
      throw errors.intervalSourcesDontMatch();
    } else if (this.startIdx === that.startIdx && this.endIdx === that.endIdx) {
      // `this` and `that` are the same interval!
      return [];
    } else if (this.startIdx < that.startIdx && that.endIdx < this.endIdx) {
      // `that` splits `this` into two intervals
      return [new Interval(this.sourceString, this.startIdx, that.startIdx), new Interval(this.sourceString, that.endIdx, this.endIdx)];
    } else if (this.startIdx < that.endIdx && that.endIdx < this.endIdx) {
      // `that` contains a prefix of `this`
      return [new Interval(this.sourceString, that.endIdx, this.endIdx)];
    } else if (this.startIdx < that.startIdx && that.startIdx < this.endIdx) {
      // `that` contains a suffix of `this`
      return [new Interval(this.sourceString, this.startIdx, that.startIdx)];
    } else {
      // `that` and `this` do not overlap
      return [this];
    }
  },
  // Returns a new Interval that has the same extent as this one, but which is relative
  // to `that`, an Interval that fully covers this one.
  relativeTo: function (that) {
    if (this.sourceString !== that.sourceString) {
      throw errors.intervalSourcesDontMatch();
    }

    assert(this.startIdx >= that.startIdx && this.endIdx <= that.endIdx, 'other interval does not cover this one');
    return new Interval(this.sourceString, this.startIdx - that.startIdx, this.endIdx - that.startIdx);
  },
  // Returns a new Interval which contains the same contents as this one,
  // but with whitespace trimmed from both ends. (This only makes sense when
  // the input stream is a string.)
  trimmed: function () {
    var contents = this.contents;
    var startIdx = this.startIdx + contents.match(/^\s*/)[0].length;
    var endIdx = this.endIdx - contents.match(/\s*$/)[0].length;
    return new Interval(this.sourceString, startIdx, endIdx);
  },
  subInterval: function (offset, len) {
    var newStartIdx = this.startIdx + offset;
    return new Interval(this.sourceString, newStartIdx, newStartIdx + len);
  }
};
Object.defineProperties(Interval.prototype, {
  contents: {
    get: function () {
      if (this._contents === undefined) {
        this._contents = this.sourceString.slice(this.startIdx, this.endIdx);
      }

      return this._contents;
    },
    enumerable: true
  },
  length: {
    get: function () {
      return this.endIdx - this.startIdx;
    },
    enumerable: true
  }
}); // --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Interval;
},{"./common":"g606","./errors":"+7+5","./util":"NOPz"}],"NY7q":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Interval = require('./Interval');

var common = require('./common'); // --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
// Unicode characters that are used in the `toString` output.


var BALLOT_X = '\u2717';
var CHECK_MARK = '\u2713';
var DOT_OPERATOR = '\u22C5';
var RIGHTWARDS_DOUBLE_ARROW = '\u21D2';
var SYMBOL_FOR_HORIZONTAL_TABULATION = '\u2409';
var SYMBOL_FOR_LINE_FEED = '\u240A';
var SYMBOL_FOR_CARRIAGE_RETURN = '\u240D';
var Flags = {
  succeeded: 1 << 0,
  isRootNode: 1 << 1,
  isImplicitSpaces: 1 << 2,
  isMemoized: 1 << 3,
  isHeadOfLeftRecursion: 1 << 4,
  terminatesLR: 1 << 5
};

function spaces(n) {
  return common.repeat(' ', n).join('');
} // Return a string representation of a portion of `input` at offset `pos`.
// The result will contain exactly `len` characters.


function getInputExcerpt(input, pos, len) {
  var excerpt = asEscapedString(input.slice(pos, pos + len)); // Pad the output if necessary.

  if (excerpt.length < len) {
    return excerpt + common.repeat(' ', len - excerpt.length).join('');
  }

  return excerpt;
}

function asEscapedString(obj) {
  if (typeof obj === 'string') {
    // Replace non-printable characters with visible symbols.
    return obj.replace(/ /g, DOT_OPERATOR).replace(/\t/g, SYMBOL_FOR_HORIZONTAL_TABULATION).replace(/\n/g, SYMBOL_FOR_LINE_FEED).replace(/\r/g, SYMBOL_FOR_CARRIAGE_RETURN);
  }

  return String(obj);
} // ----------------- Trace -----------------


function Trace(input, pos1, pos2, expr, succeeded, bindings, optChildren) {
  this.input = input;
  this.pos = this.pos1 = pos1;
  this.pos2 = pos2;
  this.source = new Interval(input, pos1, pos2);
  this.expr = expr;
  this.bindings = bindings;
  this.children = optChildren || [];
  this.terminatingLREntry = null;
  this._flags = succeeded ? Flags.succeeded : 0;
} // A value that can be returned from visitor functions to indicate that a
// node should not be recursed into.


Trace.prototype.SKIP = {};
Object.defineProperty(Trace.prototype, 'displayString', {
  get: function () {
    return this.expr.toDisplayString();
  }
}); // For convenience, create a getter and setter for the boolean flags in `Flags`.

Object.keys(Flags).forEach(function (name) {
  var mask = Flags[name];
  Object.defineProperty(Trace.prototype, name, {
    get: function () {
      return (this._flags & mask) !== 0;
    },
    set: function (val) {
      if (val) {
        this._flags |= mask;
      } else {
        this._flags &= ~mask;
      }
    }
  });
});

Trace.prototype.clone = function () {
  return this.cloneWithExpr(this.expr);
};

Trace.prototype.cloneWithExpr = function (expr) {
  var ans = new Trace(this.input, this.pos, this.pos2, expr, this.succeeded, this.bindings, this.children);
  ans.isHeadOfLeftRecursion = this.isHeadOfLeftRecursion;
  ans.isImplicitSpaces = this.isImplicitSpaces;
  ans.isMemoized = this.isMemoized;
  ans.isRootNode = this.isRootNode;
  ans.terminatesLR = this.terminatesLR;
  ans.terminatingLREntry = this.terminatingLREntry;
  return ans;
}; // Record the trace information for the terminating condition of the LR loop.


Trace.prototype.recordLRTermination = function (ruleBodyTrace, value) {
  this.terminatingLREntry = new Trace(this.input, this.pos, this.pos2, this.expr, false, [value], [ruleBodyTrace]);
  this.terminatingLREntry.terminatesLR = true;
}; // Recursively traverse this trace node and all its descendents, calling a visitor function
// for each node that is visited. If `vistorObjOrFn` is an object, then its 'enter' property
// is a function to call before visiting the children of a node, and its 'exit' property is
// a function to call afterwards. If `visitorObjOrFn` is a function, it represents the 'enter'
// function.
//
// The functions are called with three arguments: the Trace node, its parent Trace, and a number
// representing the depth of the node in the tree. (The root node has depth 0.) `optThisArg`, if
// specified, is the value to use for `this` when executing the visitor functions.


Trace.prototype.walk = function (visitorObjOrFn, optThisArg) {
  var visitor = visitorObjOrFn;

  if (typeof visitor === 'function') {
    visitor = {
      enter: visitor
    };
  }

  function _walk(node, parent, depth) {
    var recurse = true;

    if (visitor.enter) {
      if (visitor.enter.call(optThisArg, node, parent, depth) === Trace.prototype.SKIP) {
        recurse = false;
      }
    }

    if (recurse) {
      node.children.forEach(function (child) {
        _walk(child, node, depth + 1);
      });

      if (visitor.exit) {
        visitor.exit.call(optThisArg, node, parent, depth);
      }
    }
  }

  if (this.isRootNode) {
    // Don't visit the root node itself, only its children.
    this.children.forEach(function (c) {
      _walk(c, null, 0);
    });
  } else {
    _walk(this, null, 0);
  }
}; // Return a string representation of the trace.
// Sample:
//     12⋅+⋅2⋅*⋅3 ✓ exp ⇒  "12"
//     12⋅+⋅2⋅*⋅3   ✓ addExp (LR) ⇒  "12"
//     12⋅+⋅2⋅*⋅3       ✗ addExp_plus


Trace.prototype.toString = function () {
  var sb = new common.StringBuffer();
  this.walk(function (node, parent, depth) {
    if (!node) {
      return this.SKIP;
    }

    var ctorName = node.expr.constructor.name; // Don't print anything for Alt nodes.

    if (ctorName === 'Alt') {
      return; // eslint-disable-line consistent-return
    }

    sb.append(getInputExcerpt(node.input, node.pos, 10) + spaces(depth * 2 + 1));
    sb.append((node.succeeded ? CHECK_MARK : BALLOT_X) + ' ' + node.displayString);

    if (node.isHeadOfLeftRecursion) {
      sb.append(' (LR)');
    }

    if (node.succeeded) {
      var contents = asEscapedString(node.source.contents);
      sb.append(' ' + RIGHTWARDS_DOUBLE_ARROW + '  ');
      sb.append(typeof contents === 'string' ? '"' + contents + '"' : contents);
    }

    sb.append('\n');
  }.bind(this));
  return sb.contents();
}; // --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------


module.exports = Trace;
},{"./Interval":"VvGz","./common":"g606"}],"/TlS":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Trace = require('./Trace');

var common = require('./common');

var nodes = require('./nodes');

var pexprs = require('./pexprs');

var TerminalNode = nodes.TerminalNode;
var NonterminalNode = nodes.NonterminalNode;
var IterationNode = nodes.IterationNode; // --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  Evaluate the expression and return `true` if it succeeds, `false` otherwise. This method should
  only be called directly by `State.prototype.eval(expr)`, which also updates the data structures
  that are used for tracing. (Making those updates in a method of `State` enables the trace-specific
  data structures to be "secrets" of that class, which is good for modularity.)

  The contract of this method is as follows:
  * When the return value is `true`,
    - the state object will have `expr.getArity()` more bindings than it did before the call.
  * When the return value is `false`,
    - the state object may have more bindings than it did before the call, and
    - its input stream's position may be anywhere.

  Note that `State.prototype.eval(expr)`, unlike this method, guarantees that neither the state
  object's bindings nor its input stream's position will change if the expression fails to match.
*/

pexprs.PExpr.prototype.eval = common.abstract('eval'); // function(state) { ... }

pexprs.any.eval = function (state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var ch = inputStream.next();

  if (ch) {
    state.pushBinding(new TerminalNode(state.grammar, ch), origPos);
    return true;
  } else {
    state.processFailure(origPos, this);
    return false;
  }
};

pexprs.end.eval = function (state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;

  if (inputStream.atEnd()) {
    state.pushBinding(new TerminalNode(state.grammar, undefined), origPos);
    return true;
  } else {
    state.processFailure(origPos, this);
    return false;
  }
};

pexprs.Terminal.prototype.eval = function (state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;

  if (!inputStream.matchString(this.obj)) {
    state.processFailure(origPos, this);
    return false;
  } else {
    state.pushBinding(new TerminalNode(state.grammar, this.obj), origPos);
    return true;
  }
};

pexprs.Range.prototype.eval = function (state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var ch = inputStream.next();

  if (ch && this.from <= ch && ch <= this.to) {
    state.pushBinding(new TerminalNode(state.grammar, ch), origPos);
    return true;
  } else {
    state.processFailure(origPos, this);
    return false;
  }
};

pexprs.Param.prototype.eval = function (state) {
  return state.eval(state.currentApplication().args[this.index]);
};

pexprs.Lex.prototype.eval = function (state) {
  state.enterLexifiedContext();
  var ans = state.eval(this.expr);
  state.exitLexifiedContext();
  return ans;
};

pexprs.Alt.prototype.eval = function (state) {
  for (var idx = 0; idx < this.terms.length; idx++) {
    if (state.eval(this.terms[idx])) {
      return true;
    }
  }

  return false;
};

pexprs.Seq.prototype.eval = function (state) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    var factor = this.factors[idx];

    if (!state.eval(factor)) {
      return false;
    }
  }

  return true;
};

pexprs.Iter.prototype.eval = function (state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var arity = this.getArity();
  var cols = [];
  var colOffsets = [];

  while (cols.length < arity) {
    cols.push([]);
    colOffsets.push([]);
  }

  var numMatches = 0;
  var idx;

  while (numMatches < this.maxNumMatches && state.eval(this.expr)) {
    numMatches++;

    var row = state._bindings.splice(state._bindings.length - arity, arity);

    var rowOffsets = state._bindingOffsets.splice(state._bindingOffsets.length - arity, arity);

    for (idx = 0; idx < row.length; idx++) {
      cols[idx].push(row[idx]);
      colOffsets[idx].push(rowOffsets[idx]);
    }
  }

  if (numMatches < this.minNumMatches) {
    return false;
  }

  var offset = state.posToOffset(origPos);
  var matchLength = 0;

  if (numMatches > 0) {
    var lastCol = cols[arity - 1];
    var lastColOffsets = colOffsets[arity - 1];
    var endOffset = lastColOffsets[lastColOffsets.length - 1] + lastCol[lastCol.length - 1].matchLength;
    offset = colOffsets[0][0];
    matchLength = endOffset - offset;
  }

  var isOptional = this instanceof pexprs.Opt;

  for (idx = 0; idx < cols.length; idx++) {
    state._bindings.push(new IterationNode(state.grammar, cols[idx], colOffsets[idx], matchLength, isOptional));

    state._bindingOffsets.push(offset);
  }

  return true;
};

pexprs.Not.prototype.eval = function (state) {
  /*
    TODO:
    - Right now we're just throwing away all of the failures that happen inside a `not`, and
      recording `this` as a failed expression.
    - Double negation should be equivalent to lookahead, but that's not the case right now wrt
      failures. E.g., ~~'foo' produces a failure for ~~'foo', but maybe it should produce
      a failure for 'foo' instead.
  */
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  state.pushFailuresInfo();
  var ans = state.eval(this.expr);
  state.popFailuresInfo();

  if (ans) {
    state.processFailure(origPos, this);
    return false;
  }

  inputStream.pos = origPos;
  return true;
};

pexprs.Lookahead.prototype.eval = function (state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;

  if (state.eval(this.expr)) {
    inputStream.pos = origPos;
    return true;
  } else {
    return false;
  }
};

pexprs.Apply.prototype.eval = function (state) {
  var caller = state.currentApplication();
  var actuals = caller ? caller.args : [];
  var app = this.substituteParams(actuals);
  var posInfo = state.getCurrentPosInfo();

  if (posInfo.isActive(app)) {
    // This rule is already active at this position, i.e., it is left-recursive.
    return app.handleCycle(state);
  }

  var memoKey = app.toMemoKey();
  var memoRec = posInfo.memo[memoKey];

  if (memoRec && posInfo.shouldUseMemoizedResult(memoRec)) {
    if (state.hasNecessaryInfo(memoRec)) {
      return state.useMemoizedResult(state.inputStream.pos, memoRec);
    }

    delete posInfo.memo[memoKey];
  }

  return app.reallyEval(state);
};

pexprs.Apply.prototype.handleCycle = function (state) {
  var posInfo = state.getCurrentPosInfo();
  var currentLeftRecursion = posInfo.currentLeftRecursion;
  var memoKey = this.toMemoKey();
  var memoRec = posInfo.memo[memoKey];

  if (currentLeftRecursion && currentLeftRecursion.headApplication.toMemoKey() === memoKey) {
    // We already know about this left recursion, but it's possible there are "involved
    // applications" that we don't already know about, so...
    memoRec.updateInvolvedApplicationMemoKeys();
  } else if (!memoRec) {
    // New left recursion detected! Memoize a failure to try to get a seed parse.
    memoRec = posInfo.memoize(memoKey, {
      matchLength: 0,
      examinedLength: 0,
      value: false,
      rightmostFailureOffset: -1
    });
    posInfo.startLeftRecursion(this, memoRec);
  }

  return state.useMemoizedResult(state.inputStream.pos, memoRec);
};

pexprs.Apply.prototype.reallyEval = function (state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var origPosInfo = state.getCurrentPosInfo();
  var ruleInfo = state.grammar.rules[this.ruleName];
  var body = ruleInfo.body;
  var description = ruleInfo.description;
  state.enterApplication(origPosInfo, this);

  if (description) {
    state.pushFailuresInfo();
  } // Reset the input stream's examinedLength property so that we can track
  // the examined length of this particular application.


  var origInputStreamExaminedLength = inputStream.examinedLength;
  inputStream.examinedLength = 0;
  var value = this.evalOnce(body, state);
  var currentLR = origPosInfo.currentLeftRecursion;
  var memoKey = this.toMemoKey();
  var isHeadOfLeftRecursion = currentLR && currentLR.headApplication.toMemoKey() === memoKey;
  var memoRec;

  if (isHeadOfLeftRecursion) {
    value = this.growSeedResult(body, state, origPos, currentLR, value);
    origPosInfo.endLeftRecursion();
    memoRec = currentLR;
    memoRec.examinedLength = inputStream.examinedLength - origPos;
    memoRec.rightmostFailureOffset = state._getRightmostFailureOffset();
    origPosInfo.memoize(memoKey, memoRec); // updates origPosInfo's maxExaminedLength
  } else if (!currentLR || !currentLR.isInvolved(memoKey)) {
    // This application is not involved in left recursion, so it's ok to memoize it.
    memoRec = origPosInfo.memoize(memoKey, {
      matchLength: inputStream.pos - origPos,
      examinedLength: inputStream.examinedLength - origPos,
      value: value,
      failuresAtRightmostPosition: state.cloneRecordedFailures(),
      rightmostFailureOffset: state._getRightmostFailureOffset()
    });
  }

  var succeeded = !!value;

  if (description) {
    state.popFailuresInfo();

    if (!succeeded) {
      state.processFailure(origPos, this);
    }

    if (memoRec) {
      memoRec.failuresAtRightmostPosition = state.cloneRecordedFailures();
    }
  } // Record trace information in the memo table, so that it is available if the memoized result
  // is used later.


  if (state.isTracing() && memoRec) {
    var entry = state.getTraceEntry(origPos, this, succeeded, succeeded ? [value] : []);

    if (isHeadOfLeftRecursion) {
      common.assert(entry.terminatingLREntry != null || !succeeded);
      entry.isHeadOfLeftRecursion = true;
    }

    memoRec.traceEntry = entry;
  } // Fix the input stream's examinedLength -- it should be the maximum examined length
  // across all applications, not just this one.


  inputStream.examinedLength = Math.max(inputStream.examinedLength, origInputStreamExaminedLength);
  state.exitApplication(origPosInfo, value);
  return succeeded;
};

pexprs.Apply.prototype.evalOnce = function (expr, state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;

  if (state.eval(expr)) {
    var arity = expr.getArity();

    var bindings = state._bindings.splice(state._bindings.length - arity, arity);

    var offsets = state._bindingOffsets.splice(state._bindingOffsets.length - arity, arity);

    return new NonterminalNode(state.grammar, this.ruleName, bindings, offsets, inputStream.pos - origPos);
  } else {
    return false;
  }
};

pexprs.Apply.prototype.growSeedResult = function (body, state, origPos, lrMemoRec, newValue) {
  if (!newValue) {
    return false;
  }

  var inputStream = state.inputStream;

  while (true) {
    lrMemoRec.matchLength = inputStream.pos - origPos;
    lrMemoRec.value = newValue;
    lrMemoRec.failuresAtRightmostPosition = state.cloneRecordedFailures();

    if (state.isTracing()) {
      // Before evaluating the body again, add a trace node for this application to the memo entry.
      // Its only child is a copy of the trace node from `newValue`, which will always be the last
      // element in `state.trace`.
      var seedTrace = state.trace[state.trace.length - 1];
      lrMemoRec.traceEntry = new Trace(state.input, origPos, inputStream.pos, this, true, [newValue], [seedTrace.clone()]);
    }

    inputStream.pos = origPos;
    newValue = this.evalOnce(body, state);

    if (inputStream.pos - origPos <= lrMemoRec.matchLength) {
      break;
    }

    if (state.isTracing()) {
      state.trace.splice(-2, 1); // Drop the trace for the old seed.
    }
  }

  if (state.isTracing()) {
    // The last entry is for an unused result -- pop it and save it in the "real" entry.
    lrMemoRec.traceEntry.recordLRTermination(state.trace.pop(), newValue);
  }

  inputStream.pos = origPos + lrMemoRec.matchLength;
  return lrMemoRec.value;
};

pexprs.UnicodeChar.prototype.eval = function (state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var ch = inputStream.next();

  if (ch && this.pattern.test(ch)) {
    state.pushBinding(new TerminalNode(state.grammar, ch), origPos);
    return true;
  } else {
    state.processFailure(origPos, this);
    return false;
  }
};
},{"./Trace":"NY7q","./common":"g606","./nodes":"m4FS","./pexprs":"RYLI"}],"ftQR":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');

var pexprs = require('./pexprs'); // --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------


pexprs.PExpr.prototype.getArity = common.abstract('getArity');

pexprs.any.getArity = pexprs.end.getArity = pexprs.Terminal.prototype.getArity = pexprs.Range.prototype.getArity = pexprs.Param.prototype.getArity = pexprs.Apply.prototype.getArity = pexprs.UnicodeChar.prototype.getArity = function () {
  return 1;
};

pexprs.Alt.prototype.getArity = function () {
  // This is ok b/c all terms must have the same arity -- this property is
  // checked by the Grammar constructor.
  return this.terms.length === 0 ? 0 : this.terms[0].getArity();
};

pexprs.Seq.prototype.getArity = function () {
  var arity = 0;

  for (var idx = 0; idx < this.factors.length; idx++) {
    arity += this.factors[idx].getArity();
  }

  return arity;
};

pexprs.Iter.prototype.getArity = function () {
  return this.expr.getArity();
};

pexprs.Not.prototype.getArity = function () {
  return 0;
};

pexprs.Lookahead.prototype.getArity = pexprs.Lex.prototype.getArity = function () {
  return this.expr.getArity();
};
},{"./common":"g606","./pexprs":"RYLI"}],"wduc":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');

var pexprs = require('./pexprs'); // --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------


function flatten(listOfLists) {
  return Array.prototype.concat.apply([], listOfLists);
} // --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------


pexprs.PExpr.prototype.generateExample = common.abstract('generateExample');

function categorizeExamples(examples) {
  // A list of rules that the system needs examples of, in order to generate an example
  //   for the current rule
  var examplesNeeded = examples.filter(function (example) {
    return example.hasOwnProperty('examplesNeeded');
  }).map(function (example) {
    return example.examplesNeeded;
  });
  examplesNeeded = flatten(examplesNeeded);
  var uniqueExamplesNeeded = {};

  for (var i = 0; i < examplesNeeded.length; i++) {
    var currentExampleNeeded = examplesNeeded[i];
    uniqueExamplesNeeded[currentExampleNeeded] = true;
  }

  examplesNeeded = Object.keys(uniqueExamplesNeeded); // A list of successfully generated examples

  var successfulExamples = examples.filter(function (example) {
    return example.hasOwnProperty('value');
  }).map(function (item) {
    return item.value;
  }); // This flag returns true if the system cannot generate the rule it is currently
  //   attempting to generate, regardless of whether or not it has the examples it needs.
  //   Currently, this is only used in overriding generators to prevent the system from
  //   generating examples for certain rules (e.g. 'ident').

  var needHelp = examples.some(function (item) {
    return item.needHelp;
  });
  return {
    examplesNeeded: examplesNeeded,
    successfulExamples: successfulExamples,
    needHelp: needHelp
  };
}

pexprs.any.generateExample = function (grammar, examples, inSyntacticContext, actuals) {
  return {
    value: String.fromCharCode(Math.floor(Math.random() * 255))
  };
}; // Assumes that terminal's object is always a string


pexprs.Terminal.prototype.generateExample = function (grammar, examples, inSyntacticContext) {
  return {
    value: this.obj
  };
};

pexprs.Range.prototype.generateExample = function (grammar, examples, inSyntacticContext) {
  var rangeSize = this.to.charCodeAt(0) - this.from.charCodeAt(0);
  return {
    value: String.fromCharCode(this.from.charCodeAt(0) + Math.floor(rangeSize * Math.random()))
  };
};

pexprs.Param.prototype.generateExample = function (grammar, examples, inSyntacticContext, actuals) {
  return actuals[this.index].generateExample(grammar, examples, inSyntacticContext, actuals);
};

pexprs.Alt.prototype.generateExample = function (grammar, examples, inSyntacticContext, actuals) {
  // items -> termExamples
  var termExamples = this.terms.map(function (term) {
    return term.generateExample(grammar, examples, inSyntacticContext, actuals);
  });
  var categorizedExamples = categorizeExamples(termExamples);
  var examplesNeeded = categorizedExamples.examplesNeeded;
  var successfulExamples = categorizedExamples.successfulExamples;
  var needHelp = categorizedExamples.needHelp;
  var ans = {}; // Alt can contain both an example and a request for examples

  if (successfulExamples.length > 0) {
    var i = Math.floor(Math.random() * successfulExamples.length);
    ans.value = successfulExamples[i];
  }

  if (examplesNeeded.length > 0) {
    ans.examplesNeeded = examplesNeeded;
  }

  ans.needHelp = needHelp;
  return ans;
};

pexprs.Seq.prototype.generateExample = function (grammar, examples, inSyntacticContext, actuals) {
  var factorExamples = this.factors.map(function (factor) {
    return factor.generateExample(grammar, examples, inSyntacticContext, actuals);
  });
  var categorizedExamples = categorizeExamples(factorExamples);
  var examplesNeeded = categorizedExamples.examplesNeeded;
  var successfulExamples = categorizedExamples.successfulExamples;
  var needHelp = categorizedExamples.needHelp;
  var ans = {}; // In a Seq, all pieces must succeed in order to have a successful example.

  if (examplesNeeded.length > 0 || needHelp) {
    ans.examplesNeeded = examplesNeeded;
    ans.needHelp = needHelp;
  } else {
    ans.value = successfulExamples.join(inSyntacticContext ? ' ' : '');
  }

  return ans;
};

pexprs.Iter.prototype.generateExample = function (grammar, examples, inSyntacticContext, actuals) {
  var rangeTimes = Math.min(this.maxNumMatches - this.minNumMatches, 3);
  var numTimes = Math.floor(Math.random() * (rangeTimes + 1) + this.minNumMatches);
  var items = [];

  for (var i = 0; i < numTimes; i++) {
    items.push(this.expr.generateExample(grammar, examples, inSyntacticContext, actuals));
  }

  var categorizedExamples = categorizeExamples(items);
  var examplesNeeded = categorizedExamples.examplesNeeded;
  var successfulExamples = categorizedExamples.successfulExamples;
  var ans = {}; // It's always either one or the other.
  // TODO: instead of ' ', call 'spaces.generateExample()'

  ans.value = successfulExamples.join(inSyntacticContext ? ' ' : '');

  if (examplesNeeded.length > 0) {
    ans.examplesNeeded = examplesNeeded;
  }

  return ans;
}; // Right now, 'Not' and 'Lookahead' generate nothing and assume that whatever follows will
//   work according to the encoded constraints.


pexprs.Not.prototype.generateExample = function (grammar, examples, inSyntacticContext) {
  return {
    value: ''
  };
};

pexprs.Lookahead.prototype.generateExample = function (grammar, examples, inSyntacticContext) {
  return {
    value: ''
  };
};

pexprs.Lex.prototype.generateExample = function (grammar, examples, inSyntacticContext, actuals) {
  return this.expr.generateExample(grammar, examples, false, actuals);
};

pexprs.Apply.prototype.generateExample = function (grammar, examples, inSyntacticContext, actuals) {
  var ans = {};
  var ruleName = this.substituteParams(actuals).toString();

  if (!examples.hasOwnProperty(ruleName)) {
    ans.examplesNeeded = [ruleName];
  } else {
    var relevantExamples = examples[ruleName];
    var i = Math.floor(Math.random() * relevantExamples.length);
    ans.value = relevantExamples[i];
  }

  return ans;
};

pexprs.UnicodeChar.prototype.generateExample = function (grammar, examples, inSyntacticContext, actuals) {
  var char;

  switch (this.category) {
    case 'Lu':
      char = 'Á';
      break;

    case 'Ll':
      char = 'ŏ';
      break;

    case 'Lt':
      char = 'ǅ';
      break;

    case 'Lm':
      char = 'ˮ';
      break;

    case 'Lo':
      char = 'ƻ';
      break;

    case 'Nl':
      char = 'ↂ';
      break;

    case 'Nd':
      char = '½';
      break;

    case 'Mn':
      char = '\u0487';
      break;

    case 'Mc':
      char = 'ि';
      break;

    case 'Pc':
      char = '⁀';
      break;

    case 'Zs':
      char = '\u2001';
      break;

    case 'L':
      char = 'Á';
      break;

    case 'Ltmo':
      char = 'ǅ';
      break;
  }

  return {
    value: char
  }; // 💩
};
},{"./common":"g606","./pexprs":"RYLI"}],"b/bU":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');

var pexprs = require('./pexprs'); // --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------


function getMetaInfo(expr, grammarInterval) {
  var metaInfo = {};

  if (expr.source && grammarInterval) {
    var adjusted = expr.source.relativeTo(grammarInterval);
    metaInfo.sourceInterval = [adjusted.startIdx, adjusted.endIdx];
  }

  return metaInfo;
} // --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------


pexprs.PExpr.prototype.outputRecipe = common.abstract('outputRecipe');

pexprs.any.outputRecipe = function (formals, grammarInterval) {
  return ['any', getMetaInfo(this, grammarInterval)];
};

pexprs.end.outputRecipe = function (formals, grammarInterval) {
  return ['end', getMetaInfo(this, grammarInterval)];
};

pexprs.Terminal.prototype.outputRecipe = function (formals, grammarInterval) {
  return ['terminal', getMetaInfo(this, grammarInterval), this.obj];
};

pexprs.Range.prototype.outputRecipe = function (formals, grammarInterval) {
  return ['range', getMetaInfo(this, grammarInterval), this.from, this.to];
};

pexprs.Param.prototype.outputRecipe = function (formals, grammarInterval) {
  return ['param', getMetaInfo(this, grammarInterval), this.index];
};

pexprs.Alt.prototype.outputRecipe = function (formals, grammarInterval) {
  return ['alt', getMetaInfo(this, grammarInterval)].concat(this.terms.map(function (term) {
    return term.outputRecipe(formals, grammarInterval);
  }));
};

pexprs.Extend.prototype.outputRecipe = function (formals, grammarInterval) {
  var extension = this.terms[0]; // [extension, orginal]

  return extension.outputRecipe(formals, grammarInterval);
};

pexprs.Seq.prototype.outputRecipe = function (formals, grammarInterval) {
  return ['seq', getMetaInfo(this, grammarInterval)].concat(this.factors.map(function (factor) {
    return factor.outputRecipe(formals, grammarInterval);
  }));
};

pexprs.Star.prototype.outputRecipe = pexprs.Plus.prototype.outputRecipe = pexprs.Opt.prototype.outputRecipe = pexprs.Not.prototype.outputRecipe = pexprs.Lookahead.prototype.outputRecipe = pexprs.Lex.prototype.outputRecipe = function (formals, grammarInterval) {
  return [this.constructor.name.toLowerCase(), getMetaInfo(this, grammarInterval), this.expr.outputRecipe(formals, grammarInterval)];
};

pexprs.Apply.prototype.outputRecipe = function (formals, grammarInterval) {
  return ['app', getMetaInfo(this, grammarInterval), this.ruleName, this.args.map(function (arg) {
    return arg.outputRecipe(formals, grammarInterval);
  })];
};

pexprs.UnicodeChar.prototype.outputRecipe = function (formals, grammarInterval) {
  return ['unicodeChar', getMetaInfo(this, grammarInterval), this.category];
};
},{"./common":"g606","./pexprs":"RYLI"}],"JA8m":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');

var pexprs = require('./pexprs'); // --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  Called at grammar creation time to rewrite a rule body, replacing each reference to a formal
  parameter with a `Param` node. Returns a PExpr -- either a new one, or the original one if
  it was modified in place.
*/


pexprs.PExpr.prototype.introduceParams = common.abstract('introduceParams');

pexprs.any.introduceParams = pexprs.end.introduceParams = pexprs.Terminal.prototype.introduceParams = pexprs.Range.prototype.introduceParams = pexprs.Param.prototype.introduceParams = pexprs.UnicodeChar.prototype.introduceParams = function (formals) {
  return this;
};

pexprs.Alt.prototype.introduceParams = function (formals) {
  this.terms.forEach(function (term, idx, terms) {
    terms[idx] = term.introduceParams(formals);
  });
  return this;
};

pexprs.Seq.prototype.introduceParams = function (formals) {
  this.factors.forEach(function (factor, idx, factors) {
    factors[idx] = factor.introduceParams(formals);
  });
  return this;
};

pexprs.Iter.prototype.introduceParams = pexprs.Not.prototype.introduceParams = pexprs.Lookahead.prototype.introduceParams = pexprs.Lex.prototype.introduceParams = function (formals) {
  this.expr = this.expr.introduceParams(formals);
  return this;
};

pexprs.Apply.prototype.introduceParams = function (formals) {
  var index = formals.indexOf(this.ruleName);

  if (index >= 0) {
    if (this.args.length > 0) {
      // TODO: Should this be supported? See issue #64.
      throw new Error('Parameterized rules cannot be passed as arguments to another rule.');
    }

    return new pexprs.Param(index);
  } else {
    this.args.forEach(function (arg, idx, args) {
      args[idx] = arg.introduceParams(formals);
    });
    return this;
  }
};
},{"./common":"g606","./pexprs":"RYLI"}],"n8kQ":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');

var pexprs = require('./pexprs'); // --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
// Returns `true` if this parsing expression may accept without consuming any input.


pexprs.PExpr.prototype.isNullable = function (grammar) {
  return this._isNullable(grammar, Object.create(null));
};

pexprs.PExpr.prototype._isNullable = common.abstract('_isNullable');

pexprs.any._isNullable = pexprs.Range.prototype._isNullable = pexprs.Param.prototype._isNullable = pexprs.Plus.prototype._isNullable = pexprs.UnicodeChar.prototype._isNullable = function (grammar, memo) {
  return false;
};

pexprs.end._isNullable = function (grammar, memo) {
  return true;
};

pexprs.Terminal.prototype._isNullable = function (grammar, memo) {
  if (typeof this.obj === 'string') {
    // This is an over-simplification: it's only correct if the input is a string. If it's an array
    // or an object, then the empty string parsing expression is not nullable.
    return this.obj === '';
  } else {
    return false;
  }
};

pexprs.Alt.prototype._isNullable = function (grammar, memo) {
  return this.terms.length === 0 || this.terms.some(function (term) {
    return term._isNullable(grammar, memo);
  });
};

pexprs.Seq.prototype._isNullable = function (grammar, memo) {
  return this.factors.every(function (factor) {
    return factor._isNullable(grammar, memo);
  });
};

pexprs.Star.prototype._isNullable = pexprs.Opt.prototype._isNullable = pexprs.Not.prototype._isNullable = pexprs.Lookahead.prototype._isNullable = function (grammar, memo) {
  return true;
};

pexprs.Lex.prototype._isNullable = function (grammar, memo) {
  return this.expr._isNullable(grammar, memo);
};

pexprs.Apply.prototype._isNullable = function (grammar, memo) {
  var key = this.toMemoKey();

  if (!Object.prototype.hasOwnProperty.call(memo, key)) {
    var body = grammar.rules[this.ruleName].body;
    var inlined = body.substituteParams(this.args);
    memo[key] = false; // Prevent infinite recursion for recursive rules.

    memo[key] = inlined._isNullable(grammar, memo);
  }

  return memo[key];
};
},{"./common":"g606","./pexprs":"RYLI"}],"UsCk":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');

var pexprs = require('./pexprs'); // --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  Returns a PExpr that results from recursively replacing every formal parameter (i.e., instance
  of `Param`) inside this PExpr with its actual value from `actuals` (an Array).

  The receiver must not be modified; a new PExpr must be returned if any replacement is necessary.
*/
// function(actuals) { ... }


pexprs.PExpr.prototype.substituteParams = common.abstract('substituteParams');

pexprs.any.substituteParams = pexprs.end.substituteParams = pexprs.Terminal.prototype.substituteParams = pexprs.Range.prototype.substituteParams = pexprs.UnicodeChar.prototype.substituteParams = function (actuals) {
  return this;
};

pexprs.Param.prototype.substituteParams = function (actuals) {
  return actuals[this.index];
};

pexprs.Alt.prototype.substituteParams = function (actuals) {
  return new pexprs.Alt(this.terms.map(function (term) {
    return term.substituteParams(actuals);
  }));
};

pexprs.Seq.prototype.substituteParams = function (actuals) {
  return new pexprs.Seq(this.factors.map(function (factor) {
    return factor.substituteParams(actuals);
  }));
};

pexprs.Iter.prototype.substituteParams = pexprs.Not.prototype.substituteParams = pexprs.Lookahead.prototype.substituteParams = pexprs.Lex.prototype.substituteParams = function (actuals) {
  return new this.constructor(this.expr.substituteParams(actuals));
};

pexprs.Apply.prototype.substituteParams = function (actuals) {
  if (this.args.length === 0) {
    // Avoid making a copy of this application, as an optimization
    return this;
  } else {
    var args = this.args.map(function (arg) {
      return arg.substituteParams(actuals);
    });
    return new pexprs.Apply(this.ruleName, args);
  }
};
},{"./common":"g606","./pexprs":"RYLI"}],"G8m9":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');

var pexprs = require('./pexprs'); // --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
// Returns a string representing the PExpr, for use as a UI label, etc.


pexprs.PExpr.prototype.toDisplayString = common.abstract('toDisplayString');

pexprs.Alt.prototype.toDisplayString = pexprs.Seq.prototype.toDisplayString = function () {
  if (this.source) {
    return this.source.trimmed().contents;
  }

  return '[' + this.constructor.name + ']';
};

pexprs.any.toDisplayString = pexprs.end.toDisplayString = pexprs.Iter.prototype.toDisplayString = pexprs.Not.prototype.toDisplayString = pexprs.Lookahead.prototype.toDisplayString = pexprs.Lex.prototype.toDisplayString = pexprs.Terminal.prototype.toDisplayString = pexprs.Range.prototype.toDisplayString = pexprs.Param.prototype.toDisplayString = function () {
  return this.toString();
};

pexprs.Apply.prototype.toDisplayString = function () {
  if (this.args.length > 0) {
    var ps = this.args.map(function (arg) {
      return arg.toDisplayString();
    });
    return this.ruleName + '<' + ps.join(',') + '>';
  } else {
    return this.ruleName;
  }
};

pexprs.UnicodeChar.prototype.toDisplayString = function () {
  return 'Unicode [' + this.category + '] character';
};
},{"./common":"g606","./pexprs":"RYLI"}],"PpFv":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');

var pexprs = require('./pexprs');

var copyWithoutDuplicates = common.copyWithoutDuplicates; // --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function isRestrictedJSIdentifier(str) {
  return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(str);
}

function resolveDuplicatedNames(argumentNameList) {
  // `count` is used to record the number of times each argument name occurs in the list,
  // this is useful for checking duplicated argument name. It maps argument names to ints.
  var count = Object.create(null);
  argumentNameList.forEach(function (argName) {
    count[argName] = (count[argName] || 0) + 1;
  }); // Append subscripts ('_1', '_2', ...) to duplicate argument names.

  Object.keys(count).forEach(function (dupArgName) {
    if (count[dupArgName] <= 1) {
      return;
    } // This name shows up more than once, so add subscripts.


    var subscript = 1;
    argumentNameList.forEach(function (argName, idx) {
      if (argName === dupArgName) {
        argumentNameList[idx] = argName + '_' + subscript++;
      }
    });
  });
} // --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  Returns a list of strings that will be used as the default argument names for its receiver
  (a pexpr) in a semantic action. This is used exclusively by the Semantics Editor.

  `firstArgIndex` is the 1-based index of the first argument name that will be generated for this
  pexpr. It enables us to name arguments positionally, e.g., if the second argument is a
  non-alphanumeric terminal like "+", it will be named '$2'.

  `noDupCheck` is true if the caller of `toArgumentNameList` is not a top level caller. It enables
  us to avoid nested duplication subscripts appending, e.g., '_1_1', '_1_2', by only checking
  duplicates at the top level.

  Here is a more elaborate example that illustrates how this method works:
  `(a "+" b).toArgumentNameList(1)` evaluates to `['a', '$2', 'b']` with the following recursive
  calls:

    (a).toArgumentNameList(1) -> ['a'],
    ("+").toArgumentNameList(2) -> ['$2'],
    (b).toArgumentNameList(3) -> ['b']

  Notes:
  * This method must only be called on well-formed expressions, e.g., the receiver must
    not have any Alt sub-expressions with inconsistent arities.
  * e.getArity() === e.toArgumentNameList(1).length
*/
// function(firstArgIndex, noDupCheck) { ... }


pexprs.PExpr.prototype.toArgumentNameList = common.abstract('toArgumentNameList');

pexprs.any.toArgumentNameList = function (firstArgIndex, noDupCheck) {
  return ['any'];
};

pexprs.end.toArgumentNameList = function (firstArgIndex, noDupCheck) {
  return ['end'];
};

pexprs.Terminal.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
  if (typeof this.obj === 'string' && /^[_a-zA-Z0-9]+$/.test(this.obj)) {
    // If this terminal is a valid suffix for a JS identifier, just prepend it with '_'
    return ['_' + this.obj];
  } else {
    // Otherwise, name it positionally.
    return ['$' + firstArgIndex];
  }
};

pexprs.Range.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
  var argName = this.from + '_to_' + this.to; // If the `argName` is not valid then try to prepend a `_`.

  if (!isRestrictedJSIdentifier(argName)) {
    argName = '_' + argName;
  } // If the `argName` still not valid after prepending a `_`, then name it positionally.


  if (!isRestrictedJSIdentifier(argName)) {
    argName = '$' + firstArgIndex;
  }

  return [argName];
};

pexprs.Alt.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
  // `termArgNameLists` is an array of arrays where each row is the
  // argument name list that corresponds to a term in this alternation.
  var termArgNameLists = this.terms.map(function (term) {
    return term.toArgumentNameList(firstArgIndex, true);
  });
  var argumentNameList = [];
  var numArgs = termArgNameLists[0].length;

  for (var colIdx = 0; colIdx < numArgs; colIdx++) {
    var col = [];

    for (var rowIdx = 0; rowIdx < this.terms.length; rowIdx++) {
      col.push(termArgNameLists[rowIdx][colIdx]);
    }

    var uniqueNames = copyWithoutDuplicates(col);
    argumentNameList.push(uniqueNames.join('_or_'));
  }

  if (!noDupCheck) {
    resolveDuplicatedNames(argumentNameList);
  }

  return argumentNameList;
};

pexprs.Seq.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
  // Generate the argument name list, without worrying about duplicates.
  var argumentNameList = [];
  this.factors.forEach(function (factor) {
    var factorArgumentNameList = factor.toArgumentNameList(firstArgIndex, true);
    argumentNameList = argumentNameList.concat(factorArgumentNameList); // Shift the firstArgIndex to take this factor's argument names into account.

    firstArgIndex += factorArgumentNameList.length;
  });

  if (!noDupCheck) {
    resolveDuplicatedNames(argumentNameList);
  }

  return argumentNameList;
};

pexprs.Iter.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
  var argumentNameList = this.expr.toArgumentNameList(firstArgIndex, noDupCheck).map(function (exprArgumentString) {
    return exprArgumentString[exprArgumentString.length - 1] === 's' ? exprArgumentString + 'es' : exprArgumentString + 's';
  });

  if (!noDupCheck) {
    resolveDuplicatedNames(argumentNameList);
  }

  return argumentNameList;
};

pexprs.Opt.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
  return this.expr.toArgumentNameList(firstArgIndex, noDupCheck).map(function (argName) {
    return 'opt' + argName[0].toUpperCase() + argName.slice(1);
  });
};

pexprs.Not.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
  return [];
};

pexprs.Lookahead.prototype.toArgumentNameList = pexprs.Lex.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
  return this.expr.toArgumentNameList(firstArgIndex, noDupCheck);
};

pexprs.Apply.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
  return [this.ruleName];
};

pexprs.UnicodeChar.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
  return ['$' + firstArgIndex];
};

pexprs.Param.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
  return ['param' + this.index];
}; // "Value pexprs" (Value, Str, Arr, Obj) are going away soon, so we don't worry about them here.
},{"./common":"g606","./pexprs":"RYLI"}],"2pVM":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Failure = require('./Failure');

var common = require('./common');

var pexprs = require('./pexprs'); // --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------


pexprs.PExpr.prototype.toFailure = common.abstract('toFailure');

pexprs.any.toFailure = function (grammar) {
  return new Failure(this, 'any object', 'description');
};

pexprs.end.toFailure = function (grammar) {
  return new Failure(this, 'end of input', 'description');
};

pexprs.Terminal.prototype.toFailure = function (grammar) {
  return new Failure(this, this.obj, 'string');
};

pexprs.Range.prototype.toFailure = function (grammar) {
  // TODO: come up with something better
  return new Failure(this, JSON.stringify(this.from) + '..' + JSON.stringify(this.to), 'code');
};

pexprs.Not.prototype.toFailure = function (grammar) {
  var description = this.expr === pexprs.any ? 'nothing' : 'not ' + this.expr.toFailure(grammar);
  return new Failure(this, description, 'description');
};

pexprs.Lookahead.prototype.toFailure = function (grammar) {
  return this.expr.toFailure(grammar);
};

pexprs.Apply.prototype.toFailure = function (grammar) {
  var description = grammar.rules[this.ruleName].description;

  if (!description) {
    var article = /^[aeiouAEIOU]/.test(this.ruleName) ? 'an' : 'a';
    description = article + ' ' + this.ruleName;
  }

  return new Failure(this, description, 'description');
};

pexprs.UnicodeChar.prototype.toFailure = function (grammar) {
  return new Failure(this, 'a Unicode [' + this.category + '] character', 'description');
};

pexprs.Alt.prototype.toFailure = function (grammar) {
  var fs = this.terms.map(function (t) {
    return t.toFailure();
  });
  var description = '(' + fs.join(' or ') + ')';
  return new Failure(this, description, 'description');
};

pexprs.Seq.prototype.toFailure = function (grammar) {
  var fs = this.factors.map(function (f) {
    return f.toFailure();
  });
  var description = '(' + fs.join(' ') + ')';
  return new Failure(this, description, 'description');
};

pexprs.Iter.prototype.toFailure = function (grammar) {
  var description = '(' + this.expr.toFailure() + this.operator + ')';
  return new Failure(this, description, 'description');
};
},{"./Failure":"8tZR","./common":"g606","./pexprs":"RYLI"}],"FsFe":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');

var pexprs = require('./pexprs'); // --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  e1.toString() === e2.toString() ==> e1 and e2 are semantically equivalent.
  Note that this is not an iff (<==>): e.g.,
  (~"b" "a").toString() !== ("a").toString(), even though
  ~"b" "a" and "a" are interchangeable in any grammar,
  both in terms of the languages they accept and their arities.
*/


pexprs.PExpr.prototype.toString = common.abstract('toString');

pexprs.any.toString = function () {
  return 'any';
};

pexprs.end.toString = function () {
  return 'end';
};

pexprs.Terminal.prototype.toString = function () {
  return JSON.stringify(this.obj);
};

pexprs.Range.prototype.toString = function () {
  return JSON.stringify(this.from) + '..' + JSON.stringify(this.to);
};

pexprs.Param.prototype.toString = function () {
  return '$' + this.index;
};

pexprs.Lex.prototype.toString = function () {
  return '#(' + this.expr.toString() + ')';
};

pexprs.Alt.prototype.toString = function () {
  return this.terms.length === 1 ? this.terms[0].toString() : '(' + this.terms.map(function (term) {
    return term.toString();
  }).join(' | ') + ')';
};

pexprs.Seq.prototype.toString = function () {
  return this.factors.length === 1 ? this.factors[0].toString() : '(' + this.factors.map(function (factor) {
    return factor.toString();
  }).join(' ') + ')';
};

pexprs.Iter.prototype.toString = function () {
  return this.expr + this.operator;
};

pexprs.Not.prototype.toString = function () {
  return '~' + this.expr;
};

pexprs.Lookahead.prototype.toString = function () {
  return '&' + this.expr;
};

pexprs.Apply.prototype.toString = function () {
  if (this.args.length > 0) {
    var ps = this.args.map(function (arg) {
      return arg.toString();
    });
    return this.ruleName + '<' + ps.join(',') + '>';
  } else {
    return this.ruleName;
  }
};

pexprs.UnicodeChar.prototype.toString = function () {
  return '\\p{' + this.category + '}';
};
},{"./common":"g606","./pexprs":"RYLI"}],"RYLI":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var UnicodeCategories = require('../third_party/UnicodeCategories');

var common = require('./common');

var inherits = require('inherits'); // --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
// General stuff


function PExpr() {
  throw new Error("PExpr cannot be instantiated -- it's abstract");
} // Set the `source` property to the interval containing the source for this expression.


PExpr.prototype.withSource = function (interval) {
  if (interval) {
    this.source = interval.trimmed();
  }

  return this;
}; // Any


var any = Object.create(PExpr.prototype); // End

var end = Object.create(PExpr.prototype); // Terminals

function Terminal(obj) {
  this.obj = obj;
}

inherits(Terminal, PExpr); // Ranges

function Range(from, to) {
  this.from = from;
  this.to = to;
}

inherits(Range, PExpr); // Parameters

function Param(index) {
  this.index = index;
}

inherits(Param, PExpr); // Alternation

function Alt(terms) {
  this.terms = terms;
}

inherits(Alt, PExpr); // Extend is an implementation detail of rule extension

function Extend(superGrammar, name, body) {
  this.superGrammar = superGrammar;
  this.name = name;
  this.body = body;
  var origBody = superGrammar.rules[name].body;
  this.terms = [body, origBody];
}

inherits(Extend, Alt); // Sequences

function Seq(factors) {
  this.factors = factors;
}

inherits(Seq, PExpr); // Iterators and optionals

function Iter(expr) {
  this.expr = expr;
}

inherits(Iter, PExpr);

function Star(expr) {
  this.expr = expr;
}

inherits(Star, Iter);

function Plus(expr) {
  this.expr = expr;
}

inherits(Plus, Iter);

function Opt(expr) {
  this.expr = expr;
}

inherits(Opt, Iter);
Star.prototype.operator = '*';
Plus.prototype.operator = '+';
Opt.prototype.operator = '?';
Star.prototype.minNumMatches = 0;
Plus.prototype.minNumMatches = 1;
Opt.prototype.minNumMatches = 0;
Star.prototype.maxNumMatches = Number.POSITIVE_INFINITY;
Plus.prototype.maxNumMatches = Number.POSITIVE_INFINITY;
Opt.prototype.maxNumMatches = 1; // Predicates

function Not(expr) {
  this.expr = expr;
}

inherits(Not, PExpr);

function Lookahead(expr) {
  this.expr = expr;
}

inherits(Lookahead, PExpr); // "Lexification"

function Lex(expr) {
  this.expr = expr;
}

inherits(Lex, PExpr); // Rule application

function Apply(ruleName, optArgs) {
  this.ruleName = ruleName;
  this.args = optArgs || [];
}

inherits(Apply, PExpr);

Apply.prototype.isSyntactic = function () {
  return common.isSyntactic(this.ruleName);
}; // This method just caches the result of `this.toString()` in a non-enumerable property.


Apply.prototype.toMemoKey = function () {
  if (!this._memoKey) {
    Object.defineProperty(this, '_memoKey', {
      value: this.toString()
    });
  }

  return this._memoKey;
}; // Unicode character


function UnicodeChar(category) {
  this.category = category;
  this.pattern = UnicodeCategories[category];
}

inherits(UnicodeChar, PExpr); // --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.PExpr = PExpr;
exports.any = any;
exports.end = end;
exports.Terminal = Terminal;
exports.Range = Range;
exports.Param = Param;
exports.Alt = Alt;
exports.Extend = Extend;
exports.Seq = Seq;
exports.Iter = Iter;
exports.Star = Star;
exports.Plus = Plus;
exports.Opt = Opt;
exports.Not = Not;
exports.Lookahead = Lookahead;
exports.Lex = Lex;
exports.Apply = Apply;
exports.UnicodeChar = UnicodeChar; // --------------------------------------------------------------------
// Extensions
// --------------------------------------------------------------------

require('./pexprs-allowsSkippingPrecedingSpace');

require('./pexprs-assertAllApplicationsAreValid');

require('./pexprs-assertChoicesHaveUniformArity');

require('./pexprs-assertIteratedExprsAreNotNullable');

require('./pexprs-check');

require('./pexprs-eval');

require('./pexprs-getArity');

require('./pexprs-generateExample');

require('./pexprs-outputRecipe');

require('./pexprs-introduceParams');

require('./pexprs-isNullable');

require('./pexprs-substituteParams');

require('./pexprs-toDisplayString');

require('./pexprs-toArgumentNameList');

require('./pexprs-toFailure');

require('./pexprs-toString');
},{"../third_party/UnicodeCategories":"4prn","./common":"g606","inherits":"4Bm0","./pexprs-allowsSkippingPrecedingSpace":"1NN1","./pexprs-assertAllApplicationsAreValid":"kX7V","./pexprs-assertChoicesHaveUniformArity":"vDLb","./pexprs-assertIteratedExprsAreNotNullable":"FEmm","./pexprs-check":"13B8","./pexprs-eval":"/TlS","./pexprs-getArity":"ftQR","./pexprs-generateExample":"wduc","./pexprs-outputRecipe":"b/bU","./pexprs-introduceParams":"JA8m","./pexprs-isNullable":"n8kQ","./pexprs-substituteParams":"UsCk","./pexprs-toDisplayString":"G8m9","./pexprs-toArgumentNameList":"PpFv","./pexprs-toFailure":"2pVM","./pexprs-toString":"FsFe"}],"t2hR":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Failure = require('./Failure');

var TerminalNode = require('./nodes').TerminalNode;

var assert = require('./common').assert;

var inherits = require('inherits');

var pexprs = require('./pexprs');

function CaseInsensitiveTerminal(param) {
  this.obj = param;
}

inherits(CaseInsensitiveTerminal, pexprs.PExpr);
CaseInsensitiveTerminal.prototype = {
  _getString: function (state) {
    var terminal = state.currentApplication().args[this.obj.index];
    assert(terminal instanceof pexprs.Terminal, 'expected a Terminal expression');
    return terminal.obj;
  },
  // Implementation of the PExpr API
  allowsSkippingPrecedingSpace: function () {
    return true;
  },
  eval: function (state) {
    var inputStream = state.inputStream;
    var origPos = inputStream.pos;

    var matchStr = this._getString(state);

    if (!inputStream.matchString(matchStr, true)) {
      state.processFailure(origPos, this);
      return false;
    } else {
      state.pushBinding(new TerminalNode(state.grammar, matchStr), origPos);
      return true;
    }
  },
  generateExample: function (grammar, examples, inSyntacticContext, actuals) {
    // Start with a example generated from the Terminal...
    var str = this.obj.generateExample(grammar, examples, inSyntacticContext, actuals).value; // ...and randomly switch characters to uppercase/lowercase.

    var value = '';

    for (var i = 0; i < str.length; ++i) {
      value += Math.random() < 0.5 ? str[i].toLocaleLowerCase() : str[i].toLocaleUpperCase();
    }

    return {
      value: value
    };
  },
  getArity: function () {
    return 1;
  },
  substituteParams: function (actuals) {
    return new CaseInsensitiveTerminal(this.obj.substituteParams(actuals));
  },
  toDisplayString: function () {
    return this.obj.toDisplayString() + ' (case-insensitive)';
  },
  toFailure: function () {
    return new Failure(this, this.obj.toFailure() + ' (case-insensitive)', 'description');
  },
  _isNullable: function (grammar, memo) {
    return this.obj._isNullable(grammar, memo);
  }
};
module.exports = CaseInsensitiveTerminal;
},{"./Failure":"8tZR","./nodes":"m4FS","./common":"g606","inherits":"4Bm0","./pexprs":"RYLI"}],"Dwac":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Interval = require('./Interval'); // --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------


function InputStream(source) {
  this.source = source;
  this.pos = 0;
  this.examinedLength = 0;
}

InputStream.prototype = {
  atEnd: function () {
    var ans = this.pos === this.source.length;
    this.examinedLength = Math.max(this.examinedLength, this.pos + 1);
    return ans;
  },
  next: function () {
    var ans = this.source[this.pos++];
    this.examinedLength = Math.max(this.examinedLength, this.pos);
    return ans;
  },
  matchString: function (s, optIgnoreCase) {
    var idx;

    if (optIgnoreCase) {
      /*
        Case-insensitive comparison is a tricky business. Some notable gotchas include the
        "Turkish I" problem (http://www.i18nguy.com/unicode/turkish-i18n.html) and the fact
        that the German Esszet (ß) turns into "SS" in upper case.
         This is intended to be a locale-invariant comparison, which means it may not obey
        locale-specific expectations (e.g. "i" => "İ").
       */
      for (idx = 0; idx < s.length; idx++) {
        var actual = this.next();
        var expected = s[idx];

        if (actual == null || actual.toUpperCase() !== expected.toUpperCase()) {
          return false;
        }
      }

      return true;
    } // Default is case-sensitive comparison.


    for (idx = 0; idx < s.length; idx++) {
      if (this.next() !== s[idx]) {
        return false;
      }
    }

    return true;
  },
  sourceSlice: function (startIdx, endIdx) {
    return this.source.slice(startIdx, endIdx);
  },
  interval: function (startIdx, optEndIdx) {
    return new Interval(this.source, startIdx, optEndIdx ? optEndIdx : this.pos);
  }
}; // --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = InputStream;
},{"./Interval":"VvGz"}],"Sx4M":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');

var util = require('./util');

var Interval = require('./Interval'); // --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------


function MatchResult(matcher, input, startExpr, cst, cstOffset, rightmostFailurePosition, optRecordedFailures) {
  this.matcher = matcher;
  this.input = input;
  this.startExpr = startExpr;
  this._cst = cst;
  this._cstOffset = cstOffset;
  this._rightmostFailurePosition = rightmostFailurePosition;
  this._rightmostFailures = optRecordedFailures;

  if (this.failed()) {
    common.defineLazyProperty(this, 'message', function () {
      var detail = 'Expected ' + this.getExpectedText();
      return util.getLineAndColumnMessage(this.input, this.getRightmostFailurePosition()) + detail;
    });
    common.defineLazyProperty(this, 'shortMessage', function () {
      var detail = 'expected ' + this.getExpectedText();
      var errorInfo = util.getLineAndColumn(this.input, this.getRightmostFailurePosition());
      return 'Line ' + errorInfo.lineNum + ', col ' + errorInfo.colNum + ': ' + detail;
    });
  }
}

MatchResult.prototype.succeeded = function () {
  return !!this._cst;
};

MatchResult.prototype.failed = function () {
  return !this.succeeded();
};

MatchResult.prototype.getRightmostFailurePosition = function () {
  return this._rightmostFailurePosition;
};

MatchResult.prototype.getRightmostFailures = function () {
  if (!this._rightmostFailures) {
    this.matcher.setInput(this.input);

    var matchResultWithFailures = this.matcher._match(this.startExpr, false, this.getRightmostFailurePosition());

    this._rightmostFailures = matchResultWithFailures.getRightmostFailures();
  }

  return this._rightmostFailures;
};

MatchResult.prototype.toString = function () {
  return this.succeeded() ? '[match succeeded]' : '[match failed at position ' + this.getRightmostFailurePosition() + ']';
}; // Return a string summarizing the expected contents of the input stream when
// the match failure occurred.


MatchResult.prototype.getExpectedText = function () {
  if (this.succeeded()) {
    throw new Error('cannot get expected text of a successful MatchResult');
  }

  var sb = new common.StringBuffer();
  var failures = this.getRightmostFailures(); // Filter out the fluffy failures to make the default error messages more useful

  failures = failures.filter(function (failure) {
    return !failure.isFluffy();
  });

  for (var idx = 0; idx < failures.length; idx++) {
    if (idx > 0) {
      if (idx === failures.length - 1) {
        sb.append(failures.length > 2 ? ', or ' : ' or ');
      } else {
        sb.append(', ');
      }
    }

    sb.append(failures[idx].toString());
  }

  return sb.contents();
};

MatchResult.prototype.getInterval = function () {
  var pos = this.getRightmostFailurePosition();
  return new Interval(this.input, pos, pos);
}; // --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------


module.exports = MatchResult;
},{"./common":"g606","./util":"NOPz","./Interval":"VvGz"}],"dyGE":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function PosInfo() {
  this.applicationMemoKeyStack = []; // active applications at this position

  this.memo = {};
  this.maxExaminedLength = 0;
  this.maxRightmostFailureOffset = -1;
  this.currentLeftRecursion = undefined;
}

PosInfo.prototype = {
  isActive: function (application) {
    return this.applicationMemoKeyStack.indexOf(application.toMemoKey()) >= 0;
  },
  enter: function (application) {
    this.applicationMemoKeyStack.push(application.toMemoKey());
  },
  exit: function () {
    this.applicationMemoKeyStack.pop();
  },
  startLeftRecursion: function (headApplication, memoRec) {
    memoRec.isLeftRecursion = true;
    memoRec.headApplication = headApplication;
    memoRec.nextLeftRecursion = this.currentLeftRecursion;
    this.currentLeftRecursion = memoRec;
    var applicationMemoKeyStack = this.applicationMemoKeyStack;
    var indexOfFirstInvolvedRule = applicationMemoKeyStack.indexOf(headApplication.toMemoKey()) + 1;
    var involvedApplicationMemoKeys = applicationMemoKeyStack.slice(indexOfFirstInvolvedRule);

    memoRec.isInvolved = function (applicationMemoKey) {
      return involvedApplicationMemoKeys.indexOf(applicationMemoKey) >= 0;
    };

    memoRec.updateInvolvedApplicationMemoKeys = function () {
      for (var idx = indexOfFirstInvolvedRule; idx < applicationMemoKeyStack.length; idx++) {
        var applicationMemoKey = applicationMemoKeyStack[idx];

        if (!this.isInvolved(applicationMemoKey)) {
          involvedApplicationMemoKeys.push(applicationMemoKey);
        }
      }
    };
  },
  endLeftRecursion: function () {
    this.currentLeftRecursion = this.currentLeftRecursion.nextLeftRecursion;
  },
  // Note: this method doesn't get called for the "head" of a left recursion -- for LR heads,
  // the memoized result (which starts out being a failure) is always used.
  shouldUseMemoizedResult: function (memoRec) {
    if (!memoRec.isLeftRecursion) {
      return true;
    }

    var applicationMemoKeyStack = this.applicationMemoKeyStack;

    for (var idx = 0; idx < applicationMemoKeyStack.length; idx++) {
      var applicationMemoKey = applicationMemoKeyStack[idx];

      if (memoRec.isInvolved(applicationMemoKey)) {
        return false;
      }
    }

    return true;
  },
  memoize: function (memoKey, memoRec) {
    this.memo[memoKey] = memoRec;
    this.maxExaminedLength = Math.max(this.maxExaminedLength, memoRec.examinedLength);
    this.maxRightmostFailureOffset = Math.max(this.maxRightmostFailureOffset, memoRec.rightmostFailureOffset);
    return memoRec;
  },
  clearObsoleteEntries: function (pos, invalidatedIdx) {
    if (pos + this.maxExaminedLength <= invalidatedIdx) {
      // Optimization: none of the rule applications that were memoized here examined the
      // interval of the input that changed, so nothing has to be invalidated.
      return;
    }

    var memo = this.memo;
    this.maxExaminedLength = 0;
    this.maxRightmostFailureOffset = -1;
    var self = this;
    Object.keys(memo).forEach(function (k) {
      var memoRec = memo[k];

      if (pos + memoRec.examinedLength > invalidatedIdx) {
        delete memo[k];
      } else {
        self.maxExaminedLength = Math.max(self.maxExaminedLength, memoRec.examinedLength);
        self.maxRightmostFailureOffset = Math.max(self.maxRightmostFailureOffset, memoRec.rightmostFailureOffset);
      }
    });
  }
}; // --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = PosInfo;
},{}],"sB9w":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var InputStream = require('./InputStream');

var MatchResult = require('./MatchResult');

var PosInfo = require('./PosInfo');

var Trace = require('./Trace');

var pexprs = require('./pexprs'); // --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------


var applySpaces = new pexprs.Apply('spaces');

function MatchState(matcher, startExpr, optPositionToRecordFailures) {
  this.matcher = matcher;
  this.startExpr = startExpr;
  this.grammar = matcher.grammar;
  this.input = matcher.input;
  this.inputStream = new InputStream(matcher.input);
  this.memoTable = matcher.memoTable;
  this._bindings = [];
  this._bindingOffsets = [];
  this._applicationStack = [];
  this._posStack = [0];
  this.inLexifiedContextStack = [false];
  this.rightmostFailurePosition = -1;
  this._rightmostFailurePositionStack = [];
  this._recordedFailuresStack = [];

  if (optPositionToRecordFailures !== undefined) {
    this.positionToRecordFailures = optPositionToRecordFailures;
    this.recordedFailures = Object.create(null);
  }
}

MatchState.prototype = {
  posToOffset: function (pos) {
    return pos - this._posStack[this._posStack.length - 1];
  },
  enterApplication: function (posInfo, app) {
    this._posStack.push(this.inputStream.pos);

    this._applicationStack.push(app);

    this.inLexifiedContextStack.push(false);
    posInfo.enter(app);

    this._rightmostFailurePositionStack.push(this.rightmostFailurePosition);

    this.rightmostFailurePosition = -1;
  },
  exitApplication: function (posInfo, optNode) {
    var origPos = this._posStack.pop();

    this._applicationStack.pop();

    this.inLexifiedContextStack.pop();
    posInfo.exit();
    this.rightmostFailurePosition = Math.max(this.rightmostFailurePosition, this._rightmostFailurePositionStack.pop());

    if (optNode) {
      this.pushBinding(optNode, origPos);
    }
  },
  enterLexifiedContext: function () {
    this.inLexifiedContextStack.push(true);
  },
  exitLexifiedContext: function () {
    this.inLexifiedContextStack.pop();
  },
  currentApplication: function () {
    return this._applicationStack[this._applicationStack.length - 1];
  },
  inSyntacticContext: function () {
    if (typeof this.inputStream.source !== 'string') {
      return false;
    }

    var currentApplication = this.currentApplication();

    if (currentApplication) {
      return currentApplication.isSyntactic() && !this.inLexifiedContext();
    } else {
      // The top-level context is syntactic if the start application is.
      return this.startExpr.factors[0].isSyntactic();
    }
  },
  inLexifiedContext: function () {
    return this.inLexifiedContextStack[this.inLexifiedContextStack.length - 1];
  },
  skipSpaces: function () {
    this.pushFailuresInfo();
    this.eval(applySpaces);
    this.popBinding();
    this.popFailuresInfo();
    return this.inputStream.pos;
  },
  skipSpacesIfInSyntacticContext: function () {
    return this.inSyntacticContext() ? this.skipSpaces() : this.inputStream.pos;
  },
  maybeSkipSpacesBefore: function (expr) {
    if (expr instanceof pexprs.Apply && expr.isSyntactic()) {
      return this.skipSpaces();
    } else if (expr.allowsSkippingPrecedingSpace() && expr !== applySpaces) {
      return this.skipSpacesIfInSyntacticContext();
    } else {
      return this.inputStream.pos;
    }
  },
  pushBinding: function (node, origPos) {
    this._bindings.push(node);

    this._bindingOffsets.push(this.posToOffset(origPos));
  },
  popBinding: function () {
    this._bindings.pop();

    this._bindingOffsets.pop();
  },
  numBindings: function () {
    return this._bindings.length;
  },
  truncateBindings: function (newLength) {
    // Yes, this is this really faster than setting the `length` property (tested with
    // bin/es5bench on Node v6.1.0).
    while (this._bindings.length > newLength) {
      this.popBinding();
    }
  },
  getCurrentPosInfo: function () {
    return this.getPosInfo(this.inputStream.pos);
  },
  getPosInfo: function (pos) {
    var posInfo = this.memoTable[pos];

    if (!posInfo) {
      posInfo = this.memoTable[pos] = new PosInfo();
    }

    return posInfo;
  },
  processFailure: function (pos, expr) {
    this.rightmostFailurePosition = Math.max(this.rightmostFailurePosition, pos);

    if (this.recordedFailures && pos === this.positionToRecordFailures) {
      var app = this.currentApplication();

      if (app) {
        // Substitute parameters with the actual pexprs that were passed to
        // the current rule.
        expr = expr.substituteParams(app.args);
      } else {// This branch is only reached for the "end-check" that is
        // performed after the top-level application. In that case,
        // expr === pexprs.end so there is no need to substitute
        // parameters.
      }

      this.recordFailure(expr.toFailure(this.grammar), false);
    }
  },
  recordFailure: function (failure, shouldCloneIfNew) {
    var key = failure.toKey();

    if (!this.recordedFailures[key]) {
      this.recordedFailures[key] = shouldCloneIfNew ? failure.clone() : failure;
    } else if (this.recordedFailures[key].isFluffy() && !failure.isFluffy()) {
      this.recordedFailures[key].clearFluffy();
    }
  },
  recordFailures: function (failures, shouldCloneIfNew) {
    var self = this;
    Object.keys(failures).forEach(function (key) {
      self.recordFailure(failures[key], shouldCloneIfNew);
    });
  },
  cloneRecordedFailures: function () {
    if (!this.recordedFailures) {
      return undefined;
    }

    var ans = Object.create(null);
    var self = this;
    Object.keys(this.recordedFailures).forEach(function (key) {
      ans[key] = self.recordedFailures[key].clone();
    });
    return ans;
  },
  getRightmostFailurePosition: function () {
    return this.rightmostFailurePosition;
  },
  _getRightmostFailureOffset: function () {
    return this.rightmostFailurePosition >= 0 ? this.posToOffset(this.rightmostFailurePosition) : -1;
  },
  // Returns the memoized trace entry for `expr` at `pos`, if one exists, `null` otherwise.
  getMemoizedTraceEntry: function (pos, expr) {
    var posInfo = this.memoTable[pos];

    if (posInfo && expr.ruleName) {
      var memoRec = posInfo.memo[expr.toMemoKey()];

      if (memoRec && memoRec.traceEntry) {
        var entry = memoRec.traceEntry.cloneWithExpr(expr);
        entry.isMemoized = true;
        return entry;
      }
    }

    return null;
  },
  // Returns a new trace entry, with the currently active trace array as its children.
  getTraceEntry: function (pos, expr, succeeded, bindings) {
    if (expr instanceof pexprs.Apply) {
      var app = this.currentApplication();
      var actuals = app ? app.args : [];
      expr = expr.substituteParams(actuals);
    }

    return this.getMemoizedTraceEntry(pos, expr) || new Trace(this.input, pos, this.inputStream.pos, expr, succeeded, bindings, this.trace);
  },
  isTracing: function () {
    return !!this.trace;
  },
  hasNecessaryInfo: function (memoRec) {
    if (this.trace && !memoRec.traceEntry) {
      return false;
    }

    if (this.recordedFailures && this.inputStream.pos + memoRec.rightmostFailureOffset === this.positionToRecordFailures) {
      return !!memoRec.failuresAtRightmostPosition;
    }

    return true;
  },
  useMemoizedResult: function (origPos, memoRec) {
    if (this.trace) {
      this.trace.push(memoRec.traceEntry);
    }

    var memoRecRightmostFailurePosition = this.inputStream.pos + memoRec.rightmostFailureOffset;
    this.rightmostFailurePosition = Math.max(this.rightmostFailurePosition, memoRecRightmostFailurePosition);

    if (this.recordedFailures && this.positionToRecordFailures === memoRecRightmostFailurePosition && memoRec.failuresAtRightmostPosition) {
      this.recordFailures(memoRec.failuresAtRightmostPosition, true);
    }

    this.inputStream.examinedLength = Math.max(this.inputStream.examinedLength, memoRec.examinedLength + origPos);

    if (memoRec.value) {
      this.inputStream.pos += memoRec.matchLength;
      this.pushBinding(memoRec.value, origPos);
      return true;
    }

    return false;
  },
  // Evaluate `expr` and return `true` if it succeeded, `false` otherwise. On success, `bindings`
  // will have `expr.getArity()` more elements than before, and the input stream's position may
  // have increased. On failure, `bindings` and position will be unchanged.
  eval: function (expr) {
    var inputStream = this.inputStream;
    var origNumBindings = this._bindings.length;
    var origRecordedFailures;

    if (this.recordedFailures) {
      origRecordedFailures = this.recordedFailures;
      this.recordedFailures = Object.create(null);
    }

    var origPos = inputStream.pos;
    var memoPos = this.maybeSkipSpacesBefore(expr);
    var origTrace;

    if (this.trace) {
      origTrace = this.trace;
      this.trace = [];
    } // Do the actual evaluation.


    var ans = expr.eval(this);

    if (this.trace) {
      var bindings = this._bindings.slice(origNumBindings);

      var traceEntry = this.getTraceEntry(memoPos, expr, ans, bindings);
      traceEntry.isImplicitSpaces = expr === applySpaces;
      traceEntry.isRootNode = expr === this.startExpr;
      origTrace.push(traceEntry);
      this.trace = origTrace;
    }

    if (ans) {
      if (this.recordedFailures && inputStream.pos === this.positionToRecordFailures) {
        var self = this;
        Object.keys(this.recordedFailures).forEach(function (key) {
          self.recordedFailures[key].makeFluffy();
        });
      }
    } else {
      // Reset the position and the bindings.
      inputStream.pos = origPos;
      this.truncateBindings(origNumBindings);
    }

    if (this.recordedFailures) {
      this.recordFailures(origRecordedFailures, false);
    }

    return ans;
  },
  getMatchResult: function () {
    this.eval(this.startExpr);
    var rightmostFailures;

    if (this.recordedFailures) {
      var self = this;
      rightmostFailures = Object.keys(this.recordedFailures).map(function (key) {
        return self.recordedFailures[key];
      });
    }

    return new MatchResult(this.matcher, this.input, this.startExpr, this._bindings[0], this._bindingOffsets[0], this.rightmostFailurePosition, rightmostFailures);
  },
  getTrace: function () {
    this.trace = [];
    var matchResult = this.getMatchResult(); // The trace node for the start rule is always the last entry. If it is a syntactic rule,
    // the first entry is for an application of 'spaces'.
    // TODO(pdubroy): Clean this up by introducing a special `Match<startAppl>` rule, which will
    // ensure that there is always a single root trace node.

    var rootTrace = this.trace[this.trace.length - 1];
    rootTrace.result = matchResult;
    return rootTrace;
  },
  pushFailuresInfo: function () {
    this._rightmostFailurePositionStack.push(this.rightmostFailurePosition);

    this._recordedFailuresStack.push(this.recordedFailures);
  },
  popFailuresInfo: function () {
    this.rightmostFailurePosition = this._rightmostFailurePositionStack.pop();
    this.recordedFailures = this._recordedFailuresStack.pop();
  }
}; // --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = MatchState;
},{"./InputStream":"Dwac","./MatchResult":"Sx4M","./PosInfo":"dyGE","./Trace":"NY7q","./pexprs":"RYLI"}],"xFKF":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var MatchState = require('./MatchState');

var pexprs = require('./pexprs'); // --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------


function Matcher(grammar) {
  this.grammar = grammar;
  this.memoTable = [];
  this.input = '';
}

Matcher.prototype.getInput = function () {
  return this.input;
};

Matcher.prototype.setInput = function (str) {
  if (this.input !== str) {
    this.replaceInputRange(0, this.input.length, str);
  }

  return this;
};

Matcher.prototype.replaceInputRange = function (startIdx, endIdx, str) {
  var currentInput = this.input;

  if (startIdx < 0 || startIdx > currentInput.length || endIdx < 0 || endIdx > currentInput.length || startIdx > endIdx) {
    throw new Error('Invalid indices: ' + startIdx + ' and ' + endIdx);
  } // update input


  this.input = currentInput.slice(0, startIdx) + str + currentInput.slice(endIdx); // update memo table (similar to the above)

  var restOfMemoTable = this.memoTable.slice(endIdx);
  this.memoTable.length = startIdx;

  for (var idx = 0; idx < str.length; idx++) {
    this.memoTable.push(undefined);
  }

  restOfMemoTable.forEach(function (posInfo) {
    this.memoTable.push(posInfo);
  }, this); // Invalidate memoRecs

  for (var pos = 0; pos < startIdx; pos++) {
    var posInfo = this.memoTable[pos];

    if (posInfo) {
      posInfo.clearObsoleteEntries(pos, startIdx);
    }
  }

  return this;
};

Matcher.prototype.match = function (optStartApplicationStr) {
  return this._match(this._getStartExpr(optStartApplicationStr), false);
};

Matcher.prototype.trace = function (optStartApplicationStr) {
  return this._match(this._getStartExpr(optStartApplicationStr), true);
};

Matcher.prototype._match = function (startExpr, tracing, optPositionToRecordFailures) {
  var state = new MatchState(this, startExpr, optPositionToRecordFailures);
  return tracing ? state.getTrace() : state.getMatchResult();
};
/*
  Returns the starting expression for this Matcher's associated grammar. If `optStartApplicationStr`
  is specified, it is a string expressing a rule application in the grammar. If not specified, the
  grammar's default start rule will be used.
*/


Matcher.prototype._getStartExpr = function (optStartApplicationStr) {
  var applicationStr = optStartApplicationStr || this.grammar.defaultStartRule;

  if (!applicationStr) {
    throw new Error('Missing start rule argument -- the grammar has no default start rule.');
  }

  var startApp = this.grammar.parseApplication(applicationStr);
  return new pexprs.Seq([startApp, pexprs.end]);
}; // --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------


module.exports = Matcher;
},{"./MatchState":"sB9w","./pexprs":"RYLI"}],"kKrP":[function(require,module,exports) {
'use strict';

var validTypes = { object: true, symbol: true };

module.exports = function () {
	var symbol;
	if (typeof Symbol !== 'function') return false;
	symbol = Symbol('test symbol');
	try { String(symbol); } catch (e) { return false; }

	// Return 'true' also for polyfills
	if (!validTypes[typeof Symbol.iterator]) return false;
	if (!validTypes[typeof Symbol.toPrimitive]) return false;
	if (!validTypes[typeof Symbol.toStringTag]) return false;

	return true;
};

},{}],"y60x":[function(require,module,exports) {
"use strict";

module.exports = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== "function") return false;
	obj = { foo: "raz" };
	assign(obj, { bar: "dwa" }, { trzy: "trzy" });
	return (obj.foo + obj.bar + obj.trzy) === "razdwatrzy";
};

},{}],"gq3z":[function(require,module,exports) {
"use strict";

module.exports = function () {
	try {
		Object.keys("primitive");
		return true;
	} catch (e) {
		return false;
	}
};

},{}],"qYbH":[function(require,module,exports) {
"use strict";

// eslint-disable-next-line no-empty-function
module.exports = function () {};

},{}],"f648":[function(require,module,exports) {
"use strict";

var _undefined = require("../function/noop")(); // Support ES3 engines

module.exports = function (val) {
 return (val !== _undefined) && (val !== null);
};

},{"../function/noop":"qYbH"}],"3cwc":[function(require,module,exports) {
"use strict";

var isValue = require("../is-value");

var keys = Object.keys;

module.exports = function (object) { return keys(isValue(object) ? Object(object) : object); };

},{"../is-value":"f648"}],"nhVq":[function(require,module,exports) {
"use strict";

module.exports = require("./is-implemented")() ? Object.keys : require("./shim");

},{"./is-implemented":"gq3z","./shim":"3cwc"}],"XtTh":[function(require,module,exports) {
"use strict";

var isValue = require("./is-value");

module.exports = function (value) {
	if (!isValue(value)) throw new TypeError("Cannot use null or undefined");
	return value;
};

},{"./is-value":"f648"}],"ojUF":[function(require,module,exports) {
"use strict";

var keys  = require("../keys")
  , value = require("../valid-value")
  , max   = Math.max;

module.exports = function (dest, src /*, …srcn*/) {
	var error, i, length = max(arguments.length, 2), assign;
	dest = Object(value(dest));
	assign = function (key) {
		try {
			dest[key] = src[key];
		} catch (e) {
			if (!error) error = e;
		}
	};
	for (i = 1; i < length; ++i) {
		src = arguments[i];
		keys(src).forEach(assign);
	}
	if (error !== undefined) throw error;
	return dest;
};

},{"../keys":"nhVq","../valid-value":"XtTh"}],"flj+":[function(require,module,exports) {
"use strict";

module.exports = require("./is-implemented")()
	? Object.assign
	: require("./shim");

},{"./is-implemented":"y60x","./shim":"ojUF"}],"1uac":[function(require,module,exports) {

"use strict";

var isValue = require("./is-value");

var forEach = Array.prototype.forEach, create = Object.create;

var process = function (src, obj) {
	var key;
	for (key in src) obj[key] = src[key];
};

// eslint-disable-next-line no-unused-vars
module.exports = function (opts1 /*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (!isValue(options)) return;
		process(Object(options), result);
	});
	return result;
};

},{"./is-value":"f648"}],"az0W":[function(require,module,exports) {
// Deprecated

"use strict";

module.exports = function (obj) {
 return typeof obj === "function";
};

},{}],"753d":[function(require,module,exports) {
"use strict";

var str = "razdwatrzy";

module.exports = function () {
	if (typeof str.contains !== "function") return false;
	return (str.contains("dwa") === true) && (str.contains("foo") === false);
};

},{}],"3RK5":[function(require,module,exports) {
"use strict";

var indexOf = String.prototype.indexOf;

module.exports = function (searchString/*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};

},{}],"z+/R":[function(require,module,exports) {
"use strict";

module.exports = require("./is-implemented")()
	? String.prototype.contains
	: require("./shim");

},{"./is-implemented":"753d","./shim":"3RK5"}],"iAJW":[function(require,module,exports) {
'use strict';

var assign        = require('es5-ext/object/assign')
  , normalizeOpts = require('es5-ext/object/normalize-options')
  , isCallable    = require('es5-ext/object/is-callable')
  , contains      = require('es5-ext/string/#/contains')

  , d;

d = module.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if ((arguments.length < 2) || (typeof dscr !== 'string')) {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (dscr == null) {
		c = w = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
		w = contains.call(dscr, 'w');
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== 'string') {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (get == null) {
		get = undefined;
	} else if (!isCallable(get)) {
		options = get;
		get = set = undefined;
	} else if (set == null) {
		set = undefined;
	} else if (!isCallable(set)) {
		options = set;
		set = undefined;
	}
	if (dscr == null) {
		c = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

},{"es5-ext/object/assign":"flj+","es5-ext/object/normalize-options":"1uac","es5-ext/object/is-callable":"az0W","es5-ext/string/#/contains":"z+/R"}],"X3hX":[function(require,module,exports) {
'use strict';

module.exports = function (x) {
	if (!x) return false;
	if (typeof x === 'symbol') return true;
	if (!x.constructor) return false;
	if (x.constructor.name !== 'Symbol') return false;
	return (x[x.constructor.toStringTag] === 'Symbol');
};

},{}],"g5oG":[function(require,module,exports) {
'use strict';

var isSymbol = require('./is-symbol');

module.exports = function (value) {
	if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
	return value;
};

},{"./is-symbol":"X3hX"}],"BOeD":[function(require,module,exports) {
// ES2015 Symbol polyfill for environments that do not (or partially) support it

'use strict';

var d              = require('d')
  , validateSymbol = require('./validate-symbol')

  , create = Object.create, defineProperties = Object.defineProperties
  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
  , NativeSymbol, SymbolPolyfill, HiddenSymbol, globalSymbols = create(null)
  , isNativeSafe;

if (typeof Symbol === 'function') {
	NativeSymbol = Symbol;
	try {
		String(NativeSymbol());
		isNativeSafe = true;
	} catch (ignore) {}
}

var generateName = (function () {
	var created = create(null);
	return function (desc) {
		var postfix = 0, name, ie11BugWorkaround;
		while (created[desc + (postfix || '')]) ++postfix;
		desc += (postfix || '');
		created[desc] = true;
		name = '@@' + desc;
		defineProperty(objPrototype, name, d.gs(null, function (value) {
			// For IE11 issue see:
			// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
			//    ie11-broken-getters-on-dom-objects
			// https://github.com/medikoo/es6-symbol/issues/12
			if (ie11BugWorkaround) return;
			ie11BugWorkaround = true;
			defineProperty(this, name, d(value));
			ie11BugWorkaround = false;
		}));
		return name;
	};
}());

// Internal constructor (not one exposed) for creating Symbol instances.
// This one is used to ensure that `someSymbol instanceof Symbol` always return false
HiddenSymbol = function Symbol(description) {
	if (this instanceof HiddenSymbol) throw new TypeError('Symbol is not a constructor');
	return SymbolPolyfill(description);
};

// Exposed `Symbol` constructor
// (returns instances of HiddenSymbol)
module.exports = SymbolPolyfill = function Symbol(description) {
	var symbol;
	if (this instanceof Symbol) throw new TypeError('Symbol is not a constructor');
	if (isNativeSafe) return NativeSymbol(description);
	symbol = create(HiddenSymbol.prototype);
	description = (description === undefined ? '' : String(description));
	return defineProperties(symbol, {
		__description__: d('', description),
		__name__: d('', generateName(description))
	});
};
defineProperties(SymbolPolyfill, {
	for: d(function (key) {
		if (globalSymbols[key]) return globalSymbols[key];
		return (globalSymbols[key] = SymbolPolyfill(String(key)));
	}),
	keyFor: d(function (s) {
		var key;
		validateSymbol(s);
		for (key in globalSymbols) if (globalSymbols[key] === s) return key;
	}),

	// To ensure proper interoperability with other native functions (e.g. Array.from)
	// fallback to eventual native implementation of given symbol
	hasInstance: d('', (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill('hasInstance')),
	isConcatSpreadable: d('', (NativeSymbol && NativeSymbol.isConcatSpreadable) ||
		SymbolPolyfill('isConcatSpreadable')),
	iterator: d('', (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill('iterator')),
	match: d('', (NativeSymbol && NativeSymbol.match) || SymbolPolyfill('match')),
	replace: d('', (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill('replace')),
	search: d('', (NativeSymbol && NativeSymbol.search) || SymbolPolyfill('search')),
	species: d('', (NativeSymbol && NativeSymbol.species) || SymbolPolyfill('species')),
	split: d('', (NativeSymbol && NativeSymbol.split) || SymbolPolyfill('split')),
	toPrimitive: d('', (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill('toPrimitive')),
	toStringTag: d('', (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill('toStringTag')),
	unscopables: d('', (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill('unscopables'))
});

// Internal tweaks for real symbol producer
defineProperties(HiddenSymbol.prototype, {
	constructor: d(SymbolPolyfill),
	toString: d('', function () { return this.__name__; })
});

// Proper implementation of methods exposed on Symbol.prototype
// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
defineProperties(SymbolPolyfill.prototype, {
	toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
	valueOf: d(function () { return validateSymbol(this); })
});
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('', function () {
	var symbol = validateSymbol(this);
	if (typeof symbol === 'symbol') return symbol;
	return symbol.toString();
}));
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

// Note: It's important to define `toPrimitive` as last one, as some implementations
// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
// And that may invoke error in definition flow:
// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));

},{"d":"iAJW","./validate-symbol":"g5oG"}],"QUJB":[function(require,module,exports) {
'use strict';

module.exports = require('./is-implemented')() ? Symbol : require('./polyfill');

},{"./is-implemented":"kKrP","./polyfill":"BOeD"}],"Y6c6":[function(require,module,exports) {
var ohm = require('..');

module.exports = ohm.makeRecipe(["grammar", {
  "source": "OperationsAndAttributes {\n\n  AttributeSignature =\n    name\n\n  OperationSignature =\n    name Formals?\n\n  Formals\n    = \"(\" ListOf<name, \",\"> \")\"\n\n  name  (a name)\n    = nameFirst nameRest*\n\n  nameFirst\n    = \"_\"\n    | letter\n\n  nameRest\n    = \"_\"\n    | alnum\n\n}"
}, "OperationsAndAttributes", null, "AttributeSignature", {
  "AttributeSignature": ["define", {
    "sourceInterval": [29, 58]
  }, null, [], ["app", {
    "sourceInterval": [54, 58]
  }, "name", []]],
  "OperationSignature": ["define", {
    "sourceInterval": [62, 100]
  }, null, [], ["seq", {
    "sourceInterval": [87, 100]
  }, ["app", {
    "sourceInterval": [87, 91]
  }, "name", []], ["opt", {
    "sourceInterval": [92, 100]
  }, ["app", {
    "sourceInterval": [92, 99]
  }, "Formals", []]]]],
  "Formals": ["define", {
    "sourceInterval": [104, 143]
  }, null, [], ["seq", {
    "sourceInterval": [118, 143]
  }, ["terminal", {
    "sourceInterval": [118, 121]
  }, "("], ["app", {
    "sourceInterval": [122, 139]
  }, "ListOf", [["app", {
    "sourceInterval": [129, 133]
  }, "name", []], ["terminal", {
    "sourceInterval": [135, 138]
  }, ","]]], ["terminal", {
    "sourceInterval": [140, 143]
  }, ")"]]],
  "name": ["define", {
    "sourceInterval": [147, 187]
  }, "a name", [], ["seq", {
    "sourceInterval": [168, 187]
  }, ["app", {
    "sourceInterval": [168, 177]
  }, "nameFirst", []], ["star", {
    "sourceInterval": [178, 187]
  }, ["app", {
    "sourceInterval": [178, 186]
  }, "nameRest", []]]]],
  "nameFirst": ["define", {
    "sourceInterval": [191, 223]
  }, null, [], ["alt", {
    "sourceInterval": [207, 223]
  }, ["terminal", {
    "sourceInterval": [207, 210]
  }, "_"], ["app", {
    "sourceInterval": [217, 223]
  }, "letter", []]]],
  "nameRest": ["define", {
    "sourceInterval": [227, 257]
  }, null, [], ["alt", {
    "sourceInterval": [242, 257]
  }, ["terminal", {
    "sourceInterval": [242, 245]
  }, "_"], ["app", {
    "sourceInterval": [252, 257]
  }, "alnum", []]]]
}]);
},{"..":"K+zu"}],"6mT9":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var _Symbol = require('es6-symbol'); // eslint-disable-line no-undef


var inherits = require('inherits');

var InputStream = require('./InputStream');

var IterationNode = require('./nodes').IterationNode;

var MatchResult = require('./MatchResult');

var common = require('./common');

var errors = require('./errors');

var util = require('./util'); // --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------


var globalActionStack = [];
var prototypeGrammar;
var prototypeGrammarSemantics; // JSON is not a valid subset of JavaScript because there are two possible line terminators,
// U+2028 (line separator) and U+2029 (paragraph separator) that are allowed in JSON strings
// but not in JavaScript strings.
// jsonToJS() properly encodes those two characters in JSON so that it can seamlessly be
// inserted into JavaScript code (plus the encoded version is still valid JSON)

function jsonToJS(str) {
  var output = str.replace(/[\u2028\u2029]/g, function (char, pos, str) {
    var hex = char.codePointAt(0).toString(16);
    return '\\u' + '0000'.slice(hex.length) + hex;
  });
  return output;
} // ----------------- Wrappers -----------------
// Wrappers decorate CST nodes with all of the functionality (i.e., operations and attributes)
// provided by a Semantics (see below). `Wrapper` is the abstract superclass of all wrappers. A
// `Wrapper` must have `_node` and `_semantics` instance variables, which refer to the CST node and
// Semantics (resp.) for which it was created, and a `_childWrappers` instance variable which is
// used to cache the wrapper instances that are created for its child nodes. Setting these instance
// variables is the responsibility of the constructor of each Semantics-specific subclass of
// `Wrapper`.


function Wrapper() {}

Wrapper.prototype.toString = function () {
  return '[semantics wrapper for ' + this._node.grammar.name + ']';
}; // This is used by ohm editor to display a node wrapper appropriately.


Wrapper.prototype.toJSON = function () {
  return this.toString();
};

Wrapper.prototype._forgetMemoizedResultFor = function (attributeName) {
  // Remove the memoized attribute from the cstNode and all its children.
  delete this._node[this._semantics.attributeKeys[attributeName]];
  this.children.forEach(function (child) {
    child._forgetMemoizedResultFor(attributeName);
  });
}; // Returns the wrapper of the specified child node. Child wrappers are created lazily and cached in
// the parent wrapper's `_childWrappers` instance variable.


Wrapper.prototype.child = function (idx) {
  if (!(0 <= idx && idx < this._node.numChildren())) {
    // TODO: Consider throwing an exception here.
    return undefined;
  }

  var childWrapper = this._childWrappers[idx];

  if (!childWrapper) {
    var childNode = this._node.childAt(idx);

    var offset = this._node.childOffsets[idx];

    var source = this._baseInterval.subInterval(offset, childNode.matchLength);

    var base = childNode.isNonterminal() ? source : this._baseInterval;
    childWrapper = this._childWrappers[idx] = this._semantics.wrap(childNode, source, base);
  }

  return childWrapper;
}; // Returns an array containing the wrappers of all of the children of the node associated with this
// wrapper.


Wrapper.prototype._children = function () {
  // Force the creation of all child wrappers
  for (var idx = 0; idx < this._node.numChildren(); idx++) {
    this.child(idx);
  }

  return this._childWrappers;
}; // Returns `true` if the CST node associated with this wrapper corresponds to an iteration
// expression, i.e., a Kleene-*, Kleene-+, or an optional. Returns `false` otherwise.


Wrapper.prototype.isIteration = function () {
  return this._node.isIteration();
}; // Returns `true` if the CST node associated with this wrapper is a terminal node, `false`
// otherwise.


Wrapper.prototype.isTerminal = function () {
  return this._node.isTerminal();
}; // Returns `true` if the CST node associated with this wrapper is a nonterminal node, `false`
// otherwise.


Wrapper.prototype.isNonterminal = function () {
  return this._node.isNonterminal();
}; // Returns `true` if the CST node associated with this wrapper is a nonterminal node
// corresponding to a syntactic rule, `false` otherwise.


Wrapper.prototype.isSyntactic = function () {
  return this.isNonterminal() && this._node.isSyntactic();
}; // Returns `true` if the CST node associated with this wrapper is a nonterminal node
// corresponding to a lexical rule, `false` otherwise.


Wrapper.prototype.isLexical = function () {
  return this.isNonterminal() && this._node.isLexical();
}; // Returns `true` if the CST node associated with this wrapper is an iterator node
// having either one or no child (? operator), `false` otherwise.
// Otherwise, throws an exception.


Wrapper.prototype.isOptional = function () {
  return this._node.isOptional();
}; // Create a new _iter wrapper in the same semantics as this wrapper.


Wrapper.prototype.iteration = function (optChildWrappers) {
  var childWrappers = optChildWrappers || [];
  var childNodes = childWrappers.map(function (c) {
    return c._node;
  });
  var iter = new IterationNode(this._node.grammar, childNodes, [], -1, false);

  var wrapper = this._semantics.wrap(iter, null, null);

  wrapper._childWrappers = childWrappers;
  return wrapper;
};

Object.defineProperties(Wrapper.prototype, {
  // Returns an array containing the children of this CST node.
  children: {
    get: function () {
      return this._children();
    }
  },
  // Returns the name of grammar rule that created this CST node.
  ctorName: {
    get: function () {
      return this._node.ctorName;
    }
  },
  // TODO: Remove this eventually (deprecated in v0.12).
  interval: {
    get: function () {
      throw new Error('The `interval` property is deprecated -- use `source` instead');
    }
  },
  // Returns the number of children of this CST node.
  numChildren: {
    get: function () {
      return this._node.numChildren();
    }
  },
  // Returns the primitive value of this CST node, if it's a terminal node. Otherwise,
  // throws an exception.
  primitiveValue: {
    get: function () {
      if (this.isTerminal()) {
        return this._node.primitiveValue;
      }

      throw new TypeError("tried to access the 'primitiveValue' attribute of a non-terminal CST node");
    }
  },
  // Returns the contents of the input stream consumed by this CST node.
  sourceString: {
    get: function () {
      return this.source.contents;
    }
  }
}); // ----------------- Semantics -----------------
// A Semantics is a container for a family of Operations and Attributes for a given grammar.
// Semantics enable modularity (different clients of a grammar can create their set of operations
// and attributes in isolation) and extensibility even when operations and attributes are mutually-
// recursive. This constructor should not be called directly except from
// `Semantics.createSemantics`. The normal ways to create a Semantics, given a grammar 'g', are
// `g.createSemantics()` and `g.extendSemantics(parentSemantics)`.

function Semantics(grammar, superSemantics) {
  var self = this;
  this.grammar = grammar;
  this.checkedActionDicts = false; // Constructor for wrapper instances, which are passed as the arguments to the semantic actions
  // of an operation or attribute. Operations and attributes require double dispatch: the semantic
  // action is chosen based on both the node's type and the semantics. Wrappers ensure that
  // the `execute` method is called with the correct (most specific) semantics object as an
  // argument.

  this.Wrapper = function (node, sourceInterval, baseInterval) {
    self.checkActionDictsIfHaventAlready();
    this._semantics = self;
    this._node = node;
    this.source = sourceInterval; // The interval that the childOffsets of `node` are relative to. It should be the source
    // of the closest Nonterminal node.

    this._baseInterval = baseInterval;

    if (node.isNonterminal()) {
      common.assert(sourceInterval === baseInterval);
    }

    this._childWrappers = [];
  };

  this.super = superSemantics;

  if (superSemantics) {
    if (!(grammar.equals(this.super.grammar) || grammar._inheritsFrom(this.super.grammar))) {
      throw new Error("Cannot extend a semantics for grammar '" + this.super.grammar.name + "' for use with grammar '" + grammar.name + "' (not a sub-grammar)");
    }

    inherits(this.Wrapper, this.super.Wrapper);
    this.operations = Object.create(this.super.operations);
    this.attributes = Object.create(this.super.attributes);
    this.attributeKeys = Object.create(null); // Assign unique symbols for each of the attributes inherited from the super-semantics so that
    // they are memoized independently.

    for (var attributeName in this.attributes) {
      this.attributeKeys[attributeName] = _Symbol();
    }
  } else {
    inherits(this.Wrapper, Wrapper);
    this.operations = Object.create(null);
    this.attributes = Object.create(null);
    this.attributeKeys = Object.create(null);
  }
}

Semantics.prototype.toString = function () {
  return '[semantics for ' + this.grammar.name + ']';
};

Semantics.prototype.checkActionDictsIfHaventAlready = function () {
  if (!this.checkedActionDicts) {
    this.checkActionDicts();
    this.checkedActionDicts = true;
  }
}; // Checks that the action dictionaries for all operations and attributes in this semantics,
// including the ones that were inherited from the super-semantics, agree with the grammar.
// Throws an exception if one or more of them doesn't.


Semantics.prototype.checkActionDicts = function () {
  var name;

  for (name in this.operations) {
    this.operations[name].checkActionDict(this.grammar);
  }

  for (name in this.attributes) {
    this.attributes[name].checkActionDict(this.grammar);
  }
};

Semantics.prototype.toRecipe = function (semanticsOnly) {
  function hasSuperSemantics(s) {
    return s.super !== Semantics.BuiltInSemantics._getSemantics();
  }

  var str = '(function(g) {\n';

  if (hasSuperSemantics(this)) {
    str += '  var semantics = ' + this.super.toRecipe(true) + '(g';
    var superSemanticsGrammar = this.super.grammar;
    var relatedGrammar = this.grammar;

    while (relatedGrammar !== superSemanticsGrammar) {
      str += '.superGrammar';
      relatedGrammar = relatedGrammar.superGrammar;
    }

    str += ');\n';
    str += '  return g.extendSemantics(semantics)';
  } else {
    str += '  return g.createSemantics()';
  }

  ['Operation', 'Attribute'].forEach(function (type) {
    var semanticOperations = this[type.toLowerCase() + 's'];
    Object.keys(semanticOperations).forEach(function (name) {
      var signature = name;

      if (semanticOperations[name].formals.length > 0) {
        signature += '(' + semanticOperations[name].formals.join(', ') + ')';
      }

      var method;

      if (hasSuperSemantics(this) && this.super[type.toLowerCase() + 's'][name]) {
        method = 'extend' + type;
      } else {
        method = 'add' + type;
      }

      str += '\n    .' + method + '(' + JSON.stringify(signature) + ', {';
      var actions = semanticOperations[name].actionDict;
      var srcArray = [];
      Object.keys(actions).forEach(function (actionName) {
        if (semanticOperations[name].builtInDefault !== actions[actionName]) {
          srcArray.push('\n      ' + JSON.stringify(actionName) + ': ' + actions[actionName].toString());
        }
      });
      str += srcArray.join(',');
      str += '\n    })';
    }, this);
  }, this);
  str += ';\n  })';

  if (!semanticsOnly) {
    str = '(function() {\n' + '  var grammar = this.fromRecipe(' + jsonToJS(this.grammar.toRecipe()) + ');\n' + '  var semantics = ' + str + '(grammar);\n' + '  return semantics;\n' + '});\n';
  }

  return str;
};

function parseSignature(signature, type) {
  if (!prototypeGrammar) {
    // The Operations and Attributes grammar won't be available while Ohm is loading,
    // but we can get away the following simplification b/c none of the operations
    // that are used while loading take arguments.
    common.assert(signature.indexOf('(') === -1);
    return {
      name: signature,
      formals: []
    };
  }

  var r = prototypeGrammar.match(signature, type === 'operation' ? 'OperationSignature' : 'AttributeSignature');

  if (r.failed()) {
    throw new Error(r.message);
  }

  return prototypeGrammarSemantics(r).parse();
}

function newDefaultAction(type, name, doIt) {
  return function (children) {
    var self = this;
    var thisThing = this._semantics.operations[name] || this._semantics.attributes[name];
    var args = thisThing.formals.map(function (formal) {
      return self.args[formal];
    });

    if (this.isIteration()) {
      // This CST node corresponds to an iteration expression in the grammar (*, +, or ?). The
      // default behavior is to map this operation or attribute over all of its child nodes.
      return children.map(function (child) {
        return doIt.apply(child, args);
      });
    } // This CST node corresponds to a non-terminal in the grammar (e.g., AddExpr). The fact that
    // we got here means that this action dictionary doesn't have an action for this particular
    // non-terminal or a generic `_nonterminal` action.


    if (children.length === 1) {
      // As a convenience, if this node only has one child, we just return the result of
      // applying this operation / attribute to the child node.
      return doIt.apply(children[0], args);
    } else {
      // Otherwise, we throw an exception to let the programmer know that we don't know what
      // to do with this node.
      throw errors.missingSemanticAction(this.ctorName, name, type, globalActionStack);
    }
  };
}

Semantics.prototype.addOperationOrAttribute = function (type, signature, actionDict) {
  var typePlural = type + 's';
  var parsedNameAndFormalArgs = parseSignature(signature, type);
  var name = parsedNameAndFormalArgs.name;
  var formals = parsedNameAndFormalArgs.formals; // TODO: check that there are no duplicate formal arguments

  this.assertNewName(name, type); // Create the action dictionary for this operation / attribute that contains a `_default` action
  // which defines the default behavior of iteration, terminal, and non-terminal nodes...

  var builtInDefault = newDefaultAction(type, name, doIt);
  var realActionDict = {
    _default: builtInDefault
  }; // ... and add in the actions supplied by the programmer, which may override some or all of the
  // default ones.

  Object.keys(actionDict).forEach(function (name) {
    realActionDict[name] = actionDict[name];
  });
  var entry = type === 'operation' ? new Operation(name, formals, realActionDict, builtInDefault) : new Attribute(name, realActionDict, builtInDefault); // The following check is not strictly necessary (it will happen later anyway) but it's better to
  // catch errors early.

  entry.checkActionDict(this.grammar);
  this[typePlural][name] = entry;

  function doIt() {
    // Dispatch to most specific version of this operation / attribute -- it may have been
    // overridden by a sub-semantics.
    var thisThing = this._semantics[typePlural][name]; // Check that the caller passed the correct number of arguments.

    if (arguments.length !== thisThing.formals.length) {
      throw new Error('Invalid number of arguments passed to ' + name + ' ' + type + ' (expected ' + thisThing.formals.length + ', got ' + arguments.length + ')');
    } // Create an "arguments object" from the arguments that were passed to this
    // operation / attribute.


    var args = Object.create(null);

    for (var idx = 0; idx < arguments.length; idx++) {
      var formal = thisThing.formals[idx];
      args[formal] = arguments[idx];
    }

    var oldArgs = this.args;
    this.args = args;
    var ans = thisThing.execute(this._semantics, this);
    this.args = oldArgs;
    return ans;
  }

  if (type === 'operation') {
    this.Wrapper.prototype[name] = doIt;

    this.Wrapper.prototype[name].toString = function () {
      return '[' + name + ' operation]';
    };
  } else {
    Object.defineProperty(this.Wrapper.prototype, name, {
      get: doIt,
      configurable: true // So the property can be deleted.

    });
    this.attributeKeys[name] = _Symbol();
  }
};

Semantics.prototype.extendOperationOrAttribute = function (type, name, actionDict) {
  var typePlural = type + 's'; // Make sure that `name` really is just a name, i.e., that it doesn't also contain formals.

  parseSignature(name, 'attribute');

  if (!(this.super && name in this.super[typePlural])) {
    throw new Error('Cannot extend ' + type + " '" + name + "': did not inherit an " + type + ' with that name');
  }

  if (Object.prototype.hasOwnProperty.call(this[typePlural], name)) {
    throw new Error('Cannot extend ' + type + " '" + name + "' again");
  } // Create a new operation / attribute whose actionDict delegates to the super operation /
  // attribute's actionDict, and which has all the keys from `inheritedActionDict`.


  var inheritedFormals = this[typePlural][name].formals;
  var inheritedActionDict = this[typePlural][name].actionDict;
  var newActionDict = Object.create(inheritedActionDict);
  Object.keys(actionDict).forEach(function (name) {
    newActionDict[name] = actionDict[name];
  });
  this[typePlural][name] = type === 'operation' ? new Operation(name, inheritedFormals, newActionDict) : new Attribute(name, newActionDict); // The following check is not strictly necessary (it will happen later anyway) but it's better to
  // catch errors early.

  this[typePlural][name].checkActionDict(this.grammar);
};

Semantics.prototype.assertNewName = function (name, type) {
  if (Wrapper.prototype.hasOwnProperty(name)) {
    throw new Error('Cannot add ' + type + " '" + name + "': that's a reserved name");
  }

  if (name in this.operations) {
    throw new Error('Cannot add ' + type + " '" + name + "': an operation with that name already exists");
  }

  if (name in this.attributes) {
    throw new Error('Cannot add ' + type + " '" + name + "': an attribute with that name already exists");
  }
}; // Returns a wrapper for the given CST `node` in this semantics.
// If `node` is already a wrapper, returns `node` itself.  // TODO: why is this needed?


Semantics.prototype.wrap = function (node, source, optBaseInterval) {
  var baseInterval = optBaseInterval || source;
  return node instanceof this.Wrapper ? node : new this.Wrapper(node, source, baseInterval);
}; // Creates a new Semantics instance for `grammar`, inheriting operations and attributes from
// `optSuperSemantics`, if it is specified. Returns a function that acts as a proxy for the new
// Semantics instance. When that function is invoked with a CST node as an argument, it returns
// a wrapper for that node which gives access to the operations and attributes provided by this
// semantics.


Semantics.createSemantics = function (grammar, optSuperSemantics) {
  var s = new Semantics(grammar, optSuperSemantics !== undefined ? optSuperSemantics : Semantics.BuiltInSemantics._getSemantics()); // To enable clients to invoke a semantics like a function, return a function that acts as a proxy
  // for `s`, which is the real `Semantics` instance.

  var proxy = function ASemantics(matchResult) {
    if (!(matchResult instanceof MatchResult)) {
      throw new TypeError('Semantics expected a MatchResult, but got ' + common.unexpectedObjToString(matchResult));
    }

    if (matchResult.failed()) {
      throw new TypeError('cannot apply Semantics to ' + matchResult.toString());
    }

    var cst = matchResult._cst;

    if (cst.grammar !== grammar) {
      throw new Error("Cannot use a MatchResult from grammar '" + cst.grammar.name + "' with a semantics for '" + grammar.name + "'");
    }

    var inputStream = new InputStream(matchResult.input);
    return s.wrap(cst, inputStream.interval(matchResult._cstOffset, matchResult.input.length));
  }; // Forward public methods from the proxy to the semantics instance.


  proxy.addOperation = function (signature, actionDict) {
    s.addOperationOrAttribute('operation', signature, actionDict);
    return proxy;
  };

  proxy.extendOperation = function (name, actionDict) {
    s.extendOperationOrAttribute('operation', name, actionDict);
    return proxy;
  };

  proxy.addAttribute = function (name, actionDict) {
    s.addOperationOrAttribute('attribute', name, actionDict);
    return proxy;
  };

  proxy.extendAttribute = function (name, actionDict) {
    s.extendOperationOrAttribute('attribute', name, actionDict);
    return proxy;
  };

  proxy._getActionDict = function (operationOrAttributeName) {
    var action = s.operations[operationOrAttributeName] || s.attributes[operationOrAttributeName];

    if (!action) {
      throw new Error('"' + operationOrAttributeName + '" is not a valid operation or attribute ' + 'name in this semantics for "' + grammar.name + '"');
    }

    return action.actionDict;
  };

  proxy._remove = function (operationOrAttributeName) {
    var semantic;

    if (operationOrAttributeName in s.operations) {
      semantic = s.operations[operationOrAttributeName];
      delete s.operations[operationOrAttributeName];
    } else if (operationOrAttributeName in s.attributes) {
      semantic = s.attributes[operationOrAttributeName];
      delete s.attributes[operationOrAttributeName];
    }

    delete s.Wrapper.prototype[operationOrAttributeName];
    return semantic;
  };

  proxy.getOperationNames = function () {
    return Object.keys(s.operations);
  };

  proxy.getAttributeNames = function () {
    return Object.keys(s.attributes);
  };

  proxy.getGrammar = function () {
    return s.grammar;
  };

  proxy.toRecipe = function (semanticsOnly) {
    return s.toRecipe(semanticsOnly);
  }; // Make the proxy's toString() work.


  proxy.toString = s.toString.bind(s); // Returns the semantics for the proxy.

  proxy._getSemantics = function () {
    return s;
  };

  return proxy;
}; // ----------------- Operation -----------------
// An Operation represents a function to be applied to a concrete syntax tree (CST) -- it's very
// similar to a Visitor (http://en.wikipedia.org/wiki/Visitor_pattern). An operation is executed by
// recursively walking the CST, and at each node, invoking the matching semantic action from
// `actionDict`. See `Operation.prototype.execute` for details of how a CST node's matching semantic
// action is found.


function Operation(name, formals, actionDict, builtInDefault) {
  this.name = name;
  this.formals = formals;
  this.actionDict = actionDict;
  this.builtInDefault = builtInDefault;
}

Operation.prototype.typeName = 'operation';

Operation.prototype.checkActionDict = function (grammar) {
  grammar._checkTopDownActionDict(this.typeName, this.name, this.actionDict);
}; // Execute this operation on the CST node associated with `nodeWrapper` in the context of the given
// Semantics instance.


Operation.prototype.execute = function (semantics, nodeWrapper) {
  try {
    // Look for a semantic action whose name matches the node's constructor name, which is either
    // the name of a rule in the grammar, or '_terminal' (for a terminal node), or '_iter' (for an
    // iteration node). In the latter case, the action function receives a single argument, which
    // is an array containing all of the children of the CST node.
    var ctorName = nodeWrapper._node.ctorName;
    var actionFn = this.actionDict[ctorName];
    var ans;

    if (actionFn) {
      globalActionStack.push([this, ctorName]);
      ans = this.doAction(semantics, nodeWrapper, actionFn, nodeWrapper.isIteration());
      return ans;
    } // The action dictionary does not contain a semantic action for this specific type of node.
    // If this is a nonterminal node and the programmer has provided a `_nonterminal` semantic
    // action, we invoke it:


    if (nodeWrapper.isNonterminal()) {
      actionFn = this.actionDict._nonterminal;

      if (actionFn) {
        globalActionStack.push([this, '_nonterminal', ctorName]);
        ans = this.doAction(semantics, nodeWrapper, actionFn, true);
        return ans;
      }
    } // Otherwise, we invoke the '_default' semantic action.


    globalActionStack.push([this, 'default action', ctorName]);
    ans = this.doAction(semantics, nodeWrapper, this.actionDict._default, true);
    return ans;
  } finally {
    globalActionStack.pop();
  }
}; // Invoke `actionFn` on the CST node that corresponds to `nodeWrapper`, in the context of
// `semantics`. If `optPassChildrenAsArray` is truthy, `actionFn` will be called with a single
// argument, which is an array of wrappers. Otherwise, the number of arguments to `actionFn` will
// be equal to the number of children in the CST node.


Operation.prototype.doAction = function (semantics, nodeWrapper, actionFn, optPassChildrenAsArray) {
  return optPassChildrenAsArray ? actionFn.call(nodeWrapper, nodeWrapper._children()) : actionFn.apply(nodeWrapper, nodeWrapper._children());
}; // ----------------- Attribute -----------------
// Attributes are Operations whose results are memoized. This means that, for any given semantics,
// the semantic action for a CST node will be invoked no more than once.


function Attribute(name, actionDict, builtInDefault) {
  this.name = name;
  this.formals = [];
  this.actionDict = actionDict;
  this.builtInDefault = builtInDefault;
}

inherits(Attribute, Operation);
Attribute.prototype.typeName = 'attribute';

Attribute.prototype.execute = function (semantics, nodeWrapper) {
  var node = nodeWrapper._node;
  var key = semantics.attributeKeys[this.name];

  if (!node.hasOwnProperty(key)) {
    // The following is a super-send -- isn't JS beautiful? :/
    node[key] = Operation.prototype.execute.call(this, semantics, nodeWrapper);
  }

  return node[key];
}; // ----------------- Deferred initialization -----------------


util.awaitBuiltInRules(function (builtInRules) {
  var operationsAndAttributesGrammar = require('../dist/operations-and-attributes');

  initBuiltInSemantics(builtInRules);
  initPrototypeParser(operationsAndAttributesGrammar); // requires BuiltInSemantics
});

function initBuiltInSemantics(builtInRules) {
  var actions = {
    empty: function () {
      return this.iteration();
    },
    nonEmpty: function (first, _, rest) {
      return this.iteration([first].concat(rest.children));
    }
  };
  Semantics.BuiltInSemantics = Semantics.createSemantics(builtInRules, null).addOperation('asIteration', {
    emptyListOf: actions.empty,
    nonemptyListOf: actions.nonEmpty,
    EmptyListOf: actions.empty,
    NonemptyListOf: actions.nonEmpty
  });
}

function initPrototypeParser(grammar) {
  prototypeGrammarSemantics = grammar.createSemantics().addOperation('parse', {
    AttributeSignature: function (name) {
      return {
        name: name.parse(),
        formals: []
      };
    },
    OperationSignature: function (name, optFormals) {
      return {
        name: name.parse(),
        formals: optFormals.parse()[0] || []
      };
    },
    Formals: function (oparen, fs, cparen) {
      return fs.asIteration().parse();
    },
    name: function (first, rest) {
      return this.sourceString;
    }
  });
  prototypeGrammar = grammar;
}

; // --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Semantics;
},{"es6-symbol":"QUJB","inherits":"4Bm0","./InputStream":"Dwac","./nodes":"m4FS","./MatchResult":"Sx4M","./common":"g606","./errors":"+7+5","./util":"NOPz","../dist/operations-and-attributes":"Y6c6"}],"52Ng":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var CaseInsensitiveTerminal = require('./CaseInsensitiveTerminal');

var Matcher = require('./Matcher');

var Semantics = require('./Semantics');

var common = require('./common');

var errors = require('./errors');

var pexprs = require('./pexprs'); // --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------


function getSortedRuleValues(grammar) {
  return Object.keys(grammar.rules).sort().map(function (name) {
    return grammar.rules[name];
  });
}

function Grammar(name, superGrammar, rules, optDefaultStartRule) {
  this.name = name;
  this.superGrammar = superGrammar;
  this.rules = rules;

  if (optDefaultStartRule) {
    if (!(optDefaultStartRule in rules)) {
      throw new Error("Invalid start rule: '" + optDefaultStartRule + "' is not a rule in grammar '" + name + "'");
    }

    this.defaultStartRule = optDefaultStartRule;
  }
}

var ohmGrammar;
var buildGrammar; // This method is called from main.js once Ohm has loaded.

Grammar.initApplicationParser = function (grammar, builderFn) {
  ohmGrammar = grammar;
  buildGrammar = builderFn;
};

Grammar.prototype = {
  matcher: function () {
    return new Matcher(this);
  },
  // Return true if the grammar is a built-in grammar, otherwise false.
  // NOTE: This might give an unexpected result if called before BuiltInRules is defined!
  isBuiltIn: function () {
    return this === Grammar.ProtoBuiltInRules || this === Grammar.BuiltInRules;
  },
  equals: function (g) {
    if (this === g) {
      return true;
    } // Do the cheapest comparisons first.


    if (g == null || this.name !== g.name || this.defaultStartRule !== g.defaultStartRule || !(this.superGrammar === g.superGrammar || this.superGrammar.equals(g.superGrammar))) {
      return false;
    }

    var myRules = getSortedRuleValues(this);
    var otherRules = getSortedRuleValues(g);
    return myRules.length === otherRules.length && myRules.every(function (rule, i) {
      return rule.description === otherRules[i].description && rule.formals.join(',') === otherRules[i].formals.join(',') && rule.body.toString() === otherRules[i].body.toString();
    });
  },
  match: function (input, optStartApplication) {
    var m = this.matcher();
    m.replaceInputRange(0, 0, input);
    return m.match(optStartApplication);
  },
  trace: function (input, optStartApplication) {
    var m = this.matcher();
    m.replaceInputRange(0, 0, input);
    return m.trace(optStartApplication);
  },
  semantics: function () {
    // TODO: Remove this eventually! Deprecated in v0.12.
    throw new Error('semantics() is deprecated -- use createSemantics() instead.');
  },
  createSemantics: function () {
    return Semantics.createSemantics(this);
  },
  extendSemantics: function (superSemantics) {
    return Semantics.createSemantics(this, superSemantics._getSemantics());
  },
  // Check that every key in `actionDict` corresponds to a semantic action, and that it maps to
  // a function of the correct arity. If not, throw an exception.
  _checkTopDownActionDict: function (what, name, actionDict) {
    function isSpecialAction(a) {
      return a === '_iter' || a === '_terminal' || a === '_nonterminal' || a === '_default';
    }

    var problems = [];

    for (var k in actionDict) {
      var v = actionDict[k];

      if (!isSpecialAction(k) && !(k in this.rules)) {
        problems.push("'" + k + "' is not a valid semantic action for '" + this.name + "'");
      } else if (typeof v !== 'function') {
        problems.push("'" + k + "' must be a function in an action dictionary for '" + this.name + "'");
      } else {
        var actual = v.length;

        var expected = this._topDownActionArity(k);

        if (actual !== expected) {
          problems.push("Semantic action '" + k + "' has the wrong arity: " + 'expected ' + expected + ', got ' + actual);
        }
      }
    }

    if (problems.length > 0) {
      var prettyProblems = problems.map(function (problem) {
        return '- ' + problem;
      });
      var error = new Error("Found errors in the action dictionary of the '" + name + "' " + what + ':\n' + prettyProblems.join('\n'));
      error.problems = problems;
      throw error;
    }
  },
  // Return the expected arity for a semantic action named `actionName`, which
  // is either a rule name or a special action name like '_nonterminal'.
  _topDownActionArity: function (actionName) {
    if (actionName === '_iter' || actionName === '_nonterminal' || actionName === '_default') {
      return 1;
    } else if (actionName === '_terminal') {
      return 0;
    }

    return this.rules[actionName].body.getArity();
  },
  _inheritsFrom: function (grammar) {
    var g = this.superGrammar;

    while (g) {
      if (g.equals(grammar, true)) {
        return true;
      }

      g = g.superGrammar;
    }

    return false;
  },
  toRecipe: function (optVarName) {
    var metaInfo = {}; // Include the grammar source if it is available.

    if (this.source) {
      metaInfo.source = this.source.contents;
    }

    var superGrammar = null;

    if (this.superGrammar && !this.superGrammar.isBuiltIn()) {
      superGrammar = JSON.parse(this.superGrammar.toRecipe());
    }

    var startRule = null;

    if (this.defaultStartRule) {
      startRule = this.defaultStartRule;
    }

    var rules = {};
    var self = this;
    Object.keys(this.rules).forEach(function (ruleName) {
      var ruleInfo = self.rules[ruleName];
      var body = ruleInfo.body;
      var isDefinition = !self.superGrammar || !self.superGrammar.rules[ruleName];
      var operation;

      if (isDefinition) {
        operation = 'define';
      } else {
        operation = body instanceof pexprs.Extend ? 'extend' : 'override';
      }

      var metaInfo = {};

      if (ruleInfo.source && self.source) {
        var adjusted = ruleInfo.source.relativeTo(self.source);
        metaInfo.sourceInterval = [adjusted.startIdx, adjusted.endIdx];
      }

      var description = isDefinition ? ruleInfo.description : null;
      var bodyRecipe = body.outputRecipe(ruleInfo.formals, self.source);
      rules[ruleName] = [operation, // "define"/"extend"/"override"
      metaInfo, description, ruleInfo.formals, bodyRecipe];
    });
    return JSON.stringify(['grammar', metaInfo, this.name, superGrammar, startRule, rules]);
  },
  // TODO: Come up with better names for these methods.
  // TODO: Write the analog of these methods for inherited attributes.
  toOperationActionDictionaryTemplate: function () {
    return this._toOperationOrAttributeActionDictionaryTemplate();
  },
  toAttributeActionDictionaryTemplate: function () {
    return this._toOperationOrAttributeActionDictionaryTemplate();
  },
  _toOperationOrAttributeActionDictionaryTemplate: function () {
    // TODO: add the super-grammar's templates at the right place, e.g., a case for AddExpr_plus
    // should appear next to other cases of AddExpr.
    var sb = new common.StringBuffer();
    sb.append('{');
    var first = true;

    for (var ruleName in this.rules) {
      var body = this.rules[ruleName].body;

      if (first) {
        first = false;
      } else {
        sb.append(',');
      }

      sb.append('\n');
      sb.append('  ');
      this.addSemanticActionTemplate(ruleName, body, sb);
    }

    sb.append('\n}');
    return sb.contents();
  },
  addSemanticActionTemplate: function (ruleName, body, sb) {
    sb.append(ruleName);
    sb.append(': function(');

    var arity = this._topDownActionArity(ruleName);

    sb.append(common.repeat('_', arity).join(', '));
    sb.append(') {\n');
    sb.append('  }');
  },
  // Parse a string which expresses a rule application in this grammar, and return the
  // resulting Apply node.
  parseApplication: function (str) {
    var app;

    if (str.indexOf('<') === -1) {
      // simple application
      app = new pexprs.Apply(str);
    } else {
      // parameterized application
      var cst = ohmGrammar.match(str, 'Base_application');
      app = buildGrammar(cst, {});
    } // Ensure that the application is valid.


    if (!(app.ruleName in this.rules)) {
      throw errors.undeclaredRule(app.ruleName, this.name);
    }

    var formals = this.rules[app.ruleName].formals;

    if (formals.length !== app.args.length) {
      var source = this.rules[app.ruleName].source;
      throw errors.wrongNumberOfParameters(app.ruleName, formals.length, app.args.length, source);
    }

    return app;
  }
}; // The following grammar contains a few rules that couldn't be written  in "userland".
// At the bottom of src/main.js, we create a sub-grammar of this grammar that's called
// `BuiltInRules`. That grammar contains several convenience rules, e.g., `letter` and
// `digit`, and is implicitly the super-grammar of any grammar whose super-grammar
// isn't specified.

Grammar.ProtoBuiltInRules = new Grammar('ProtoBuiltInRules', // name
undefined, // supergrammar
{
  any: {
    body: pexprs.any,
    formals: [],
    description: 'any character',
    primitive: true
  },
  end: {
    body: pexprs.end,
    formals: [],
    description: 'end of input',
    primitive: true
  },
  caseInsensitive: {
    body: new CaseInsensitiveTerminal(new pexprs.Param(0)),
    formals: ['str'],
    primitive: true
  },
  lower: {
    body: new pexprs.UnicodeChar('Ll'),
    formals: [],
    description: 'a lowercase letter',
    primitive: true
  },
  upper: {
    body: new pexprs.UnicodeChar('Lu'),
    formals: [],
    description: 'an uppercase letter',
    primitive: true
  },
  // The union of Lt (titlecase), Lm (modifier), and Lo (other), i.e. any letter not in Ll or Lu.
  unicodeLtmo: {
    body: new pexprs.UnicodeChar('Ltmo'),
    formals: [],
    description: 'a Unicode character in Lt, Lm, or Lo',
    primitive: true
  },
  // These rules are not truly primitive (they could be written in userland) but are defined
  // here for bootstrapping purposes.
  spaces: {
    body: new pexprs.Star(new pexprs.Apply('space')),
    formals: []
  },
  space: {
    body: new pexprs.Range('\x00', ' '),
    formals: [],
    description: 'a space'
  }
}); // --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Grammar;
},{"./CaseInsensitiveTerminal":"t2hR","./Matcher":"xFKF","./Semantics":"6mT9","./common":"g606","./errors":"+7+5","./pexprs":"RYLI"}],"k+1W":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Grammar = require('./Grammar');

var InputStream = require('./InputStream');

var common = require('./common');

var errors = require('./errors');

var pexprs = require('./pexprs'); // --------------------------------------------------------------------
// Private Stuff
// --------------------------------------------------------------------
// Constructors


function GrammarDecl(name) {
  this.name = name;
} // Helpers


GrammarDecl.prototype.sourceInterval = function (startIdx, endIdx) {
  return this.source.subInterval(startIdx, endIdx - startIdx);
};

GrammarDecl.prototype.ensureSuperGrammar = function () {
  if (!this.superGrammar) {
    this.withSuperGrammar( // TODO: The conditional expression below is an ugly hack. It's kind of ok because
    // I doubt anyone will ever try to declare a grammar called `BuiltInRules`. Still,
    // we should try to find a better way to do this.
    this.name === 'BuiltInRules' ? Grammar.ProtoBuiltInRules : Grammar.BuiltInRules);
  }

  return this.superGrammar;
};

GrammarDecl.prototype.installOverriddenOrExtendedRule = function (name, formals, body, source) {
  var duplicateParameterNames = common.getDuplicates(formals);

  if (duplicateParameterNames.length > 0) {
    throw errors.duplicateParameterNames(name, duplicateParameterNames, source);
  }

  var ruleInfo = this.ensureSuperGrammar().rules[name];
  var expectedFormals = ruleInfo.formals;
  var expectedNumFormals = expectedFormals ? expectedFormals.length : 0;

  if (formals.length !== expectedNumFormals) {
    throw errors.wrongNumberOfParameters(name, expectedNumFormals, formals.length, source);
  }

  return this.install(name, formals, body, ruleInfo.description, source);
};

GrammarDecl.prototype.install = function (name, formals, body, description, source) {
  this.rules[name] = {
    body: body.introduceParams(formals),
    formals: formals,
    description: description,
    source: source
  };
  return this;
}; // Stuff that you should only do once


GrammarDecl.prototype.withSuperGrammar = function (superGrammar) {
  if (this.superGrammar) {
    throw new Error('the super grammar of a GrammarDecl cannot be set more than once');
  }

  this.superGrammar = superGrammar;
  this.rules = Object.create(superGrammar.rules); // Grammars with an explicit supergrammar inherit a default start rule.

  if (!superGrammar.isBuiltIn()) {
    this.defaultStartRule = superGrammar.defaultStartRule;
  }

  return this;
};

GrammarDecl.prototype.withDefaultStartRule = function (ruleName) {
  this.defaultStartRule = ruleName;
  return this;
};

GrammarDecl.prototype.withSource = function (source) {
  this.source = new InputStream(source).interval(0, source.length);
  return this;
}; // Creates a Grammar instance, and if it passes the sanity checks, returns it.


GrammarDecl.prototype.build = function () {
  var grammar = new Grammar(this.name, this.ensureSuperGrammar(), this.rules, this.defaultStartRule); // TODO: change the pexpr.prototype.assert... methods to make them add
  // exceptions to an array that's provided as an arg. Then we'll be able to
  // show more than one error of the same type at a time.
  // TODO: include the offending pexpr in the errors, that way we can show
  // the part of the source that caused it.

  var grammarErrors = [];
  var grammarHasInvalidApplications = false;
  Object.keys(grammar.rules).forEach(function (ruleName) {
    var body = grammar.rules[ruleName].body;

    try {
      body.assertChoicesHaveUniformArity(ruleName);
    } catch (e) {
      grammarErrors.push(e);
    }

    try {
      body.assertAllApplicationsAreValid(ruleName, grammar);
    } catch (e) {
      grammarErrors.push(e);
      grammarHasInvalidApplications = true;
    }
  });

  if (!grammarHasInvalidApplications) {
    // The following check can only be done if the grammar has no invalid applications.
    Object.keys(grammar.rules).forEach(function (ruleName) {
      var body = grammar.rules[ruleName].body;

      try {
        body.assertIteratedExprsAreNotNullable(grammar, ruleName);
      } catch (e) {
        grammarErrors.push(e);
      }
    });
  }

  if (grammarErrors.length > 0) {
    errors.throwErrors(grammarErrors);
  }

  if (this.source) {
    grammar.source = this.source;
  }

  return grammar;
}; // Rule declarations


GrammarDecl.prototype.define = function (name, formals, body, description, source) {
  this.ensureSuperGrammar();

  if (this.superGrammar.rules[name]) {
    throw errors.duplicateRuleDeclaration(name, this.name, this.superGrammar.name, source);
  } else if (this.rules[name]) {
    throw errors.duplicateRuleDeclaration(name, this.name, this.name, source);
  }

  var duplicateParameterNames = common.getDuplicates(formals);

  if (duplicateParameterNames.length > 0) {
    throw errors.duplicateParameterNames(name, duplicateParameterNames, source);
  }

  return this.install(name, formals, body, description, source);
};

GrammarDecl.prototype.override = function (name, formals, body, descIgnored, source) {
  var ruleInfo = this.ensureSuperGrammar().rules[name];

  if (!ruleInfo) {
    throw errors.cannotOverrideUndeclaredRule(name, this.superGrammar.name, source);
  }

  this.installOverriddenOrExtendedRule(name, formals, body, source);
  return this;
};

GrammarDecl.prototype.extend = function (name, formals, fragment, descIgnored, source) {
  var ruleInfo = this.ensureSuperGrammar().rules[name];

  if (!ruleInfo) {
    throw errors.cannotExtendUndeclaredRule(name, this.superGrammar.name, source);
  }

  var body = new pexprs.Extend(this.superGrammar, name, fragment);
  body.source = fragment.source;
  this.installOverriddenOrExtendedRule(name, formals, body, source);
  return this;
}; // --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------


module.exports = GrammarDecl;
},{"./Grammar":"52Ng","./InputStream":"Dwac","./common":"g606","./errors":"+7+5","./pexprs":"RYLI"}],"t92O":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var GrammarDecl = require('./GrammarDecl');

var pexprs = require('./pexprs'); // --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------


function Builder() {}

Builder.prototype = {
  currentDecl: null,
  newGrammar: function (name) {
    return new GrammarDecl(name);
  },
  grammar: function (metaInfo, name, superGrammar, defaultStartRule, rules) {
    var gDecl = new GrammarDecl(name);

    if (superGrammar) {
      gDecl.withSuperGrammar(this.fromRecipe(superGrammar));
    }

    if (defaultStartRule) {
      gDecl.withDefaultStartRule(defaultStartRule);
    }

    if (metaInfo && metaInfo.source) {
      gDecl.withSource(metaInfo.source);
    }

    var self = this;
    this.currentDecl = gDecl;
    Object.keys(rules).forEach(function (ruleName) {
      var ruleRecipe = rules[ruleName];
      var action = ruleRecipe[0]; // define/extend/override

      var metaInfo = ruleRecipe[1];
      var description = ruleRecipe[2];
      var formals = ruleRecipe[3];
      var body = self.fromRecipe(ruleRecipe[4]);
      var source;

      if (gDecl.source && metaInfo && metaInfo.sourceInterval) {
        source = gDecl.source.subInterval(metaInfo.sourceInterval[0], metaInfo.sourceInterval[1] - metaInfo.sourceInterval[0]);
      }

      gDecl[action](ruleName, formals, body, description, source);
    });
    this.currentDecl = null;
    return gDecl.build();
  },
  terminal: function (x) {
    return new pexprs.Terminal(x);
  },
  range: function (from, to) {
    return new pexprs.Range(from, to);
  },
  param: function (index) {
    return new pexprs.Param(index);
  },
  alt: function ()
  /* term1, term1, ... */
  {
    var terms = [];

    for (var idx = 0; idx < arguments.length; idx++) {
      var arg = arguments[idx];

      if (!(arg instanceof pexprs.PExpr)) {
        arg = this.fromRecipe(arg);
      }

      if (arg instanceof pexprs.Alt) {
        terms = terms.concat(arg.terms);
      } else {
        terms.push(arg);
      }
    }

    return terms.length === 1 ? terms[0] : new pexprs.Alt(terms);
  },
  seq: function ()
  /* factor1, factor2, ... */
  {
    var factors = [];

    for (var idx = 0; idx < arguments.length; idx++) {
      var arg = arguments[idx];

      if (!(arg instanceof pexprs.PExpr)) {
        arg = this.fromRecipe(arg);
      }

      if (arg instanceof pexprs.Seq) {
        factors = factors.concat(arg.factors);
      } else {
        factors.push(arg);
      }
    }

    return factors.length === 1 ? factors[0] : new pexprs.Seq(factors);
  },
  star: function (expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }

    return new pexprs.Star(expr);
  },
  plus: function (expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }

    return new pexprs.Plus(expr);
  },
  opt: function (expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }

    return new pexprs.Opt(expr);
  },
  not: function (expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }

    return new pexprs.Not(expr);
  },
  la: function (expr) {
    // TODO: temporary to still be able to read old recipes
    return this.lookahead(expr);
  },
  lookahead: function (expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }

    return new pexprs.Lookahead(expr);
  },
  lex: function (expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }

    return new pexprs.Lex(expr);
  },
  app: function (ruleName, optParams) {
    if (optParams && optParams.length > 0) {
      optParams = optParams.map(function (param) {
        return param instanceof pexprs.PExpr ? param : this.fromRecipe(param);
      }, this);
    }

    return new pexprs.Apply(ruleName, optParams);
  },
  fromRecipe: function (recipe) {
    // the meta-info of 'grammar' is proccessed in Builder.grammar
    var result = this[recipe[0]].apply(this, recipe[0] === 'grammar' ? recipe.slice(1) : recipe.slice(2));
    var metaInfo = recipe[1];

    if (metaInfo) {
      if (metaInfo.sourceInterval && this.currentDecl) {
        result.withSource(this.currentDecl.sourceInterval.apply(this.currentDecl, metaInfo.sourceInterval));
      }
    }

    return result;
  }
}; // --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Builder;
},{"./GrammarDecl":"k+1W","./pexprs":"RYLI"}],"eY6Q":[function(require,module,exports) {
module.exports = {
  "name": "ohm-js",
  "version": "0.14.0",
  "description": "An object-oriented language for parsing and pattern matching",
  "repository": "https://github.com/harc/ohm",
  "keywords": ["parser", "compiler", "pattern matching", "pattern-matching", "ometa", "ometa/js", "ometa-js", "ometajs", "rapid", "prototyping"],
  "homepage": "https://ohmlang.github.io/",
  "bugs": "https://github.com/harc/ohm/issues",
  "main": "src/main.js",
  "bin": "src/ohm-cmd.js",
  "types": "index.d.ts",
  "scripts": {
    "prebootstrap": "bash bin/prebootstrap",
    "bootstrap": "bash bin/bootstrap --test || (echo 'Bootstrap failed.' && mv -v dist/ohm-grammar.js.old dist/ohm-grammar.js && mv -v dist/built-in-rules.js.old dist/built-in-rules.js && mv -v dist/operations-and-attributes.js.old dist/operations-and-attributes.js)",
    "build": "node bin/build-debug.js && uglifyjs dist/ohm.js > dist/ohm.min.js",
    "prebuild-debug": "bash bin/update-env.sh",
    "build-debug": "bash bin/build-debug.sh",
    "ci-test": "npm run lint && npm test && ts-node test/test-typings.ts",
    "clean": "rm -f dist/ohm.js dist/ohm.min.js",
    "deploy-gh-pages": "bin/deploy-gh-pages.sh",
    "lint": "eslint .",
    "pretest": "bash bin/update-env.sh",
    "test": "tape 'test/**/*.js' | tap-spec",
    "test-watch": "bash bin/test-watch",
    "postinstall": "node bin/dev-setup.js",
    "precommit": "npm run prepublishOnly",
    "prepublishOnly": "npm run lint && npm run build && npm run bootstrap",
    "unsafe-bootstrap": "bash bin/bootstrap",
    "visualizer": "bash bin/ohm-visualizer",
    "watch": "bash bin/watch.sh"
  },
  "license": "MIT",
  "author": "Alex Warth <alexwarth@gmail.com> (http://tinlizzie.org/~awarth)",
  "contributors": ["Patrick Dubroy <pdubroy@gmail.com>", "Meixian Li <lmeixian@gmail.com>", "Marko Röder <m.roeder@photon-software.de>", "Tony Garnock-Jones <tonygarnockjones@gmail.com>", "Saketh Kasibatla <sake.kasi@gmail.com>", "Lionel Landwerlin <llandwerlin@gmail.com>", "Jason Merrill <jwmerrill@gmail.com>", "Yoshiki Ohshima <Yoshiki.Ohshima@acm.org>", "Ray Toal <rtoal@lmu.edu>", "Jonathan Edwards <JonathanMEdwards@gmail.com>", "Neil Jewers <njjewers@uwaterloo.ca>", "sfinnie <scott.finnie@gmail.com>", "Arthur Carabott <arthurc@gmail.com>", "Daniel Tomlinson <DanielTomlinson@me.com>", "Justin Chase <justin.m.chase@gmail.com>", "Leslie Ying <acetophore@users.noreply.github.com>", "Luca Guzzon <luca.guzzon@gmail.com>", "Mike Niebling <(none)>", "Milan Lajtoš <milan.lajtos@me.com>", "Stephan Seidt <stephan.seidt@gmail.com>", "acslk <d_vd415@hotmail.com>", "codeZeilen <codeZeilen@users.noreply.github.com>", "owch <bowenrainyday@gmail.com>"],
  "dependencies": {
    "es6-symbol": "^3.1.0",
    "inherits": "^2.0.3",
    "is-buffer": "^1.1.4",
    "util-extend": "^1.0.3"
  },
  "devDependencies": {
    "@types/tape": "^4.2.29",
    "browserify": "^13.1.1",
    "eslint": "~3.13.1",
    "eslint-config-google": "~0.7.1",
    "eslint-plugin-camelcase-ohm": "~0.2.1",
    "eslint-plugin-no-extension-in-require": "~0.2.0",
    "eslint-plugin-tape": "~1.1.0",
    "husky": "^0.14.3",
    "jsdom": "^9.9.1",
    "json": "^9.0.4",
    "markscript": "^0.5.0",
    "node-static": "^0.7.9",
    "nodemon": "^1.11.0",
    "tap-spec": "^4.1.1",
    "tape": "^4.6.3",
    "tape-catch": "^1.0.6",
    "ts-node": "^2.1.0",
    "typescript": "2.2.1",
    "uglify-js": "^2.7.5",
    "walk-sync": "^0.3.1",
    "watchify": "^3.8.0"
  },
  "engines": {
    "node": ">=0.12.1"
  }
};
},{}],"ap7j":[function(require,module,exports) {
/* global browserifyGlobalOhmVersion */
'use strict'; // When running under Node, read the version from package.json. For the browser,
// use a special global variable defined in the build process (see bin/build-debug.js).

module.exports = typeof browserifyGlobalOhmVersion === 'string' ? browserifyGlobalOhmVersion : require('../package.json').version;
},{"../package.json":"eY6Q"}],"q/Zl":[function(require,module,exports) {
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],"7IHp":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var assert = require('../src/common').assert; // --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
// Helpers


function getProp(name, thing, fn) {
  return fn(thing[name]);
}

function mapProp(name, thing, fn) {
  return thing[name].map(fn);
} // Returns a function that will walk a single property of a node.
// `descriptor` is a string indicating the property name, optionally ending
// with '[]' (e.g., 'children[]').


function getPropWalkFn(descriptor) {
  var parts = descriptor.split(/ ?\[\]/);

  if (parts.length === 2) {
    return mapProp.bind(null, parts[0]);
  }

  return getProp.bind(null, descriptor);
}

function getProps(walkFns, thing, fn) {
  return walkFns.map(function (walkFn) {
    return walkFn(thing, fn);
  });
}

function getWalkFn(shape) {
  if (typeof shape === 'string') {
    return getProps.bind(null, [getPropWalkFn(shape)]);
  } else if (Array.isArray(shape)) {
    return getProps.bind(null, shape.map(getPropWalkFn));
  } else {
    assert(typeof shape === 'function', 'Expected a string, Array, or function');
    assert(shape.length === 2, 'Expected a function of arity 2, got ' + shape.length);
    return shape;
  }
}

function isRestrictedIdentifier(str) {
  return /^[a-zA-Z_][0-9a-zA-Z_]*$/.test(str);
}

function trim(s) {
  return s.trim();
}

function parseSignature(sig) {
  var parts = sig.split(/[()]/).map(trim);

  if (parts.length === 3 && parts[2] === '') {
    var name = parts[0];
    var params = [];

    if (parts[1].length > 0) {
      params = parts[1].split(',').map(trim);
    }

    if (isRestrictedIdentifier(name) && params.every(isRestrictedIdentifier)) {
      return {
        name: name,
        formals: params
      };
    }
  }

  throw new Error('Invalid operation signature: ' + sig);
}
/*
  A VisitorFamily contains a set of recursive operations that are defined over some kind of
  tree structure. The `config` parameter specifies how to walk the tree:
  - 'getTag' is function which, given a node in the tree, returns the node's 'tag' (type)
  - 'shapes' an object that maps from a tag to a value that describes how to recursively
    evaluate the operation for nodes of that type. The value can be:
    * a string indicating the property name that holds that node's only child
    * an Array of property names (or an empty array indicating a leaf type), or
    * a function taking two arguments (node, fn), and returning an Array which is the result
      of apply `fn` to each of the node's children.
 */


function VisitorFamily(config) {
  this._shapes = config.shapes;
  this._getTag = config.getTag;

  this.Adapter = function (thing, family) {
    this._adaptee = thing;
    this._family = family;
  };

  this.Adapter.prototype.valueOf = function () {
    throw new Error('heeey!');
  };

  this.operations = {};
  this._arities = Object.create(null);
  this._getChildren = Object.create(null);
  var self = this;
  Object.keys(this._shapes).forEach(function (k) {
    var shape = self._shapes[k];
    self._getChildren[k] = getWalkFn(shape); // A function means the arity isn't fixed, so don't put an entry in the arity map.

    if (typeof shape !== 'function') {
      self._arities[k] = Array.isArray(shape) ? shape.length : 1;
    }
  });

  this._wrap = function (thing) {
    return new self.Adapter(thing, self);
  };
}

VisitorFamily.prototype.wrap = function (thing) {
  return this._wrap(thing);
};

VisitorFamily.prototype._checkActionDict = function (dict) {
  var self = this;
  Object.keys(dict).forEach(function (k) {
    assert(k in self._getChildren, "Unrecognized action name '" + k + "'");
    var action = dict[k];
    assert(typeof action === 'function', "Key '" + k + "': expected function, got " + action);

    if (k in self._arities) {
      var expected = self._arities[k];
      var actual = dict[k].length;
      assert(actual === expected, "Action '" + k + "' has the wrong arity: expected " + expected + ', got ' + actual);
    }
  });
};

VisitorFamily.prototype.addOperation = function (signature, actions) {
  var sig = parseSignature(signature);
  var name = sig.name;

  this._checkActionDict(actions);

  this.operations[name] = {
    name: name,
    formals: sig.formals,
    actions: actions
  };
  var family = this;

  this.Adapter.prototype[name] = function () {
    var tag = family._getTag(this._adaptee);

    assert(tag in family._getChildren, "getTag returned unrecognized tag '" + tag + "'");
    assert(tag in actions, "No action for '" + tag + "' in operation '" + name + "'"); // Create an "arguments object" from the arguments that were passed to this
    // operation / attribute.

    var args = Object.create(null);

    for (var i = 0; i < arguments.length; i++) {
      args[sig.formals[i]] = arguments[i];
    }

    var oldArgs = this.args;
    this.args = args;
    var ans = actions[tag].apply(this, family._getChildren[tag](this._adaptee, family._wrap));
    this.args = oldArgs;
    return ans;
  };

  return this;
}; // --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------


module.exports = VisitorFamily;
},{"../src/common":"g606"}],"SCQ9":[function(require,module,exports) {
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var pexprs = require('../src/pexprs');

var MatchResult = require('../src/MatchResult');

var Grammar = require('../src/Grammar');

var extend = require('util-extend'); // --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------


var defaultOperation = {
  _terminal: function () {
    return this.primitiveValue;
  },
  _nonterminal: function (children) {
    var ctorName = this._node.ctorName;
    var mapping = this.args.mapping; // without customization

    if (!mapping.hasOwnProperty(ctorName)) {
      // intermediate node
      if (this._node instanceof pexprs.Alt || this._node instanceof pexprs.Apply) {
        return children[0].toAST(mapping);
      } // lexical rule


      if (this.isLexical()) {
        return this.sourceString;
      } // singular node (e.g. only surrounded by literals or lookaheads)


      var realChildren = children.filter(function (child) {
        return !child.isTerminal();
      });

      if (realChildren.length === 1) {
        return realChildren[0].toAST(mapping);
      } // rest: terms with multiple children

    } // direct forward


    if (typeof mapping[ctorName] === 'number') {
      return children[mapping[ctorName]].toAST(mapping);
    } // named/mapped children or unnamed children ('0', '1', '2', ...)


    var propMap = mapping[ctorName] || children;
    var node = {
      type: ctorName
    };

    for (var prop in propMap) {
      var mappedProp = mapping[ctorName] && mapping[ctorName][prop];

      if (typeof mappedProp === 'number') {
        // direct forward
        node[prop] = children[mappedProp].toAST(mapping);
      } else if (typeof mappedProp === 'string' || typeof mappedProp === 'boolean' || mappedProp === null) {
        // primitive value
        node[prop] = mappedProp;
      } else if (_typeof(mappedProp) === 'object' && mappedProp instanceof Number) {
        // primitive number (must be unboxed)
        node[prop] = Number(mappedProp);
      } else if (typeof mappedProp === 'function') {
        // computed value
        node[prop] = mappedProp.call(this, children);
      } else if (mappedProp === undefined) {
        if (children[prop] && !children[prop].isTerminal()) {
          node[prop] = children[prop].toAST(mapping);
        } else {
          // delete predefined 'type' properties, like 'type', if explicitely removed
          delete node[prop];
        }
      }
    }

    return node;
  },
  _iter: function (children) {
    if (this._node.isOptional()) {
      if (this.numChildren === 0) {
        return null;
      } else {
        return children[0].toAST(this.args.mapping);
      }
    }

    return children.map(function (child) {
      return child.toAST(this.args.mapping);
    }, this);
  },
  NonemptyListOf: function (first, sep, rest) {
    return [first.toAST(this.args.mapping)].concat(rest.toAST(this.args.mapping));
  },
  EmptyListOf: function () {
    return [];
  }
}; // Returns a plain JavaScript object that includes an abstract syntax tree (AST)
// for the given match result `res` containg a concrete syntax tree (CST) and grammar.
// The optional `mapping` parameter can be used to customize how the nodes of the CST
// are mapped to the AST (see /doc/extras.md#toastmatchresult-mapping).

function toAST(res, mapping) {
  if (!(res instanceof MatchResult) || res.failed()) {
    throw new Error('toAST() expects a succesfull MatchResult as first parameter');
  }

  mapping = extend({}, mapping);
  var operation = extend({}, defaultOperation);

  for (var termName in mapping) {
    if (typeof mapping[termName] === 'function') {
      operation[termName] = mapping[termName];
      delete mapping[termName];
    }
  }

  var g = res._cst.grammar;
  var s = g.createSemantics().addOperation('toAST(mapping)', operation);
  return s(res).toAST(mapping);
} // Returns a semantics containg the toAST(mapping) operation for the given grammar g.


function semanticsForToAST(g) {
  if (!(g instanceof Grammar)) {
    throw new Error('semanticsToAST() expects a Grammar as parameter');
  }

  return g.createSemantics().addOperation('toAST(mapping)', defaultOperation);
}

module.exports = {
  helper: toAST,
  semantics: semanticsForToAST
};
},{"../src/pexprs":"RYLI","../src/MatchResult":"Sx4M","../src/Grammar":"52Ng","util-extend":"WLkt"}],"hnar":[function(require,module,exports) {
'use strict';

module.exports = {
  VisitorFamily: require('./VisitorFamily'),
  semanticsForToAST: require('./semantics-toAST').semantics,
  toAST: require('./semantics-toAST').helper
};
},{"./VisitorFamily":"7IHp","./semantics-toAST":"SCQ9"}],"5ozn":[function(require,module,exports) {
var ohm = require('..');

module.exports = ohm.makeRecipe(["grammar", {
  "source": "BuiltInRules {\n\n  alnum  (an alpha-numeric character)\n    = letter\n    | digit\n\n  letter  (a letter)\n    = lower\n    | upper\n    | unicodeLtmo\n\n  digit  (a digit)\n    = \"0\"..\"9\"\n\n  hexDigit  (a hexadecimal digit)\n    = digit\n    | \"a\"..\"f\"\n    | \"A\"..\"F\"\n\n  ListOf<elem, sep>\n    = NonemptyListOf<elem, sep>\n    | EmptyListOf<elem, sep>\n\n  NonemptyListOf<elem, sep>\n    = elem (sep elem)*\n\n  EmptyListOf<elem, sep>\n    = /* nothing */\n\n  listOf<elem, sep>\n    = nonemptyListOf<elem, sep>\n    | emptyListOf<elem, sep>\n\n  nonemptyListOf<elem, sep>\n    = elem (sep elem)*\n\n  emptyListOf<elem, sep>\n    = /* nothing */\n\n}"
}, "BuiltInRules", null, null, {
  "alnum": ["define", {
    "sourceInterval": [18, 78]
  }, "an alpha-numeric character", [], ["alt", {
    "sourceInterval": [60, 78]
  }, ["app", {
    "sourceInterval": [60, 66]
  }, "letter", []], ["app", {
    "sourceInterval": [73, 78]
  }, "digit", []]]],
  "letter": ["define", {
    "sourceInterval": [82, 142]
  }, "a letter", [], ["alt", {
    "sourceInterval": [107, 142]
  }, ["app", {
    "sourceInterval": [107, 112]
  }, "lower", []], ["app", {
    "sourceInterval": [119, 124]
  }, "upper", []], ["app", {
    "sourceInterval": [131, 142]
  }, "unicodeLtmo", []]]],
  "digit": ["define", {
    "sourceInterval": [146, 177]
  }, "a digit", [], ["range", {
    "sourceInterval": [169, 177]
  }, "0", "9"]],
  "hexDigit": ["define", {
    "sourceInterval": [181, 254]
  }, "a hexadecimal digit", [], ["alt", {
    "sourceInterval": [219, 254]
  }, ["app", {
    "sourceInterval": [219, 224]
  }, "digit", []], ["range", {
    "sourceInterval": [231, 239]
  }, "a", "f"], ["range", {
    "sourceInterval": [246, 254]
  }, "A", "F"]]],
  "ListOf": ["define", {
    "sourceInterval": [258, 336]
  }, null, ["elem", "sep"], ["alt", {
    "sourceInterval": [282, 336]
  }, ["app", {
    "sourceInterval": [282, 307]
  }, "NonemptyListOf", [["param", {}, 0], ["param", {}, 1]]], ["app", {
    "sourceInterval": [314, 336]
  }, "EmptyListOf", [["param", {}, 0], ["param", {}, 1]]]]],
  "NonemptyListOf": ["define", {
    "sourceInterval": [340, 388]
  }, null, ["elem", "sep"], ["seq", {
    "sourceInterval": [372, 388]
  }, ["param", {}, 0], ["star", {
    "sourceInterval": [377, 388]
  }, ["seq", {
    "sourceInterval": [378, 386]
  }, ["param", {}, 1], ["param", {}, 0]]]]],
  "EmptyListOf": ["define", {
    "sourceInterval": [392, 434]
  }, null, ["elem", "sep"], ["seq", {
    "sourceInterval": [438, 438]
  }]],
  "listOf": ["define", {
    "sourceInterval": [438, 516]
  }, null, ["elem", "sep"], ["alt", {
    "sourceInterval": [462, 516]
  }, ["app", {
    "sourceInterval": [462, 487]
  }, "nonemptyListOf", [["param", {}, 0], ["param", {}, 1]]], ["app", {
    "sourceInterval": [494, 516]
  }, "emptyListOf", [["param", {}, 0], ["param", {}, 1]]]]],
  "nonemptyListOf": ["define", {
    "sourceInterval": [520, 568]
  }, null, ["elem", "sep"], ["seq", {
    "sourceInterval": [552, 568]
  }, ["param", {}, 0], ["star", {
    "sourceInterval": [557, 568]
  }, ["seq", {
    "sourceInterval": [558, 566]
  }, ["param", {}, 1], ["param", {}, 0]]]]],
  "emptyListOf": ["define", {
    "sourceInterval": [572, 614]
  }, null, ["elem", "sep"], ["seq", {
    "sourceInterval": [616, 616]
  }]]
}]);
},{"..":"K+zu"}],"leqA":[function(require,module,exports) {
var ohm = require('..');

module.exports = ohm.makeRecipe(["grammar", {
  "source": "Ohm {\n\n  Grammars\n    = Grammar*\n\n  Grammar\n    = ident SuperGrammar? \"{\" Rule* \"}\"\n\n  SuperGrammar\n    = \"<:\" ident\n\n  Rule\n    = ident Formals? ruleDescr? \"=\"  RuleBody  -- define\n    | ident Formals?            \":=\" RuleBody  -- override\n    | ident Formals?            \"+=\" RuleBody  -- extend\n\n  RuleBody\n    = \"|\"? NonemptyListOf<TopLevelTerm, \"|\">\n\n  TopLevelTerm\n    = Seq caseName  -- inline\n    | Seq\n\n  Formals\n    = \"<\" ListOf<ident, \",\"> \">\"\n\n  Params\n    = \"<\" ListOf<Seq, \",\"> \">\"\n\n  Alt\n    = NonemptyListOf<Seq, \"|\">\n\n  Seq\n    = Iter*\n\n  Iter\n    = Pred \"*\"  -- star\n    | Pred \"+\"  -- plus\n    | Pred \"?\"  -- opt\n    | Pred\n\n  Pred\n    = \"~\" Lex  -- not\n    | \"&\" Lex  -- lookahead\n    | Lex\n\n  Lex\n    = \"#\" Base  -- lex\n    | Base\n\n  Base\n    = ident Params? ~(ruleDescr? \"=\" | \":=\" | \"+=\")  -- application\n    | oneCharTerminal \"..\" oneCharTerminal           -- range\n    | terminal                                       -- terminal\n    | \"(\" Alt \")\"                                    -- paren\n\n  ruleDescr  (a rule description)\n    = \"(\" ruleDescrText \")\"\n\n  ruleDescrText\n    = (~\")\" any)*\n\n  caseName\n    = \"--\" (~\"\\n\" space)* name (~\"\\n\" space)* (\"\\n\" | &\"}\")\n\n  name  (a name)\n    = nameFirst nameRest*\n\n  nameFirst\n    = \"_\"\n    | letter\n\n  nameRest\n    = \"_\"\n    | alnum\n\n  ident  (an identifier)\n    = name\n\n  terminal\n    = \"\\\"\" terminalChar* \"\\\"\"\n\n  oneCharTerminal\n    = \"\\\"\" terminalChar \"\\\"\"\n\n  terminalChar\n    = escapeChar\n    | ~\"\\\\\" ~\"\\\"\" ~\"\\n\" any\n\n  escapeChar  (an escape sequence)\n    = \"\\\\\\\\\"                                     -- backslash\n    | \"\\\\\\\"\"                                     -- doubleQuote\n    | \"\\\\\\'\"                                     -- singleQuote\n    | \"\\\\b\"                                      -- backspace\n    | \"\\\\n\"                                      -- lineFeed\n    | \"\\\\r\"                                      -- carriageReturn\n    | \"\\\\t\"                                      -- tab\n    | \"\\\\u\" hexDigit hexDigit hexDigit hexDigit  -- unicodeEscape\n    | \"\\\\x\" hexDigit hexDigit                    -- hexEscape\n\n  space\n   += comment\n\n  comment\n    = \"//\" (~\"\\n\" any)* \"\\n\"  -- singleLine\n    | \"/*\" (~\"*/\" any)* \"*/\"  -- multiLine\n\n  tokens = token*\n\n  token = caseName | comment | ident | operator | punctuation | terminal | any\n\n  operator = \"<:\" | \"=\" | \":=\" | \"+=\" | \"*\" | \"+\" | \"?\" | \"~\" | \"&\"\n\n  punctuation = \"<\" | \">\" | \",\" | \"--\"\n}"
}, "Ohm", null, "Grammars", {
  "Grammars": ["define", {
    "sourceInterval": [9, 32]
  }, null, [], ["star", {
    "sourceInterval": [24, 32]
  }, ["app", {
    "sourceInterval": [24, 31]
  }, "Grammar", []]]],
  "Grammar": ["define", {
    "sourceInterval": [36, 83]
  }, null, [], ["seq", {
    "sourceInterval": [50, 83]
  }, ["app", {
    "sourceInterval": [50, 55]
  }, "ident", []], ["opt", {
    "sourceInterval": [56, 69]
  }, ["app", {
    "sourceInterval": [56, 68]
  }, "SuperGrammar", []]], ["terminal", {
    "sourceInterval": [70, 73]
  }, "{"], ["star", {
    "sourceInterval": [74, 79]
  }, ["app", {
    "sourceInterval": [74, 78]
  }, "Rule", []]], ["terminal", {
    "sourceInterval": [80, 83]
  }, "}"]]],
  "SuperGrammar": ["define", {
    "sourceInterval": [87, 116]
  }, null, [], ["seq", {
    "sourceInterval": [106, 116]
  }, ["terminal", {
    "sourceInterval": [106, 110]
  }, "<:"], ["app", {
    "sourceInterval": [111, 116]
  }, "ident", []]]],
  "Rule_define": ["define", {
    "sourceInterval": [131, 181]
  }, null, [], ["seq", {
    "sourceInterval": [131, 170]
  }, ["app", {
    "sourceInterval": [131, 136]
  }, "ident", []], ["opt", {
    "sourceInterval": [137, 145]
  }, ["app", {
    "sourceInterval": [137, 144]
  }, "Formals", []]], ["opt", {
    "sourceInterval": [146, 156]
  }, ["app", {
    "sourceInterval": [146, 155]
  }, "ruleDescr", []]], ["terminal", {
    "sourceInterval": [157, 160]
  }, "="], ["app", {
    "sourceInterval": [162, 170]
  }, "RuleBody", []]]],
  "Rule_override": ["define", {
    "sourceInterval": [188, 240]
  }, null, [], ["seq", {
    "sourceInterval": [188, 227]
  }, ["app", {
    "sourceInterval": [188, 193]
  }, "ident", []], ["opt", {
    "sourceInterval": [194, 202]
  }, ["app", {
    "sourceInterval": [194, 201]
  }, "Formals", []]], ["terminal", {
    "sourceInterval": [214, 218]
  }, ":="], ["app", {
    "sourceInterval": [219, 227]
  }, "RuleBody", []]]],
  "Rule_extend": ["define", {
    "sourceInterval": [247, 297]
  }, null, [], ["seq", {
    "sourceInterval": [247, 286]
  }, ["app", {
    "sourceInterval": [247, 252]
  }, "ident", []], ["opt", {
    "sourceInterval": [253, 261]
  }, ["app", {
    "sourceInterval": [253, 260]
  }, "Formals", []]], ["terminal", {
    "sourceInterval": [273, 277]
  }, "+="], ["app", {
    "sourceInterval": [278, 286]
  }, "RuleBody", []]]],
  "Rule": ["define", {
    "sourceInterval": [120, 297]
  }, null, [], ["alt", {
    "sourceInterval": [131, 297]
  }, ["app", {
    "sourceInterval": [131, 170]
  }, "Rule_define", []], ["app", {
    "sourceInterval": [188, 227]
  }, "Rule_override", []], ["app", {
    "sourceInterval": [247, 286]
  }, "Rule_extend", []]]],
  "RuleBody": ["define", {
    "sourceInterval": [301, 354]
  }, null, [], ["seq", {
    "sourceInterval": [316, 354]
  }, ["opt", {
    "sourceInterval": [316, 320]
  }, ["terminal", {
    "sourceInterval": [316, 319]
  }, "|"]], ["app", {
    "sourceInterval": [321, 354]
  }, "NonemptyListOf", [["app", {
    "sourceInterval": [336, 348]
  }, "TopLevelTerm", []], ["terminal", {
    "sourceInterval": [350, 353]
  }, "|"]]]]],
  "TopLevelTerm_inline": ["define", {
    "sourceInterval": [377, 400]
  }, null, [], ["seq", {
    "sourceInterval": [377, 389]
  }, ["app", {
    "sourceInterval": [377, 380]
  }, "Seq", []], ["app", {
    "sourceInterval": [381, 389]
  }, "caseName", []]]],
  "TopLevelTerm": ["define", {
    "sourceInterval": [358, 410]
  }, null, [], ["alt", {
    "sourceInterval": [377, 410]
  }, ["app", {
    "sourceInterval": [377, 389]
  }, "TopLevelTerm_inline", []], ["app", {
    "sourceInterval": [407, 410]
  }, "Seq", []]]],
  "Formals": ["define", {
    "sourceInterval": [414, 454]
  }, null, [], ["seq", {
    "sourceInterval": [428, 454]
  }, ["terminal", {
    "sourceInterval": [428, 431]
  }, "<"], ["app", {
    "sourceInterval": [432, 450]
  }, "ListOf", [["app", {
    "sourceInterval": [439, 444]
  }, "ident", []], ["terminal", {
    "sourceInterval": [446, 449]
  }, ","]]], ["terminal", {
    "sourceInterval": [451, 454]
  }, ">"]]],
  "Params": ["define", {
    "sourceInterval": [458, 495]
  }, null, [], ["seq", {
    "sourceInterval": [471, 495]
  }, ["terminal", {
    "sourceInterval": [471, 474]
  }, "<"], ["app", {
    "sourceInterval": [475, 491]
  }, "ListOf", [["app", {
    "sourceInterval": [482, 485]
  }, "Seq", []], ["terminal", {
    "sourceInterval": [487, 490]
  }, ","]]], ["terminal", {
    "sourceInterval": [492, 495]
  }, ">"]]],
  "Alt": ["define", {
    "sourceInterval": [499, 533]
  }, null, [], ["app", {
    "sourceInterval": [509, 533]
  }, "NonemptyListOf", [["app", {
    "sourceInterval": [524, 527]
  }, "Seq", []], ["terminal", {
    "sourceInterval": [529, 532]
  }, "|"]]]],
  "Seq": ["define", {
    "sourceInterval": [537, 552]
  }, null, [], ["star", {
    "sourceInterval": [547, 552]
  }, ["app", {
    "sourceInterval": [547, 551]
  }, "Iter", []]]],
  "Iter_star": ["define", {
    "sourceInterval": [567, 584]
  }, null, [], ["seq", {
    "sourceInterval": [567, 575]
  }, ["app", {
    "sourceInterval": [567, 571]
  }, "Pred", []], ["terminal", {
    "sourceInterval": [572, 575]
  }, "*"]]],
  "Iter_plus": ["define", {
    "sourceInterval": [591, 608]
  }, null, [], ["seq", {
    "sourceInterval": [591, 599]
  }, ["app", {
    "sourceInterval": [591, 595]
  }, "Pred", []], ["terminal", {
    "sourceInterval": [596, 599]
  }, "+"]]],
  "Iter_opt": ["define", {
    "sourceInterval": [615, 631]
  }, null, [], ["seq", {
    "sourceInterval": [615, 623]
  }, ["app", {
    "sourceInterval": [615, 619]
  }, "Pred", []], ["terminal", {
    "sourceInterval": [620, 623]
  }, "?"]]],
  "Iter": ["define", {
    "sourceInterval": [556, 642]
  }, null, [], ["alt", {
    "sourceInterval": [567, 642]
  }, ["app", {
    "sourceInterval": [567, 575]
  }, "Iter_star", []], ["app", {
    "sourceInterval": [591, 599]
  }, "Iter_plus", []], ["app", {
    "sourceInterval": [615, 623]
  }, "Iter_opt", []], ["app", {
    "sourceInterval": [638, 642]
  }, "Pred", []]]],
  "Pred_not": ["define", {
    "sourceInterval": [657, 672]
  }, null, [], ["seq", {
    "sourceInterval": [657, 664]
  }, ["terminal", {
    "sourceInterval": [657, 660]
  }, "~"], ["app", {
    "sourceInterval": [661, 664]
  }, "Lex", []]]],
  "Pred_lookahead": ["define", {
    "sourceInterval": [679, 700]
  }, null, [], ["seq", {
    "sourceInterval": [679, 686]
  }, ["terminal", {
    "sourceInterval": [679, 682]
  }, "&"], ["app", {
    "sourceInterval": [683, 686]
  }, "Lex", []]]],
  "Pred": ["define", {
    "sourceInterval": [646, 710]
  }, null, [], ["alt", {
    "sourceInterval": [657, 710]
  }, ["app", {
    "sourceInterval": [657, 664]
  }, "Pred_not", []], ["app", {
    "sourceInterval": [679, 686]
  }, "Pred_lookahead", []], ["app", {
    "sourceInterval": [707, 710]
  }, "Lex", []]]],
  "Lex_lex": ["define", {
    "sourceInterval": [724, 740]
  }, null, [], ["seq", {
    "sourceInterval": [724, 732]
  }, ["terminal", {
    "sourceInterval": [724, 727]
  }, "#"], ["app", {
    "sourceInterval": [728, 732]
  }, "Base", []]]],
  "Lex": ["define", {
    "sourceInterval": [714, 751]
  }, null, [], ["alt", {
    "sourceInterval": [724, 751]
  }, ["app", {
    "sourceInterval": [724, 732]
  }, "Lex_lex", []], ["app", {
    "sourceInterval": [747, 751]
  }, "Base", []]]],
  "Base_application": ["define", {
    "sourceInterval": [766, 827]
  }, null, [], ["seq", {
    "sourceInterval": [766, 811]
  }, ["app", {
    "sourceInterval": [766, 771]
  }, "ident", []], ["opt", {
    "sourceInterval": [772, 779]
  }, ["app", {
    "sourceInterval": [772, 778]
  }, "Params", []]], ["not", {
    "sourceInterval": [780, 811]
  }, ["alt", {
    "sourceInterval": [782, 810]
  }, ["seq", {
    "sourceInterval": [782, 796]
  }, ["opt", {
    "sourceInterval": [782, 792]
  }, ["app", {
    "sourceInterval": [782, 791]
  }, "ruleDescr", []]], ["terminal", {
    "sourceInterval": [793, 796]
  }, "="]], ["terminal", {
    "sourceInterval": [799, 803]
  }, ":="], ["terminal", {
    "sourceInterval": [806, 810]
  }, "+="]]]]],
  "Base_range": ["define", {
    "sourceInterval": [834, 889]
  }, null, [], ["seq", {
    "sourceInterval": [834, 870]
  }, ["app", {
    "sourceInterval": [834, 849]
  }, "oneCharTerminal", []], ["terminal", {
    "sourceInterval": [850, 854]
  }, ".."], ["app", {
    "sourceInterval": [855, 870]
  }, "oneCharTerminal", []]]],
  "Base_terminal": ["define", {
    "sourceInterval": [896, 954]
  }, null, [], ["app", {
    "sourceInterval": [896, 904]
  }, "terminal", []]],
  "Base_paren": ["define", {
    "sourceInterval": [961, 1016]
  }, null, [], ["seq", {
    "sourceInterval": [961, 972]
  }, ["terminal", {
    "sourceInterval": [961, 964]
  }, "("], ["app", {
    "sourceInterval": [965, 968]
  }, "Alt", []], ["terminal", {
    "sourceInterval": [969, 972]
  }, ")"]]],
  "Base": ["define", {
    "sourceInterval": [755, 1016]
  }, null, [], ["alt", {
    "sourceInterval": [766, 1016]
  }, ["app", {
    "sourceInterval": [766, 811]
  }, "Base_application", []], ["app", {
    "sourceInterval": [834, 870]
  }, "Base_range", []], ["app", {
    "sourceInterval": [896, 904]
  }, "Base_terminal", []], ["app", {
    "sourceInterval": [961, 972]
  }, "Base_paren", []]]],
  "ruleDescr": ["define", {
    "sourceInterval": [1020, 1079]
  }, "a rule description", [], ["seq", {
    "sourceInterval": [1058, 1079]
  }, ["terminal", {
    "sourceInterval": [1058, 1061]
  }, "("], ["app", {
    "sourceInterval": [1062, 1075]
  }, "ruleDescrText", []], ["terminal", {
    "sourceInterval": [1076, 1079]
  }, ")"]]],
  "ruleDescrText": ["define", {
    "sourceInterval": [1083, 1114]
  }, null, [], ["star", {
    "sourceInterval": [1103, 1114]
  }, ["seq", {
    "sourceInterval": [1104, 1112]
  }, ["not", {
    "sourceInterval": [1104, 1108]
  }, ["terminal", {
    "sourceInterval": [1105, 1108]
  }, ")"]], ["app", {
    "sourceInterval": [1109, 1112]
  }, "any", []]]]],
  "caseName": ["define", {
    "sourceInterval": [1118, 1186]
  }, null, [], ["seq", {
    "sourceInterval": [1133, 1186]
  }, ["terminal", {
    "sourceInterval": [1133, 1137]
  }, "--"], ["star", {
    "sourceInterval": [1138, 1152]
  }, ["seq", {
    "sourceInterval": [1139, 1150]
  }, ["not", {
    "sourceInterval": [1139, 1144]
  }, ["terminal", {
    "sourceInterval": [1140, 1144]
  }, "\n"]], ["app", {
    "sourceInterval": [1145, 1150]
  }, "space", []]]], ["app", {
    "sourceInterval": [1153, 1157]
  }, "name", []], ["star", {
    "sourceInterval": [1158, 1172]
  }, ["seq", {
    "sourceInterval": [1159, 1170]
  }, ["not", {
    "sourceInterval": [1159, 1164]
  }, ["terminal", {
    "sourceInterval": [1160, 1164]
  }, "\n"]], ["app", {
    "sourceInterval": [1165, 1170]
  }, "space", []]]], ["alt", {
    "sourceInterval": [1174, 1185]
  }, ["terminal", {
    "sourceInterval": [1174, 1178]
  }, "\n"], ["lookahead", {
    "sourceInterval": [1181, 1185]
  }, ["terminal", {
    "sourceInterval": [1182, 1185]
  }, "}"]]]]],
  "name": ["define", {
    "sourceInterval": [1190, 1230]
  }, "a name", [], ["seq", {
    "sourceInterval": [1211, 1230]
  }, ["app", {
    "sourceInterval": [1211, 1220]
  }, "nameFirst", []], ["star", {
    "sourceInterval": [1221, 1230]
  }, ["app", {
    "sourceInterval": [1221, 1229]
  }, "nameRest", []]]]],
  "nameFirst": ["define", {
    "sourceInterval": [1234, 1266]
  }, null, [], ["alt", {
    "sourceInterval": [1250, 1266]
  }, ["terminal", {
    "sourceInterval": [1250, 1253]
  }, "_"], ["app", {
    "sourceInterval": [1260, 1266]
  }, "letter", []]]],
  "nameRest": ["define", {
    "sourceInterval": [1270, 1300]
  }, null, [], ["alt", {
    "sourceInterval": [1285, 1300]
  }, ["terminal", {
    "sourceInterval": [1285, 1288]
  }, "_"], ["app", {
    "sourceInterval": [1295, 1300]
  }, "alnum", []]]],
  "ident": ["define", {
    "sourceInterval": [1304, 1337]
  }, "an identifier", [], ["app", {
    "sourceInterval": [1333, 1337]
  }, "name", []]],
  "terminal": ["define", {
    "sourceInterval": [1341, 1379]
  }, null, [], ["seq", {
    "sourceInterval": [1356, 1379]
  }, ["terminal", {
    "sourceInterval": [1356, 1360]
  }, "\""], ["star", {
    "sourceInterval": [1361, 1374]
  }, ["app", {
    "sourceInterval": [1361, 1373]
  }, "terminalChar", []]], ["terminal", {
    "sourceInterval": [1375, 1379]
  }, "\""]]],
  "oneCharTerminal": ["define", {
    "sourceInterval": [1383, 1427]
  }, null, [], ["seq", {
    "sourceInterval": [1405, 1427]
  }, ["terminal", {
    "sourceInterval": [1405, 1409]
  }, "\""], ["app", {
    "sourceInterval": [1410, 1422]
  }, "terminalChar", []], ["terminal", {
    "sourceInterval": [1423, 1427]
  }, "\""]]],
  "terminalChar": ["define", {
    "sourceInterval": [1431, 1488]
  }, null, [], ["alt", {
    "sourceInterval": [1450, 1488]
  }, ["app", {
    "sourceInterval": [1450, 1460]
  }, "escapeChar", []], ["seq", {
    "sourceInterval": [1467, 1488]
  }, ["not", {
    "sourceInterval": [1467, 1472]
  }, ["terminal", {
    "sourceInterval": [1468, 1472]
  }, "\\"]], ["not", {
    "sourceInterval": [1473, 1478]
  }, ["terminal", {
    "sourceInterval": [1474, 1478]
  }, "\""]], ["not", {
    "sourceInterval": [1479, 1484]
  }, ["terminal", {
    "sourceInterval": [1480, 1484]
  }, "\n"]], ["app", {
    "sourceInterval": [1485, 1488]
  }, "any", []]]]],
  "escapeChar_backslash": ["define", {
    "sourceInterval": [1531, 1586]
  }, null, [], ["terminal", {
    "sourceInterval": [1531, 1537]
  }, "\\\\"]],
  "escapeChar_doubleQuote": ["define", {
    "sourceInterval": [1593, 1650]
  }, null, [], ["terminal", {
    "sourceInterval": [1593, 1599]
  }, "\\\""]],
  "escapeChar_singleQuote": ["define", {
    "sourceInterval": [1657, 1714]
  }, null, [], ["terminal", {
    "sourceInterval": [1657, 1663]
  }, "\\'"]],
  "escapeChar_backspace": ["define", {
    "sourceInterval": [1721, 1776]
  }, null, [], ["terminal", {
    "sourceInterval": [1721, 1726]
  }, "\\b"]],
  "escapeChar_lineFeed": ["define", {
    "sourceInterval": [1783, 1837]
  }, null, [], ["terminal", {
    "sourceInterval": [1783, 1788]
  }, "\\n"]],
  "escapeChar_carriageReturn": ["define", {
    "sourceInterval": [1844, 1904]
  }, null, [], ["terminal", {
    "sourceInterval": [1844, 1849]
  }, "\\r"]],
  "escapeChar_tab": ["define", {
    "sourceInterval": [1911, 1960]
  }, null, [], ["terminal", {
    "sourceInterval": [1911, 1916]
  }, "\\t"]],
  "escapeChar_unicodeEscape": ["define", {
    "sourceInterval": [1967, 2026]
  }, null, [], ["seq", {
    "sourceInterval": [1967, 2008]
  }, ["terminal", {
    "sourceInterval": [1967, 1972]
  }, "\\u"], ["app", {
    "sourceInterval": [1973, 1981]
  }, "hexDigit", []], ["app", {
    "sourceInterval": [1982, 1990]
  }, "hexDigit", []], ["app", {
    "sourceInterval": [1991, 1999]
  }, "hexDigit", []], ["app", {
    "sourceInterval": [2000, 2008]
  }, "hexDigit", []]]],
  "escapeChar_hexEscape": ["define", {
    "sourceInterval": [2033, 2088]
  }, null, [], ["seq", {
    "sourceInterval": [2033, 2056]
  }, ["terminal", {
    "sourceInterval": [2033, 2038]
  }, "\\x"], ["app", {
    "sourceInterval": [2039, 2047]
  }, "hexDigit", []], ["app", {
    "sourceInterval": [2048, 2056]
  }, "hexDigit", []]]],
  "escapeChar": ["define", {
    "sourceInterval": [1492, 2088]
  }, "an escape sequence", [], ["alt", {
    "sourceInterval": [1531, 2088]
  }, ["app", {
    "sourceInterval": [1531, 1537]
  }, "escapeChar_backslash", []], ["app", {
    "sourceInterval": [1593, 1599]
  }, "escapeChar_doubleQuote", []], ["app", {
    "sourceInterval": [1657, 1663]
  }, "escapeChar_singleQuote", []], ["app", {
    "sourceInterval": [1721, 1726]
  }, "escapeChar_backspace", []], ["app", {
    "sourceInterval": [1783, 1788]
  }, "escapeChar_lineFeed", []], ["app", {
    "sourceInterval": [1844, 1849]
  }, "escapeChar_carriageReturn", []], ["app", {
    "sourceInterval": [1911, 1916]
  }, "escapeChar_tab", []], ["app", {
    "sourceInterval": [1967, 2008]
  }, "escapeChar_unicodeEscape", []], ["app", {
    "sourceInterval": [2033, 2056]
  }, "escapeChar_hexEscape", []]]],
  "space": ["extend", {
    "sourceInterval": [2092, 2111]
  }, null, [], ["app", {
    "sourceInterval": [2104, 2111]
  }, "comment", []]],
  "comment_singleLine": ["define", {
    "sourceInterval": [2129, 2166]
  }, null, [], ["seq", {
    "sourceInterval": [2129, 2151]
  }, ["terminal", {
    "sourceInterval": [2129, 2133]
  }, "//"], ["star", {
    "sourceInterval": [2134, 2146]
  }, ["seq", {
    "sourceInterval": [2135, 2144]
  }, ["not", {
    "sourceInterval": [2135, 2140]
  }, ["terminal", {
    "sourceInterval": [2136, 2140]
  }, "\n"]], ["app", {
    "sourceInterval": [2141, 2144]
  }, "any", []]]], ["terminal", {
    "sourceInterval": [2147, 2151]
  }, "\n"]]],
  "comment_multiLine": ["define", {
    "sourceInterval": [2173, 2209]
  }, null, [], ["seq", {
    "sourceInterval": [2173, 2195]
  }, ["terminal", {
    "sourceInterval": [2173, 2177]
  }, "/*"], ["star", {
    "sourceInterval": [2178, 2190]
  }, ["seq", {
    "sourceInterval": [2179, 2188]
  }, ["not", {
    "sourceInterval": [2179, 2184]
  }, ["terminal", {
    "sourceInterval": [2180, 2184]
  }, "*/"]], ["app", {
    "sourceInterval": [2185, 2188]
  }, "any", []]]], ["terminal", {
    "sourceInterval": [2191, 2195]
  }, "*/"]]],
  "comment": ["define", {
    "sourceInterval": [2115, 2209]
  }, null, [], ["alt", {
    "sourceInterval": [2129, 2209]
  }, ["app", {
    "sourceInterval": [2129, 2151]
  }, "comment_singleLine", []], ["app", {
    "sourceInterval": [2173, 2195]
  }, "comment_multiLine", []]]],
  "tokens": ["define", {
    "sourceInterval": [2213, 2228]
  }, null, [], ["star", {
    "sourceInterval": [2222, 2228]
  }, ["app", {
    "sourceInterval": [2222, 2227]
  }, "token", []]]],
  "token": ["define", {
    "sourceInterval": [2232, 2308]
  }, null, [], ["alt", {
    "sourceInterval": [2240, 2308]
  }, ["app", {
    "sourceInterval": [2240, 2248]
  }, "caseName", []], ["app", {
    "sourceInterval": [2251, 2258]
  }, "comment", []], ["app", {
    "sourceInterval": [2261, 2266]
  }, "ident", []], ["app", {
    "sourceInterval": [2269, 2277]
  }, "operator", []], ["app", {
    "sourceInterval": [2280, 2291]
  }, "punctuation", []], ["app", {
    "sourceInterval": [2294, 2302]
  }, "terminal", []], ["app", {
    "sourceInterval": [2305, 2308]
  }, "any", []]]],
  "operator": ["define", {
    "sourceInterval": [2312, 2377]
  }, null, [], ["alt", {
    "sourceInterval": [2323, 2377]
  }, ["terminal", {
    "sourceInterval": [2323, 2327]
  }, "<:"], ["terminal", {
    "sourceInterval": [2330, 2333]
  }, "="], ["terminal", {
    "sourceInterval": [2336, 2340]
  }, ":="], ["terminal", {
    "sourceInterval": [2343, 2347]
  }, "+="], ["terminal", {
    "sourceInterval": [2350, 2353]
  }, "*"], ["terminal", {
    "sourceInterval": [2356, 2359]
  }, "+"], ["terminal", {
    "sourceInterval": [2362, 2365]
  }, "?"], ["terminal", {
    "sourceInterval": [2368, 2371]
  }, "~"], ["terminal", {
    "sourceInterval": [2374, 2377]
  }, "&"]]],
  "punctuation": ["define", {
    "sourceInterval": [2381, 2417]
  }, null, [], ["alt", {
    "sourceInterval": [2395, 2417]
  }, ["terminal", {
    "sourceInterval": [2395, 2398]
  }, "<"], ["terminal", {
    "sourceInterval": [2401, 2404]
  }, ">"], ["terminal", {
    "sourceInterval": [2407, 2410]
  }, ","], ["terminal", {
    "sourceInterval": [2413, 2417]
  }, "--"]]]
}]);
},{"..":"K+zu"}],"K+zu":[function(require,module,exports) {
/* global document, XMLHttpRequest */
'use strict'; // --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Builder = require('./Builder');

var Grammar = require('./Grammar');

var Namespace = require('./Namespace');

var common = require('./common');

var errors = require('./errors');

var pexprs = require('./pexprs');

var util = require('./util');

var version = require('./version');

var isBuffer = require('is-buffer'); // --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
// The metagrammar, i.e. the grammar for Ohm grammars. Initialized at the
// bottom of this file because loading the grammar requires Ohm itself.


var ohmGrammar; // An object which makes it possible to stub out the document API for testing.

var documentInterface = {
  querySelector: function (sel) {
    return document.querySelector(sel);
  },
  querySelectorAll: function (sel) {
    return document.querySelectorAll(sel);
  }
}; // Check if `obj` is a DOM element.

function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}

function isUndefined(obj) {
  return obj === void 0; // eslint-disable-line no-void
}

var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

function isArrayLike(obj) {
  if (obj == null) {
    return false;
  }

  var length = obj.length;
  return typeof length === 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
} // TODO: just use the jQuery thing


function load(url) {
  var req = new XMLHttpRequest();
  req.open('GET', url, false);

  try {
    req.send();

    if (req.status === 0 || req.status === 200) {
      return req.responseText;
    }
  } catch (e) {}

  throw new Error('unable to load url ' + url);
} // Returns a Grammar instance (i.e., an object with a `match` method) for
// `tree`, which is the concrete syntax tree of a user-written grammar.
// The grammar will be assigned into `namespace` under the name of the grammar
// as specified in the source.


function buildGrammar(match, namespace, optOhmGrammarForTesting) {
  var builder = new Builder();
  var decl;
  var currentRuleName;
  var currentRuleFormals;
  var overriding = false;
  var metaGrammar = optOhmGrammarForTesting || ohmGrammar; // A visitor that produces a Grammar instance from the CST.

  var helpers = metaGrammar.createSemantics().addOperation('visit', {
    Grammar: function (n, s, open, rs, close) {
      var grammarName = n.visit();
      decl = builder.newGrammar(grammarName, namespace);
      s.visit();
      rs.visit();
      var g = decl.build();
      g.source = this.source.trimmed();

      if (grammarName in namespace) {
        throw errors.duplicateGrammarDeclaration(g, namespace);
      }

      namespace[grammarName] = g;
      return g;
    },
    SuperGrammar: function (_, n) {
      var superGrammarName = n.visit();

      if (superGrammarName === 'null') {
        decl.withSuperGrammar(null);
      } else {
        if (!namespace || !(superGrammarName in namespace)) {
          throw errors.undeclaredGrammar(superGrammarName, namespace, n.source);
        }

        decl.withSuperGrammar(namespace[superGrammarName]);
      }
    },
    Rule_define: function (n, fs, d, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit()[0] || []; // If there is no default start rule yet, set it now. This must be done before visiting
      // the body, because it might contain an inline rule definition.

      if (!decl.defaultStartRule && decl.ensureSuperGrammar() !== Grammar.ProtoBuiltInRules) {
        decl.withDefaultStartRule(currentRuleName);
      }

      var body = b.visit();
      var description = d.visit()[0];
      var source = this.source.trimmed();
      return decl.define(currentRuleName, currentRuleFormals, body, description, source);
    },
    Rule_override: function (n, fs, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit()[0] || [];
      overriding = true;
      var body = b.visit();
      var source = this.source.trimmed();
      var ans = decl.override(currentRuleName, currentRuleFormals, body, null, source);
      overriding = false;
      return ans;
    },
    Rule_extend: function (n, fs, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit()[0] || [];
      var body = b.visit();
      var source = this.source.trimmed();
      var ans = decl.extend(currentRuleName, currentRuleFormals, body, null, source);
      return ans;
    },
    RuleBody: function (_, terms) {
      var args = terms.visit();
      return builder.alt.apply(builder, args).withSource(this.source);
    },
    Formals: function (opointy, fs, cpointy) {
      return fs.visit();
    },
    Params: function (opointy, ps, cpointy) {
      return ps.visit();
    },
    Alt: function (seqs) {
      var args = seqs.visit();
      return builder.alt.apply(builder, args).withSource(this.source);
    },
    TopLevelTerm_inline: function (b, n) {
      var inlineRuleName = currentRuleName + '_' + n.visit();
      var body = b.visit();
      var source = this.source.trimmed();
      var isNewRuleDeclaration = !(decl.superGrammar && decl.superGrammar.rules[inlineRuleName]);

      if (overriding && !isNewRuleDeclaration) {
        decl.override(inlineRuleName, currentRuleFormals, body, null, source);
      } else {
        decl.define(inlineRuleName, currentRuleFormals, body, null, source);
      }

      var params = currentRuleFormals.map(function (formal) {
        return builder.app(formal);
      });
      return builder.app(inlineRuleName, params).withSource(body.source);
    },
    Seq: function (expr) {
      return builder.seq.apply(builder, expr.visit()).withSource(this.source);
    },
    Iter_star: function (x, _) {
      return builder.star(x.visit()).withSource(this.source);
    },
    Iter_plus: function (x, _) {
      return builder.plus(x.visit()).withSource(this.source);
    },
    Iter_opt: function (x, _) {
      return builder.opt(x.visit()).withSource(this.source);
    },
    Pred_not: function (_, x) {
      return builder.not(x.visit()).withSource(this.source);
    },
    Pred_lookahead: function (_, x) {
      return builder.lookahead(x.visit()).withSource(this.source);
    },
    Lex_lex: function (_, x) {
      return builder.lex(x.visit()).withSource(this.source);
    },
    Base_application: function (rule, ps) {
      return builder.app(rule.visit(), ps.visit()[0] || []).withSource(this.source);
    },
    Base_range: function (from, _, to) {
      return builder.range(from.visit(), to.visit()).withSource(this.source);
    },
    Base_terminal: function (expr) {
      return builder.terminal(expr.visit()).withSource(this.source);
    },
    Base_paren: function (open, x, close) {
      return x.visit();
    },
    ruleDescr: function (open, t, close) {
      return t.visit();
    },
    ruleDescrText: function (_) {
      return this.sourceString.trim();
    },
    caseName: function (_, space1, n, space2, end) {
      return n.visit();
    },
    name: function (first, rest) {
      return this.sourceString;
    },
    nameFirst: function (expr) {},
    nameRest: function (expr) {},
    terminal: function (open, cs, close) {
      return cs.visit().join('');
    },
    oneCharTerminal: function (open, c, close) {
      return c.visit();
    },
    terminalChar: function (_) {
      return common.unescapeChar(this.sourceString);
    },
    escapeChar: function (_) {
      return this.sourceString;
    },
    NonemptyListOf: function (x, _, xs) {
      return [x.visit()].concat(xs.visit());
    },
    EmptyListOf: function () {
      return [];
    },
    _terminal: function () {
      return this.primitiveValue;
    }
  });
  return helpers(match).visit();
}

function compileAndLoad(source, namespace) {
  var m = ohmGrammar.match(source, 'Grammars');

  if (m.failed()) {
    throw errors.grammarSyntaxError(m);
  }

  return buildGrammar(m, namespace);
} // Return the contents of a script element, fetching it via XHR if necessary.


function getScriptElementContents(el) {
  if (!isElement(el)) {
    throw new TypeError('Expected a DOM Node, got ' + common.unexpectedObjToString(el));
  }

  if (el.type !== 'text/ohm-js') {
    throw new Error('Expected a script tag with type="text/ohm-js", got ' + el);
  }

  return el.getAttribute('src') ? load(el.getAttribute('src')) : el.innerHTML;
}

function grammar(source, optNamespace) {
  var ns = grammars(source, optNamespace); // Ensure that the source contained no more than one grammar definition.

  var grammarNames = Object.keys(ns);

  if (grammarNames.length === 0) {
    throw new Error('Missing grammar definition');
  } else if (grammarNames.length > 1) {
    var secondGrammar = ns[grammarNames[1]];
    var interval = secondGrammar.source;
    throw new Error(util.getLineAndColumnMessage(interval.sourceString, interval.startIdx) + 'Found more than one grammar definition -- use ohm.grammars() instead.');
  }

  return ns[grammarNames[0]]; // Return the one and only grammar.
}

function grammars(source, optNamespace) {
  var ns = Namespace.extend(Namespace.asNamespace(optNamespace));

  if (typeof source !== 'string') {
    // For convenience, detect Node.js Buffer objects and automatically call toString().
    if (isBuffer(source)) {
      source = source.toString();
    } else {
      throw new TypeError('Expected string as first argument, got ' + common.unexpectedObjToString(source));
    }
  }

  compileAndLoad(source, ns);
  return ns;
}

function grammarFromScriptElement(optNode) {
  var node = optNode;

  if (isUndefined(node)) {
    var nodeList = documentInterface.querySelectorAll('script[type="text/ohm-js"]');

    if (nodeList.length !== 1) {
      throw new Error('Expected exactly one script tag with type="text/ohm-js", found ' + nodeList.length);
    }

    node = nodeList[0];
  }

  return grammar(getScriptElementContents(node));
}

function grammarsFromScriptElements(optNodeOrNodeList) {
  // Simple case: the argument is a DOM node.
  if (isElement(optNodeOrNodeList)) {
    return grammars(optNodeOrNodeList);
  } // Otherwise, it must be either undefined or a NodeList.


  var nodeList = optNodeOrNodeList;

  if (isUndefined(nodeList)) {
    // Find all script elements with type="text/ohm-js".
    nodeList = documentInterface.querySelectorAll('script[type="text/ohm-js"]');
  } else if (typeof nodeList === 'string' || !isElement(nodeList) && !isArrayLike(nodeList)) {
    throw new TypeError('Expected a Node, NodeList, or Array, but got ' + nodeList);
  }

  var ns = Namespace.createNamespace();

  for (var i = 0; i < nodeList.length; ++i) {
    // Copy the new grammars into `ns` to keep the namespace flat.
    common.extend(ns, grammars(getScriptElementContents(nodeList[i]), ns));
  }

  return ns;
}

function makeRecipe(recipe) {
  if (typeof recipe === 'function') {
    return recipe.call(new Builder());
  } else {
    if (typeof recipe === 'string') {
      // stringified JSON recipe
      recipe = JSON.parse(recipe);
    }

    return new Builder().fromRecipe(recipe);
  }
} // --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
// Stuff that users should know about


module.exports = {
  createNamespace: Namespace.createNamespace,
  grammar: grammar,
  grammars: grammars,
  grammarFromScriptElement: grammarFromScriptElement,
  grammarsFromScriptElements: grammarsFromScriptElements,
  makeRecipe: makeRecipe,
  ohmGrammar: null,
  // Initialized below, after Grammar.BuiltInRules.
  pexprs: pexprs,
  util: util,
  extras: require('../extras'),
  version: version
}; // Stuff for testing, etc.

module.exports._buildGrammar = buildGrammar;

module.exports._setDocumentInterfaceForTesting = function (doc) {
  documentInterface = doc;
}; // Late initialization for stuff that is bootstrapped.


Grammar.BuiltInRules = require('../dist/built-in-rules');
util.announceBuiltInRules(Grammar.BuiltInRules);
module.exports.ohmGrammar = ohmGrammar = require('../dist/ohm-grammar');
Grammar.initApplicationParser(ohmGrammar, buildGrammar);
},{"./Builder":"t92O","./Grammar":"52Ng","./Namespace":"JhPb","./common":"g606","./errors":"+7+5","./pexprs":"RYLI","./util":"NOPz","./version":"ap7j","is-buffer":"q/Zl","../extras":"hnar","../dist/built-in-rules":"5ozn","../dist/ohm-grammar":"leqA"}],"2lmm":[function(require,module,exports) {
var ohm = require('ohm-js');

module.exports = ohm.makeRecipe(["grammar", {
  "source": "ESQueryGrammar {\n    ESQuery = query\n\n    reservedWord = \"AND\" | \"OR\" | \"NOT\" | \"TO\"\n    boolOperator = \"AND\" | \"OR\"\n    orSpace = space+\n    orLine = \"|\"\n\n    // STRING LITERALS\n    sourceCharacter = any\n    nonEscapeCharacter = ~(singleEscapeCharacter) sourceCharacter\n    characterEscapeSequence = singleEscapeCharacter\n                            | nonEscapeCharacter\n    singleEscapeCharacter = \"\\\"\" | \"\\\\\"\n    doubleStringCharacter = ~(\"\\\"\" | \"\\\\\") sourceCharacter -- nonEscaped\n                          | \"\\\\\" characterEscapeSequence -- Escaped\n    singleESEscapeCharacter = \" \" | \"+\" | \"-\" | \"=\" | \"!\" | \"(\" | \")\" | \"{\" | \"}\"\n                            | \"[\" | \"]\" | \"^\" | \"\\\"\" | \"~\" | \"*\" | \"?\" | \":\" | \"\\\\\" | \"/\"\n    escapedESStringCharacter = \"\\\\\" singleESEscapeCharacter\n\twildcardCharacter = \"*\" | \"?\"\n    regexCharacter = \"*\" | \"?\" | \"[\" | \"]\" | \"(\" | \")\"\n\n    unquotedString = ~reservedWord (escapedESStringCharacter | wildcardCharacter | alnum | \"_\" | \".\" | \"-\" | \"’\")+\n    quotedString = \"\\\"\" doubleStringCharacter* \"\\\"\"\n\n    detachedCond = quotedString | unquotedString\n\n    // UTILS\n    spaced<x> = space+ x space+\n    parented<x> = \"(\" space* x space* \")\"\n\n    spacedBool = spaced<boolOperator>\n    genericBoolOp = spacedBool | orSpace | orLine\n\n    // FIELD QUERY\n    fieldName = ~reservedWord (alnum | \".\" | \"_\")+ &\":\"\n    fieldCond = fieldName \":\" subquery\n\n    // RANGE QUERY\n    rangeValue = ~space ((alnum | \"/\" | \"-\" | \":\" | \"+\")+ | \"*\")\n    rangeCond = \"[\" space* rangeValue spaced<\"TO\"> rangeValue space* \"]\"\n\n    // REGEX QUERY\n    regexCond = \"/\" (alnum | regexCharacter)+ \"/\"\n\n    // CONDITIONS\n    genericCond = fieldCond | rangeCond | regexCond | detachedCond\n    cond = parented<genericCond> | genericCond\n\n    simpleNegation = \"-\" subquery\n    simpleMust = \"+\" subquery\n    longNegation = \"NOT\" space+ subquery\n    markedCond = longNegation | simpleNegation | simpleMust\n\n    queryElement = markedCond | cond\n\tsubquery = parented<query> | queryElement\n    query = nonemptyListOf<subquery, genericBoolOp> | parented<query>\n}"
}, "ESQueryGrammar", null, "ESQuery", {
  "ESQuery": ["define", {
    "sourceInterval": [21, 36]
  }, null, [], ["app", {
    "sourceInterval": [31, 36]
  }, "query", []]],
  "reservedWord": ["define", {
    "sourceInterval": [42, 84]
  }, null, [], ["alt", {
    "sourceInterval": [57, 84]
  }, ["terminal", {
    "sourceInterval": [57, 62]
  }, "AND"], ["terminal", {
    "sourceInterval": [65, 69]
  }, "OR"], ["terminal", {
    "sourceInterval": [72, 77]
  }, "NOT"], ["terminal", {
    "sourceInterval": [80, 84]
  }, "TO"]]],
  "boolOperator": ["define", {
    "sourceInterval": [89, 116]
  }, null, [], ["alt", {
    "sourceInterval": [104, 116]
  }, ["terminal", {
    "sourceInterval": [104, 109]
  }, "AND"], ["terminal", {
    "sourceInterval": [112, 116]
  }, "OR"]]],
  "orSpace": ["define", {
    "sourceInterval": [121, 137]
  }, null, [], ["plus", {
    "sourceInterval": [131, 137]
  }, ["app", {
    "sourceInterval": [131, 136]
  }, "space", []]]],
  "orLine": ["define", {
    "sourceInterval": [142, 154]
  }, null, [], ["terminal", {
    "sourceInterval": [151, 154]
  }, "|"]],
  "sourceCharacter": ["define", {
    "sourceInterval": [183, 204]
  }, null, [], ["app", {
    "sourceInterval": [201, 204]
  }, "any", []]],
  "nonEscapeCharacter": ["define", {
    "sourceInterval": [209, 270]
  }, null, [], ["seq", {
    "sourceInterval": [230, 270]
  }, ["not", {
    "sourceInterval": [230, 254]
  }, ["app", {
    "sourceInterval": [232, 253]
  }, "singleEscapeCharacter", []]], ["app", {
    "sourceInterval": [255, 270]
  }, "sourceCharacter", []]]],
  "characterEscapeSequence": ["define", {
    "sourceInterval": [275, 371]
  }, null, [], ["alt", {
    "sourceInterval": [301, 371]
  }, ["app", {
    "sourceInterval": [301, 322]
  }, "singleEscapeCharacter", []], ["app", {
    "sourceInterval": [353, 371]
  }, "nonEscapeCharacter", []]]],
  "singleEscapeCharacter": ["define", {
    "sourceInterval": [376, 411]
  }, null, [], ["alt", {
    "sourceInterval": [400, 411]
  }, ["terminal", {
    "sourceInterval": [400, 404]
  }, "\""], ["terminal", {
    "sourceInterval": [407, 411]
  }, "\\"]]],
  "doubleStringCharacter_nonEscaped": ["define", {
    "sourceInterval": [440, 484]
  }, null, [], ["seq", {
    "sourceInterval": [440, 470]
  }, ["not", {
    "sourceInterval": [440, 454]
  }, ["alt", {
    "sourceInterval": [442, 453]
  }, ["terminal", {
    "sourceInterval": [442, 446]
  }, "\""], ["terminal", {
    "sourceInterval": [449, 453]
  }, "\\"]]], ["app", {
    "sourceInterval": [455, 470]
  }, "sourceCharacter", []]]],
  "doubleStringCharacter_Escaped": ["define", {
    "sourceInterval": [513, 552]
  }, null, [], ["seq", {
    "sourceInterval": [513, 541]
  }, ["terminal", {
    "sourceInterval": [513, 517]
  }, "\\"], ["app", {
    "sourceInterval": [518, 541]
  }, "characterEscapeSequence", []]]],
  "doubleStringCharacter": ["define", {
    "sourceInterval": [416, 552]
  }, null, [], ["alt", {
    "sourceInterval": [440, 552]
  }, ["app", {
    "sourceInterval": [440, 470]
  }, "doubleStringCharacter_nonEscaped", []], ["app", {
    "sourceInterval": [513, 541]
  }, "doubleStringCharacter_Escaped", []]]],
  "singleESEscapeCharacter": ["define", {
    "sourceInterval": [557, 724]
  }, null, [], ["alt", {
    "sourceInterval": [583, 724]
  }, ["terminal", {
    "sourceInterval": [583, 586]
  }, " "], ["terminal", {
    "sourceInterval": [589, 592]
  }, "+"], ["terminal", {
    "sourceInterval": [595, 598]
  }, "-"], ["terminal", {
    "sourceInterval": [601, 604]
  }, "="], ["terminal", {
    "sourceInterval": [607, 610]
  }, "!"], ["terminal", {
    "sourceInterval": [613, 616]
  }, "("], ["terminal", {
    "sourceInterval": [619, 622]
  }, ")"], ["terminal", {
    "sourceInterval": [625, 628]
  }, "{"], ["terminal", {
    "sourceInterval": [631, 634]
  }, "}"], ["terminal", {
    "sourceInterval": [665, 668]
  }, "["], ["terminal", {
    "sourceInterval": [671, 674]
  }, "]"], ["terminal", {
    "sourceInterval": [677, 680]
  }, "^"], ["terminal", {
    "sourceInterval": [683, 687]
  }, "\""], ["terminal", {
    "sourceInterval": [690, 693]
  }, "~"], ["terminal", {
    "sourceInterval": [696, 699]
  }, "*"], ["terminal", {
    "sourceInterval": [702, 705]
  }, "?"], ["terminal", {
    "sourceInterval": [708, 711]
  }, ":"], ["terminal", {
    "sourceInterval": [714, 718]
  }, "\\"], ["terminal", {
    "sourceInterval": [721, 724]
  }, "/"]]],
  "escapedESStringCharacter": ["define", {
    "sourceInterval": [729, 784]
  }, null, [], ["seq", {
    "sourceInterval": [756, 784]
  }, ["terminal", {
    "sourceInterval": [756, 760]
  }, "\\"], ["app", {
    "sourceInterval": [761, 784]
  }, "singleESEscapeCharacter", []]]],
  "wildcardCharacter": ["define", {
    "sourceInterval": [786, 815]
  }, null, [], ["alt", {
    "sourceInterval": [806, 815]
  }, ["terminal", {
    "sourceInterval": [806, 809]
  }, "*"], ["terminal", {
    "sourceInterval": [812, 815]
  }, "?"]]],
  "regexCharacter": ["define", {
    "sourceInterval": [820, 870]
  }, null, [], ["alt", {
    "sourceInterval": [837, 870]
  }, ["terminal", {
    "sourceInterval": [837, 840]
  }, "*"], ["terminal", {
    "sourceInterval": [843, 846]
  }, "?"], ["terminal", {
    "sourceInterval": [849, 852]
  }, "["], ["terminal", {
    "sourceInterval": [855, 858]
  }, "]"], ["terminal", {
    "sourceInterval": [861, 864]
  }, "("], ["terminal", {
    "sourceInterval": [867, 870]
  }, ")"]]],
  "unquotedString": ["define", {
    "sourceInterval": [876, 986]
  }, null, [], ["seq", {
    "sourceInterval": [893, 986]
  }, ["not", {
    "sourceInterval": [893, 906]
  }, ["app", {
    "sourceInterval": [894, 906]
  }, "reservedWord", []]], ["plus", {
    "sourceInterval": [907, 986]
  }, ["alt", {
    "sourceInterval": [908, 984]
  }, ["app", {
    "sourceInterval": [908, 932]
  }, "escapedESStringCharacter", []], ["app", {
    "sourceInterval": [935, 952]
  }, "wildcardCharacter", []], ["app", {
    "sourceInterval": [955, 960]
  }, "alnum", []], ["terminal", {
    "sourceInterval": [963, 966]
  }, "_"], ["terminal", {
    "sourceInterval": [969, 972]
  }, "."], ["terminal", {
    "sourceInterval": [975, 978]
  }, "-"], ["terminal", {
    "sourceInterval": [981, 984]
  }, "’"]]]]],
  "quotedString": ["define", {
    "sourceInterval": [991, 1038]
  }, null, [], ["seq", {
    "sourceInterval": [1006, 1038]
  }, ["terminal", {
    "sourceInterval": [1006, 1010]
  }, "\""], ["star", {
    "sourceInterval": [1011, 1033]
  }, ["app", {
    "sourceInterval": [1011, 1032]
  }, "doubleStringCharacter", []]], ["terminal", {
    "sourceInterval": [1034, 1038]
  }, "\""]]],
  "detachedCond": ["define", {
    "sourceInterval": [1044, 1088]
  }, null, [], ["alt", {
    "sourceInterval": [1059, 1088]
  }, ["app", {
    "sourceInterval": [1059, 1071]
  }, "quotedString", []], ["app", {
    "sourceInterval": [1074, 1088]
  }, "unquotedString", []]]],
  "spaced": ["define", {
    "sourceInterval": [1107, 1134]
  }, null, ["x"], ["seq", {
    "sourceInterval": [1119, 1134]
  }, ["plus", {
    "sourceInterval": [1119, 1125]
  }, ["app", {
    "sourceInterval": [1119, 1124]
  }, "space", []]], ["param", {}, 0], ["plus", {
    "sourceInterval": [1128, 1134]
  }, ["app", {
    "sourceInterval": [1128, 1133]
  }, "space", []]]]],
  "parented": ["define", {
    "sourceInterval": [1139, 1176]
  }, null, ["x"], ["seq", {
    "sourceInterval": [1153, 1176]
  }, ["terminal", {
    "sourceInterval": [1153, 1156]
  }, "("], ["star", {
    "sourceInterval": [1157, 1163]
  }, ["app", {
    "sourceInterval": [1157, 1162]
  }, "space", []]], ["param", {}, 0], ["star", {
    "sourceInterval": [1166, 1172]
  }, ["app", {
    "sourceInterval": [1166, 1171]
  }, "space", []]], ["terminal", {
    "sourceInterval": [1173, 1176]
  }, ")"]]],
  "spacedBool": ["define", {
    "sourceInterval": [1182, 1215]
  }, null, [], ["app", {
    "sourceInterval": [1195, 1215]
  }, "spaced", [["app", {
    "sourceInterval": [1202, 1214]
  }, "boolOperator", []]]]],
  "genericBoolOp": ["define", {
    "sourceInterval": [1220, 1265]
  }, null, [], ["alt", {
    "sourceInterval": [1236, 1265]
  }, ["app", {
    "sourceInterval": [1236, 1246]
  }, "spacedBool", []], ["app", {
    "sourceInterval": [1249, 1256]
  }, "orSpace", []], ["app", {
    "sourceInterval": [1259, 1265]
  }, "orLine", []]]],
  "fieldName": ["define", {
    "sourceInterval": [1290, 1341]
  }, null, [], ["seq", {
    "sourceInterval": [1302, 1341]
  }, ["not", {
    "sourceInterval": [1302, 1315]
  }, ["app", {
    "sourceInterval": [1303, 1315]
  }, "reservedWord", []]], ["plus", {
    "sourceInterval": [1316, 1336]
  }, ["alt", {
    "sourceInterval": [1317, 1334]
  }, ["app", {
    "sourceInterval": [1317, 1322]
  }, "alnum", []], ["terminal", {
    "sourceInterval": [1325, 1328]
  }, "."], ["terminal", {
    "sourceInterval": [1331, 1334]
  }, "_"]]], ["lookahead", {
    "sourceInterval": [1337, 1341]
  }, ["terminal", {
    "sourceInterval": [1338, 1341]
  }, ":"]]]],
  "fieldCond": ["define", {
    "sourceInterval": [1346, 1380]
  }, null, [], ["seq", {
    "sourceInterval": [1358, 1380]
  }, ["app", {
    "sourceInterval": [1358, 1367]
  }, "fieldName", []], ["terminal", {
    "sourceInterval": [1368, 1371]
  }, ":"], ["app", {
    "sourceInterval": [1372, 1380]
  }, "subquery", []]]],
  "rangeValue": ["define", {
    "sourceInterval": [1405, 1465]
  }, null, [], ["seq", {
    "sourceInterval": [1418, 1465]
  }, ["not", {
    "sourceInterval": [1418, 1424]
  }, ["app", {
    "sourceInterval": [1419, 1424]
  }, "space", []]], ["alt", {
    "sourceInterval": [1426, 1464]
  }, ["plus", {
    "sourceInterval": [1426, 1458]
  }, ["alt", {
    "sourceInterval": [1427, 1456]
  }, ["app", {
    "sourceInterval": [1427, 1432]
  }, "alnum", []], ["terminal", {
    "sourceInterval": [1435, 1438]
  }, "/"], ["terminal", {
    "sourceInterval": [1441, 1444]
  }, "-"], ["terminal", {
    "sourceInterval": [1447, 1450]
  }, ":"], ["terminal", {
    "sourceInterval": [1453, 1456]
  }, "+"]]], ["terminal", {
    "sourceInterval": [1461, 1464]
  }, "*"]]]],
  "rangeCond": ["define", {
    "sourceInterval": [1470, 1538]
  }, null, [], ["seq", {
    "sourceInterval": [1482, 1538]
  }, ["terminal", {
    "sourceInterval": [1482, 1485]
  }, "["], ["star", {
    "sourceInterval": [1486, 1492]
  }, ["app", {
    "sourceInterval": [1486, 1491]
  }, "space", []]], ["app", {
    "sourceInterval": [1493, 1503]
  }, "rangeValue", []], ["app", {
    "sourceInterval": [1504, 1516]
  }, "spaced", [["terminal", {
    "sourceInterval": [1511, 1515]
  }, "TO"]]], ["app", {
    "sourceInterval": [1517, 1527]
  }, "rangeValue", []], ["star", {
    "sourceInterval": [1528, 1534]
  }, ["app", {
    "sourceInterval": [1528, 1533]
  }, "space", []]], ["terminal", {
    "sourceInterval": [1535, 1538]
  }, "]"]]],
  "regexCond": ["define", {
    "sourceInterval": [1563, 1608]
  }, null, [], ["seq", {
    "sourceInterval": [1575, 1608]
  }, ["terminal", {
    "sourceInterval": [1575, 1578]
  }, "/"], ["plus", {
    "sourceInterval": [1579, 1604]
  }, ["alt", {
    "sourceInterval": [1580, 1602]
  }, ["app", {
    "sourceInterval": [1580, 1585]
  }, "alnum", []], ["app", {
    "sourceInterval": [1588, 1602]
  }, "regexCharacter", []]]], ["terminal", {
    "sourceInterval": [1605, 1608]
  }, "/"]]],
  "genericCond": ["define", {
    "sourceInterval": [1632, 1694]
  }, null, [], ["alt", {
    "sourceInterval": [1646, 1694]
  }, ["app", {
    "sourceInterval": [1646, 1655]
  }, "fieldCond", []], ["app", {
    "sourceInterval": [1658, 1667]
  }, "rangeCond", []], ["app", {
    "sourceInterval": [1670, 1679]
  }, "regexCond", []], ["app", {
    "sourceInterval": [1682, 1694]
  }, "detachedCond", []]]],
  "cond": ["define", {
    "sourceInterval": [1699, 1741]
  }, null, [], ["alt", {
    "sourceInterval": [1706, 1741]
  }, ["app", {
    "sourceInterval": [1706, 1727]
  }, "parented", [["app", {
    "sourceInterval": [1715, 1726]
  }, "genericCond", []]]], ["app", {
    "sourceInterval": [1730, 1741]
  }, "genericCond", []]]],
  "simpleNegation": ["define", {
    "sourceInterval": [1747, 1776]
  }, null, [], ["seq", {
    "sourceInterval": [1764, 1776]
  }, ["terminal", {
    "sourceInterval": [1764, 1767]
  }, "-"], ["app", {
    "sourceInterval": [1768, 1776]
  }, "subquery", []]]],
  "simpleMust": ["define", {
    "sourceInterval": [1781, 1806]
  }, null, [], ["seq", {
    "sourceInterval": [1794, 1806]
  }, ["terminal", {
    "sourceInterval": [1794, 1797]
  }, "+"], ["app", {
    "sourceInterval": [1798, 1806]
  }, "subquery", []]]],
  "longNegation": ["define", {
    "sourceInterval": [1811, 1847]
  }, null, [], ["seq", {
    "sourceInterval": [1826, 1847]
  }, ["terminal", {
    "sourceInterval": [1826, 1831]
  }, "NOT"], ["plus", {
    "sourceInterval": [1832, 1838]
  }, ["app", {
    "sourceInterval": [1832, 1837]
  }, "space", []]], ["app", {
    "sourceInterval": [1839, 1847]
  }, "subquery", []]]],
  "markedCond": ["define", {
    "sourceInterval": [1852, 1907]
  }, null, [], ["alt", {
    "sourceInterval": [1865, 1907]
  }, ["app", {
    "sourceInterval": [1865, 1877]
  }, "longNegation", []], ["app", {
    "sourceInterval": [1880, 1894]
  }, "simpleNegation", []], ["app", {
    "sourceInterval": [1897, 1907]
  }, "simpleMust", []]]],
  "queryElement": ["define", {
    "sourceInterval": [1913, 1945]
  }, null, [], ["alt", {
    "sourceInterval": [1928, 1945]
  }, ["app", {
    "sourceInterval": [1928, 1938]
  }, "markedCond", []], ["app", {
    "sourceInterval": [1941, 1945]
  }, "cond", []]]],
  "subquery": ["define", {
    "sourceInterval": [1947, 1988]
  }, null, [], ["alt", {
    "sourceInterval": [1958, 1988]
  }, ["app", {
    "sourceInterval": [1958, 1973]
  }, "parented", [["app", {
    "sourceInterval": [1967, 1972]
  }, "query", []]]], ["app", {
    "sourceInterval": [1976, 1988]
  }, "queryElement", []]]],
  "query": ["define", {
    "sourceInterval": [1993, 2058]
  }, null, [], ["alt", {
    "sourceInterval": [2001, 2058]
  }, ["app", {
    "sourceInterval": [2001, 2040]
  }, "nonemptyListOf", [["app", {
    "sourceInterval": [2016, 2024]
  }, "subquery", []], ["app", {
    "sourceInterval": [2026, 2039]
  }, "genericBoolOp", []]]], ["app", {
    "sourceInterval": [2043, 2058]
  }, "parented", [["app", {
    "sourceInterval": [2052, 2057]
  }, "query", []]]]]]
}]);
},{"ohm-js":"K+zu"}],"/P8c":[function(require,module,exports) {

},{}],"epB2":[function(require,module,exports) {
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-disable */
var _ = require('underscore');

var pp = require('prettier-printer');

var prism = require('prismjs');

var queryGrammar = require('../dist/grammar');

var prismTheme = require('prismjs/themes/prism.css');

var syntaxActionsMap = {
  'nonemptyListOf': flattenNonemptyListOf,
  'spaced': flattenSpaced,
  'parented': flattenParented,
  'boolOperator': flattenBoolOperator,
  'longNegation': flattenLongNegation,
  'simpleNegation': flattenSimpleNegation,
  'simpleMust': flattenSimpleMust,
  'detachedCond': flattenDetachedCondition,
  'fieldCond': flattenFieldCondition,
  'orSpace': flattenOrSpace,
  'rangeCond': flattenRangeCondition,
  'regexCond': flattenRegexCondition,
  '_terminal': terminalAction
};

function terminalAction() {
  return this.primitiveValue;
}

function flattenNonemptyListOf(first, separators, rest) {
  var topNodes = [first].concat([separators, rest]);
  var childrenWithOffsets = [];
  topNodes.map(function (node) {
    _.map(node.children, function (child, idx) {
      childrenWithOffsets.push({
        'offset': node._node.childOffsets[idx],
        'child': child
      });
    });
  });

  var sortedChildren = _.sortBy(childrenWithOffsets, 'offset');

  return sortedChildren.map(function (wrap) {
    return wrap.child.flatten();
  });
}

function flattenSpaced(_, innerNode, __) {
  return innerNode.flatten();
}

function flattenOrSpace(children) {
  return {
    'type': 'boolOperator',
    'value': 'IMP-OR'
  };
}

function flattenParented(_, __, innerNode, ___, ____) {
  return {
    'type': 'parented',
    'value': innerNode.flatten()
  };
}

function flattenBoolOperator(children) {
  var operator = children._node.primitiveValue;
  return {
    'type': 'boolOperator',
    'value': operator
  };
}

function flattenFieldCondition(nameNode, _, valueNode) {
  return {
    'type': 'fieldCondition',
    'name': nameNode.sourceString,
    'value': valueNode.flatten()
  };
}

function flattenRangeCondition(_, __, fromValue, ___, toValue, ____, _____) {
  return {
    'type': 'rangeCondition',
    'from': fromValue.sourceString,
    'to': toValue.sourceString
  };
}

function flattenRegexCondition(_, expression, __) {
  return {
    'type': 'regexCondition',
    'expression': expression.sourceString
  };
}

function flattenLongNegation(negation, spaces, condition) {
  return {
    'type': 'marking',
    'op': 'NOT',
    'value': condition.flatten()
  };
}

function flattenSimpleNegation(_, condition) {
  return {
    'type': 'marking',
    'op': '-',
    'value': condition.flatten()
  };
}

function flattenSimpleMust(_, condition) {
  return {
    'type': 'marking',
    'op': '+',
    'value': condition.flatten()
  };
}

function flattenDetachedCondition(children) {
  return this.sourceString;
}

function isFlatList(list) {
  var nonFlat = list.filter(function (el) {
    return !(el.value === undefined) && !(typeof el.value === 'string');
  });
  return nonFlat.length == 0;
}

function formatFlatTree(tree, maxWidth, style) {
  style = style || 'lisp';
  var formattersMap = {
    'parented': formatParented,
    'boolOperator': formatBoolOperator,
    'fieldCondition': formatFieldCondition,
    'marking': formatMarking,
    'rangeCondition': formatRangeCondition,
    'regexCondition': formatRegexCondition
  };
  return pp.render(maxWidth, pp.group(formatNodeRecursively(tree)));

  function wrap(result) {
    switch (style) {
      case 'lisp':
        // lisp-style align from '('
        return pp.group(pp.hang(1, result));

      case 'simple':
        // simple 2 space indent alignment
        return pp.group(pp.nest(2, result));

      default:
        throw 'Unknown formatting style \'' + style + '\'';
    }
  }

  function formatParented(node) {
    var children = _.filter(formatNodeRecursively(node['value']), null);

    return wrap(pp.enclose(pp.parens, pp.enclose([pp.softBreak, pp.softBreak], children)));
  }

  function formatBoolOperator(node) {
    if (node['value'] == 'IMP-OR') {
      // implicit OR operator
      return null;
    } else {
      // FIXME: in rare cases this lineBreak adds up to softLine in list
      // merge and produces empty lines in the output
      return pp.prepend(pp.lineBreak, node['value']);
    }
  }

  function formatFieldCondition(node) {
    var result = formatNodeRecursively(node['value']);
    return [node['name'], ':', result];
  }

  function formatRegexCondition(node) {
    return pp.enclose(['/', '/'], node['expression']);
  }

  function formatMarking(node) {
    if (node['op'] == 'NOT') {
      return wrap(pp.intersperse(pp.softLine, [node['op'], formatNodeRecursively(node['value'])]));
    } else {
      // simple marking with "-" or "+" does not require a space
      return wrap([node['op'], formatNodeRecursively(node['value'])]);
    }
  }

  function formatRangeCondition(node) {
    return wrap(['[', pp.intersperse(pp.softLine, [node['from'], 'TO', node['to']]), ']']);
  }

  function formatNodeRecursively(node) {
    switch (_typeof(node)) {
      case 'string':
        return node;

      case 'object':
        if (node instanceof Array) {
          var children = _.filter(node.map(formatNodeRecursively), null);

          return pp.intersperse(pp.softLine, children);
        } else {
          var formatter = formattersMap[node['type']];

          if (formatter) {
            return formatter(node);
          }

          return '<NO FORMATER DEFINED FOR \'' + node['type'] + '\'>';
        }

      default:
        throw 'Unknown object type \'' + _typeof(node) + '\'';
    }
  }
}

function formatQuery(query, maxWidth, style) {
  var match = queryGrammar.match(query);

  if (match.failed()) {
    var error = new Error('Can not parse query');
    error.message = match.message;
    error.shortMessage = match.shortMessage;
    error.rightmostFailurePosition = match.getRightmostFailurePosition();
    error.expectedText = match.getExpectedText();
    error.match = match;
    throw error;
  }

  var semantics = queryGrammar.createSemantics().addOperation('flatten', syntaxActionsMap);
  var tree = semantics(match);
  var flatTree = tree.flatten();
  return formatFlatTree(flatTree, maxWidth, style);
}

prism.languages.esquery = {
  'string': {
    pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\])*\2/,
    greedy: true,
    lookbehind: true
  },
  'variable': /@[\w.$]+|@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/,
  'boolean': /\b(?:true|false|null)\b/i,
  'number': /\b0x[\da-f]+\b|\b\d+\.?\d*|\B\.\d+\b/i,
  'operator': /[-+\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|OR|TO|NOT|_exists_)\b/i,
  'punctuation': /[;[\]()`,.]/
};

function extendHighlighter(keywords) {
  var keywordsExpr = '\\b(?:' + keywords.join('|') + ')\\b';
  prism.languages.esquery['keyword'] = new RegExp(keywordsExpr, 'i');
}

function highlightQuery(query) {
  return prism.highlight(query, prism.languages.esquery, 'esquery');
}

function prettify(query, maxWidth) {
  maxWidth = maxWidth || 100;
  var formatted = formatQuery(query, maxWidth);
  var highlighted = highlightQuery(formatted);
  return highlighted;
}

function formatErrorMessage(error, cssClass) {
  var styling = cssClass ? 'class="' + cssClass + '"' : 'style="color:red"';
  return '<p ' + styling + '>' + error.shortMessage + '</p>';
}

function prettifyElement(elementId, showErrors, maxWidth, errorCss) {
  var element = document.getElementById(elementId);
  var query = element.innerText.trim();
  var result;

  try {
    result = prettify(query, maxWidth);
  } catch (error) {
    if (showErrors) {
      element.innerHTML = markErrorInQuery(query, error, errorCss) + formatErrorMessage(error, errorCss);
      return element;
    }

    return false;
  }

  element.innerHTML = result;
  return element;
}

function markErrorInQuery(query, error, cssClass) {
  var index = error.rightmostFailurePosition;
  var part1 = query.slice(0, index);
  var part2 = query.slice(index + 1);
  var styling;

  if (cssClass) {
    styling = 'class="' + cssClass + '"';
  } else {
    styling = 'style="text-decoration-color: red;-webkit-text-decoration-color: red;color: red;"';
  }

  return part1 + '<u ' + styling + '>' + query[index] + '</u>' + part2;
}

var PrettierEs = {
  format: formatQuery,
  highlight: highlightQuery,
  prettify: prettify,
  prettifyElement: prettifyElement,
  extendHighlighter: extendHighlighter,
  markErrorInQuery: markErrorInQuery
};
module.exports = PrettierEs;

if (typeof window !== 'undefined') {
  window.PrettierEs = PrettierEs;
}
},{"underscore":"h15N","prettier-printer":"2fpi","prismjs":"6hKA","../dist/grammar":"2lmm","prismjs/themes/prism.css":"/P8c"}]},{},["epB2"], null)
//# sourceMappingURL=/prettier-es.map