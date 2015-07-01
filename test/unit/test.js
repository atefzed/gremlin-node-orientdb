'use strict';

var getApp = require('./main');

describe("Vertices", function() {

    var app;

    before(function(done) {
        getApp(function(err, a) {
            app = a;
            done(err);
        })
    });

    describe("v", function() {

        it("Should be correct!", function(done) {
            app.models.vertex1.v("id", "#12:57", function(e1, r1) {
                if (e1) console.log(e1);
                console.log(r1);
                done();
            })
        })
        it("Should get a WARN!", function(done) {
            app.models.vertex1.v("id", "false_value", function(e1, r1) {
                if (e1) console.log(e1);
                console.log(r1);
                done();
            })
        })
    })
    describe("Paths", function() {

        it("shortestPath", function(done) {
            app.models.vertex1.shortestPath("#12:15", "#12:9", 6, function(e1, r1) {
                if (e1) console.log(e1);
                console.log(r1);
                done();
            })
        })
        it("linkBoth", function(done) {
            app.models.vertex1.linkBoth("#12:15", "relationship", ["#12:14", "#12:5"], function(e1, r1) {
                if (e1) console.log(e1);
                console.log(r1);
                done();
            })
        })
    })
});

describe("Edges", function() {

    var app;

    before(function(done) {
        getApp(function(err, a) {
            app = a;
            done(err);
        })
    });

    describe("Nested requests", function() {

        it("E", function(done) {
            app.models.relationship.E(function(e1, r1) {
                if (e1) console.log(e1);
                app.models.relationship.dedup(r1, function(e2, r2) {
                    if (e2) console.log(e2);
                    app.models.relationship.count(r2, function(e3, r3) {
                        if (e3) console.log(e3);
                        // console.log(r3);
                        done();
                    })
                })
            })
        })
        it("getProperties", function(done) {
            app.models.relationship.getProperties("#14:12", function(e1, r1) {
                if (e1) console.log(e1);
                console.log(r1);
                done();
            })
        })
    })
});
