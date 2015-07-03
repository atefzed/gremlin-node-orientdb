'use strict';


/**
 * Test dependencies
 */
var getApp = require('./main');

var chai = require('chai'),
    expect = chai.expect,
    should = chai.should();

/**
 * This test only works when the db has been generated using gen-db.js
 */
describe('', function() {

    var app;

    before(function(done) {
        getApp(function(err, a) {
            app = a;
            done(err);
        });
    });

    describe("TEST OF: Vertices", function() {

        xdescribe("METHOD: v", function() {
            it("should return a WARN message: 'Cannot use Vertex's methods!' When The relationship model is using Vertex's methods.", function(done) {
                app.models.relationship.v("id", "#0:0", function(e1, r1) {
                    e1.name.should.equal("WARN");
                    e1.message.should.equal("Cannot use Vertex's methods!");
                    done();
                });
            });

            it("should throw an error when there is no argument.", function() {
                expect(function() {
                    app.models.vertex1.v();
                }).to.throw();
            });

            it("should return an ERROR message: 'Some arguments are missing!' When only there is only a callback.", function(done) {
                app.models.vertex1.v(function(e1, r1) {
                    e1.name.should.equal("ERROR");
                    e1.message.should.equal("Some arguments are missing!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG1 isn't string.", function(done) {
                app.models.vertex1.v(5, 'a', function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 and ARG2 must be strings!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ARG1 and ARG2 must be string!' When ARG2 isn't string", function(done) {
                app.models.vertex1.v('a', 5, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 and ARG2 must be strings!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ARG3 must be string!' When ARG3 isn't string", function(done) {
                app.models.vertex1.v('a', 'a', 5, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG3 must be string!");
                    done();
                });
            });

            it("should return an INFO message: 'Not Found!' When The input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    app.models.vertex2.v("id", r1[0]._id, function(e2, r2) {
                        e2.name.should.equal("INFO");
                        e2.message.should.equal("Not found!");
                        done();
                    });
                });
            });

            it("should return a VALIDATION message: 'ID's format is invalid!' When ID's format is wrong.", function(done) {
                app.models.vertex1.v("id", "wrong_id_format", function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ID's format is invalid!");
                    done();
                });
            });

            it("should return an object when The input ID exists.", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    app.models.vertex1.v("id", r1[0]._id, function(e2, r2) {
                        should.exist(r1[0]._id);
                        done();
                    });
                });
            });

            it("should return an ERROR message: 'Query returns more than 1 row!' When ID's format is wrong.", function(done) {
                app.models.vertex1.v("firstname", "test", function(e1, r1) {
                    e1.name.should.equal("ERROR");
                    e1.message.should.equal("Query returns more than 1 row!");
                    done();
                });
            });
        });

        xdescribe("METHOD: V", function() {
            it("should throw an error when there is no argument.", function() {
                expect(function() {
                    app.models.vertex1.V();
                }).to.throw();
            });

            it("should return an array of Vertex1 when the 'all' argument isn't set.", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    should.not.exist(e1);
                    (r1 instanceof Array).should.be.true;
                    done();
                });
            });

            it("should return an array of Vertex1 when the 'all' argument is set to 0.", function(done) {
                app.models.vertex1.V(0, function(e1, r1) {
                    should.not.exist(e1);
                    (r1 instanceof Array).should.be.true;
                    done();
                });
            });

            it("should return an array of Vertex1 when the 'all' argument is set to 1.", function(done) {
                app.models.vertex1.V(1, function(e1, r1) {
                    should.not.exist(e1);
                    (r1 instanceof Array).should.be.true;
                    done();
                });
            });
        });

        xdescribe("METHOD: inV", function() {
            it("should return a WARN message: 'Cannot use Vertex's methods!' When The relationship model is using Vertex's methods.", function(done) {
                app.models.relationship.inV("id", "#0:0", function(e1, r1) {
                    e1.name.should.equal("WARN");
                    e1.message.should.equal("Cannot use Vertex's methods!");
                    done();
                });
            });

            it("should throw an error when there is no argument.", function() {
                expect(function() {
                    app.models.vertex1.inV();
                }).to.throw();
            });

            it("should return an ERROR message: 'Some arguments are missing!' When there is only a callback.", function(done) {
                app.models.vertex1.inV(function(e1, r1) {
                    e1.name.should.equal("ERROR");
                    e1.message.should.equal("Some arguments are missing!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG1 isn't string.", function(done) {
                app.models.vertex1.inV(5, 'a', function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 and ARG2 must be strings!");
                    done();
                });
            });


            it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG2 isn't string.", function(done) {
                app.models.vertex1.inV('a', 5, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 and ARG2 must be strings!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ID's format is invalid!' When ID's format is wrong.", function(done) {
                app.models.vertex1.inV('id', 'wrong_id_format', function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ID's format is invalid!");
                    done();
                });
            });

            it("should return an INFO message: 'Not Found!' When The input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    app.models.vertex2.inV("id", r1[0]._id, function(e2, r2) {
                        e2.name.should.equal("INFO");
                        e2.message.should.equal("Not found!");
                        done();
                    });
                });
            });

            it("should return an array of Vertex1 when input arguments are correctly set.", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    app.models.vertex1.inV('id', r1[0]._id, function(e2, r2) {
                        should.not.exist(e1);
                        should.not.exist(e2);
                        (r2 instanceof Array).should.be.true;
                        done();
                    });
                });
            });
        });

        xdescribe("METHOD: outV", function() {
            it("should return a WARN message: 'Cannot use Vertex's methods!' When The relationship model is using Vertex's methods.", function(done) {
                app.models.relationship.outV("id", "#0:0", function(e1, r1) {
                    e1.name.should.equal("WARN");
                    e1.message.should.equal("Cannot use Vertex's methods!");
                    done();
                });
            });

            it("should throw an error when there is no argument.", function() {
                expect(function() {
                    app.models.vertex1.outV();
                }).to.throw();
            });

            it("should return an ERROR message: 'Some arguments are missing!' When there is only a callback.", function(done) {
                app.models.vertex1.outV(function(e1, r1) {
                    e1.name.should.equal("ERROR");
                    e1.message.should.equal("Some arguments are missing!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG1 isn't string.", function(done) {
                app.models.vertex1.outV(5, 'a', function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 and ARG2 must be strings!");
                    done();
                });
            });


            it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG2 isn't string.", function(done) {
                app.models.vertex1.outV('a', 5, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 and ARG2 must be strings!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ID's format is invalid!' When ID's format is wrong.", function(done) {
                app.models.vertex1.outV('id', 'wrong_id_format', function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ID's format is invalid!");
                    done();
                });
            });

            it("should return an INFO message: 'Not Found!' When The input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    app.models.vertex2.outV("id", r1[0]._id, function(e2, r2) {
                        e2.name.should.equal("INFO");
                        e2.message.should.equal("Not found!");
                        done();
                    });
                });
            });

            it("should return an array of Vertex1 when input arguments are correctly set.", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    app.models.vertex1.outV('id', r1[0]._id, function(e2, r2) {
                        should.not.exist(e1);
                        should.not.exist(e2);
                        (r2 instanceof Array).should.be.true;
                        done();
                    });
                });
            });
        });

        xdescribe("METHOD: bothV", function() {
            it("should return a WARN message: 'Cannot use Vertex's methods!' When The relationship model is using Vertex's methods.", function(done) {
                app.models.relationship.bothV("id", "#0:0", function(e1, r1) {
                    e1.name.should.equal("WARN");
                    e1.message.should.equal("Cannot use Vertex's methods!");
                    done();
                });
            });

            it("should throw an error when there is no argument.", function() {
                expect(function() {
                    app.models.vertex1.bothV();
                }).to.throw();
            });

            it("should return an ERROR message: 'Some arguments are missing!' When there is only a callback.", function(done) {
                app.models.vertex1.bothV(function(e1, r1) {
                    e1.name.should.equal("ERROR");
                    e1.message.should.equal("Some arguments are missing!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG1 isn't string.", function(done) {
                app.models.vertex1.bothV(5, 'a', function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 and ARG2 must be strings!");
                    done();
                });
            });


            it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG2 isn't string.", function(done) {
                app.models.vertex1.bothV('a', 5, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 and ARG2 must be strings!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ID's format is invalid!' When ID's format is wrong.", function(done) {
                app.models.vertex1.bothV('id', 'wrong_id_format', function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ID's format is invalid!");
                    done();
                });
            });

            it("should return an INFO message: 'Not Found!' When The input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    app.models.vertex2.bothV("id", r1[0]._id, function(e2, r2) {
                        e2.name.should.equal("INFO");
                        e2.message.should.equal("Not found!");
                        done();
                    });
                });
            });

            it("should return an array of Vertex1 when input arguments are correctly set.", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    app.models.vertex1.bothV('id', r1[0]._id, function(e2, r2) {
                        should.not.exist(e1);
                        should.not.exist(e2);
                        (r2 instanceof Array).should.be.true;
                        done();
                    });
                });
            });
        });

        xdescribe("METHOD: inE", function() {
            it("should return a WARN message: 'Cannot use Vertex's methods!' When The relationship model is using Vertex's methods.", function(done) {
                app.models.relationship.inE("id", "#0:0", function(e1, r1) {
                    e1.name.should.equal("WARN");
                    e1.message.should.equal("Cannot use Vertex's methods!");
                    done();
                });
            });

            it("should throw an error when there is no argument.", function() {
                expect(function() {
                    app.models.vertex1.inE();
                }).to.throw();
            });

            it("should return an ERROR message: 'Some arguments are missing!' When there is only a callback.", function(done) {
                app.models.vertex1.inE(function(e1, r1) {
                    e1.name.should.equal("ERROR");
                    e1.message.should.equal("Some arguments are missing!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG1 isn't string.", function(done) {
                app.models.vertex1.inE(5, 'a', function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 and ARG2 must be strings!");
                    done();
                });
            });


            it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG2 isn't string.", function(done) {
                app.models.vertex1.inE('a', 5, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 and ARG2 must be strings!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ID's format is invalid!' When ID's format is wrong.", function(done) {
                app.models.vertex1.inE('id', 'wrong_id_format', function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ID's format is invalid!");
                    done();
                });
            });

            it("should return an INFO message: 'Not Found!' When The input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    app.models.vertex2.inE("id", r1[0]._id, function(e2, r2) {
                        e2.name.should.equal("INFO");
                        e2.message.should.equal("Not found!");
                        done();
                    });
                });
            });

            it("should return an array of Vertex1 when input arguments are correctly set.", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    app.models.vertex1.inE('id', r1[0]._id, function(e2, r2) {
                        should.not.exist(e1);
                        should.not.exist(e2);
                        (r2 instanceof Array).should.be.true;
                        done();
                    });
                });
            });
        });
    });

    xdescribe("METHOD: outE", function() {
        it("should return a WARN message: 'Cannot use Vertex's methods!' When The relationship model is using Vertex's methods.", function(done) {
            app.models.relationship.outE("id", "#0:0", function(e1, r1) {
                e1.name.should.equal("WARN");
                e1.message.should.equal("Cannot use Vertex's methods!");
                done();
            });
        });

        it("should throw an error when there is no argument.", function() {
            expect(function() {
                app.models.vertex1.inE();
            }).to.throw();
        });

        it("should return an ERROR message: 'Some arguments are missing!' When there is only a callback.", function(done) {
            app.models.vertex1.outE(function(e1, r1) {
                e1.name.should.equal("ERROR");
                e1.message.should.equal("Some arguments are missing!");
                done();
            });
        });

        it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG1 isn't string.", function(done) {
            app.models.vertex1.outE(5, 'a', function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ARG1 and ARG2 must be strings!");
                done();
            });
        });


        it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG2 isn't string.", function(done) {
            app.models.vertex1.outE('a', 5, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ARG1 and ARG2 must be strings!");
                done();
            });
        });

        it("should return a VALIDATION message: 'ID's format is invalid!' When ID's format is wrong.", function(done) {
            app.models.vertex1.outE('id', 'wrong_id_format', function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ID's format is invalid!");
                done();
            });
        });

        it("should return an INFO message: 'Not Found!' When The input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
            app.models.vertex1.V(function(e1, r1) {
                app.models.vertex2.outE("id", r1[0]._id, function(e2, r2) {
                    e2.name.should.equal("INFO");
                    e2.message.should.equal("Not found!");
                    done();
                });
            });
        });

        it("should return an array of Vertex1 when input arguments are correctly set.", function(done) {
            app.models.vertex1.V(function(e1, r1) {
                app.models.vertex1.outE('id', r1[0]._id, function(e2, r2) {
                    should.not.exist(e1);
                    should.not.exist(e2);
                    (r2 instanceof Array).should.be.true;
                    done();
                });
            });
        });
    });

    describe("METHOD: bothE", function() {
        it("should return a WARN message: 'Cannot use Vertex's methods!' When The relationship model is using Vertex's methods.", function(done) {
            app.models.relationship.bothE("id", "#0:0", function(e1, r1) {
                e1.name.should.equal("WARN");
                e1.message.should.equal("Cannot use Vertex's methods!");
                done();
            });
        });

        it("should throw an error when there is no argument.", function() {
            expect(function() {
                app.models.vertex1.bothE();
            }).to.throw();
        });

        it("should return an ERROR message: 'Some arguments are missing!' When there is only a callback.", function(done) {
            app.models.vertex1.bothE(function(e1, r1) {
                e1.name.should.equal("ERROR");
                e1.message.should.equal("Some arguments are missing!");
                done();
            });
        });

        it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG1 isn't string.", function(done) {
            app.models.vertex1.bothE(5, 'a', function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ARG1 and ARG2 must be strings!");
                done();
            });
        });


        it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG2 isn't string.", function(done) {
            app.models.vertex1.bothE('a', 5, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ARG1 and ARG2 must be strings!");
                done();
            });
        });

        it("should return a VALIDATION message: 'ID's format is invalid!' When ID's format is wrong.", function(done) {
            app.models.vertex1.bothE('id', 'wrong_id_format', function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ID's format is invalid!");
                done();
            });
        });

        it("should return an INFO message: 'Not Found!' When The input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
            app.models.vertex1.V(function(e1, r1) {
                app.models.vertex2.bothE("id", r1[0]._id, function(e2, r2) {
                    e2.name.should.equal("INFO");
                    e2.message.should.equal("Not found!");
                    done();
                });
            });
        });

        it("should return an array of Vertex1 when input arguments are correctly set.", function(done) {
            app.models.vertex1.V(function(e1, r1) {
                app.models.vertex1.bothE('id', r1[0]._id, function(e2, r2) {
                    should.not.exist(e1);
                    should.not.exist(e2);
                    (r2 instanceof Array).should.be.true;
                    done();
                });
            });
        });
    });
});
