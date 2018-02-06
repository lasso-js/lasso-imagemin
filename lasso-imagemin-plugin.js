var nodePath = require('path');
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

            if (typeof path === 'string') {
                var ext = nodePath.extname(path).substr(1);
                return types.indexOf(ext) !== -1 ? minifier.minify(inStream, path, lassoContext) : inStream;
            } else {
                return inStream;
            }
        }
    });
};
