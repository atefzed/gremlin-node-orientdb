'use strict';

var express = require('express');

var app = express();

require('./config/express')(app);

var Waterline = require('waterline'),
    methodOverride = require('method-override'),
    orm = new Waterline();

var vertex1 = require('./models/Vertex1'),
    relationship = require('./models/Relationship'),
    vertex2 = require('./models/Vertex2');

var async = require('async');

// Load the Models into the ORM
orm.loadCollection(vertex1);
orm.loadCollection(relationship);
orm.loadCollection(vertex2);

var orientdb = require('./config/orientdb');

module.exports = function(callback) {
    async.auto({
        app: function(cb) {
            orm.initialize(orientdb, function(err, models) {
                if (err) throw err;
                app.models = models.collections;
                app.connections = models.connections;
                // require('./gen-db')(app);
                return cb(null, app);
            });
        },
        ret: ['app', function(cb, results) {
            callback(null, results.app);
        }]
    }, function(err, res) {
        return callback(err, res.ret);
    });
}
