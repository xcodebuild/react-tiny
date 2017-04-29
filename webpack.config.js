module.exports = function(webpackConfig) {
    webpackConfig.ts.transpileOnly = false;
    webpackConfig.plugins.shift();
    return webpackConfig;
};