optimizer-imagemin
==================
This plugin for the [RaptorJS Optimizer](https://github.com/raptorjs/optimizer) allows the [imagemin](https://github.com/imagemin/imagemin) module to be used to minify GIF, PNG, JPG and SVG images during optimization.

# Installation

Install the plugin:

```
npm install optimizer-imagemin --save
```

Enable the plugin:

```javascript
require('optimizer').configure({
    plugins: [
        {
            plugin: 'optimizer-imagemin',
            config: {
                ... // See below for config options
            }
        },
        ...
    ]
});
```

# Plugin Configuration


This plugins supports the following builtin image minification plugins:

* [gifsicle](https://github.com/imagemin/imagemin-gifsicle) — Compress GIF images.
* [jpegtran](https://github.com/imagemin/imagemin-jpegtran) — Compress JPG images.
* [optipng](https://github.com/imagemin/imagemin-optipng) — Lossless compression of PNG images.
* [pngquant](https://github.com/imagemin/imagemin-pngquant) — Lossy compression of PNG images.
* [svgo](https://github.com/imagemin/imagemin-svgo) — Compress SVG images.

The full list of plugins can found on the following page: [imagemin plugins](https://www.npmjs.org/browse/keyword/imageminplugin)

If you intend to use a non-builtin plugin then you must `npm install` it first (e.g. `npm install imagemin-webp`).

## Sample Configuration

```javascript
require('optimizer').configure({
    plugins: [
        {
            plugin: 'optimizer-imagemin',
            config: {
                use: [
                    {
                        paths: ['**/*.gif'],
                        plugin: 'gifsicle',
                        options: { interlaced: true }
                    },
                    {
                        paths: ['**/*.png'],
                        plugin: 'optipng',
                        options: { optimizationLevel: 3 }
                    },
                    {
                        // Non-builtin plugins must be referenced by npm module name:
                        paths: ['**/*.webp'],
                        plugin: 'imagemin-webp', // Or: require('imagemin-webp')
                        options: {}
                    }
                ]
            }
        },
        ...
    ]
});
```