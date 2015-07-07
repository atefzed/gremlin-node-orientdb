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
        describe("METHOD: v", function() {
            it("should return a WARN message: 'Cannot use Vertex's methods!' When the relationship model is using Vertex's methods.", function(done) {
                app.models.relationship.v({
                    "id": "#0:0"
                }, function(e1, r1) {
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

            it("should return an ERROR message: 'Some arguments are missing!' When there is only a callback.", function(done) {
                app.models.vertex1.v(function(e1, r1) {
                    e1.name.should.equal("ERROR");
                    e1.message.should.equal("Some arguments are missing!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ARG1's key must be a string!' When ARG1 isn't string.", function(done) {
                app.models.vertex1.v({
                    5: 'a'
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1's key must be a string!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ARG3 must be a string!' When ARG3 isn't string", function(done) {
                app.models.vertex1.v({
                    'a': 'a'
                }, 5, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG3 must be a string!");
                    done();
                });
            });

            xit("should return an INFO message: 'Not Found!' When the input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    app.models.vertex2.v({
                        "id": r1[0]._id
                    }, function(e2, r2) {
                        e2.name.should.equal("INFO");
                        e2.message.should.equal("Not found!");
                        done();
                    });
                });
            });

            it("should return a VALIDATION message: 'ID's format is invalid!' When ID's format is wrong.", function(done) {
                app.models.vertex1.v({
                    "id": "wrong_id_format"
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ID's format is invalid!");
                    done();
                });
            });

            xit("should return an object when the input ID exists.", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    app.models.vertex1.v({
                        "id": r1[0]._id
                    }, function(e2, r2) {
                        should.exist(r1[0]._id);
                        done();
                    });
                });
            });

            xit("should return an ERROR message: 'Query returns more than 1 row!' When ID's format is wrong.", function(done) {
                app.models.vertex1.v({
                    "firstname": "test"
                }, function(e1, r1) {
                    e1.name.should.equal("ERROR");
                    e1.message.should.equal("Query returns more than 1 row!");
                    done();
                });
            });
        });

        describe("METHOD: V", function() {
            it("should throw an error when there is no argument.", function() {
                expect(function() {
                    app.models.vertex1.V();
                }).to.throw();
            });

            xit("should return an array of Vertex1 when the 'all' argument isn't set.", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    should.not.exist(e1);
                    (r1 instanceof Array).should.be.true;
                    done();
                });
            });

            xit("should return an array of Vertex1 when the 'all' argument is set to 0.", function(done) {
                app.models.vertex1.V(0, function(e1, r1) {
                    should.not.exist(e1);
                    (r1 instanceof Array).should.be.true;
                    done();
                });
            });

            xit("should return an array of Vertex1 when the 'all' argument is set to 1.", function(done) {
                app.models.vertex1.V(1, function(e1, r1) {
                    should.not.exist(e1);
                    (r1 instanceof Array).should.be.true;
                    done();
                });
            });
        });

        describe("METHOD: inV", function() {
            it("should return a WARN message: 'Cannot use Vertex's methods!' When the relationship model is using Vertex's methods.", function(done) {
                app.models.relationship.inV({
                    "id": "#0:0"
                }, function(e1, r1) {
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

            xit("should return a VALIDATION message: 'ARG1's key must be a string!' When ARG1 isn't string.", function(done) {
                app.models.vertex1.inV({
                    5: 'a'
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1's key must be a string!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ID's format is invalid!' When ID's format is wrong.", function(done) {
                app.models.vertex1.inV({
                    'id': 'wrong_id_format'
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ID's format is invalid!");
                    done();
                });
            });

            xit("should return an INFO message: 'Not Found!' When the input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    app.models.vertex2.inV({
                        "id": r1[0]._id
                    }, function(e2, r2) {
                        e2.name.should.equal("INFO");
                        e2.message.should.equal("Not found!");
                        done();
                    });
                });
            });

            xit("should return an array of Vertex1 when input arguments are correctly set.", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    app.models.vertex1.inV({
                        'id': r1[0]._id
                    }, function(e2, r2) {
                        should.not.exist(e1);
                        should.not.exist(e2);
                        (r1 instanceof Array).should.be.true;
                        (r2 instanceof Array).should.be.true;
                        done();
                    });
                });
            });
        });

        describe("METHOD: outV", function() {
            xit("should return a WARN message: 'Cannot use Vertex's methods!' When the relationship model is using Vertex's methods.", function(done) {
                app.models.relationship.outV({
                    "id": "#0:0"
                }, function(e1, r1) {
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

            xit("should return a VALIDATION message: 'ARG1's key must be a string!' When ARG1 isn't string.", function(done) {
                app.models.vertex1.outV({
                    5: 'a'
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1's key must be a string!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ID's format is invalid!' When ID's format is wrong.", function(done) {
                app.models.vertex1.outV({
                    'id': 'wrong_id_format'
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ID's format is invalid!");
                    done();
                });
            });

            xit("should return an INFO message: 'Not Found!' When the input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    app.models.vertex2.outV({
                        "id": r1[0]._id
                    }, function(e2, r2) {
                        e2.name.should.equal("INFO");
                        e2.message.should.equal("Not found!");
                        done();
                    });
                });
            });

            xit("should return an array of Vertex1 when input arguments are correctly set.", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    app.models.vertex1.outV({
                        'id': r1[0]._id
                    }, function(e2, r2) {
                        should.not.exist(e1);
                        should.not.exist(e2);
                        (r1 instanceof Array).should.be.true;
                        (r2 instanceof Array).should.be.true;
                        done();
                    });
                });
            });
        });

        describe("METHOD: bothV", function() {
            it("should return a WARN message: 'Cannot use Vertex's methods!' When the relationship model is using Vertex's methods.", function(done) {
                app.models.relationship.bothV({
                    "id": "#0:0"
                }, function(e1, r1) {
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

            xit("should return an ERROR message: 'Some arguments are missing!' When there is only a callback.", function(done) {
                app.models.vertex1.bothV(function(e1, r1) {
                    e1.name.should.equal("ERROR");
                    e1.message.should.equal("Some arguments are missing!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ARG1's key must be a string!' When ARG1 isn't string.", function(done) {
                app.models.vertex1.bothV({
                    5: 'a'
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1's key must be a string!");
                    done();
                });
            });

            xit("should return a VALIDATION message: 'ID's format is invalid!' When ID's format is wrong.", function(done) {
                app.models.vertex1.bothV({
                    'id': 'wrong_id_format'
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ID's format is invalid!");
                    done();
                });
            });

            xit("should return an INFO message: 'Not Found!' When the input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    app.models.vertex2.bothV({
                        "id": r1[0]._id
                    }, function(e2, r2) {
                        e2.name.should.equal("INFO");
                        e2.message.should.equal("Not found!");
                        done();
                    });
                });
            });

            xit("should return an array of Vertex1 when input arguments are correctly set.", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    app.models.vertex1.bothV({
                        'id': r1[0]._id
                    }, function(e2, r2) {
                        should.not.exist(e1);
                        should.not.exist(e2);
                        (r1 instanceof Array).should.be.true;
                        (r2 instanceof Array).should.be.true;
                        done();
                    });
                });
            });
        });

        describe("METHOD: inE", function() {
            xit("should return a WARN message: 'Cannot use Vertex's methods!' When the relationship model is using Vertex's methods.", function(done) {
                app.models.relationship.inE({
                    "id": "#0:0"
                }, function(e1, r1) {
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

            xit("should return an ERROR message: 'Some arguments are missing!' When there is only a callback.", function(done) {
                app.models.vertex1.inE(function(e1, r1) {
                    e1.name.should.equal("ERROR");
                    e1.message.should.equal("Some arguments are missing!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ARG1's key must be a string!' When ARG1 isn't string.", function(done) {
                app.models.vertex1.inE({
                    5: 'a'
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1's key must be a string!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ID's format is invalid!' When ID's format is wrong.", function(done) {
                app.models.vertex1.inE({
                    'id': 'wrong_id_format'
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ID's format is invalid!");
                    done();
                });
            });

            xit("should return an INFO message: 'Not Found!' When the input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    app.models.vertex2.inE({
                        "id": r1[0]._id
                    }, function(e2, r2) {
                        e2.name.should.equal("INFO");
                        e2.message.should.equal("Not found!");
                        done();
                    });
                });
            });

            xit("should return an array of Vertex1 when input arguments are correctly set.", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    app.models.vertex1.inE({
                        'id': r1[0]._id
                    }, function(e2, r2) {
                        should.not.exist(e1);
                        should.not.exist(e2);
                        (r1 instanceof Array).should.be.true;
                        (r2 instanceof Array).should.be.true;
                        done();
                    });
                });
            });
        });
    });

    describe("METHOD: outE", function() {
        it("should return a WARN message: 'Cannot use Vertex's methods!' When the relationship model is using Vertex's methods.", function(done) {
            app.models.relationship.outE({
                "id": "#0:0"
            }, function(e1, r1) {
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

        xit("should return an ERROR message: 'Some arguments are missing!' When there is only a callback.", function(done) {
            app.models.vertex1.outE(function(e1, r1) {
                e1.name.should.equal("ERROR");
                e1.message.should.equal("Some arguments are missing!");
                done();
            });
        });

        it("should return a VALIDATION message: 'ARG1's key must be a string!' When ARG1 isn't string.", function(done) {
            app.models.vertex1.outE({
                5: 'a'
            }, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ARG1's key must be a string!");
                done();
            });
        });

        xit("should return a VALIDATION message: 'ID's format is invalid!' When ID's format is wrong.", function(done) {
            app.models.vertex1.outE({
                'id': 'wrong_id_format'
            }, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ID's format is invalid!");
                done();
            });
        });

        xit("should return an INFO message: 'Not Found!' When the input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
            app.models.vertex1.V(function(e1, r1) {
                app.models.vertex2.outE({
                    "id": r1[0]._id
                }, function(e2, r2) {
                    e2.name.should.equal("INFO");
                    e2.message.should.equal("Not found!");
                    done();
                });
            });
        });

        xit("should return an array of Vertex1 when input arguments are correctly set.", function(done) {
            app.models.vertex1.V(function(e1, r1) {
                app.models.vertex1.outE({
                    'id': r1[0]._id
                }, function(e2, r2) {
                    should.not.exist(e1);
                    should.not.exist(e2);
                    (r1 instanceof Array).should.be.true;
                    (r2 instanceof Array).should.be.true;
                    done();
                });
            });
        });
    });

    describe("METHOD: bothE", function() {
        xit("should return a WARN message: 'Cannot use Vertex's methods!' When the relationship model is using Vertex's methods.", function(done) {
            app.models.relationship.bothE({
                "id": "#0:0"
            }, function(e1, r1) {
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

        xit("should return an ERROR message: 'Some arguments are missing!' When there is only a callback.", function(done) {
            app.models.vertex1.bothE(function(e1, r1) {
                e1.name.should.equal("ERROR");
                e1.message.should.equal("Some arguments are missing!");
                done();
            });
        });

        it("should return a VALIDATION message: 'ARG1's key must be a string!' When ARG1 isn't string.", function(done) {
            app.models.vertex1.bothE({
                5: 'a'
            }, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ARG1's key must be a string!");
                done();
            });
        });

        xit("should return a VALIDATION message: 'ID's format is invalid!' When ID's format is wrong.", function(done) {
            app.models.vertex1.bothE({
                'id': 'wrong_id_format'
            }, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ID's format is invalid!");
                done();
            });
        });

        xit("should return an INFO message: 'Not Found!' When the input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
            app.models.vertex1.V(function(e1, r1) {
                app.models.vertex2.bothE({
                    "id": r1[0]._id
                }, function(e2, r2) {
                    e2.name.should.equal("INFO");
                    e2.message.should.equal("Not found!");
                    done();
                });
            });
        });

        xit("should return an array of Vertex1 when input arguments are correctly set.", function(done) {
            app.models.vertex1.V(function(e1, r1) {
                app.models.vertex1.bothE({
                    'id': r1[0]._id
                }, function(e2, r2) {
                    should.not.exist(e1);
                    should.not.exist(e2);
                    (r1 instanceof Array).should.be.true;
                    (r2 instanceof Array).should.be.true;
                    done();
                });
            });
        });
    });

    describe("METHOD: has", function() {
        it("should throw an error when there is no argument.", function() {
            expect(function() {
                app.models.vertex1.has();
            }).to.throw();
        });

        it("should return an ERROR message: 'Some arguments are missing!' When there is only a callback.", function(done) {
            app.models.vertex1.has(function(e1, r1) {
                e1.name.should.equal("ERROR");
                e1.message.should.equal("Some arguments are missing!");
                done();
            });
        });

        it("should return a VALIDATION message: 'ARG1's key must be a string!' When ARG1 isn't string.", function(done) {
            app.models.vertex1.has({
                5: 'a'
            }, 'vertex', function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ARG1's key must be a string!");
                done();
            });
        });

        it("should return a VALIDATION message: 'ARG2 must take as value 'vertex', 'edge' or 'all'!' When type isn't equal to those values.", function(done) {
            app.models.vertex1.has({
                'class': 'vertex1'
            }, 'wrong_value', function(e2, r2) {
                e2.name.should.equal("VALIDATION");
                e2.message.should.equal("ARG2 must take as value 'vertex', 'edge' or 'all'!");
                done();
            });
        });
    });

    describe("METHOD: hasNot", function() {
        it("should throw an error when there is no argument.", function() {
            expect(function() {
                app.models.vertex1.hasNot();
            }).to.throw();
        });

        it("should return an ERROR message: 'Some arguments are missing!' When there is only a callback.", function(done) {
            app.models.vertex1.hasNot(function(e1, r1) {
                e1.name.should.equal("ERROR");
                e1.message.should.equal("Some arguments are missing!");
                done();
            });
        });

        it("should return a VALIDATION message: 'ARG1's key must be a string!' When ARG1 isn't string.", function(done) {
            app.models.vertex1.hasNot({
                5: 'a'
            }, 'b', function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ARG1's key must be a string!");
                done();
            });
        });

        it("should return a VALIDATION message: 'ARG2 must take as value 'vertex', 'edge' or 'all'!' When type isn't equal to 'vertex', 'edge' or 'all'.", function(done) {
            app.models.vertex1.hasNot({
                'class': 'vertex1'
            }, 'wrong_value', function(e2, r2) {
                e2.name.should.equal("VALIDATION");
                e2.message.should.equal("ARG2 must take as value 'vertex', 'edge' or 'all'!");
                done();
            });
        });

        xit("should return an array of objects when input arguments are correctly set.", function(done) {
            app.models.vertex1.V(function(e1, r1) {
                app.models.vertex1.hasNot({
                    'id': r1[0]._id
                }, 'vertex', function(e2, r2) {
                    should.not.exist(e1);
                    should.not.exist(e2);
                    (r1 instanceof Array).should.be.true;
                    (r2 instanceof Array).should.be.true;
                    done();
                });
            });
        });
    });

    describe("METHOD: removeVertex", function() {
        it("should throw an error when there is no argument.", function() {
            expect(function() {
                app.models.vertex1.removeVertex();
            }).to.throw();
        });

        it("should return an ERROR message: 'Some arguments are missing!' When there is only a callback.", function(done) {
            app.models.vertex1.removeVertex(function(e1, r1) {
                e1.name.should.equal("ERROR");
                e1.message.should.equal("Some arguments are missing!");
                done();
            });
        });

        xit("should return a VALIDATION message: 'ARG1's key must be a string!' When ARG1 isn't string.", function(done) {
            app.models.vertex1.removeVertex({
                5: 'a'
            }, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ARG1's key must be a string!");
                done();
            });
        });

        xit("should return a VALIDATION message: 'ID's format is invalid!' When ID's format is wrong.", function(done) {
            app.models.vertex1.removeVertex({
                "id": "wrong_id_format"
            }, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ID's format is invalid!");
                done();
            });
        });

        xit("should return an object when input arguments are correctly set.", function(done) {
            app.models.vertex1.V(function(e1, r1) {
                app.models.vertex1.removeVertex({
                    'id': r1[0]._id
                }, function(e2, r2) {
                    should.not.exist(e1);
                    should.not.exist(e2);
                    (r1 instanceof Array).should.be.true;
                    (typeof r2 === 'object').should.be.true;
                    done();
                });
            });
        });
    });
    describe("TEST OF: Edges", function() {
        describe("METHOD: e", function() {
            xit("should return a WARN message: 'Cannot use Edge's methods!' When the vertex1 model is using Edge's methods.", function(done) {
                app.models.vertex1.e({
                    "id": "#0:0"
                }, function(e1, r1) {
                    e1.name.should.equal("WARN");
                    e1.message.should.equal("Cannot use Edge's methods!");
                    done();
                });
            });

            it("should throw an error when there is no argument.", function() {
                expect(function() {
                    app.models.relationship.e();
                }).to.throw();
            });

            it("should return an ERROR message: 'Some arguments are missing!' When there is only a callback.", function(done) {
                app.models.relationship.e(function(e1, r1) {
                    e1.name.should.equal("ERROR");
                    e1.message.should.equal("Some arguments are missing!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ARG1's key must be a string!' When ARG1 isn't string.", function(done) {
                app.models.relationship.e({
                    5: 'a'
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1's key must be a string!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ID's format is invalid!' When ID's format is wrong.", function(done) {
                app.models.relationship.e({
                    "id": "wrong_id_format"
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ID's format is invalid!");
                    done();
                });
            });

            it("should return an object when the input ID exists.", function(done) {
                app.models.relationship.E(function(e1, r1) {
                    if (r1 && r1.length !== 0) {
                        app.models.relationship.e({
                            "id": r1[0]._id
                        }, function(e2, r2) {
                            should.exist(r2._id);
                            done();
                        });
                    } else done();
                });
            });

            it("should return an ERROR message: 'Query returns more than 1 row!' When ID's format is wrong.", function(done) {
                app.models.relationship.e({
                    "@class": "relationship"
                }, function(e1, r1) {
                    e1.name.should.equal("ERROR");
                    e1.message.should.equal("Query returns more than 1 row!");
                    done();
                });
            });
        });

        describe("METHOD: E", function() {
            it("should throw an error when there is no argument.", function() {
                expect(function() {
                    app.models.relationship.E();
                }).to.throw();
            });

            it("should return an array of Relationship.", function(done) {
                app.models.relationship.E(function(e1, r1) {
                    should.not.exist(e1);
                    (r1 instanceof Array).should.be.true;
                    done();
                });
            });
        });
    });
});
