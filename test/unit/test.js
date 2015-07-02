'use strict';

/**
 * Test dependencies
 */
var getApp = require('./main');

/**
 * To make this test works, the gen-db.js file must be executed!
 */
describe('', function() {

    var app;

    before(function(done) {
        getApp(function(err, a) {
            app = a;
            done(err);
        })
    });

    describe("TEST OF: Vertices", function() {
        describe("METHOD: v", function() {

            it("Should get a WARN message: Cannot use Vertex's methods! Cause: The relationship model is using Vertex's methods.", function(done) {
                app.models.relationship.v("id", "#0:0", function(e1, r1) {
                    // if (e1) console.log(e1);
                    // else console.log(r1);
                    done();
                })
            })

            it("Should get a VALIDATION message: Some arguments are missing!", function(done) {
                app.models.vertex1.v(function(e1, r1) {
                    // if (e1) console.log(e1);
                    // else console.log(r1);
                    done();
                })
            })

            it("Should get a VALIDATION message: ARG1 must be strings!", function(done) {
                app.models.vertex1.v(5, 'a', function(e1, r1) {
                    // if (e1) console.log(e1);
                    // else console.log(r1);
                    done();
                })
            })

            it("Should get a VALIDATION message: ARG2 must be string!", function(done) {
                app.models.vertex1.v('a', 5, function(e1, r1) {
                    // if (e1) console.log(e1);
                    // else console.log(r1);
                    done();
                })
            })

            it("Should get a VALIDATION message: ARG3 must be string!", function(done) {
                app.models.vertex1.v('a', 'a', 5, function(e1, r1) {
                    // if (e1) console.log(e1);
                    // else console.log(r1);
                    done();
                })
            })

            it("Should get an INFO message: Not Found! Cause: The input ID doesn't exist!", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    // if (e1) console.log(e1);
                    app.models.vertex1.v("id", r1[0]._id, function(e2, r2) {
                        // if (e2) console.log(e2);
                        // else console.log(r2);
                        done();
                    })
                });
            })

            it("Should get an INFO message: Not Found! Cause: The input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    // if (e1) console.log(e1);
                    app.models.vertex2.v("id", r1[0]._id, function(e2, r2) {
                        // if (e2) console.log(e2);
                        // else console.log(r2);
                        done();
                    })
                });
            })

            it("Should get a VALIDATION message: ID's format is invalid! Cause: ID's format is wrong!", function(done) {
                app.models.vertex1.v("id", "wrong_id_format", function(e1, r1) {
                    // if (e1) console.log(e1);
                    // else console.log(r1);
                    done();
                })
            })

            it("Should return an object: The input ID exists.", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    // if (e1) console.log(e1);
                    app.models.vertex1.v("id", r1[0]._id, function(e2, r2) {
                        // if (e2) console.log(e2);
                        // else console.log(r1[0]._id);
                        done();

                    })
                });
            })

            it("Should get a VALIDATION message: ID's format is invalid! Cause: ID's format is wrong.", function(done) {
                app.models.vertex1.v("id", "wrong_id_format", function(e1, r1) {
                    // if (e1) console.log(e1);
                    // else console.log(r1);
                    done();
                })
            })

            it("Should get an ERROR message: Query returns more than 1 row! Cause: ID's format is wrong.", function(done) {
                app.models.vertex1.v("firstname", "test", function(e1, r1) {
                    // if (e1) console.log(e1);
                    // else console.log(r1);
                    done();
                })
            })
        })
    });
});
