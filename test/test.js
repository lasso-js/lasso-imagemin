'use strict';
var chai = require('chai');
chai.Assertion.includeStack = true;
require('chai').should();
var expect = require('chai').expect;
var nodePath = require('path');
var fs = require('fs');

var optimizerImagePlugin = require('../'); // Load this module just to make sure it works
var optimizer = require('optimizer');

describe('optimizer-imagemin' , function() {

    beforeEach(function(done) {
        done();
    });

    it('should minify a gif image', function(done) {

        var pageOptimizer = optimizer.create({
                fileWriter: {
                    fingerprintsEnabled: true,
                    outputDir: nodePath.join(__dirname, 'static')
                },
                plugins: [
                    {
                        plugin: optimizerImagePlugin,
                        config: {
                            use: [
                                {
                                    paths: ['test/fixtures/*.gif'],
                                    plugin: 'gifsicle',
                                    options: { interlaced: true }
                                }
                            ]
                        }
                    }
                ]
            });

        pageOptimizer.optimizeResource(nodePath.join(__dirname, 'fixtures/test.gif'), function(err, result) {
            if (err) {
                return done(err);
            }
            console.log('RESULT: ', result);
            // setTimeout(done, 1400);
            done();
        });
    });


});
