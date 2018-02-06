'use strict';
var fs = require('fs');
var chai = require('chai');
chai.Assertion.includeStack = true;
require('chai').should();
var expect = require('chai').expect;
var nodePath = require('path');

var lassoImagePlugin = require('../'); // Load this module just to make sure it works
var lasso = require('lasso');

function imageTest (lassoImageConfig, fixtureImage, outputFile, done) {
    var myLasso = lasso.create({
        fileWriter: {
            fingerprintsEnabled: true,
            outputDir: nodePath.join(__dirname, 'static')
        },
        plugins: [
            {
                plugin: lassoImagePlugin,
                config: lassoImageConfig
            }
        ]
    });

    var filePath = nodePath.join(__dirname, 'static/' + outputFile);

    myLasso.lassoResource(nodePath.join(__dirname, 'fixtures/' + fixtureImage), { cache: false }, function(err, result) {
        if (err) {
            return done(err);
        }

        expect(result.outputFile).to.equal(filePath);
        done();
    });
}

function addImageTests (prefix) {
    prefix = prefix === true ? 'imagemin-' : '';
    var usingMessage = prefix ? ' using ' + prefix + ' plugin prefix' : '';

    it('should minify a gif image' + usingMessage, function(done) {
        imageTest({
            use: [
                {
                    paths: ['test/fixtures/*.gif'],
                    plugin: prefix + 'gifsicle',
                    options: { interlaced: true }
                }
            ]
        }, 'test.gif', 'test-7752c891.gif', done);
    });

    it('should minify a png image with optipng' + usingMessage, function(done) {
        imageTest({
            use: [
                {
                    paths: ['test/fixtures/*.png'],
                    plugin: prefix + 'optipng',
                    options: { optimzationLevel: 3 }
                }
            ]
        }, 'test.png', 'test-db7807cd.png', done);
    });

    it('should minify a jpg image' + usingMessage, function(done) {
        imageTest({
            use: [
                {
                    paths: ['test/fixtures/*.jpg'],
                    plugin: prefix + 'jpegtran'
                }
            ]
        }, 'test.jpg', 'test-6dcefbfc.jpg', done);
    });

    it('should minify an svg image' + usingMessage, function(done) {
        imageTest({
            use: [
                {
                    paths: ['test/fixtures/*.svg'],
                    plugin: prefix + 'svgo'
                }
            ]
        }, 'test.svg', 'test-dbe6fcd9.svg', done);
    });
}

describe('lasso-imagemin' , function() {

    beforeEach(function(done) {
        done();
    });

    addImageTests();
    addImageTests(true);
});
