var proc = require('child_process')
  , extend = require('extend')
;

function exec(command) {
  return new Promise((resolve, reject) => {

    proc.exec(command, (error, stdout, stderr) => {

      if (error)
        reject(extend(error, {stdout: stdout, stderr: stderr}));

      else
        resolve({stdout: stdout, stderr: stderr});

    });

  });
}
module.exports.exec = exec;


function quote(str) {
  return "'" + String(str).replace(/\'/g, "'\"'\"'") + "'";
}
module.exports.quote = quote;
