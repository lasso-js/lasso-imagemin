var ok = require('assert').ok;
var Minifier = require('./Minifier');

module.exports = function (pageOptimizer, pluginConfig) {

    var types = pluginConfig.types || ['gif', 'jpeg', 'jpg', 'png', 'svg'];

    var minifier = new Minifier(pluginConfig);

    pageOptimizer.addTransform({
        contentTypes: types,

        name: module.id,

        stream: true,

        transform: function(inStream, contentType, optimizerContext) {

            /*
            What this method will do:
            1. Convert the incoming stream to a buffer
            2. Calculate a hash of the buffer to use for the output file name
            3. If the output file already exists in the destination directory then return the input stream for that file
            4. Else:
                a. configure imagemin based on the file type
                b. minify the image
                c. return a a file read stream for the optimized image written to disk
             */
             var path = optimizerContext.path;
             contentType = contentType.toLowerCase();

             ok(typeof path === 'string', 'Path expected');

             return minifier.minify(inStream, path, optimizerContext);
        }
    });
};