'use strict';

/**
 * Test dependencies
 */
var Graph = require('./../lib/graph');
var g = new Graph();

var conn = "",
    prof = "prof",
    course = "course",
    student = "student";

describe("Vertices", function() {
    describe("Nested requests", function() {
        it("bothV", function(done) {
            g.bothV(conn, prof, "id", "#12:15", function(e1, r1) {
                if (e1) console.log(e1);
                g.dedup(conn, prof, r1, function(e2, r2) {
                    if (e2) console.log(e2);
                    g.count(conn, prof, r2, function(e3, r3) {
                        if (e3) console.log(e3);
                        // console.log(r3);
                        done();
                    })
                })
            })
        })
        it("getProperties", function(done) {
            g.getProperties(conn, prof, "#12:15", function(e1, r1) {
                if (e1) console.log(e1);
                // console.log(r1);
                done();
            })
        })
    })
    describe("Paths", function() {
        it("shortestPath", function(done) {
            g.shortestPath(conn, prof, "#12:15", "#12:9", 6, function(e1, r1) {
                if (e1) console.log(e1);
                // console.log(r1);
                done();
            })
        })
    })
});

describe("Edges", function() {
    describe("Nested requests", function() {
        it("E", function(done) {
            g.E(conn, course, function(e1, r1) {
                if (e1) console.log(e1);
                g.dedup(conn, course, r1, function(e2, r2) {
                    if (e2) console.log(e2);
                    g.count(conn, course, r2, function(e3, r3) {
                        if (e3) console.log(e3);
                        // console.log(r3);
                        done();
                    })
                })
            })
        })
        it("getProperties", function(done) {
            g.getProperties(conn, course, "#14:12", function(e1, r1) {
                if (e1) console.log(e1);
                console.log(r1);
                done();
            })
        })
    })
});
