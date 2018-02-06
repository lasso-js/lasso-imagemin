var ok = require('assert').ok;
var Minifier = require('./Minifier');

module.exports = function (lasso, pluginConfig) {

    var types = pluginConfig.types || ['gif', 'jpeg', 'jpg', 'png', 'svg'];

    var minifier = new Minifier(pluginConfig);

    lasso.addTransform({
        contentTypes: types,

        name: module.id,

        stream: true,

        transform: function(inStream, lassoContext) {
             var path = lassoContext.path;
             return typeof path === 'string' ? minifier.minify(inStream, path, lassoContext) : inStream;
        }
    });
};
