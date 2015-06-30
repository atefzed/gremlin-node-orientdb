'use strict';
/**
 * Dependancies
 */
var Graph = require('./../lib/graph');
var g = new Graph();

/**
 * Working WITHOUT sails-orientdb
 */
g.filter('', 'prof', {
    'firstname': 'test'
}, function(err, res) {
    console.log(1, err, res);
});

g.has('', 'prof', 'firstname', 'test', 'all', function(err, rec) {
    console.log(2, err, rec);
});

g.outE('', 'prof', 'id', '#12:5', 'E', function(err, rec) {
    console.log(3, err, rec);
});

g.shortestPath('', 'prof', '#12:15', '#12:9', 4, function(err, rec) {
    console.log(4, err, rec);
});


/**
 * Working WITH sails-orientdb
 */
var o = app.models.prof;

o.inV('id', '#12:0', function(err, resp) {
    o.dedup(resp, function(e, r){
        console.log(r);
    });
});

o.loop('#12:15', 'loops<4', "firstname == 'test'", function(err, resp){
    console.log(resp);
});

o.bothE('id', '#12:15', function(err, resp) {
    o.dedup(resp, function(err, r) {
        console.log(err, r);
    })
})
