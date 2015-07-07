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

            it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG1 isn't string.", function(done) {
                app.models.vertex1.v({
                    5: 'a'
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 and ARG2 must be strings!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ARG1 and ARG2 must be string!' When ARG2 isn't string", function(done) {
                app.models.vertex1.v({
                    'a': 5
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 and ARG2 must be strings!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ARG3 must be string!' When ARG3 isn't string", function(done) {
                app.models.vertex1.v({
                    'a': 'a'
                }, 5, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG3 must be string!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ARG1 must be string!' When ARG1 isn't string.", function(done) {
                app.models.vertex1.v({
                    5: 'a'
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 must be string!");
                    done();
                });
            });

            it("should return an INFO message: 'Not Found!' When The input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
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

            it("should return an object when The input ID exists.", function(done) {
                app.models.vertex1.V(function(e1, r1) {
                    app.models.vertex1.v({
                        "id": r1[0]._id
                    }, function(e2, r2) {
                        should.exist(r1[0]._id);
                        done();
                    });
                });
            });

            it("should return an ERROR message: 'Query returns more than 1 row!' When ID's format is wrong.", function(done) {
                app.models.vertex1.v({
                    "firstname": "test"
                }, function(e1, r1) {
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

            it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG1 isn't string.", function(done) {
                app.models.vertex1.inV({
                    5: 'a'
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 and ARG2 must be strings!");
                    done();
                });
            });


            it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG2 isn't string.", function(done) {
                app.models.vertex1.inV({
                    'a': 5
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 and ARG2 must be strings!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ARG1 must be string!' When ARG1 isn't string.", function(done) {
                app.models.vertex1.inV({
                    5: 'a'
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 must be string!");
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

            it("should return an INFO message: 'Not Found!' When The input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
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

            it("should return an array of Vertex1 when input arguments are correctly set.", function(done) {
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

        xdescribe("METHOD: outV", function() {
            it("should return a WARN message: 'Cannot use Vertex's methods!' When The relationship model is using Vertex's methods.", function(done) {
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

            it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG1 isn't string.", function(done) {
                app.models.vertex1.outV({
                    5: 'a'
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 and ARG2 must be strings!");
                    done();
                });
            });


            it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG2 isn't string.", function(done) {
                app.models.vertex1.outV({
                    'a': 5
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 and ARG2 must be strings!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ARG1 must be string!' When ARG1 isn't string.", function(done) {
                app.models.vertex1.outV({
                    5: 'a'
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 must be string!");
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

            it("should return an INFO message: 'Not Found!' When The input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
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

            it("should return an array of Vertex1 when input arguments are correctly set.", function(done) {
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

        xdescribe("METHOD: bothV", function() {
            it("should return a WARN message: 'Cannot use Vertex's methods!' When The relationship model is using Vertex's methods.", function(done) {
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

            it("should return an ERROR message: 'Some arguments are missing!' When there is only a callback.", function(done) {
                app.models.vertex1.bothV(function(e1, r1) {
                    e1.name.should.equal("ERROR");
                    e1.message.should.equal("Some arguments are missing!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG1 isn't string.", function(done) {
                app.models.vertex1.bothV({
                    5: 'a'
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 and ARG2 must be strings!");
                    done();
                });
            });


            it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG2 isn't string.", function(done) {
                app.models.vertex1.bothV({
                    'a': 5
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 and ARG2 must be strings!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ARG1 must be string!' When ARG1 isn't string.", function(done) {
                app.models.vertex1.bothV({
                    5: 'a'
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 must be string!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ID's format is invalid!' When ID's format is wrong.", function(done) {
                app.models.vertex1.bothV({
                    'id': 'wrong_id_format'
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ID's format is invalid!");
                    done();
                });
            });

            it("should return an INFO message: 'Not Found!' When The input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
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

            it("should return an array of Vertex1 when input arguments are correctly set.", function(done) {
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

        xdescribe("METHOD: inE", function() {
            it("should return a WARN message: 'Cannot use Vertex's methods!' When The relationship model is using Vertex's methods.", function(done) {
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

            it("should return an ERROR message: 'Some arguments are missing!' When there is only a callback.", function(done) {
                app.models.vertex1.inE(function(e1, r1) {
                    e1.name.should.equal("ERROR");
                    e1.message.should.equal("Some arguments are missing!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG1 isn't string.", function(done) {
                app.models.vertex1.inE({
                    5: 'a'
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 and ARG2 must be strings!");
                    done();
                });
            });

            it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG2 isn't string.", function(done) {
                app.models.vertex1.inE({
                    'a': 5
                }, function(e1, r1) {
                    e1.name.should.equal("VALIDATION");
                    e1.message.should.equal("ARG1 and ARG2 must be strings!");
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

            it("should return an INFO message: 'Not Found!' When The input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
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

            it("should return an array of Vertex1 when input arguments are correctly set.", function(done) {
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

    xdescribe("METHOD: outE", function() {
        it("should return a WARN message: 'Cannot use Vertex's methods!' When The relationship model is using Vertex's methods.", function(done) {
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

        it("should return an ERROR message: 'Some arguments are missing!' When there is only a callback.", function(done) {
            app.models.vertex1.outE(function(e1, r1) {
                e1.name.should.equal("ERROR");
                e1.message.should.equal("Some arguments are missing!");
                done();
            });
        });

        it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG1 isn't string.", function(done) {
            app.models.vertex1.outE({
                5: 'a'
            }, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ARG1 and ARG2 must be strings!");
                done();
            });
        });


        it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG2 isn't string.", function(done) {
            app.models.vertex1.outE({
                'a': 5
            }, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ARG1 and ARG2 must be strings!");
                done();
            });
        });

        it("should return a VALIDATION message: 'ID's format is invalid!' When ID's format is wrong.", function(done) {
            app.models.vertex1.outE({
                'id': 'wrong_id_format'
            }, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ID's format is invalid!");
                done();
            });
        });

        it("should return an INFO message: 'Not Found!' When The input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
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

        it("should return an array of Vertex1 when input arguments are correctly set.", function(done) {
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

    xdescribe("METHOD: bothE", function() {
        it("should return a WARN message: 'Cannot use Vertex's methods!' When The relationship model is using Vertex's methods.", function(done) {
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

        it("should return an ERROR message: 'Some arguments are missing!' When there is only a callback.", function(done) {
            app.models.vertex1.bothE(function(e1, r1) {
                e1.name.should.equal("ERROR");
                e1.message.should.equal("Some arguments are missing!");
                done();
            });
        });

        it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG1 isn't string.", function(done) {
            app.models.vertex1.bothE({
                5: 'a'
            }, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ARG1 and ARG2 must be strings!");
                done();
            });
        });


        it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG2 isn't string.", function(done) {
            app.models.vertex1.bothE({
                'a': 5
            }, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ARG1 and ARG2 must be strings!");
                done();
            });
        });

        it("should return a VALIDATION message: 'ID's format is invalid!' When ID's format is wrong.", function(done) {
            app.models.vertex1.bothE({
                'id': 'wrong_id_format'
            }, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ID's format is invalid!");
                done();
            });
        });

        it("should return an INFO message: 'Not Found!' When The input ID exists, but it doesn't belong to the vertex2 class!", function(done) {
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

        it("should return an array of Vertex1 when input arguments are correctly set.", function(done) {
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

    xdescribe("METHOD: has", function() {
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

        it("should return a VALIDATION message: 'ARG1 and ARG3 must be strings!' When ARG1 isn't string.", function(done) {
            app.models.vertex1.has({
                5: 'a'
            }, 'b', function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ARG1 and ARG3 must be strings!");
                done();
            });
        });


        it("should return a VALIDATION message: 'ARG1 and ARG3 must be strings!' When ARG3 isn't string.", function(done) {
            app.models.vertex1.has({
                'a': 5
            }, 6, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ARG1 and ARG3 must be strings!");
                done();
            });
        });

        it("should return a VALIDATION message: 'ARG3 must take as value 'vertex', 'edge' or 'all'!' When type isn't equal to 'vertex', 'edge' or 'all'.", function(done) {
            app.models.vertex1.has('class', 'vertex1', 'wrong_value', function(e2, r2) {
                e2.name.should.equal("VALIDATION");
                e2.message.should.equal("ARG3 must take as value 'vertex', 'edge' or 'all'!");
                done();
            });
        });
    });

    xdescribe("METHOD: hasNot", function() {
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

        it("should return a VALIDATION message: 'ARG1 and ARG3 must be strings!' When ARG1 isn't string.", function(done) {
            app.models.vertex1.hasNot({
                5: 'a'
            }, 'b', function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ARG1 and ARG3 must be strings!");
                done();
            });
        });


        it("should return a VALIDATION message: 'ARG1 and ARG3 must be strings!' When ARG3 isn't string.", function(done) {
            app.models.vertex1.hasNot({
                'a': 5
            }, 6, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ARG1 and ARG3 must be strings!");
                done();
            });
        });

        it("should return a VALIDATION message: 'ARG3 must take as value 'vertex', 'edge' or 'all'!' When type isn't equal to 'vertex', 'edge' or 'all'.", function(done) {
            app.models.vertex1.hasNot('class', 'vertex1', 'wrong_value', function(e2, r2) {
                e2.name.should.equal("VALIDATION");
                e2.message.should.equal("ARG3 must take as value 'vertex', 'edge' or 'all'!");
                done();
            });
        });

        it("should return an array of objects when input arguments are correctly set.", function(done) {
            app.models.vertex1.V(function(e1, r1) {
                app.models.vertex1.hasNot({
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

    xdescribe("METHOD: removeVertex", function() {
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

        it("should return a VALIDATION message: 'ARG1 must be string!' When ARG1 isn't string.", function(done) {
            app.models.vertex1.removeVertex({
                5: 'a'
            }, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ARG1 must be string!");
                done();
            });
        });

        it("should return a VALIDATION message: 'ID's format is invalid!' When ID's format is wrong.", function(done) {
            app.models.vertex1.removeVertex({
                "id": "wrong_id_format"
            }, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ID's format is invalid!");
                done();
            });
        });

        it("should return an object when input arguments are correctly set.", function(done) {
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

    xdescribe("METHOD: removeVertex", function() {
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

        it("should return a VALIDATION message: 'ARG1 must be string!' When ARG1 isn't string.", function(done) {
            app.models.vertex1.removeVertex({
                5: 'a'
            }, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ARG1 must be string!");
                done();
            });
        });

        it("should return a VALIDATION message: 'ID's format is invalid!' When ID's format is wrong.", function(done) {
            app.models.vertex1.removeVertex({
                "id": "wrong_id_format"
            }, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ID's format is invalid!");
                done();
            });
        });

        it("should return an object when input arguments are correctly set.", function(done) {
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

    xdescribe("METHOD: e", function() {
        it("should return a WARN message: 'Cannot use Edge's methods!' When the vertex1 model is using Edge's methods.", function(done) {
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

        it("should return a VALIDATION message: 'ARG1 and ARG2 must be strings!' When ARG1 isn't string.", function(done) {
            app.models.relationship.e({
                5: 'a'
            }, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ARG1 and ARG2 must be strings!");
                done();
            });
        });

        it("should return a VALIDATION message: 'ARG1 and ARG2 must be string!' When ARG2 isn't string", function(done) {
            app.models.relationship.e({
                'a': 5
            }, function(e1, r1) {
                e1.name.should.equal("VALIDATION");
                e1.message.should.equal("ARG1 and ARG2 must be strings!");
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

        it("should return an object when The input ID exists.", function(done) {
            app.models.relationship.E(function(e1, r1) {
                if (r1 && r1.length !== 0) {
                    app.models.relationship.e({
                        "id": r1[0]._id
                    }, function(e2, r2) {
                        should.exist(r1[0]._id);
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

    xdescribe("METHOD: E", function() {
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
    xdescribe("METHOD : loop", function() {


        it("should return an array of path loops.", function(done) {
            app.models.vertex1.loop("#12:0", "loops<3", "firstname=='Jon'", function(e1, r1) {
                console.log(e1,r1)
                should.not.exist(e1)
                should.exist(r1.length);
                done();

            })
        })
        it("should return an error when id is invalid .", function(done) {
            app.models.vertex1.loop("invalid_id", "loops<3", "firstname=='Jon'", function(e1, r1) {
                
                should.exist(e1);
                e1.message.should.be.equal('ID\'s format is invalid!')
                done();

            })
        })
        it("should return an error when id doesn't exists.", function(done) {
            app.models.vertex1.loop("#11:0", "loops<3", "firstname=='Jon'", function(e1, r1) {
                should.exist(e1);
                e1.message.should.be.equal('Not found!')
                done();

            })
        })
        it("should return an error when ARG1 , ARG2 must be strings.", function(done) {
            app.models.vertex1.loop("#12:0", 2, 33, function(e1, r1) {
                should.exist(e1);
                e1.message.should.be.equal('ARG1, ARG2 and ARG3 must be a strings!')
                done();

            })
        })
        it("should return an array of path loops.", function(done) {
            app.models.vertex1.loop("#12:0", "loops<3", "firstname=='Joerzn'", function(e1, r1) {
                console.log(e1,r1)
                should.not.exist(e1);
                (r1.length).should.be.equal(0);
                done();
            })
        })
        it("should throw an error when there is no argument.", function() {
            expect(function() {
                app.models.vertex1.loop();
            }).to.throw();
        });
    });
    xdescribe("METHOD : Shortestpath", function() {

        it("should pass and return an array of paths from #12:1", function(done) {
            app.models.vertex1.shortestPath("#12:0", "#13:151", 3, function(e1, r1) {
                console.log(e1,r1)
                should.not.exist(e1);
                (r1.length >= 0).should.be.true;
                done();
            })
        })
        it("should pass and return an empty array ", function(done) {
            app.models.vertex1.shortestPath("#11:1", "#13:151", 3, function(e1, r1) {
                should.not.exist(e1);
                done();
            })
        })
        it("should throw an error when ARG3 is not a number ", function(done) {
            app.models.vertex1.shortestPath("#11:0", "#13:151", "3a", function(e1, r1) {
                should.exist(e1);
                e1.message.should.be.equal('ARG3 must be number!');
                done();
            })
        })
        it("should throw an error when ARG1 , ARG2  must be strings ", function(done) {
            app.models.vertex1.shortestPath(true, 12, "3a", function(e1, r1) {
                should.exist(e1);
                e1.message.should.be.equal('ARG1 and ARG2 must be a strings!');
                done();
            })
        })
        it("should throw an error when there is no argument.", function() {
            expect(function() {
                app.models.vertex1.shortestPath();
            }).to.throw();
        });


    });
    xdescribe("METHOD : Get Properties", function() {


        it("should return an Array of Properties.", function(done) {
            app.models.vertex1.getProperties("#12:0", function(e1, r1) {
                should.not.exist(e1);
                (r1.length > 0).should.be.true;
                done();
            })
        });

        it("should throw an error when there is no vertex with #11:0 id .  ", function(done) {
            app.models.vertex1.getProperties("#11:0", function(e1, r1) {
                should.exist(e1);
                e1.message.should.be.equal('Not found!');
                done();
            })
        });
        it("should throw an error when missing some argument.", function(done) {
            app.models.vertex1.getProperties(function(e1, r1) {
                should.exist(e1);
                e1.message.should.be.equal('Some arguments are missing!');
                done();
            })
        });
        it("should return an error when id is invalid.", function(done) {
            app.models.vertex1.getProperties('unvalid_id', function(e1, r1) {
                should.exist(e1);
                e1.message.should.be.equal('ID\'s format is invalid!');
                done();
            })
        });
        it("should throw an error when there is no argument.", function() {
            expect(function() {
                app.models.vertex1.getProperties();
            }).to.throw();
        });


    });
        xdescribe("METHOD : Get Property", function() {
        it("should throw an error when there is no argument.", function() {
            expect(function() {
                app.models.vertex1.getProperty();
            }).to.throw();
        });

        it("should return the value of the firstname property.", function(done) {
            app.models.vertex1.getProperty("#12:0", 'firstname', function(e1, r1) {
                should.not.exist(e1);
                (r1.length > 0).should.be.true;
                done();
            })
        })
        it("should return an error when the property is invalid. ", function(done) {
            app.models.vertex1.getProperty("#12:0", 'undefined_property', function(e1, r1) {
                should.exist(e1);
                e1.message.should.be.equal('This property doesn t exist in our model');
                done();
            })
        })
        it("should return an error when some arguments are missing.", function(done) {
            app.models.vertex1.getProperty('firstname', function(e1, r1) {
                should.exist(e1);
                e1.message.should.be.equal('Some arguments are missing!');
                done();
            })
        })
        it("should return an error when id format is invalid.", function(done) {
            app.models.vertex1.getProperty('id_format', 'firstname', function(e1, r1) {
                should.exist(e1);
                e1.message.should.be.equal('ID\'s format is invalid!');
                done();
            })
        })

    });
    xdescribe("METHOD : Get Labels", function() {    
        it("should throw an error when there is no argument.", function() {
            expect(function() {
                app.models.vertex2.getLabels();
            }).to.throw();
        });

        it("should throw an error when ARG1 is not a string.", function(done) {
            app.models.vertex2.getLabels(true, function(e1, r1) {
                should.exist(e1);
                e1.message.should.be.equal('ARG1 must be string!');
                done();
            })
        })

        it("should throw an error when there is some missing arguments.", function(done) {
            app.models.vertex2.getLabels(function(e1, r1) {
                should.exist(e1);
                e1.message.should.be.equal('Some arguments are missing!');
                done();
            })
        })

        it("should return an array of labels of outE. ", function(done) {
            app.models.vertex2.getLabels("#13:1", function(e1, r1) {
                should.not.exist(e1);
                done()
            })
        })
        it("should return an error when id is not found.", function(done) {
            app.models.vertex2.getLabels("#13:150", function(e1, r1) {
                should.exist(e1);
                e1.message.should.be.equal('Element not found!');
                done();
            })
        })

    });
    xdescribe('Method : BothByLabel', function() {

       it("should throw an error when there is no argument.", function() {
            expect(function() {
                app.models.vertex1.getLabels();
            }).to.throw();
        });

        it('should return an array of relationship vertexes', function(done) {
            app.models.vertex2.bothByLabel('out', '#13:1', 'relationship', function(err, res) {
                should.not.exist(err);
                (res.length >= 0).should.be.true;
                done();
            });
        });
        it('should return an error when some args are missing', function(done) {
            app.models.vertex1.bothByLabel('#12:0', 'relationship', function(err, res) {
                should.exist(err);
                err.message.should.be.equal('Some arguments are missing!');
                done();
            });
        });
        it('should return an error when ARG1, ARG2 and ARG3 not strings!', function(done) {
            app.models.vertex1.bothByLabel("all", 121, 'relationship', function(err, res) {
                should.exist(err);
                err.message.should.be.equal('ARG1, ARG2 and ARG3 must be strings!');
                done();
            });
        });
        it('should return an error when ARG1 must take as value in , out or all!', function(done) {
            app.models.vertex1.bothByLabel("azeaz", "#12:3", 'relationship', function(err, res) {
                should.exist(err);
                err.message.should.be.equal('ARG1 must take as value \'in\', \'out\' or \'all\'!');
                done();
            });
        });
      
        it('should return an error when the vertex not found', function(done) {
            app.models.vertex1.bothByLabel('in', '#11:90', 'relationship', function(err, res) {
                should.exist(err);
                err.message.should.be.equal('No row selected!');
                done();
            });
        });
        it('should return an error when the label not found', function(done) {
            app.models.vertex1.bothByLabel('in', '#12:0', 'aezeaze', function(err, res) {
                should.exist(err);
                err.message.should.be.equal('Label Not Found!');
                done();
            });
        });

    });

    xdescribe('IF THEN  ELSE : METHOD', function() {
        it("should throw an error when there is no argument.", function() {
            expect(function() {
                app.models.vertex1.ifThenElse();
            }).to.throw();
        });

        it('should return an array of results by case', function(done) {
            app.models.vertex1.ifThenElse('out', "#12:1", "firstname=='Bart'", '_id', 'firstname', function(err, res) {
                should.not.exist(err);
                (res.length >= 0).should.be.true;
                done();
            });
        });
        it('should return an array of results by case', function(done) {
            app.models.vertex1.ifThenElse('out', "#11:91", "firstname=='Bart'", '_id', 'firstname', function(err, res) {
                should.exist(err);
                done();
            });
        });
        it('should return an aan error when some arguments are missing', function(done) {
            app.models.vertex1.ifThenElse('_id', 'firstname', function(err, res) {
                should.exist(err);
                err.message.should.be.equal('Some arguments are missing!');
                done();
            });
        });
        it('should return an error when args are not strings', function(done) {
            app.models.vertex1.ifThenElse(true, "#12:1", "firstname=='Bart'", '_id', 'firstname', function(err, res) {
                should.exist(err);
                err.message.should.be.equal('ARG1, ARG2, ARG3, ARG4 and ARG5 must be a strings!');
                done();
            });
        });
        it('should return an error when ARG1 is not all , in or out', function(done) {
            app.models.vertex1.ifThenElse("true", "#12:1", "firstname=='Bart'", '_id', 'firstname', function(err, res) {
                should.exist(err);
                err.message.should.be.equal('ARG1 must take as value \'in\', \'out\' or \'all\'!');
                done();
            });
        });
    });
    xdescribe('linkBoth : METHOD', function() {
        it("should throw an error when there is no argument.", function() {
            expect(function() {
                app.models.vertex1.linkBoth();
            }).to.throw();
        });

        it('should return an array of results matching this string criteria', function(done) {
            app.models.vertex2.linkBoth("#12:4", "relationship", ["#12:1", "#13:151"], function(err, res) {
                should.not.exist(err);
                (res.results.length >= 0).should.be.true;
                done();
            });
        });
        it('should return an array of results matching this object criteria', function(done) {
            app.models.vertex1.linkBoth("#12:1", "relationship", true, function(err, res) {
                should.exist(err);
                err.message.should.be.equal('ARG3 must be an array of Ids!')
                done()
            });
        });
        it('should return an empty array when criteria doesnt match any vertex', function(done) {
            app.models.vertex1.linkBoth("#12:1", 11, ["#12:2", "#12:0"], function(err, res) {
                should.exist(err);
                err.message.should.be.equal('ARG1 and ARG2 must be a strings!')
                done()
            });
        });
        it('should return an error when some arguments are missing', function(done) {
            app.models.vertex1.linkBoth(function(err, res) {
                should.exist(err);
                err.message.should.be.equal('Some arguments are missing!')
                done()
            });
        });


    });
    xdescribe('gather : METHOD', function() {
        it("should throw an error when there is no argument.", function() {
            expect(function() {
                app.models.vertex1.gather();
            }).to.throw();
        });

        it('should return an array of results matching this string criteria', function(done) {
            app.models.vertex1.gather('in', "#12:1", "size", function(err, res) {
                should.not.exist(err);
                (res instanceof Array).should.be.true;
                done();

            });
        });
        it('should return an array of results matching this string criteria', function(done) {
            app.models.vertex1.gather('aozea', "#12:1", "size", function(err, res) {
                should.exist(err);
                err.message.should.be.equal('TYPE must be in, out or all');
                done();

            });
        });
        it('should return an error when vertex not found', function(done) {
            app.models.vertex1.gather('in', "#19:2", "size", function(err, res) {
                should.exist(err);
                done();

            });
        });
        it('should return an empty array when ARGS are not strings', function(done) {
            app.models.vertex1.gather(true, "#12:2", "size", function(err, res) {
                should.exist(err);
                err.message.should.be.equal('ARG1, ARG2 and ARG3 must be a strings!');
                done();
            });
        });
        it('should return an error when some arguments are missing', function(done) {
            app.models.vertex1.gather(function(err, res) {
                should.exist(err);
                err.message.should.be.equal('Some arguments are missing!')
                done()
            });
        });


    });
    xdescribe('Remove Edge : METHOD', function() {
        it("should throw an error when there is no argument.", function() {
            expect(function() {
                app.models.relationship.removeEdge();
            }).to.throw();
        });

        it('should return an array of results and remove the Edge', function(done) {
            app.models.relationship.removeEdge({'id': "#14:145"}, function(err, res) {
                should.not.exist(err);
                done();

            });
        });
        it('should return an error when the ID is not valid', function(done) {
            app.models.relationship.removeEdge({'id':'invalid_id'}, function(err, res) {
                should.exist(err);
                err.message.should.be.equal('ID\'s format is invalid!');
                done()

            });
        });
        it('should return an empty array when Edge ID doesnt exists', function(done) {
            app.models.relationship.removeEdge({'id':"#14:120"}, function(err, res) {
                should.exist(err);
                done();
            });
        });
        it('should return an error when some arguments are missing', function(done) {
            app.models.relationship.removeEdge(function(err, res) {
                should.exist(err);
                err.message.should.be.equal('ARG1 must be an object!')
                done()
            });
        });


    });

    describe('EACH : METHOD', function() {
        it("should throw an error when there is no argument.", function() {
            expect(function() {
                app.models.vertex1.each();
            }).to.throw();
        });
        it('should do each operation ', function(done) {
            app.models.vertex1.V(0, function(err, res) {
                app.models.vertex1.each(res,'remove',function(err,res){
                    console.log(err,res)
                    done();
                });
            });
        });
        it('should return an error when some arguments are missing', function(done) {
            app.models.relationship.removeEdge(function(err, res) {
                should.exist(err);
                err.message.should.be.equal('ARG1 must be an object!')
                done()
            });
        });
    });
});
