var webpack = require('atool-build/lib/webpack');

module.exports = function(c) {
  c.entry = {
    index: './src/react-tiny.js'
  };
  c.plugins.shift();
  return c;
};
