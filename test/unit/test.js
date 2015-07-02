'use strict';

var getApp = require('./main');
describe('All', function() {
    var app;

    before(function(done) {
        getApp(function(err, a) {
            app = a;
            done(err);
        })
    });

    describe("Vertices", function() {

        describe("v", function() {

            it("Should be correct!", function(done) {
                app.models.vertex2.v("id", "#13:148", function(e1, r1) {
                    if (e1) console.log(e1);
                    else {
                        console.log(r1);
                        done();
                    }
                })
            })

            it("Should get a WARN!", function(done) {
                app.models.vertex2.v("id", "#13:666", function(e1, r1) {
                    if (e1 || !r1) console.log(e1);
                    else {
                        console.log(r1);
                        done();
                    }
                })
            })
        })
        describe("Paths", function() {

            it("shortestPath", function(done) {
                app.models.vertex1.shortestPath("#12:0", "#13:148", 6, function(e1, r1) {
                    if (e1 || !r1) console.log(e1);
                    else {
                        console.log(r1);
                        done();
                    }
                })
            })
            it("linkBoth", function(done) {
                app.models.vertex1.linkBoth("#12:0", "relationship", ["#12:1", "#12:2"], function(e1, r1) {
                    if (e1 || !r1) console.log(e1);
                    else {
                        console.log(r1);
                        done();
                    }
                })
            })
        })
    });

    describe("Edges", function() {


        describe("Nested requests", function() {

            it("E", function(done) {
                app.models.relationship.E(function(e1, r1) {
                    app.models.relationship.count(r1, function(err, res) {
                        if (err) console.log(err)
                        else {
                            done();
                            console.log(res);
                        }
                    })

                })
            });
            it("getProperties", function(done) {
                app.models.vertex2.getProperties("#13:151", function(e1, r1) {
                    if (e1 || !r1) console.log(e1);
                    else {
                        //console.log(r1);
                        done();
                    }
                })
            })
        })
        describe("IN/OUT EXAMPLES", function() {

            it("both Vertex", function(done) {
                app.models.vertex1.bothV('id','#12:1',function(e1, r1) {
                    if (e1) console.log(e1)
                    else {
                        console.log(r1);
                        done();
                    }

                })
            });
            it("both Edges", function(done) {
                app.models.vertex1.bothE('id','#12:0', function(e1, r1) {
                    if (e1 || !r1) console.log(e1);
                    else {
                        console.log(r1);
                        done();
                    }
                })
            })
        })
    });
});
