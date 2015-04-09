var glob = require('glob');
var DataHolder = require('raptor-async/DataHolder');
var series = require('raptor-async/series');
var vinylToStream = require('vinyl-to-stream');
var Imagemin = require('imagemin');
var nodePath = require('path');

function streamToBuffer(stream, callback) {
    var chunks = [];
    stream
        .on('data', function(chunk) {
            chunks.push(chunk);
        })
        .on('error', function(err) {
            return callback(err);
        })
        .on('end', function() {
            var buffer = Buffer.concat(chunks); // Create a buffer from all the received chunks
            return callback(null, buffer);
        });
}

var builtins = {
    'imagemin-gifsicle': Imagemin.gifsicle,
    'imagemin-jpegtran': Imagemin.jpegtran,
    'imagemin-optipng': Imagemin.optipng,
    'imagemin-pngquant': Imagemin.pngquant,
    'imagemin-svgo': Imagemin.svgo,
    'gifsicle': Imagemin.gifsicle,
    'jpegtran': Imagemin.jpegtran,
    'optipng': Imagemin.optipng,
    'pngquant': Imagemin.pngquant,
    'svgo': Imagemin.svgo
};

function Minifier(pluginConfig) {
    var initDataHolder = new DataHolder();
    var pluginsByPath = {};
    var basedir = process.cwd();

    function init() {
        var useArray = pluginConfig.use;
        if (Array.isArray(useArray)) {
            var tasks = useArray.map(function(use) {
                return function(callback) {
                    var plugin = use.plugin;
                    var pluginName;

                    if (typeof plugin === 'string') {
                        pluginName = plugin;
                        plugin = builtins[plugin] || require(plugin);
                    }

                    if (!pluginName) {
                        pluginName = plugin.name;
                    }

                    var options = use.options || {};

                    var patterns = use.paths;
                    if (typeof patterns === 'string') {
                        patterns = [patterns];
                    }

                    var paths = {};

                    series(patterns.map(function(pattern) {
                            return function(callback) {
                                glob(pattern, { cwd: basedir}, function (err, files) {
                                    if (err) {
                                        return callback(err);
                                    }
                                    for (var i=0, len=files.length; i<len; i++) {
                                        var path = files[i];
                                        path = nodePath.join(basedir, path);
                                        paths[path] = true;
                                    }

                                    callback();
                                });
                            };
                        }),
                        function(err) {
                            if (err) {
                                return initDataHolder.reject(err);
                            }

                            Object.keys(paths).forEach(function(path) {
                                var pluginsForPath = pluginsByPath[path] ||
                                    (pluginsByPath[path] = []);

                                pluginsForPath.push({
                                    plugin: plugin,
                                    options: options
                                });
                            });

                            callback();
                        });
                };
            });

            series(tasks, function(err) {
                if (err) {
                    return initDataHolder.reject(err);
                }

                initDataHolder.resolve();
            });
        } else {
            initDataHolder.resolve();
        }
    }

    init();

    this.minify = function(inStream, path, lassoContext) {

        var readable = lassoContext.deferredStream(function() {
            initDataHolder.done(function() {
                var pluginsForPath = pluginsByPath[path];
                if (!pluginsForPath || pluginsForPath.length === 0) {
                    readable.setWrappedStream(inStream);
                    return;
                }

                streamToBuffer(inStream, function(err, buffer) {
                    if (err) {
                        readable.emit('error', err);
                        return;
                    }

                    var imageReadable = vinylToStream();
                    var imagemin = new Imagemin()
                        .src(buffer);

                    pluginsForPath.forEach(function(pluginConfig) {
                        imagemin.use(pluginConfig.plugin(pluginConfig.options));
                    });

                    imagemin.use(imageReadable);
                    imagemin.run(function(err) {
                        if (err) {
                            readable.emit('error', err);
                            imageReadable.push(null);
                            return;
                        }
                    });

                    readable.setWrappedStream(imageReadable);
                });
            });
        });

        return readable;
    };
}


module.exports = Minifier;

