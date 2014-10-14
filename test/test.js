'use strict';
var chai = require('chai');
chai.Assertion.includeStack = true;
require('chai').should();
var expect = require('chai').expect;
var nodePath = require('path');

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
            expect(result.outputFile).to.equal(
                nodePath.join(__dirname, 'static/test-23919e20.gif'));

            done();
        });
    });


});
