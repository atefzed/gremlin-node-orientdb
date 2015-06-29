'use strict';

var grex = require('grex');
var async = require('async');
var gremlin = grex.gremlin;
var g = grex.g;
var client = grex.createClient({
    host: 'localhost',
    port: 8182,
    graph: 'orientdbsample'
});

Array.prototype.filterById = function() {
    var size = this.length;
    for (var i = 0; i < size; i++) {
        for (var j = i + 1; j < size; j++) {
            if (this[i]._id === this[j]._id) {
                this.splice(j, 1);
                j--;
                size--;
            }
        }
    }
}

Array.prototype.merge = function(arr) {
    var ret = this;
    for (var i = 0; i < arr.length; i++) {
        ret.push(arr[i]);
    }
    return ret;
}

function getType(type) {
    if (type === 'id')
        return '@rid';
    else if (type === 'class')
        return '@class';
    else return type;
}

function reWrite(criteria, opt) {
    if (opt === undefined) opt = '';
    var arr;

    if (~criteria.indexOf("&") || ~criteria.indexOf("|")) {
        var c = criteria;

        var regex = new RegExp("[ )(|&]+", "g");
        arr = criteria.split(regex);
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == '==' || arr[i] == '>' || arr[i] == '>=' || arr[i] == '<' || arr[i] == '<=' || arr[i] == '!=')
                i += 2;
            if (i >= arr.length) break;
            arr[i] = "it." + opt + arr[i];
        }
        criteria = arr.join(' ');

        var j = 0;
        for (var i = 0; i < criteria.length; i++) {
            if (criteria.charAt(i) == 'i' && criteria.charAt(i + 1) == 't' && criteria.charAt(i + 2) == '.')
                j++;
            if (c.charAt(i) == '&' && c.charAt(i + 1) == '&') {
                criteria = criteria.substr(0, i + j * 3) + '&& ' + criteria.substr(i + j * 3, c.length + j * 3);
            }
            if (c.charAt(i) == '|' && c.charAt(i + 1) == '|') {
                criteria = criteria.substr(0, i + j * 3) + '|| ' + criteria.substr(i + j * 3, c.length + j * 3);
            }
        }
    } else {
        criteria = "it." + opt + criteria;
    }

    return criteria;
}

function eORv(coll, callback) {
    if (coll === undefined)
        return callback('Some arguments are missing!');
    if (typeof coll !== 'string')
        return callback('ARG1 must be strings!');

    var query = gremlin();
    async.auto({
        v: function(cb) {
            query("g.V('@class', '" + coll + "')");
            client.fetch(query, function(err, vertex) {
                if (err) return cb(err);
                return cb(null, vertex);
            });
        },
        e: function(cb) {
            query("g.E('@class', '" + coll + "')");
            client.fetch(query, function(err, vertex) {
                if (err) return cb(err);
                return cb(null, vertex);
            });
        },
        final: ["v", "e", function(cb, results) {
            if (results.v.length !== 0)
                return cb(null, "v");
            if (results.e.length !== 0)
                return cb(null, "e");
        }]
    }, function(err, res) {
        callback(err, res.final);
    });
}

//////////////////////////////////////////////////////////

function Graph() {

    /************************************************************************************/
    /*                                     VERTEX                                       */
    /************************************************************************************/
    this.v = function(conn, coll, type, value, filter, callback) {
        eORv(coll, function(e, r) {
            if (r === 'v') {
                if (!callback) {
                    callback = filter;
                    filter = 'class';
                }
                if (!type || !value)
                    return callback('Some arguments are missing!');
                if (typeof type !== 'string' && typeof value !== 'string')
                    return callback('ARG2 and ARG3 must be string!');

                var query = gremlin();
                async.auto({
                    v: function(cb) {
                        if (type === 'id')
                            query("g.v('" + value + "')");
                        else
                            query("g.V('" + getType(type) + "', '" + value + "')");
                        client.fetch(query, function(err, vertex) {
                            if (err) return cb(err);
                            return cb(null, vertex);
                        });
                    },
                    has: ["v", function(cb, results) {
                        if (results.v) {
                            if (type === 'id')
                                query("g.v('" + value + "').has('@class', '" + coll + "')");
                            else
                                query("g.V('" + getType(type) + "', '" + value + "').has('@class', '" + coll + "')");
                            client.fetch(query, function(err, vertex) {
                                if (err) return cb(err);
                                return cb(null, vertex);
                            });
                        } else {
                            return callback(null);
                        }
                    }]
                }, function(err, res) {
                    if (err) return callback(err);
                    if (filter === 'all') {
                        return callback(err, res.v[0]);
                    } else {
                        if (res.has) {
                            if (res.has.length == 1) {
                                return callback(err, res.v[0]);
                            }
                            if (res.has.length == 0) {
                                return callback('Not found!');
                            }
                            callback('Query returns more than 1 row!');
                        }
                    }
                });
            } else {
                callback("Cannot use Vertex's methods!");
            }
        });
    }

    this.V = function(conn, coll, all, callback) {
        eORv(coll, function(e, r) {
            if (r === 'v') {
                if (!callback) {
                    callback = all;
                    all = 0;
                }
                async.auto({
                    V: function(cb) {
                        var query = gremlin();
                        if (all === 0)
                            query("g.V.has('@class', '" + coll + "')");
                        else
                            query("g.V");
                        client.fetch(query, function(err, response) {
                            if (err) return cb(err);
                            return cb(null, response);
                        });
                    }
                }, function(err, res) {
                    callback(err, res.V);
                });
            } else {
                callback("Cannot use Vertex's methods!");
            }
        });
    }

    this.inV = function(conn, coll, type, value, callback) {
        eORv(coll, function(e, r) {
            if (r === 'v') {
                if (!type || !value)
                    return callback('Some arguments are missing!');
                if (typeof type !== 'string')
                    return callback('ARG1 must be string!');

                async.auto({
                    v: function(cb) {
                        new Graph().v(conn, coll, type, value, function(err, record) {
                            if (err) return cb(err);
                            return cb(null, record);
                        });
                    },
                    inV: ['v', function(cb, results) {
                        if (results.v) {
                            var query = gremlin();
                            if (type === 'id') {
                                query("g.v('" + value + "').has('@class', '" + coll + "').in()");
                            } else
                                query("g.V('" + getType(type) + "', '" + value + "').has('@class', '" + coll + "').in()");
                            client.fetch(query, function(err, response) {
                                if (err) return cb(err);
                                return cb(null, response);
                            });
                        } else {
                            return callback('Vertex not found!');
                        }
                    }]
                }, function(err, res) {
                    callback(err, res.inV);
                });
            } else {
                callback("Cannot use Vertex's methods!");
            }
        });
    }

    this.outV = function(conn, coll, type, value, callback) {
        eORv(coll, function(e, r) {
            if (r === 'v') {
                if (!type || !value)
                    return callback('Some arguments are missing!');
                if (typeof type !== 'string')
                    return callback('ARG1 must be string!');

                async.auto({
                    v: function(cb) {
                        new Graph().v(conn, coll, type, value, function(err, record) {
                            if (err) return cb(err);
                            return cb(null, record);
                        });
                    },
                    outV: ['v', function(cb, results) {
                        if (results.v) {
                            var query = gremlin();
                            if (type === 'id')
                                query("g.v('" + value + "').has('@class', '" + coll + "').out()");
                            else
                                query("g.V('" + getType(type) + "', '" + value + "').has('@class', '" + coll + "').out()");
                            client.fetch(query, function(err, response) {
                                if (err) return cb(err);
                                return cb(null, response);
                            });
                        } else {
                            return callback('Vertex not found!');
                        }
                    }]
                }, function(err, res) {
                    callback(err, res.outV);
                });
            } else {
                callback("Cannot use Vertex's methods!");
            }
        });
    }

    this.bothV = function(conn, coll, type, value, callback) {
        eORv(coll, function(e, r) {
            if (r === 'v') {
                if (!type || !value)
                    return callback('Some arguments are missing!');
                if (typeof type !== 'string')
                    return callback('ARG1 must be string!');

                async.auto({
                    inV: function(cb) {
                        new Graph().inV(conn, coll, type, value, function(err, record) {
                            return cb(err, record);
                        });
                    },
                    outV: function(cb) {
                        new Graph().outV(conn, coll, type, value, function(err, record) {
                            return cb(err, record);
                        });
                    },
                    bothV: ['inV', 'outV', function(cb, results) {
                        if (results.inV && results.outV) {
                            var arr = results.outV.merge(results.inV);
                            return cb(null, arr);
                        } else {
                            return callback('Vertex not found!')
                        }
                    }]
                }, function(err, res) {
                    callback(err, res.bothV);
                });
            } else {
                callback("Cannot use Vertex's methods!");
            }
        });
    }

    this.inE = function(conn, coll, type, value, label, callback) {
        eORv(coll, function(e, r) {
            if (r === 'v') {
                if (!callback) {
                    callback = label;
                    label = '';
                }
                if (!type || !value || !label)
                    return callback('Some arguments are missing!');
                if (typeof type !== 'string' && typeof label !== 'string')
                    return callback('ARG1 must be string!');

                async.auto({
                    v: function(cb) {
                        new Graph().v(conn, coll, type, value, function(err, record) {
                            return cb(err, record);
                        });
                    },
                    outE: ['v', function(cb, results) {
                        if (results.v) {
                            var query = gremlin();
                            if (label) {
                                if (type === 'id')
                                    query("g.v('" + value + "').has('@class', '" + coll + "').inE('" + label + "')");
                                else
                                    query("g.v('" + getType(type) + "', '" + value + "').has('@class', '" + coll + "').inE('" + label + "')");
                            } else {
                                if (type === 'id')
                                    query("g.v('" + value + "').has('@class', '" + coll + "').inE");
                                else
                                    query("g.v('" + getType(type) + "', '" + value + "').has('@class', '" + coll + "').inE");
                            }
                            client.fetch(query, function(err, response) {
                                if (err) return cb(err);
                                return cb(null, response);
                            });
                        }
                    }]
                }, function(err, res) {
                    callback(err, res.outE);
                });
            } else {
                callback("Cannot use Vertex's methods!");
            }
        });
    }

    this.outE = function(conn, coll, type, value, callback) {
        eORv(coll, function(e, r) {
            if (r === 'v') {
                if (!callback) {
                    callback = label;
                    label = '';
                }
                if (!type || !value)
                    return callback('Some arguments are missing!');
                if (typeof type !== 'string')
                    return callback('ARG1 must be string!');

                async.auto({
                    v: function(cb) {
                        new Graph().v(conn, coll, type, value, function(err, record) {
                            cb(err, record);
                        });
                    },
                    outE: ['v', function(cb, results) {
                        if (results.v) {
                            var query = gremlin();
                            if (label) {
                                if (type === 'id')
                                    query("g.v('" + value + "').has('@class', '" + coll + "').outE('" + label + "')");
                                else
                                    query("g.v('" + getType(type) + "', '" + value + "').has('@class', '" + coll + "').outE('" + label + "')");
                            } else {
                                if (type === 'id')
                                    query("g.v('" + value + "').has('@class', '" + coll + "').outE");
                                else
                                    query("g.v('" + getType(type) + "', '" + value + "').has('@class', '" + coll + "').outE");
                            }
                            client.fetch(query, function(err, response) {
                                if (err) return cb(err);
                                return cb(null, response);
                            });
                        } else {
                            return callback('Vertex not found');
                        }
                    }]
                }, function(err, res) {
                    callback(err, res.outE);
                });
            } else {
                callback("Cannot use Vertex's methods!");
            }
        });
    }

    this.bothE = function(conn, coll, type, value, callback) {
        eORv(coll, function(e, r) {
            if (r === 'v') {
                if (!type || !value)
                    return callback('Some arguments are missing!');
                if (typeof type !== 'string')
                    return callback('ARG1 must be string!');

                async.auto({
                    inE: function(cb) {
                        new Graph().inE(conn, coll, type, value, function(err, record) {
                            return cb(err, record);
                        });
                    },
                    outE: function(cb) {
                        new Graph().outE(conn, coll, type, value, function(err, record) {
                            return cb(err, record);
                        });
                    },
                    bothE: ['inE', 'outE', function(cb, results) {
                        if (results.inE || results.outE) {
                            var arr = results.outE.merge(results.inE);
                            return cb(null, arr);
                        } else {
                            return cb(null, []);
                        }
                    }]
                }, function(err, res) {
                    callback(err, res.bothE);
                });
            } else {
                callback("Cannot use Vertex's methods!");
            }
        });
    }

    this.interval = function(conn, coll, label, value1, value2, callback) {
        if (!label || !value1 || !value2)
            return callback('Some arguments are missing!');
        if (typeof value1 !== 'number' || typeof value2 !== 'number')
            return callback('ARG2 and ARG3 must be numbers!');
        if (typeof label !== 'string')
            return callback('ARG1 must be string!');

        async.auto({
            interval: function(cb) {
                var query = gremlin();
                query("g.V.has('@class', '" + coll + "').interval('" + label + "'," + value1 + "," + value2 + ")");
                client.fetch(query, function(err, response) {
                    if (err) return cb(err);
                    return cb(null, response);
                });
            }
        }, function(err, res) {
            callback(err, res.interval);
        });
    }

    this.has = function(conn, coll, label, value, type, callback) {
        if (!label || !value || !type)
            return callback('Some arguments are missing!');
        if (typeof label !== 'string' || typeof type !== 'string')
            return callback('ARG1 and ARG3 must be strings!');
        type = type.toLowerCase();
        if (type !== 'vertex' && type !== 'edge' &&  type !== 'all')
            return callback("ARG3 must take as value 'vertex', 'edge' or 'all'!");

        var query = gremlin();
        async.auto({
            V: function(cb) {
                if (type === 'all' || type === 'vertex') {
                    if (typeof value == 'string')
                        query("g.V.has('@class', '" + coll + "').has(%s, %s)", label, value);
                    else
                        query("g.V.has('@class', '" + coll + "').has(%s, %d)", label, value);
                    client.execute(query, function(err, response) {
                        if (err) return cb(err);
                        return cb(null, response);
                    });
                } else
                    return cb(null);
            },
            E: function(cb) {
                if (type === 'all' || type === 'edge') {
                    if (typeof value == 'string')
                        query("g.E.has('@class', '" + coll + "').has(%s, %s)", label, value);
                    else
                        query("g.E.has('@class', '" + coll + "').has(%s, %d)", label, value);
                    client.execute(query, function(err, response) {
                        if (err) return cb(err);
                        return cb(null, response);
                    });
                } else
                    return cb(null);
            },
            has: ['V', 'E', function(cb, results) {
                if (results.V.results && !results.E.results)
                    return cb(null, results.V.results);
                if (results.E.results && !results.V.results)
                    return cb(null, results.E.results);
                if (results.V.results && results.E.results) {
                    var arr = results.V.results.merge(results.E.results)
                    return cb(null, arr);
                } else {
                    return cb(null, []);
                }
            }]
        }, function(err, res) {
            callback(err, res.has);
        });
    }

    this.hasNot = function(conn, coll, label, value, type, callback) {
        if (!label || !value || !type)
            return callback('Some arguments are missing!');
        if (typeof label !== 'string')
            return callback('ARG1 must be string!');
        type = type.toLowerCase();
        if (type !== 'vertex' && type !== 'edge' &&  type !== 'all')
            return callback("ARG3 must take as value 'vertex', 'edge' or 'all'!");

        var query = gremlin();
        async.auto({
            V: function(cb) {
                if (type === 'all' || type === 'vertex') {
                    if (typeof value == 'string')
                        query("g.V.has('@class', '" + coll + "').hasNot(%s, %s)", label, value);
                    else
                        query("g.V.has('@class', '" + coll + "').hasNot(%s, %d)", label, value);
                    client.execute(query, function(err, response) {
                        if (err) return cb(err);
                        return cb(null, response.results);
                    });
                } else
                    return cb(null);
            },
            E: function(cb) {
                if (type === 'all' || type === 'edge') {
                    if (typeof value == 'string')
                        query("g.E.has('@class', '" + coll + "').hasNot(%s, %s)", label, value);
                    else
                        query("g.E.has('@class', '" + coll + "').hasNot(%s, %d)", label, value);
                    client.execute(query, function(err, response) {
                        if (err) return cb(err);
                        return cb(null, response.results);
                    });
                } else
                    return cb(null);
            },
            has: ['V', 'E', function(cb, results) {
                if (results.V && !results.E)
                    return cb(null, results.V);
                if (results.E && !results.V)
                    return cb(null, results.E);
                if (results.V && results.E) {
                    var arr = results.V.merge(results.E)
                    return cb(null, arr);
                } else {
                    return cb(null, []);
                }
            }]
        }, function(err, res) {
            callback(err, res.has);
        });
    }

    this.removeVertex = function(conn, coll, type, value, callback) {
        eORv(coll, function(e, r) {
            if (r === 'v') {
                if (!type || !value)
                    return callback('Some arguments are missing!');
                if (typeof type !== 'string')
                    return callback('ARG1 must be string!');

                async.auto({
                    removeV: function(cb) {
                        var query = gremlin();
                        if (type === 'id')
                            query('g.removeVertex(g.v(%s))', value);
                        else
                            query('g.removeVertex(g.v(%s, %s))', getType(type), value);
                        client.execute(query, function(err, vertex) {
                            if (err) return cb(err);
                            cb(null, vertex);
                        });
                    }
                }, function(err, res) {
                    callback(err, res.removeV);
                });
            } else {
                callback("Cannot use Vertex's methods!");
            }
        });
    }

    this.removeAllVertices = function(conn, coll, callback) {
        eORv(coll, function(e, r) {
            if (r === 'v') {
                async.auto({
                    removeV: function(cb) {
                        var query = gremlin();
                        query("g.V.has('@class', '" + coll + "').each{g.removeVertex(it)}");
                        client.execute(query, function(err, vertex) {
                            if (err) return cb(err);
                            return cb(null, vertex);
                        });
                    }
                }, function(err, res) {
                    callback(err, res.removeV);
                });
            } else {
                callback("Cannot use Vertex's methods!");
            }
        });
    }

    /************************************************************************************/
    /*                                       EDGE                                       */
    /************************************************************************************/
    this.e = function(conn, coll, type, value, callback) {
        eORv(coll, function(e, r) {
            if (!type || !value)
                return callback('ARG1 must be object!');
            if (typeof type !== 'string')
                return callback('ARG1 must be string!');
            if (r === 'e') {

                var query = gremlin();
                async.auto({
                    e: function(cb) {
                        if (type === 'id')
                            query("g.e('" + value + "')");
                        else
                            query("g.E('" + getType(type) + "', '" + value + "')");
                        client.fetch(query, function(err, edge) {
                            if (err) return cb(err);
                            return cb(null, edge);
                        });
                    },
                    has: ["e", function(cb, results) {
                        if (results.e) {
                            if (type === 'id')
                                query("g.e('" + value + "').has('@class', '" + coll + "')");
                            else
                                query("g.E('" + getType(type) + "', '" + value + "').has('@class', '" + coll + "')");
                            client.fetch(query, function(err, edge) {
                                if (err) return cb(err);
                                return cb(null, edge);
                            });
                        } else {
                            return callback(null);
                        }
                    }]
                }, function(err, res) {
                    if (res.has) {
                        if (res.has.length == 1) {
                            callback(err, res.e[0]);
                            return;
                        }
                        if (res.has.length == 0) {
                            callback('Not found!');
                            return;
                        }
                        callback('Query returns more than 1 row!');
                    }
                });
            } else {
                callback("Cannot use Edge's methods!");
            }
        });
    }

    this.E = function(conn, coll, callback) {
        eORv(coll, function(e, r) {
            if (r === 'e') {
                var query = gremlin();
                query("g.E.has('@class', '" + coll + "')");
                client.fetch(query, function(err, response) {
                    if (err) return callback(err);
                    return callback(null, response);
                });
            } else {
                callback("Cannot use Edge's methods!");
            }
        });
    }

    this.removeEdge = function(conn, coll, type, value, callback) {
        eORv(coll, function(e, r) {
            if (r === 'e') {
                if (!type || !value)
                    return callback('Some arguments are missing!');
                if (typeof type !== 'string')
                    return callback('ARG1 must be string!');

                async.auto({
                    removeE: function(cb) {
                        var query = gremlin();
                        if (type === 'id')
                            query('g.removeEdge(g.e(%s))', value);
                        else
                            query('g.removeEdge(g.E(%s, %s))', getType(type), value);
                        client.execute(query, function(err, edge) {
                            if (err) return cb(err);
                            return cb(null, edge.results);
                        });
                    }
                }, function(err, res) {
                    callback(err, res.removeE);
                });
            } else {
                callback("Cannot use Vertex's methods!");
            }
        });
    }

    /************************************************************************************/
    /*                                     INDEX                                        */
    /************************************************************************************/
    this.idx = function(conn, coll, nameIdx, callback) {
        if (!nameIdx)
            return callback('Some arguments are missing!');
        if (typeof nameIdx !== 'string')
            return callback('ARG1 must be string!');

        async.auto({
            idx: function(cb) {
                var query = gremlin();
                query("g.idx('" + idx + "')");
                client.fetch(query, function(err, idx) {
                    if (err) return cb(err);
                    return cb(null, edge);
                });
            }
        }, function(err, res) {
            callback(err, res.idx);
        });
    }

    this.putIdx = function(conn, coll, nameIdx, label, property, idV, callback) {
        if (!nameIdx ||  !label || !property || !idV)
            return callback('Some arguments are missing!');
        if (typeof nameIdx !== 'string' ||  typeof label !== 'string' ||  typeof property !== 'string' ||  typeof idV !== 'string')
            return callback('ARG1, ARG2, ARG3, ARG4 and ARG5 must be strings!');

        async.auto({
            v: function(cb) {
                new Graph().v(conn, coll, "id", idV, function(err, res) {
                    if (err) return cb(err);
                    return cb(null, res);
                });
            },
            putIdx: ['v', function(cb, results) {
                if (results.v) {
                    var query = gremlin();
                    query("g.idx(" + nameIdx + ").put(" + label + ", " + property + ", g.v(" + idV + "))");
                    client.execute(query, function(err, obj) {
                        if (err) return cb(err);
                        return cb(null, obj);
                    });
                }
            }]
        }, function(err, res) {
            callback(err, res.putIdx);
        });
    }

    /************************************************************************************/
    /*                                     GLOBAL                                       */
    /************************************************************************************/
    this.dedup = function(conn, coll, obj, callback) {
        if (!obj)
            return callback('Some arguments are missing!');
        if (typeof obj !== 'object')
            return callback('ARG1 must be object!');
        if (obj instanceof Array) {
            obj.filterById()
            return callback(null, obj);
        }
        return callback(null, obj);
    }

    this.count = function(conn, coll, obj, callback) {
        if (!obj)
            return callback('Some arguments are missing!');
        if (typeof obj !== 'object')
            return callback('ARG1 must be object!');
        if (obj instanceof Array)
            return callback(null, obj.length);
        if (obj === null || obj === {})
            return callback(null, 0);
        return callback(null, 1);
    }

    this.gather = function(conn, coll, type, idV, condition, callback) {
        if (eORv(coll) === 'v') {
            if (!idV || !condition ||  !type)
                return callback('Some arguments are missing!');
            if (typeof idV !== 'string' || typeof condition !== 'string' || typeof type !== 'string')
                return callback('ARG1, ARG2 and ARG3 must be strings!');

            var query;
            async.auto({
                v: function(cb) {
                    new Graph().v(conn, coll, "id", idV, function(err, res) {
                        if (err) return cb(err);
                        return cb(null, res);
                    });
                },
                in : ["v", function(cb, results) {
                    if (results.v) {
                        condition = reWrite(condition);
                        query = gremlin();
                        query("g.v(" + idV + ").has('@class', '" + coll + "').in.gather{" + condition + "}");
                        client.execute(query, function(err, response) {
                            if (err) return cb(err);
                            return cb(null, response);
                        });
                    } else {
                        return callback('Vertex not found!');
                    }
                }],
                out: ["v", function(cb, results) {
                    if (results.v) {
                        condition = reWrite(condition);
                        query = gremlin();
                        query("g.v(" + idV + ").has('@class', '" + coll + "').out.gather{" + condition + "}");
                        client.execute(query, function(err, response) {
                            if (err) return cb(err);
                            return cb(null, response);
                        });
                    } else {
                        return callback('Vertex not found!');
                    }
                }],
                gather: ["in", "out", function(cb, results) {
                    if (type === 'in')
                        return cb(null, results.in);
                    if (type === 'out')
                        return cb(null, results.out);
                    var r = results.out.merge(results.in);
                    if (type === 'all')
                        return cb(null, r);
                }]
            }, function(err, res) {
                callback(err, res.gather);
            });
        } else {
            callback("Cannot use Edge's methods!");
        }
    }

    this.gather = function(conn, coll, type, idV, condition, callback) {
        eORv(coll, function(e, r) {
            if (r === 'v') {
                if (idV === undefined || condition === undefined || type === undefined)
                    return callback('Some arguments are missing!');
                if (typeof idV !== 'string' || typeof condition !== 'string' || typeof type !== 'string')
                    return callback('ARG1, ARG2 and ARG3 must be strings!');

                var query;
                condition = reWrite(condition);

                async.auto({
                    v: function(cb) {
                        new Graph().v(conn, coll, "id", idV, function(err, res) {
                            if (err) return cb(err);
                            return cb(null, res);
                        });
                    },
                    in : ["v", function(cb, results) {
                        if (results.v) {
                            query = gremlin();
                            query("g.v('" + idV + "').in.gather{" + condition + "}");
                            client.execute(query, function(err, response) {
                                if (err) return cb(err);
                                return cb(null, response.results);
                            });
                        } else {
                            return callback('Vertex not found!');
                        }
                    }],
                    out: ["v", function(cb, results) {
                        if (results.v) {
                            query = gremlin();
                            query("g.v('" + idV + "').out.gather{" + condition + "}");
                            client.execute(query, function(err, response) {
                                if (err) return cb(err);
                                return cb(null, response.results);
                            });
                        } else {
                            return callback('Vertex not found!');
                        }
                    }],
                    gather: ["in", "out", function(cb, results) {
                        if (type === 'in')
                            return cb(null, results.in);
                        if (type === 'out')
                            return cb(null, results.out);
                        var r = parseInt(results.out[0]) + parseInt(results.in[0]);
                        if (type === 'all')
                            return cb(null, r);
                    }]
                }, function(err, res) {
                    callback(err, res.gather);
                });
            } else {
                callback("Cannot use Edge's methods!");
            }
        });
    }

    this.linkBoth = function(conn, coll, idV, labelE, arrIdVs, callback) {
        eORv(coll, function(e, r) {
            if (r === 'v') {
                if (idV === undefined || labelE === undefined || arrIdVs === undefined)
                    return callback('Some arguments are missing!');
                if (!(arrIdVs instanceof Array))
                    return callback('ARG13 must be an array of Ids!');
                if (typeof idV !== 'string' && typeof labelE !== 'string')
                    return callback('ARG1 and ARG2 must be strings!');

                var arrStr = "";
                async.auto({
                    v: function(cb) {
                        new Graph().V(conn, coll, 'sdkjlk', function(err, res) {
                            return cb(err, res);
                        });
                    },
                    except: ['v', function(cb, results) {
                        for (var k = 0; k < arrIdVs.length; k++) {
                            for (var j = 0; j < results.v.length; j++) {
                                if (arrIdVs[k] === results.v[j]._id) {
                                    results.v.splice(j, 1);
                                    j--;
                                    break;
                                }
                            }
                        }
                        for (var i = 0; i < results.v.length; i++) {
                            if (i !== 0) arrStr += ", ";
                            arrStr += "g.v('" + results.v[i]._id + "')";
                        }
                        if (results.v.length) {
                            arrStr += ", "
                        }
                        var query = gremlin();
                        query("g.V.except([" + arrStr + " g.v('" + idV + "')]).linkBoth('" + labelE + "', g.v('" + idV + "'))");
                        client.execute(query, function(err, response) {
                            if (err) return cb(err);
                            return cb(null, response);
                        });
                    }]
                }, function(err, res) {
                    callback(err, res.except);
                });
            } else {
                callback("Cannot use Vertex's methods!");
            }
        });
    }

    this.filter = function(conn, coll, criteria, callback) {
        eORv(coll, function(e, r) {
            if (r === 'v') {
                if (!criteria)
                    callback('Some arguments are missing!');
                if (typeof criteria === 'string') {
                    async.auto({
                        filter: function(cb) {
                            criteria = reWrite(criteria);
                            var query = gremlin();
                            console.log("g.V.has('@class', '" + coll + "').filter{" + criteria + "}");
                            query("g.V.has('@class', '" + coll + "').filter{" + criteria + "}");
                            client.execute(query, function(err, response) {
                                if (err) return cb(err);
                                return cb(null, response);
                            });
                        }
                    }, function(err, res) {
                        if (!res.filter) {
                            return callback('Check your query!');
                        }
                        callback(err, res.filter.results);
                    });
                } else if (typeof criteria === 'object' || criteria instanceof 'array') {
                    var i = 0,
                        arr = [],
                        arrObj = [],
                        key;
                    for (key in obj) {
                        var newObj = {};
                        newObj['key'] = key;
                        newObj['value'] = obj[key];
                        arrObj.push(newObj);
                    }
                    async.eachSeries(arrObj, function(item, cb) {
                            if (i === 0) {
                                new Graph().has(conn, coll, item.key, item.value, 'all', function(err, res) {
                                    if (err) return callback(err);
                                    if (res.length === 0)
                                        return callback(null);
                                    if (arrObj.length == 1)
                                        return callback(null, res);
                                    arr = res;
                                    i++;
                                    cb();
                                });
                            } else {
                                for (var j = 0; j < arr.length; j++) {
                                    if (arr[j][item.key] !== item.value) {
                                        arr.splice(j, 1);
                                        j--;
                                    }
                                }
                                i++;
                                if (i === arrObj.length)
                                    return callback(null, arr);
                            }
                        },
                        function(err, res) {
                            callback(err, res);
                        });
                } else {
                    callback('ARG1 must be string!');
                }
            } else {
                callback("Cannot use Vertex's methods!");
            }
        });
    }

    this.ifThenElse = function(conn, coll, type, idV, condition, attTrue, attFalse, callback) {
        if (!type ||  !idV ||  condition || !attTrue || !attFalse)
            return callback('Some arguments are missing!');
        if (typeof type !== 'string' || typeof idV !== 'string' || typeof condition !== 'string' || typeof attTrue !== 'string' || typeof attFalse !== 'string')
            return callback('ARG1, ARG2, ARG3, ARG4 and ARG5 must be strings!');
        if (type !== 'in' && type !== 'out' && type !== 'all')
            return callback("ARG1 must take as value 'in', 'out' or 'all'!");

        var query = gremlin();
        condition = reWrite(condition);
        (attTrue === '_id') ? 'id' : 'id';
        (attFalse === '_id') ? 'id' : 'id';
        async.auto({
            out: function(cb) {
                query("g.v('" + idV + "').has('@class', '" + coll + "').out.ifThenElse{" + condition + "}{it." + attTrue + "}{it." + attFalse + "}");
                client.fetch(query, function(err, res) {
                    if (err) return cb(err);
                    return cb(null, res);
                });
            },
            in : function(cb) {
                query("g.v('" + idV + "').in.ifThenElse{" + condition + "}{it." + attTrue + "}{it." + attFalse + "}");
                client.fetch(query, function(err, res) {
                    if (err) return cb(err);
                    return cb(null, res);
                });
            },
            all: ['out', 'in', function(cb, results) {
                if (type === 'in')
                    return callback(null, results.in);
                if (type === 'out')
                    return callback(null, results.out);
                results.all = results.out.merge(results.in);
                if (type === 'all')
                    return callback(null, results.all);
            }]
        }, function(err, res) {
            callback(err, res);
        });
    }

    this.each = function(conn, coll, obj, action, callback) {
        if (eORv(coll, function(req, res) {
                if (res === 'v') {
                    if (!obj || !action)
                        return callback('Some arguments are missing!');
                    if (typeof obj !== 'object')
                        return callback('ARG1 must be object!');
                    if (typeof action !== 'string')
                        return callback('ARG2 must be string!');

                    if (obj instanceof Array) {
                        async.eachSeries(obj, function(item, cb) {
                            if (action === 'remove') {
                                if (item._type === 'vertex')
                                    new Graph().removeVertex(conn, coll, 'id', item._id, cb);
                                if (item._type === 'edge')
                                    new Graph().removeEdge(conn, coll, 'id', item._id, cb);
                            }
                        }, function(err) {
                            if (err) return callback(err);
                            return callback(err, "Finished By Sucess");
                        });
                    } else {
                        if (action === 'remove') {
                            if (obj._type === 'vertex')
                                new Graph().removeVertex(conn, coll, 'id', obj._id, function(err, res) {
                                    if (err) return callback(err);
                                    return callback(err, res);
                                });
                            if (obj._type === 'edge')
                                new Graph().removeEdge(conn, coll, 'id', obj._id, function(err, res) {
                                    if (err) return callback(err);
                                    return callback(err, res);
                                });
                        }
                    }
                } else {
                    return callback('Cannot use for vertex methods ');
                }
            }));
    }

    this.bothByLabel = function(conn, coll, type, id, label, callback) {
        if (!type || !id || !label)
            return callback('Some arguments are missing!');
        if (typeof type !== 'string' || typeof id !== 'string' || typeof label !== 'string')
            return callback('ARG1, ARG2 and ARG3 must be strings!');
        if (type !== 'in' && type !== 'out' && type !== 'all')
            return callback("ARG1 must take as value 'in', 'out' or 'all'!");
        var query = gremlin();
        async.auto({
            v: function(cb) {
                new Graph().v(conn, coll, "id", id, 'all', function(err, res) {
                    if (err) return cb(err);
                    return cb(null, res);
                });
            },
            out: ['v', function(cb, results) {
                if (results.v) {
                    var acc = [],
                        arr = [];
                    new Graph().outE(conn, coll, "id", id, label, function(err, res) {
                        arr = res;
                        async.eachSeries(arr, function(item, callback1) {
                            new Graph().v(conn, coll, "id", item._inV, 'all', function(err, res) {
                                acc.push(res);
                                return callback1();
                            });
                        }, function(err) {
                            if (err) return cb(err);
                            return cb(null, acc);
                        });
                    });
                } else {
                    return cb('No Row Selected ', null);
                }

            }],
            in : ['v', function(cb, results) {
                if (results.v) {
                    var acc = [],
                        arr = [];
                    new Graph().inE(conn, coll, "id", id, label, function(err, res) {
                        arr = res;
                        async.eachSeries(arr, function(item, callback1) {
                            new Graph().v(conn, coll, "id", item._outV, 'all', function(err, res) {
                                acc.push(res);
                                callback1();
                            });
                        }, function(err) {
                            if (err) return cb(err);
                            return cb(null, acc);
                        });
                    });
                } else {
                    return cb('No Row Selected ', null);
                }
            }],
            all: ['v', 'out', 'in', function(cb, results) {
                if (results.v) {
                    if (type === 'in')
                        return cb(null, results.in);
                    if (type === 'out')
                        return cb(null, results.out)
                    results.all = results.out.merge(results.in);
                    if (type === 'all')
                        return cb(null, results.all);
                } else {
                    return cb('No Row Found', null);

                }
            }]
        }, function(err, res) {
            callback(err, res.all);
        });
    }

    this.getLabels = function(conn, coll, id, callback) {
        if (!id)
            return callback('Some arguments are missing!');
        if (typeof id !== 'string')
            return callback('ARG1 must be string!');

        async.auto({
            v: function(cb) {
                new Graph().v(conn, coll, "id", id, function(err, res) {
                    if (err) return cb(err);
                    return cb(null, res);
                });
            },
            e: function(cb) {
                new Graph().e(conn, coll, "id", id, function(err, res) {
                    if (err) return cb(err);
                    return cb(null, res);
                });
            },
            getP: ['v', 'e', function(cb, results) {
                var query = gremlin();
                if (results.e)
                    query('g.e(%s).outE.label', id);
                if (results.v)
                    query("g.v(%s).has('@class', '" + coll + "').outE.label", id);
                if (!results.v && !results.e)
                    return callback('Element not found!');
                client.execute(query, function(err, properties) {
                    if (err) return cb(err);
                    return cb(null, properties);
                });
            }]
        }, function(err, res) {
            callback(err, res.getP.results);
        });
    }

    this.getProperty = function(conn, coll, id, label, callback) {
        eORv(coll, function(e, r) {
            if (r === 'v') {
                if (!id || !label)
                    return callback('Some arguments are missing!');
                if (typeof id !== 'string' || typeof label !== 'string')
                    return callback('ARG1 and ARG2 must be strings!');

                async.auto({
                    v: function(cb) {
                        new Graph().v(conn, coll, "id", id, function(err, res) {
                            if (err) return cb(err);
                            return cb(null, res);
                        });
                    },
                    e: function(cb) {
                        new Graph().e(conn, coll, "id", id, function(err, res) {
                            if (err) return cb(err);
                            return cb(null, res);
                        });
                    },
                    getP: ['v', 'e', function(cb, results) {
                        console.log(results);
                        var query = gremlin();
                        if (results.e)
                            query('g.e(%s).' + label, id);
                        if (results.v)
                            query("g.v('" + id + "').has('@class', '" + coll + "')." + label);
                        if (!results.v && !results.e)
                            return callback('Element not found!');
                        client.execute(query, function(err, properties) {
                            if (err) return cb(err);
                            return cb(null, properties);
                        });
                    }]
                }, function(err, res) {
                    callback(err, res.getP.results);
                });
            } else {
                callback("Cannot use Vertex's methods!");
            }
        });
    }

    this.getProperties = function(conn, coll, id, callback) {
        if (!id)
            return callback('Some arguments are missing!');
        if (typeof id !== 'string')
            return callback('ARG1 must be string!');

        async.auto({
            v: function(cb) {
                new Graph().v(conn, coll, "id", id, function(err, res) {
                    if (err) return cb(err);
                    return cb(null, res);
                });
            },
            e: function(cb) {
                new Graph().e(conn, coll, "id", id, function(err, res) {
                    if (err) return cb(err);
                    return cb(null, res);
                });
            },
            getP: ['v', 'e', function(cb, results) {
                var query = gremlin();
                if (results.e)
                    query('g.e(%s).keys()', id);
                if (results.v)
                    query("g.v(%s).keys()", id);
                if (!results.v && !results.e)
                    return callback('Element not found!');
                client.execute(query, function(err, properties) {
                    if (err) return cb(err);
                    return cb(null, properties);
                });
            }]
        }, function(err, res) {
            callback(err, res.getP.results);
        });
    }

    this.shortestPath = function(conn, coll, idVStart, idVEnd, nbIterations, callback) {
        if (eORv(coll) === 'v') {
            if (!idVStart || !idVEnd || !nbIterations)
                return callback('Some arguments are missing!');
            if (typeof idVStart !== 'string' || typeof idVEnd !== 'string')
                return callback('ARG1 and ARG2 must be strings!');
            if (typeof nbIterations !== 'number')
                return callback('ARG3 must be number!');

            async.auto({
                shortestP: function(cb) {
                    var query = gremlin();
                    query("g.v(%s).has('@class', '" + coll + "').out.loop(1){it.object.id != %s && it.loops < %d}.path", idVStart, idVEnd, nbIterations);
                    client.execute(query, function(err, path) {
                        if (err) return cb(err);
                        return cb(null, path);
                    });
                }
            }, function(err, res) {
                callback(err, res.shortestP);
            });
        } else {
            callback("Cannot use Vertex's methods!");
        }
    }

    this.loop = function(conn, coll, idV, condition1, condition2, callback) {
        if (eORv(coll) === 'v') {
            if (!idV || !condition1 || !condition2)
                return callback('Some arguments are missing!');
            if (typeof idV !== 'string' ||  typeof condition1 !== 'string' || typeof condition2 !== 'string')
                return callback('ARG1, ARG2 and ARG3 must be strings!');

            var query = gremlin();
            async.auto({
                v: function(cb) {
                    new Graph().v(conn, coll, 'id', idV, function(err, record) {
                        return cb(err, record);
                    });
                },
                loop: ['v', function(cb, results) {
                    if (results.v) {
                        condition1 = reWrite(condition1);
                        condition2 = reWrite(condition2, 'object.');
                        query("g.v('" + idV + "').has('@class', '" + coll + "').out.loop(1){" + condition1 + "}{" + condition2 + "}");
                        client.fetch(query, function(err, res) {
                            if (err) return cb(err);
                            return cb(null, res);
                        });
                    } else {
                        return callback('Vertex not found!');
                    }
                }]
            }, function(err, res) {
                callback(err, res.loop);
            });
        } else {
            callback("Cannot use Vertex's methods!");
        }
    }
};

//////////////////////////////////////////////////////////

module.exports = Graph;
