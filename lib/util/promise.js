function asPromise(block) {
  return new Promise((resolve, reject) => {

    function callback(err, result) {
      if (err)
        reject(err);
      else
        resolve(result);
    }

    block.call(this, callback);
  });
}
module.exports.asPromise = asPromise;


function promiseEach(items, callback) {
  return items.reduce((chain, item) => {

    return chain.then(() => callback(item));

  }, Promise.resolve());
}
module.exports.promiseEach = promiseEach;


function withinTimeout(ms, promise) {
  return new Promise((resolve, reject) => {
    let timedOut = false;

    let timer = setTimeout(() => {
      timedOut = true;
      reject(new Error('Timed out'));
    }, ms);

    promise
      .then((result) => {
        if (timedOut) return;

        clearTimeout(timer);
        resolve(result);
      })
      .catch((err) => {
        if (timedOut) return;

        clearTimeout(timer);
        reject(err);
      });
  });
}
module.exports.withinTimeout = withinTimeout;
