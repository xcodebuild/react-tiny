var webpack = require('atool-build/lib/webpack');

module.exports = function(c) {
  c.entry = {
    index: './src/index.js'
  };
  c.plugins.shift();
  c.output.path = process.cwd();
  return c;
};
