'use strict';
var chai = require('chai');
chai.Assertion.includeStack = true;
require('chai').should();
var expect = require('chai').expect;
var nodePath = require('path');

var lassoImagePlugin = require('../'); // Load this module just to make sure it works
var lasso = require('lasso');

describe('lasso-imagemin' , function() {

    beforeEach(function(done) {
        done();
    });

    it('should minify a gif image', function(done) {

        var myLasso = lasso.create({
                fileWriter: {
                    fingerprintsEnabled: true,
                    outputDir: nodePath.join(__dirname, 'static')
                },
                plugins: [
                    {
                        plugin: lassoImagePlugin,
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

        myLasso.optimizeResource(nodePath.join(__dirname, 'fixtures/test.gif'), function(err, result) {
            if (err) {
                return done(err);
            }
            expect(result.outputFile).to.equal(
                nodePath.join(__dirname, 'static/test-7752c891.gif'));

            done();
        });
    });


});
