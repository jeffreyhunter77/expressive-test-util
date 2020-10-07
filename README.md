# expressive-test-util

A set of utility functions used by expressive-test. Are all of these necessary? Might there already be something else out there that does exactly this? No and probably, but having these made me less frustrated while writing Javascript and writing the routines was faster than searching for existing solutions, so here we are.

## Installation

Using npm:

```
npm install expressive-test-util
```

## API

This module exports the following top-level properties:

 * [exec](#api_exec)
 * [file](#api_file)
 * [promise](#api_promise)
 * [string](#api_string)

<a name="api_exec"></a>
### exec

The exec module includes utility routines related to executing other processes.

It exports the following functions:

  * [exec](#api_exec_exec)
  * [quote](#api_exec_quote)

<a name="api_exec_exec"></a>
#### exec.exec(command)

**Parameters**

 * `command`: **String** The command to execute

**Return Value**

Returns a promise. When the promise resolves, the resolved value is an object containing the following properties:

  * `stdout`: **String** Anything the process wrote to standard out
  * `stderr`: **String** Anything the process wrote to standard error

If the promise rejects, `stdout` and `stderr` are provided as properties on the error.

**Description**

Spawns a shell and executes `command`. This is a wrapper for `child_process.exec` that returns a promise instead of requiring a callback.

<a name="api_exec_quote"></a>
#### exec.quote(str)

**Parameters**

 * `str`: **String** The value to quote

**Return Value**

Returns a string containing `str` wrapped in single quotes.

**Description**

Wraps the provided value in single quotation marks ('). Any single quote characters in the input are escaped in Unix shell style. Specifically, any instance of `'` is replaced with the value `'"'"'`.

This is useful for sanitizing values to pass to `exec`.

<a name="api_file"></a>
### file

The file module includes utility routines for working with the file system.

It exports the following functions:

  * [access](#api_file_access)
  * [exists](#api_file_exists)
  * [isDirectory](#api_file_isdirectory)
  * [readdir](#api_file_readdir)
  * [rmdir](#api_file_rmdir)
  * [rmTree](#api_file_rmtree)
  * [stat](#api_file_stat)
  * [unlink](#api_file_unlink)

<a name="api_file_access"></a>
#### file.access(path, mode)

**Parameters**

 * `path`: **String** Path to the directory or file to test
 * `mode`: **Integer** The access permissions to test. May be a value from fs.constants or an OR (`|`) of two or more values.

**Return Value**

A promise. If the promise resolves, the tested mode is available. Otherwise, it rejects.

**Description**

Tests the current user's permissions for a file or directory. This is a wrapper for `fs.access` that returns a promise instead of requiring a callback.

<a name="api_file_exists"></a>
#### file.exists(path)

**Parameters**

 * `path`: **String** Path to the directory or file to test

**Return Value**

Returns a promise. If a file or directory exists at the given path, resolves `true`. Otherwise, it resolves `false`. It only rejects if an error other than `ENOENT` occurred, such as a device or name too long error.

**Description**

Tests for the existence of a file or directory at the given path.

<a name="api_file_isdirectory"></a>
#### file.isDirectory(path)

**Parameters**

 * `path`: **String** Path to the directory or file to test

**Return Value**

Returns a promise. If a directory exists at the given path, resolves `true`. If no file exists at path or it is not a directory, resolves `false`.

**Description**

Tests for a directory at the given path.

<a name="api_file_readdir"></a>
#### file.readdir(path)

**Parameters**

 * `path`: **String** Path to the directory to read

**Return Value**

Returns a promise. The resolve value of the promise is an array containing the names of the files in the directory, excluding `.` and `..`.

**Description**

Reads the contents of a directory at the given path. This is a wrapper for `fs.readdir` that returns a promise instead of requiring a callback.

<a name="api_file_rmdir"></a>
#### file.rmdir(path)

**Parameters**

 * `path`: **String** Path to the directory to remove

**Return Value**

Returns a promise that resolves when the directory is removed.

**Description**

Removes the directory named by `path`. The provided path must be a directory an must be empty. This is a wrapper for `fs.rmdir`.

<a name="api_file_rmtree"></a>
#### file.rmTree(path)

**Parameters**

 * `path`: **String** Path to the file or directory to remove

**Return Value**

Returns a promise that resolves when all files at `path` have been removed.

**Description**

Recursively removes the contents of the file system at `path`. If `path` is a regular file, it is removed. If `path` is a directory, it's contents are first removed and then it is removed. Any error encountered will result in a rejection. Unlike `fs.rmdir`, all errors are reported and no retries are attempted.

<a name="api_file_stat"></a>
#### file.stat(path)

**Parameters**

 * `path`: **String** Path to the file or directory to retrieve information on

**Return Value**

Returns a promise that resolves to an `fs.Stats` object.

**Description**

Returns information about the file or directory at `path`. This is a wrapper for `fs.stat`.

<a name="api_file_unlink"></a>
#### file.unlink(path)

**Parameters**

 * `path`: **String** Path to the file to remove

**Return Value**

Returns a promise that resolves when the file is removed.

**Description**

Removes the file at `path`. The provided path must be a file, not a directory. This is a wrapper for `fs.unlink`.

<a name="api_promise"></a>
### promise

The promise module includes utility routines for working with promises.

It exports the following functions:

  * [asPromise](#api_promise_aspromise)
  * [promiseEach](#api_promise_promiseeach)
  * [withinTimeout](#api_promise_withintimeout)

<a name="api_promise_aspromise"></a>
#### promise.asPromise(fn)

**Parameters**

 * `fn`: **Function** A function that invokes a callback-style asynchronous function.
 
   `fn` is called with the the following parameters:
   
   * `callback`: **Function** A function which accepts an error as its first argument and a result as the second.
   
   Any value returned by `fn` is ignored.

**Return Value**

A promise which resolves to the result passed to `callback`. If `callback` is passed an error, the promise rejects with that error.

**Description**

This is an alternative to `util.promisify`. Instead of defining a promisified function, it invokes a callback style function immediately and makes its outcome available as a promise.

For example, to read the contents of a file, you could do the following:

```javascript
let contents = await promise.asPromise(callback => fs.readFile('/etc/hosts', 'utf8', callback));
```

<a name="api_promise_promiseeach"></a>
#### promise.promiseEach(items, fn)
**Parameters**

 * `items`: **Array** A list of inputs to iterate over
 * `fn`: **Function** A function that will be invoke for each item.
 
   For each entry in `items`, `fn` is invoked with the following parameters:
   
   * `item`: **Any** The current item being processed
   
   If `fn` returns a promise, the next item will not be processed until it resolves. If a returned promise rejects, `promiseEach` also rejects.

**Return Value**

A promise. When the promise resolves, its value is the value of the last item in the list or `undefined` for an empty list.

**Description**

A utility for performing a collection of asynchronous work serially. It chains the items in the collection together as a series of promises. This makes it possible to invoke a list of promises one at a time. It can also be used to call functions that may result in either a promise or a value one after another.

As an example, here is how you could use `promiseEach` to make three post requests one after the other:

```javascript
const put = util.promisify(request.put);

const docs = [
  {path: 'one', content: {message: 'hello'}},
  {path: 'two', content: {see: '/one'}},
  {path: 'three', content: {see: '/two'}}
];

promise.promiseEach(docs, (doc) => {
  return put(`http://example.com/${doc.path}`, {json: doc.content});
});
```

<a name="api_promise_withintimeout"></a>
#### promise.withinTimeout(ms, promise)
**Parameters**

 * `ms`: **Integer** Time limit for promise to resolve in milliseconds
 * `promise`: **Promise** The promise to await

**Return Value**

Returns a promise. If the promise passed to the function resolves before time expires, the returned promise resolves with its value. If it rejects or time elapses, the returned promise rejects.

**Description**

Awaits a promise for up to `ms` milliseconds. If the promise does not resolve within `ms` milliseconds, it rejects with the error `'Timed out'`.

<a name="api_string"></a>
### string

The string module includes utility routines for working with strings. It is inspired by functionality in the Rails `Inflector` module.

It exports the following functions:

  * [pluralize](#api_string_pluralize)
  * [underscore](#api_string_underscore)

<a name="api_string_pluralize"></a>
#### string.pluralize(str)

**Parameters**

 * `str`: **String** The value to pluralize

**Return Value**

A string containing the (hopefully) pluralized version of the input.

**Description**

Attempts to pluralize an input string using simple English pluralization rules. This appends an "s" to the input. It correctly handles the case for words that end in a "ch", "s", "y", or "x". It does not handle any other exceptions, so don't expect a correct plural for "deer", "fish", or "tooth".

<a name="api_string_underscore"></a>
#### string.underscore(str)

**Parameters**

 * `str`: **String** The value to format

**Return Value**

A string containing the underscore formatted version of the input.

**Description**

Formats a name using lower case underscore-separated formatting. This is intended for converting camel case or dash-separated names into an underscore equivalent. For example, the input 'FooBar' would be returned as 'foo_bar'.
