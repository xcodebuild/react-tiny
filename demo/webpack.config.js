var webpack = require('atool-build/lib/webpack');

module.exports = function(c) {
  c.entry = {
    index: './src/index.js'
  };
  c.plugins.shift();
  c.babel.plugins.push(['flow-runtime', {
    "assert": true,
    "annotate": true
  }]);
  c.output.path = process.cwd();
  return c;
};
