var ok = require('assert').ok;
var Minifier = require('./Minifier');

module.exports = function (pageOptimizer, pluginConfig) {

    var types = pluginConfig.types || ['gif', 'jpeg', 'jpg', 'png', 'svg'];

    var minifier = new Minifier(pluginConfig);

    pageOptimizer.addTransform({
        contentTypes: types,

        name: module.id,

        stream: true,

        transform: function(inStream, optimizerContext) {
             var path = optimizerContext.path;
             ok(typeof path === 'string', 'Path expected');
             return minifier.minify(inStream, path, optimizerContext);
        }
    });
};