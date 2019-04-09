var fs = require('fs')
  , path = require('path')
  , prom = require('./promise')
;

function stat(path) {
  return prom.asPromise(callback => fs.stat(path, callback));
}
module.exports.stat = stat;


function readdir(path) {
  return prom.asPromise(callback => fs.readdir(path, callback));
}
module.exports.readdir = readdir;


function unlink(path) {
  return prom.asPromise(callback => fs.unlink(path, callback));
}
module.exports.unlink = unlink;


function access(path, options) {
  return prom.asPromise(callback => fs.access(path, options, callback));
}
module.exports.access = access;


function exists(path) {
  return access(path, fs.constants.F_OK)

    .then(() => true)

    .catch((err) => {
      if (err.code == 'ENOENT') return false;
      throw err;
    });
}
module.exports.exists = exists;


function rmdir(path) {
  return prom.asPromise(callback => fs.rmdir(path, callback));
}
module.exports.rmdir = rmdir;


function isDirectory(path) {
  return stat(path)

    .then((stats) => stats.isDirectory())

    .catch((err) => {
      if (err.code == 'ENOENT') return false;
      throw err;
    });
}
module.exports.isDirectory = isDirectory;


function rmTree(fileName) {

  return isDirectory(fileName).then((dir) => {

    if (!dir)
      return unlink(fileName);

    return readdir(fileName).then((files) => {

      return prom.promiseEach(files,
          (file) => rmTree(path.join(fileName, file))
        )
        .then(() => rmdir(fileName));
    })

  });
}
module.exports.rmTree = rmTree;
