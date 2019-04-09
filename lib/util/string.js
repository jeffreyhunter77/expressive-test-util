function underscore(str) {
  str = String(str).replace(/([a-z\d]+)([A-Z])/g, '$1_$2');
  str = String(str).replace(/([A-Z]+)([A-Z])/g, '$1_$2');
  str = str.replace(/-/g, '_');
  return str.toLowerCase();
}
module.exports.underscore = underscore;


function pluralize(str) {
  if (/(?:ch|s|x)$/.test(str))
    return str + 'es';
  else if (/y$/.exec(str))
    return str.substr(0, str.length - 1) + 'ies';
  else
    return str + 's';
}
module.exports.pluralize = pluralize;
