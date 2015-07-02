'use strict';

var async = require('async');

var arrObjs = [{
    o: {
        firstname: "Jon",
        lastname: "Snow",
        age: 24
    },
    t: "vertex1"
}, {
    o: {
        firstname: "Bart",
        lastname: "Simpson",
        age: 10
    },
    t: "vertex1"
}, {
    o: {
        firstname: "Steve",
        lastname: "Jobs",
        age: 56
    },
    t: "vertex1"
}, {
    o: {
        firstname: "test",
        lastname: "test",
        age: 106
    },
    t: "vertex1"
}, {
    o: {
        firstname: "test",
        lastname: "test",
        age: 100
    },
    t: "vertex1"
}, {
    o: {
        firstname: "Lisa",
        lastname: "Simpson",
        age: 13
    },
    t: "vertex2"
}, {
    o: {
        firstname: "Homer",
        lastname: "Simpson",
        age: 40
    },
    t: "vertex2"
}, {
    o: {
        firstname: "Marge",
        lastname: "Simpson",
        age: 39
    },
    t: "vertex2"
}, {
    o: {
        firstname: "Aria",
        lastname: "Stark",
        age: 14
    },
    t: "vertex2"
}];

module.exports = function(app) {
    async.eachSeries(arrObjs, function(item, cb) {

            if (item.t === "vertex1") {
                app.models.vertex1.create(item.o, function(err, vertex1) {
                    // console.log(err,vertex1);
                });
            } else {
                app.models.vertex2.create(item.o, function(err, vertex2) {
                    // console.log(err,vertex2);
                });
            }
            cb();
        },
        function(err, res) {
            return;
        });
}
