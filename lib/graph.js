'use strict';

/**
 * Module Dependencies
 */
var grex = require('grex');
var async = require('async');
var _ = require('lodash/array');
var gremlin = grex.gremlin;
var g = grex.g;
var client = grex.createClient({
    host: 'localhost',
    port: 8182,
    graph: 'orientdbecole'

});

/**
 * This method runs to rewrite the input user data.
 *
 * @param {String} type [description]
 * @return {String} [description]
 */
function getType(type) {
    if (type === 'id')
        return '@rid';
    else if (type === 'class')
        return '@class';
    else return type;
}

/**
 * Rewrites the criteria of selection to match to the gremlin's specifications.
 *
 * @param {String} criteria [description]
 * @param {String} opt [description]
 */
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

/**
 * This method determines whether the current model is a vertex or an edge.
 * It returns 'v' if it's a vertex and 'e' if it's an edge.
 *
 * @param {String} coll [description]
 * @param {Function} callback [description]
 * @return {String} [description]
 */
function eORv(coll, callback) {
    if (coll === undefined)
        return callback({
            name: 'VALIDATION',
            message: 'Some arguments are missing!'
        });
    if (typeof coll !== 'string')
        return callback({
            name: 'VALIDATION',
            message: 'ARG1 must be a strings!'
        });
    var query = gremlin();
    async.auto({
        v: function(cb) {
            query("g.V('@class', '" + coll + "')");
            client.fetch(query, function(err, vertex) {
                if (err) return cb({
                    name: 'ERROR',
                    message: err
                });
                return cb(null, vertex);
            });
        },
        e: function(cb) {
            query("g.E('@class', '" + coll + "')");
            client.fetch(query, function(err, vertex) {
                if (err) return cb({
                    name: 'ERROR',
                    message: err
                });
                return cb(null, vertex);
            });
        },
        final: ["v", "e", function(cb, results) {
            if (results.v.length !== 0)
                return cb(null, "v");
            else if (results.e.length !== 0)
                return cb(null, "e");
            else if (results.v.length === 0 && results.e.length === 0)
                return cb(null, "e");
        }]
    }, function(err, res) {
        return callback(err, res.final);
    });
}

//////////////////////////////////////////////////////////

/**
 * @class Graph
 */
function Graph() {


    /************************************************************************************/
    /*                                     VERTEX                                       */
    /************************************************************************************/

    /**
     * Get a vertex or set of vertices by providing one or more vertex identifiers.
     * The identifiers must be the identifiers assigned by the underlying graph implementation.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} type [Label to select]
     * @param {String} value [Value of selection]
     * @param {String} filter [description]
     * @param {Function} callback [description]
     * @return {Object} [description]
     */
    this.v = function(conn, coll, obj, filter, callback) {
        var key, type, value, nbArgs = 0;
        for (key in obj) {
            type = key;
            value = obj[key];
            nbArgs++;
        }
        if (!obj && !filter && !callback) {
            throw new Error({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        }
        if (!filter && !callback) {
            callback = obj;
            obj = undefined;
        } else if (!callback) {
            callback = filter;
            filter = '';
        }
        if (obj && typeof obj !== 'object')
            return callback({
                name: 'VALIDATION',
                message: "ARG1 must be an object!"
            });
        if (nbArgs > 1) {
            return callback({
                name: 'ERROR',
                message: 'ARG1 should take only one argument.'
            });
        }
        if (!type || value === undefined)
            return callback({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });

        if (!isNaN(type))
            return callback({
                name: 'VALIDATION',
                message: "ARG1's key must be a string!"
            });
        if (typeof filter !== 'string')
            return callback({
                name: 'VALIDATION',
                message: 'ARG3 must be a string!'
            });
        if (type === 'id') {
            var regexID = new RegExp("#[0-9]+:[0-9]+", "g");
            if (!value.match(regexID))
                return callback({
                    name: 'VALIDATION',
                    message: "ID's format is invalid!"
                });
        }

        eORv(coll, function(e, r) {
            if (r === 'v') {
                var query = gremlin();
                async.auto({
                    v: function(cb) {
                        if (type === 'id') {
                            query("g.v('" + value + "')");
                        } else
                            query("g.V('" + getType(type) + "', '" + value + "')");
                        client.fetch(query, function(err, vertex) {
                            if (err) return cb(err);
                            return cb(null, vertex);
                        });
                    },
                    has: ["v", function(cb, results) {
                        if (results.v) {
                            if (type === 'id') {
                                query("g.v('" + value + "').has('@class', '" + coll + "')");
                            } else
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
                                return callback({
                                    name: 'INFO',
                                    message: 'Not found!'
                                });
                            }
                            return callback({
                                name: 'ERROR',
                                message: 'Query returns more than 1 row!'
                            });
                        }
                    }
                });
            } else {
                return callback({
                    name: 'WARN',
                    message: "Cannot use Vertex's methods!"
                });
            }
        });
    }

    /**
     * The vertex iterator for the graph. Utilize this to iterate through all the vertices in the graph.
     * Use with care on large graphs unless used in combination with a key index lookup.
     * To rerieve all objects without regard to the calling object, 'filter' must be set to 1.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} all [Takes 1, to rerieve all objects without regard to the calling object]
     * @param {Function} callback [description]
     * @return {Array of Objects} [description]
     */
    this.V = function(conn, coll, all, callback) {
        if (!all && !callback) {
            throw new Error({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        } else if (!callback) {
            callback = all;
            all = 0;
        }
        if (all != 0 && all != 1)
            return callback({
                name: 'VALIDATION',
                message: 'ARG1 must be set to 0 or 1!'
            });
        eORv(coll, function(e, r) {
            if (r === 'v') {
                async.auto({
                    V: function(cb) {
                        var query = gremlin();
                        if (all === 0)
                            query("g.V.has('@class', '" + coll + "')");
                        if (all === 1)
                            query("g.V");
                        client.fetch(query, function(err, response) {
                            if (err) return cb(err);
                            return cb(null, response);
                        });
                    }
                }, function(err, res) {
                    return callback(err, res.V);
                });
            } else {
                return callback({
                    name: 'WARN',
                    message: "Cannot use Vertex's methods!"
                });
            }
        });
    }

    /**
     * This method returns all of the predecessors of a vertex known from the input values ('type', 'value').
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} type [Label to select]
     * @param {String} value [Value of selection]
     * @param {Function} callback [description]
     * @return {Array of Objects} [description]
     */
    this.inV = function(conn, coll, obj, callback) {
        var key, type, value, nbArgs = 0;
        for (key in obj) {
            type = key;
            value = obj[key];
            nbArgs++;
        }
        if (!obj && !callback) {
            throw new Error({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        }
        if (!callback) {
            callback = obj;
            obj = undefined;
        }
        if (obj && typeof obj !== 'object')
            return callback({
                name: 'VALIDATION',
                message: "ARG1 must be an object!"
            });
        if (nbArgs > 1) {
            return callback({
                name: 'ERROR',
                message: 'ARG1 should take only one argument.'
            });
        }
        if (!type || value === undefined)
            return callback({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        if (!isNaN(type))
            return callback({
                name: 'VALIDATION',
                message: "ARG1's key must be a string!"
            });
        if (type === 'id') {
            var regexID = new RegExp("#[0-9]+:[0-9]+", "g");
            if (!value.match(regexID))
                return callback({
                    name: 'VALIDATION',
                    message: "ID's format is invalid!"
                });
        }
        eORv(coll, function(e, r) {
            if (r === 'v') {
                async.auto({
                    v: function(cb) {
                        new Graph().v(conn, coll, obj, function(err, record) {
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
                            return callback({
                                name: 'INFO',
                                message: 'Vertex not found!'
                            });
                        }
                    }]
                }, function(err, res) {
                    return callback(err, res.inV);
                });
            } else {
                return callback({
                    name: 'WARN',
                    message: "Cannot use Vertex's methods!"
                });
            }
        });
    }

    /**
     * This method returns all of the successors of a vertex known from the input values ('type', 'value').
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} type [Label to select]
     * @param {String} value [Value of selection]
     * @param {Function} callback [description]
     * @return {Array of Objects} [description]
     */
    this.outV = function(conn, coll, obj, callback) {
        var key, type, value, nbArgs = 0;
        for (key in obj) {
            type = key;
            value = obj[key];
            nbArgs++;
        }
        if (!obj && !callback) {
            throw new Error({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        }
        if (!callback) {
            callback = obj;
            obj = undefined;
        }
        if (obj && typeof obj !== 'object')
            return callback({
                name: 'VALIDATION',
                message: "ARG1 must be an object!"
            });
        if (nbArgs > 1) {
            return callback({
                name: 'ERROR',
                message: 'ARG1 should take only one argument.'
            });
        }
        if (!type || value === undefined)
            return callback({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        if (!isNaN(type))
            return callback({
                name: 'VALIDATION',
                message: "ARG1's key must be a string!"
            });
        if (type === 'id') {
            var regexID = new RegExp("#[0-9]+:[0-9]+", "g");
            if (!value.match(regexID))
                return callback({
                    name: 'VALIDATION',
                    message: "ID's format is invalid!"
                });
        }

        eORv(coll, function(e, r) {
            if (r === 'v') {

                async.auto({
                    v: function(cb) {
                        new Graph().v(conn, coll, obj, function(err, record) {
                            if (err) return cb(err);
                            return cb(null, record);
                        });
                    },
                    outV: ['v', function(cb, results) {
                        if (results.v) {
                            var query = gremlin();
                            if (type === 'id') {
                                query("g.v('" + value + "').has('@class', '" + coll + "').out()");
                            } else
                                query("g.V('" + getType(type) + "', '" + value + "').has('@class', '" + coll + "').out()");
                            client.fetch(query, function(err, response) {
                                if (err) return cb(err);
                                return cb(null, response);
                            });
                        } else {
                            return callback({
                                name: 'INFO',
                                message: 'Vertex not found!'
                            });
                        }
                    }]
                }, function(err, res) {
                    return callback(err, res.outV);
                });
            } else {
                return callback({
                    name: 'WARN',
                    message: "Cannot use Vertex's methods!"
                });
            }
        });
    }

    /**
     * Get both successors and the predecessors vertices of a vertex known from the input values ('type', 'value').
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} type [Label to select]
     * @param {String} value [Value of selection]
     * @param {Function} callback [description]
     * @return {Array of Objects} [description]
     */
    this.bothV = function(conn, coll, obj, callback) {
        var key, type, value, nbArgs = 0;
        for (key in obj) {
            type = key;
            value = obj[key];
            nbArgs++;
        }
        if (!obj && !callback) {
            throw new Error({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        }
        if (!callback) {
            callback = obj;
            obj = undefined;
        }
        if (obj && typeof obj !== 'object')
            return callback({
                name: 'VALIDATION',
                message: "ARG1 must be an object!"
            });
        if (nbArgs > 1) {
            return callback({
                name: 'ERROR',
                message: 'ARG1 should take only one argument.'
            });
        }
        if (!isNaN(type))
            return callback({
                name: 'VALIDATION',
                message: "ARG1's key must be a string!"
            });

        eORv(coll, function(e, r) {
            if (r === 'v') {
                async.auto({
                    inV: function(cb) {
                        new Graph().inV(conn, coll, obj, function(err, record) {
                            if (err) return cb(err);
                            return cb(null, record);
                        });
                    },
                    outV: function(cb) {
                        new Graph().outV(conn, coll, obj, function(err, record) {
                            if (err) return cb(err);
                            return cb(null, record);
                        });
                    },
                    bothV: ['inV', 'outV', function(cb, results) {
                        if (results.inV && results.outV) {
                            var arr = results.outV.concat(results.inV);
                            return cb(null, arr);
                        } else {
                            return callback({
                                name: 'INFO',
                                message: 'Vertex not found!'
                            });
                        }
                    }]
                }, function(err, res) {
                    return callback(err, res.bothV);
                });
            } else {
                return callback({
                    name: 'WARN',
                    message: "Cannot use Vertex's methods!"
                });
            }
        });
    }

    /**
     * Gets the incoming edges of the vertex.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} type [Label to select]
     * @param {String} value [Value of selection]
     * @param {Function} callback [description]
     * @return {Array of Objects} [description]
     */
    this.inE = function(conn, coll, obj, label, callback) {
        var key, type, value, nbArgs = 0;
        for (key in obj) {
            type = key;
            value = obj[key];
            nbArgs++;
        }
        if (!obj && !callback) {
            throw new Error({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        }
        if (!label && !callback) {
            callback = obj;
            obj = undefined;
        } else if (!callback) {
            callback = label;
            label = undefined;
        }
        if (obj && typeof obj !== 'object')
            return callback({
                name: 'VALIDATION',
                message: "ARG1 must be an object!"
            });
        if (nbArgs > 1) {
            return callback({
                name: 'ERROR',
                message: 'ARG1 should take only one argument.'
            });
        }
        if (!isNaN(type))
            return callback({
                name: 'VALIDATION',
                message: "ARG1's key must be a string!"
            });
        if (type === 'id') {
            var regexID = new RegExp("#[0-9]+:[0-9]+", "g");
            if (!value.match(regexID))
                return callback({
                    name: 'VALIDATION',
                    message: "ID's format is invalid!"
                });
        }

        eORv(coll, function(e, r) {
            if (r === 'v') {
                async.auto({
                    v: function(cb) {
                        new Graph().v(conn, coll, obj, function(err, record) {
                            if (err) return cb(err);
                            cb(null, record);
                        });
                    },
                    inE: ['v', function(cb, results) {
                        if (results.v) {
                            var query = gremlin();
                            if (label) {
                                if (type === 'id') {
                                    query("g.v('" + value + "').has('@class', '" + coll + "').inE('" + label + "')");
                                } else
                                    query("g.v('" + getType(type) + "', '" + value + "').has('@class', '" + coll + "').inE('" + label + "')");
                            } else {
                                if (type === 'id') {
                                    query("g.v('" + value + "').has('@class', '" + coll + "').inE");
                                } else
                                    query("g.v('" + getType(type) + "', '" + value + "').has('@class', '" + coll + "').inE");
                            }
                            client.fetch(query, function(err, response) {
                                if (err) return cb(err);
                                return cb(null, response);
                            });
                        } else {
                            return callback({
                                name: 'INFO',
                                message: 'Vertex not found!'
                            });
                        }
                    }]
                }, function(err, res) {
                    return callback(err, res.inE);
                });
            } else {
                return callback({
                    name: 'WARN',
                    message: "Cannot use Vertex's methods!"
                });
            }
        });
    }

    /**
     * Gets the outgoing edges of the vertex.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} type [Label to select]
     * @param {String} value [Value of selection]
     * @param {Function} callback [description]
     * @return {Array of Objects} [description]
     */
    this.outE = function(conn, coll, obj, label, callback) {
        var key, type, value, nbArgs = 0;
        for (key in obj) {
            type = key;
            value = obj[key];
            nbArgs++;
        }
        if (!obj && !label && !callback) {
            throw new Error({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        }
        if (!label && !callback) {
            callback = obj;
            obj = undefined;
        } else if (!callback) {
            callback = label;
            label = undefined;
        }
        if (obj && typeof obj !== 'object')
            return callback({
                name: 'VALIDATION',
                message: "ARG1 must be an object!"
            });
        if (nbArgs > 1) {
            return callback({
                name: 'ERROR',
                message: 'ARG1 should take only one argument.'
            });
        }
        if (!isNaN(type))
            return callback({
                name: 'VALIDATION',
                message: "ARG1's key must be a string!"
            });

        eORv(coll, function(e, r) {
            if (r === 'v') {
                async.auto({
                    v: function(cb) {
                        new Graph().v(conn, coll, obj, function(err, record) {
                            if (err) return cb(err);
                            cb(null, record);
                        });
                    },
                    outE: ['v', function(cb, results) {
                        if (results.v) {
                            var query = gremlin();
                            if (label) {
                                if (type === 'id') {
                                    query("g.v('" + value + "').has('@class', '" + coll + "').outE('" + label + "')");
                                } else
                                    query("g.v('" + getType(type) + "', '" + value + "').has('@class', '" + coll + "').outE('" + label + "')");
                            } else {
                                if (type === 'id') {
                                    query("g.v('" + value + "').has('@class', '" + coll + "').outE");
                                } else
                                    query("g.v('" + getType(type) + "', '" + value + "').has('@class', '" + coll + "').outE");
                            }
                            client.fetch(query, function(err, response) {
                                if (err) return cb(err);
                                return cb(null, response);
                            });
                        } else {
                            return callback({
                                name: 'INFO',
                                message: 'Vertex not found!'
                            });
                        }
                    }]
                }, function(err, res) {
                    return callback(err, res.outE);
                });
            } else {
                return callback({
                    name: 'WARN',
                    message: "Cannot use Vertex's methods!"
                });
            }
        });
    }

    /**
     * Get both incoming and outgoing edges of the vertex.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} type [Label to select]
     * @param {String} value [Value of selection]
     * @param {Function} callback [description]
     * @return {Array of Objects} [description]
     */
    this.bothE = function(conn, coll, obj, callback) {
        var key, type, value, nbArgs = 0;
        for (key in obj) {
            type = key;
            value = obj[key];
            nbArgs++;
        }
        if (!obj && !callback) {
            throw new Error({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        }
        if (!callback) {
            callback = obj;
            obj = undefined;
        }
        if (obj && typeof obj !== 'object')
            return callback({
                name: 'VALIDATION',
                message: "ARG1 must be an object!"
            });
        if (nbArgs > 1) {
            return callback({
                name: 'ERROR',
                message: 'ARG1 should take only one argument.'
            });
        }
        if (!isNaN(type))
            return callback({
                name: 'VALIDATION',
                message: "ARG1's key must be a string!"
            });

        eORv(coll, function(e, r) {
            if (r === 'v') {
                async.auto({
                    inE: function(cb) {
                        new Graph().inE(conn, coll, obj, undefined, function(err, record) {
                            if (err) return cb(err);
                            return cb(null, record);
                        });
                    },
                    outE: function(cb) {
                        new Graph().outE(conn, coll, obj, undefined, function(err, record) {
                            if (err) return cb(err);
                            return cb(null, record);
                        });
                    },
                    bothE: ['inE', 'outE', function(cb, results) {
                        if (results.inE && results.outE) {
                            var arr = results.outE.concat(results.inE);
                            return cb(null, arr);
                        } else {
                            return cb(null, []);
                        }
                    }]
                }, function(err, res) {
                    return callback(err, res.bothE);
                });
            } else {
                return callback({
                    name: 'WARN',
                    message: "Cannot use Vertex's methods!"
                });
            }
        });
    }

    /**
     * Allow elements to pass that have their property in the provided start and end interval.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} type [Label to select]
     * @param {String} value1 [Value inf of selection]
     * @param {String} value2 [Value sup of selection]
     * @param {Function} callback [description]
     * @return {Array of Objects} [description]
     */
    this.interval = function(conn, coll, label, value1, value2, callback) {
        if (!label || value1 === undefined || value2 === undefined)
            return callback({
                name: 'VALIDATION',
                message: 'Some arguments are missing!'
            });
        if (typeof value1 !== 'number' || typeof value2 !== 'number')
            return callback({
                name: 'VALIDATION',
                message: 'ARG2 and ARG3 must be numbers!'
            });
        if (!isNaN(type))
            return callback({
                name: 'VALIDATION',
                message: 'ARG1 must be a string!'
            });

        async.auto({
            interval: function(cb) {
                var query = gremlin();
                query("g.V.has('@class', '" + coll + "').interval('" + label + "'," + value1 + "," + value2 + ")");
                client.fetch(query, function(err, response) {
                    if (err) return cb({
                        name: 'ERROR',
                        message: err
                    });
                    return cb(null, response);
                });
            }
        }, function(err, res) {
            return callback(err, res.interval);
        });
    }

    /**
     * Gets an element if it has a particular property.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} label [Label to select]
     * @param {String} value [Value inf of selection]
     * @param {String} type [Nature of the object to select]
     * @param {Function} callback [description]
     * @return {Array of Objects} [description]
     */
    this.has = function(conn, coll, obj, type, callback) {
        var key, label, value, nbArgs = 0;
        for (key in obj) {
            label = key;
            value = obj[key];
            nbArgs++;
        }
        if (!obj && !type && callback) {
            throw new Error({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        }
        if (!type && !callback) {
            callback = obj;
            obj = undefined;
        } else if (!callback) {
            callback = type;
            type = undefined;
        }
        if (obj && typeof obj !== 'object')
            return callback({
                name: 'VALIDATION',
                message: "ARG1 must be an object!"
            });
        if (nbArgs > 1) {
            return callback({
                name: 'ERROR',
                message: 'ARG1 should take only one argument.'
            });
        }
        if (!label || value === undefined || !type)
            return callback({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        type = type.toLowerCase();
        if (type !== 'vertex' && type !== 'edge' &&  type !== 'all')
            return callback({
                name: 'VALIDATION',
                message: "ARG2 must take as value 'vertex', 'edge' or 'all'!"
            });
        if (!isNaN(label))
            return callback({
                name: 'VALIDATION',
                message: "ARG1's key must be a string!"
            });
        var query = gremlin();
        async.auto({
            V: function(cb) {
                if (type === 'all' || type === 'vertex') {
                    if (label === 'id')
                        query("g.v(%s)", value);
                    else if (typeof value == 'string')
                        query("g.V.has('@class', '" + coll + "').has(%s, %s)", label, value);
                    else
                        query("g.V.has('@class', '" + coll + "').has(%s, %d)", label, value);
                    client.execute(query, function(err, response) {
                        console.log(type, value, response);
                        if (err) return cb({
                            name: 'ERROR',
                            message: err
                        });
                        return cb(null, response.results);
                    });
                } else
                    return cb(null);
            },
            E: function(cb) {
                if (type === 'all' || type === 'edge') {
                    if (label === 'id')
                        query("g.e(%s)", value);
                    else if (typeof value == 'string')
                        query("g.E.has('@class', '" + coll + "').has(%s, %s)", label, value);
                    else
                        query("g.E.has('@class', '" + coll + "').has(%s, %d)", label, value);
                    client.execute(query, function(err, response) {
                        if (err) return cb({
                            name: 'ERROR',
                            message: err
                        });
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
                    var arr = results.V.concat(results.E)
                    return cb(null, arr);
                } else {
                    return cb(null, []);
                }
            }]
        }, function(err, res) {
            return callback(err, res.has);
        });
    }

    /**
     * Gets an element if it has not a particular property.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} label [Label to select]
     * @param {String} value [Value inf of selection]
     * @param {String} type [Nature of the object to select]
     * @param {Function} callback [description]
     * @return {Array of Objects} [description]
     */
    this.hasNot = function(conn, coll, obj, type, callback) {
        var key, label, value, nbArgs = 0;
        for (key in obj) {
            label = key;
            value = obj[key];
            nbArgs++;
        }
        if (!obj && !type && callback) {
            throw new Error({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        }
        if (!type && !callback) {
            callback = obj;
            obj = undefined;
        } else if (!callback) {
            callback = type;
            type = undefined;
        }
        if (obj && typeof obj !== 'object')
            return callback({
                name: 'VALIDATION',
                message: "ARG1 must be an object!"
            });
        if (nbArgs > 1) {
            return callback({
                name: 'ERROR',
                message: 'ARG1 should take only one argument.'
            });
        }
        if (!label || value === undefined || !type)
            return callback({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        if (!isNaN(label))
            return callback({
                name: 'VALIDATION',
                message: "ARG1's key must be a string!"
            });
        type = type.toLowerCase();
        if (type !== 'vertex' && type !== 'edge' &&  type !== 'all')
            return callback({
                name: 'VALIDATION',
                message: "ARG2 must take as value 'vertex', 'edge' or 'all'!"
            });

        var query = gremlin();
        async.auto({
            V: function(cb) {
                if (type === 'all' || type === 'vertex') {
                    query("g.E.has('@class', '" + coll + "').hasNot(" + getType(label) + ", " + value + ")");
                    client.execute(query, function(err, response) {
                        if (err) return cb({
                            name: 'ERROR',
                            message: err
                        });
                        return cb(null, response.results);
                    });
                } else
                    return cb(null);
            },
            E: function(cb) {
                if (type === 'all' || type === 'edge') {
                    query("g.E.has('@class', '" + coll + "').hasNot(" + getType(label) + ", " + value + ")");
                    client.execute(query, function(err, response) {
                        if (err) return cb({
                            name: 'ERROR',
                            message: err
                        });
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
                    var arr = results.V.concat(results.E)
                    return cb(null, arr);
                } else {
                    return cb(null, []);
                }
            }]
        }, function(err, res) {
            return callback(err, res.has);
        });
    }

    /**
     * Removes a vertex according to the input values.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} type [Label to select]
     * @param {String} value [Value inf of selection]
     * @param {Function} callback [description]
     * @return {Object} [description]
     */
    this.removeVertex = function(conn, coll, obj, callback) {
        var key, type, value, nbArgs = 0;
        for (key in obj) {
            type = key;
            value = obj[key];
            nbArgs++;
        }
        if (!type && value === undefined && !callback && !obj) {
            throw new Error({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        }
        if (!callback) {
            callback = obj;
            obj = undefined;
        }
        if (obj && typeof obj !== 'object')
            return callback({
                name: 'VALIDATION',
                message: "ARG1 must be an object!"
            });
        if (nbArgs > 1) {
            return callback({
                name: 'ERROR',
                message: 'ARG1 should take only one argument.'
            });
        }
        if (value === undefined || !type)
            return callback({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        if (!isNaN(type))
            return callback({
                name: 'VALIDATION',
                message: "ARG1's key must be a string!"
            });
        if (type === 'id') {
            var regexID = new RegExp("#[0-9]+:[0-9]+", "g");
            if (!value.match(regexID))
                return callback({
                    name: 'VALIDATION',
                    message: "ID's format is invalid!"
                });
        }

        eORv(coll, function(e, r) {
            if (r === 'v') {
                async.auto({
                    removeV: function(cb) {
                        var query = gremlin();
                        if (type === 'id') {
                            query('g.removeVertex(g.v(%s))', value);
                        } else
                            query('g.removeVertex(g.v(%s, %s))', getType(type), value);
                        client.execute(query, function(err, vertex) {
                            if (err) return cb(err);
                            cb(null, vertex);
                        });
                    }
                }, function(err, res) {
                    return callback(err, res.removeV);
                });
            } else {
                return callback({
                    name: 'WARN',
                    message: "Cannot use Vertex's methods!"
                });
            }
        });
    }

    /**
     * Removes a all of the vertices.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} type [Label to select]
     * @param {String} value [Value inf of selection]
     * @param {Function} callback [description]
     * @return {Object} [description]
     */
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
                    return callback(err, res.removeV);
                });
            } else {
                return callback({
                    name: 'WARN',
                    message: "Cannot use Vertex's methods!"
                });
            }
        });
    }

    /************************************************************************************/
    /*                                       EDGE                                       */
    /************************************************************************************/

    /**
     * Get an edge or set of edges by providing one or more edge identifiers.
     * The identifiers must be the identifiers assigned by the underlying graph implementation.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} type [Label to select]
     * @param {String} value [Value of selection]
     * @param {Function} callback [description]
     * @return {Object} [description]
     */
    this.e = function(conn, coll, obj, callback) {
        var key, type, value, nbArgs = 0;
        for (key in obj) {
            type = key;
            value = obj[key];
            nbArgs++;
        }
        if (!obj && !callback) {
            throw new Error({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        }
        if (!callback) {
            callback = obj;
            obj = undefined;
        }
        if (obj && typeof obj !== 'object')
            return callback({
                name: 'VALIDATION',
                message: "ARG1 must be an object!"
            });
        if (nbArgs > 1) {
            return callback({
                name: 'ERROR',
                message: 'ARG1 should take only one argument.'
            });
        }
        if (!type || value === undefined)
            return callback({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        if (!isNaN(type))
            return callback({
                name: 'VALIDATION',
                message: "ARG1's key must be a string!"
            });
        if (type === 'id') {
            var regexID = new RegExp("#[0-9]+:[0-9]+", "g");
            if (!value.match(regexID))
                return callback({
                    name: 'VALIDATION',
                    message: "ID's format is invalid!"
                });
        }
        eORv(coll, function(e, r) {
            if (r === 'e') {
                var query = gremlin();
                async.auto({
                    e: function(cb) {
                        if (type === 'id') {
                            query("g.e('" + value + "')");
                        } else
                            query("g.E('" + getType(type) + "', '" + value + "')");
                        client.fetch(query, function(err, edge) {
                            if (err) return cb(err);
                            return cb(null, edge);
                        });
                    },
                    has: ["e", function(cb, results) {
                        if (results.e) {
                            if (type === 'id') {
                                query("g.e('" + value + "').has('@class', '" + coll + "')");
                            } else
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
                        return callback({
                            name: 'ERROR',
                            message: "Query returns more than 1 row!"
                        });
                    }
                });
            } else {
                return callback({
                    name: 'WARN',
                    message: "Cannot use Edge's methods!"
                });
            }
        });
    }

    /**
     * The edge iterator for the graph. Utilize this to iterate through all the edges in the graph.
     * Use with care on large graphs unless used in combination with a key index lookup.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {Function} callback [description]
     * @return {Array of Objects} [description]
     */
    this.E = function(conn, coll, callback) {
        if (!callback) {
            throw new Error({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        }
        eORv(coll, function(e, r) {
            if (r === 'e') {
                var query = gremlin();
                query("g.E.has('@class', '" + coll + "')");
                client.fetch(query, function(err, response) {
                    if (err) return callback({
                        name: 'ERROR',
                        message: err
                    });
                    return callback(null, response);
                });
            } else {
                return callback({
                    name: 'WARN',
                    message: "Cannot use Edge's methods!"
                });
            }
        });
    }

    /**
     * Removes an edge according to the input values.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} type [Label to select]
     * @param {String} value [Value inf of selection]
     * @param {Function} callback [description]
     * @return {Object} [description]
     */
    this.removeEdge = function(conn, coll, obj, callback) {
        if (!obj && !callback) {
            throw new Error({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        } else if (!callback) {
            if (typeof obj == 'function') {
                callback = obj;
                obj = undefined;
                return callback({
                    name: 'ERROR',
                    message: 'Some arguments are missing!'
                });
            }
        }

        var key, type, value, nbArgs = 0;
        for (key in obj) {
            type = key;
            value = obj[key];
            nbArgs++;
        }

        if (obj && typeof obj !== 'object')
            return callback({
                name: 'VALIDATION',
                message: "ARG1 must be an object!"
            });
        if (nbArgs > 1) {
            return callback({
                name: 'ERROR',
                message: 'ARG1 should take only one argument.'
            });
        }
        if (!isNaN(type))
            return callback({
                name: 'VALIDATION',
                message: "ARG1's key must be a string!"
            });
        var regexID = new RegExp("#[0-9]+:[0-9]+", "g");
        if (!value.match(regexID))
            return callback({
                name: 'VALIDATION',
                message: "ID's format is invalid!"
            });
        eORv(coll, function(e, r) {
            if (r === 'e') {
                async.auto({
                    removeE: function(cb) {
                        var query = gremlin();
                        if (type === 'id') {
                            query('g.removeEdge(g.e(%s))', value);
                        } else
                            query('g.removeEdge(g.E(%s, %s))', getType(type), value);
                        client.execute(query, function(err, edge) {
                            if (err) return cb(err);
                            return cb(null, edge.results);
                        });
                    }
                }, function(err, res) {
                    return callback(err, res.removeE);
                });
            } else {
                return callback({
                    name: 'WARN',
                    message: "Cannot use Edge's methods!"
                });
            }
        });
    }

    /************************************************************************************/
    /*                                     INDEX                                        */
    /************************************************************************************/

    /**
     * Get an manual index by its name.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} nameIdx [Name of the index to get]
     * @param {Function} callback [description]
     * @return {Object} [description]
     */
    this.idx = function(conn, coll, nameIdx, callback) {
        if (!nameIdx)
            return callback({
                name: 'VALIDATION',
                message: 'Some arguments are missing!'
            });
        if (typeof nameIdx !== 'string')
            return callback({
                name: 'VALIDATION',
                message: 'ARG1 must be a string!'
            });

        async.auto({
            idx: function(cb) {
                var query = gremlin();
                query("g.idx('" + idx + "')");
                client.fetch(query, function(err, idx) {
                    if (err) return cb({
                        name: 'ERROR',
                        message: err
                    });
                    return cb(null, edge);
                });
            }
        }, function(err, res) {
            return callback(err, res.idx);
        });
    }

    /**
     * Puts an index on a vertex.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} nameIdx [Name of the index to get]
     * @param {String} label [Label to select]
     * @param {String} property [Value of selection]
     * @param {String} idV [ID of the vertex to select]
     * @param {Function} callback [description]
     * @return {Object} [description]
     */
    this.putIdx = function(conn, coll, nameIdx, label, property, idV, callback) {
        if (!nameIdx ||  !label || !property || !idV)
            return callback({
                name: 'VALIDATION',
                message: 'Some arguments are missing!'
            });
        if (typeof nameIdx !== 'string' ||  typeof label !== 'string' ||  typeof property !== 'string' ||  typeof idV !== 'string')
            return callback({
                name: 'VALIDATION',
                message: 'ARG1, ARG2, ARG3, ARG4 and ARG5 must be a strings!'
            });

        async.auto({
            v: function(cb) {
                new Graph().v(conn, coll, "id", idV, function(err, res) {
                    if (err) return cb({
                        name: 'ERROR',
                        message: err
                    });
                    return cb(null, res);
                });
            },
            putIdx: ['v', function(cb, results) {
                if (results.v) {
                    var query = gremlin();
                    query("g.idx(" + nameIdx + ").put(" + label + ", " + property + ", g.v(" + idV + "))");
                    client.execute(query, function(err, obj) {
                        if (err) return cb({
                            name: 'ERROR',
                            message: err
                        });
                        return cb(null, obj);
                    });
                }
            }]
        }, function(err, res) {
            return callback(err, res.putIdx);
        });
    }

    /************************************************************************************/
    /*                                     GLOBAL                                       */
    /************************************************************************************/

    /**
     * Emit only incoming objects that have not been seen before with an optional closure being the object to check on.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {T} obj [description]
     * @param {Function} callback [description]
     * @return {T} [description]
     */
    this.dedup = function(conn, coll, obj, callback) {
        if (!obj)
            return callback({
                name: 'VALIDATION',
                message: 'Some arguments are missing!'
            });
        if (obj instanceof Array) {
            _.union(obj);
            return callback(null, obj);
        }
        return callback(null, obj);
    }

    /**
     * Counts the number of elements of the input array.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {T} obj [description]
     * @param {Function} callback [description]
     * @return {T} [description]
     */
    this.count = function(conn, coll, obj, callback) {
        if (!obj)
            return callback({
                name: 'VALIDATION',
                message: 'Some arguments are missing!'
            });
        if (obj instanceof Array)
            return callback(null, obj.length);
        if (obj === null || obj === {})
            return callback(null, 0);
        return callback(null, 1);
    }

    /**
     * Collect all objects up to that step and process the gathered list with the provided closure.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} type [Type of the operation]
     * @param {String} idV [ID of the selected vertex]
     * @param {String} condition [condition to perform]
     * @param {Function} callback [description]
     * @return {T} [description]
     */
    this.gather = function(conn, coll, type, idV, condition, callback) {
        if (!type && !idV && !condition && !callback) {
            throw new ERROR({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        } else if (!callback) {
            if (typeof type == 'function') {
                callback = type;
                type = undefined;
            }
            if (typeof idV == 'function') {
                callback = idV;
                idV = undefined;
            }
            if (typeof condition == 'function') {
                callback = condition;
                condition = undefined;
            }
        }
        eORv(coll, function(e, r) {
            if (r === 'v') {
                if (idV === undefined || condition === undefined || type === undefined)
                    return callback({
                        name: 'ERROR',
                        message: 'Some arguments are missing!'
                    });
                if (typeof idV !== 'string' || typeof condition !== 'string' || !isNaN(type))
                    return callback({
                        name: 'VALIDATION',
                        message: 'ARG1, ARG2 and ARG3 must be a strings!'
                    });
                if (type !== 'all' && type !== 'in' && type !== 'out')
                    return callback({
                        name: 'VALIDATION',
                        message: 'ARG1 must be in, out or all'
                    });
                var query;
                condition = reWrite(condition);
                async.auto({
                    v: function(cb) {
                        new Graph().v(conn, coll, {
                            "id": idV
                        }, function(err, res) {
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
                            return callback({
                                name: 'INFO',
                                message: 'Vertex not found!'
                            });
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
                            return callback({
                                name: 'INFO',
                                message: 'Vertex not found!'
                            });
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
                    return callback(err, res.gather);
                });
            } else {
                return callback({
                    name: 'WARN',
                    message: "Cannot use Edge's methods!"
                });
            }
        });
    }

    /**
     * An element-centric mutation that takes every incoming vertex and creates an edge to the provided vertex. 
     * It can be used with both a Vertex object or a named step.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} idV [ID of the vertex to link]
     * @param {String} labelE [Label of the edge]
     * @param {Array of Strings} arrIdVs [IDs of vertices to link with]
     * @param {Function} callback [description]
     * @return {T} [description]
     */
    this.linkBoth = function(conn, coll, idV, labelE, arrIdVs, callback) {
        if(!idV && !arrIdVs && !labelE && !callback){
            throw new Error({
                        name: 'ERROR',
                        message: 'Some arguments are missing!'
                    });
        }else if(!callback){
            if(typeof idV == 'function'){
                callback = idV ;
                idV =undefined;
            }
            if(typeof arrIdVs == 'function'){
                callback = arrIdVs ;
                arrIdVs =undefined;
            }
            if(typeof labelE == 'function'){
                callback = labelE ;
                labelE =undefined;
            }
        }

        eORv(coll, function(e, r) {
            if (r === 'v') {
                if (idV === undefined || labelE === undefined || arrIdVs === undefined)
                    return callback({
                        name: 'ERROR',
                        message: 'Some arguments are missing!'
                    });
                if (!(arrIdVs instanceof Array))
                    return callback({name:'VALIDATION',message:'ARG2 must be an array of Ids!'});
                if (typeof idV !== 'string' || typeof labelE !== 'string')
                    return callback({name :'VALIDATION',message:'ARG1 and ARG3 must be a strings!'});

                var arrStr = "";
                async.auto({
                        V: function(cb) {
                            new Graph().V(conn, coll, 1, function(err, res) {
                                if (err) return cb(err);
                                return cb(null, res);
                            });
                        },
                        e: function(cb) {
                            var query = gremlin();
                            query("g.E('@class', '" + labelE + "')");
                            client.fetch(query, function(err, edge) {
                                if (err) return cb(err);
                                return cb(null, edge);
                            });
                        },
                        except: ['V', 'e', function(cb, results) {
                            if (results.e) {
                                for (var k = 0; k < arrIdVs.length; k++) {
                                    for (var j = 0; j < results.V.length; j++) {
                                        if (arrIdVs[k] === results.V[j]._id) {
                                            results.V.splice(j, 1);
                                            j--;
                                            break;
                                        }
                                    }
                                }
                                for (var i = 0; i < results.V.length; i++) {
                                    if (i !== 0) arrStr += ", ";
                                    arrStr += "g.v('" + results.V[i]._id + "')";
                                }
                                if (results.V.length) {
                                    arrStr += ", "
                                }
                                var query = gremlin();
                                query("g.V.except([" + arrStr + " g.v('" + idV + "')]).linkBoth('" + labelE + "', g.v('" + idV + "'))");
                                client.execute(query, function(err, response) {
                                    if (err && err.indexOf("Transaction was rolled back more times than it was started."))
                                        return cb({
                                            name: 'ERROR',
                                            message: 'These vertices are already linked.'
                                        })
                                    if (err) return cb({
                                        name: 'ERROR',
                                        message: err
                                    });
                                    return cb(null, response);
                                });
                            } else {
                                return callback({
                                    name: 'WARN',
                                    message: "Class of Edges doesn't exist!"
                                });
                            }
                        }]
                    },
                    function(err, res) {
                        return callback(err, res.except);
                    });
            } else {
                return callback({
                    name: 'WARN',
                    message: "Cannot use Vertex's methods!"
                });
            }
        });
    }

    /**
     * Decide whether to allow an object to pass. Return true from the closure to allow an object to pass.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} criteria [criteria of selection]
     * @param {Function} callback [description]
     * @return {Array of Objects} [description]
     */
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
                        return callback(err, res.filter.results);
                    });
                } else if (typeof criteria === 'object' || criteria instanceof 'array') {
                    var i = 0,
                        arr = [],
                        arrObj = [],
                        key;
                    for (key in criteria) {
                        var newObj = {};
                        newObj['key'] = key;
                        newObj['value'] = criteria[key];
                        arrObj.push(newObj);
                    }
                    async.eachSeries(arrObj, function(item, cb) {
                            if (i === 0) {
                                new Graph().has(conn, coll, item.key, item.value, 'all', function(err, res) {
                                    if (err) return callback({
                                        name: 'ERROR',
                                        message: err
                                    });
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
                            return callback(err, res);
                        });
                } else {
                    return callback({
                        name: 'VALIDATION',
                        message: "ARG1 must be a string!"
                    });
                }
            } else {
                return callback({
                    name: 'WARN',
                    message: "Cannot use Vertex's methods!"
                });
            }
        });
    }

    /**
     * Implements the if-then-else conditional logic.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} type [Type of the operation to apply to the selected vertex: 'in', 'out', 'all']
     * @param {String} idV [ID of the vertex to select]
     * @param {String} condition [condition to set]
     * @param {String} attTrue [Attribut to select if the condition is true]
     * @param {String} attFalse [Attribut to select if the condition is false]
     * @param {Function} callback [description]
     * @return {T} [description]
     */
    this.ifThenElse = function(conn, coll, type, idV, condition, attTrue, attFalse, callback) {
        if (!type &&  !idV &&  !condition && !attTrue && !attFalse & !callback)
            throw new Error({
                name: 'VALIDATION',
                message: 'Some arguments are missing!'
            });
        else if (!callback) {
            if (typeof type == 'function') {
                callback = type;
                type = undefined;
            }
            if (typeof idV == 'function') {
                callback = idV;
                idV = undefined;
            }
            if (typeof condition == 'function') {
                callback = condition;
                condition = undefined;
            }
            if (typeof attFalse == 'function') {
                callback = attFalse;
                attFalse = undefined;
            }
            if (typeof attTrue == 'function') {
                callback = attTrue;
                attTrue = undefined;
            }
        }
        if (!type ||  !idV ||  !condition || !attTrue || !attFalse)
            return callback({
                name: 'VALIDATION',
                message: 'Some arguments are missing!'
            });
        if (!isNaN(type) || typeof idV !== 'string' || typeof condition !== 'string' || typeof attTrue !== 'string' || typeof attFalse !== 'string')
            {
                return callback({
                name: 'VALIDATION',
                message: 'ARG1, ARG2, ARG3, ARG4 and ARG5 must be a strings!'
            });}
        if (type !== 'in' && type !== 'out' && type !== 'all')
            return callback({
                name: 'VALIDATION',
                message: "ARG1 must take as value 'in', 'out' or 'all'!"
            });

        var query = gremlin();
        condition = reWrite(condition);
        (attTrue === '_id') ? 'id' : 'id';
        (attFalse === '_id') ? 'id' : 'id';
        async.auto({
            v: function(cb) {
                query("g.v('" + idV + "')");
                client.fetch(query, function(err, res) {
                    if (res == null) return cb({
                        name: 'ERROR',
                        message: 'ID Not Found !'
                    });

                    if (err) return cb({
                        name: 'ERROR',
                        message: 'ERROR'
                    });
                    return cb(null, res);
                });
            },
            out: function(cb) {
                query("g.v('" + idV + "').out.ifThenElse{" + condition + "}{it." + attTrue + "}{it." + attFalse + "}");
                client.fetch(query, function(err, res) {
                    if (err) return cb({
                        name: 'ERROR',
                        message: err
                    });
                    return cb(null, res);
                });

            },
            in : function(cb) {
                query("g.v('" + idV + "').in.ifThenElse{" + condition + "}{it." + attTrue + "}{it." + attFalse + "}");
                client.fetch(query, function(err, res) {
                    if (err) return cb({
                        name: 'ERROR',
                        message: err
                    });
                    return cb(null, res);
                });

            },
            all: ['out', 'in', function(cb, results) {
                if (type === 'in')
                    return callback(null, results.in);
                if (type === 'out')
                    return callback(null, results.out);
                results.all = results.out.concat(results.in);
                if (type === 'all')
                    return callback(null, results.all);


            }]
        }, function(err, res) {
            return callback(err, res);
        });
    }

    /**
     * Implements the ForEach iteration. Applus a specific action to each element of the array.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {Array of Objects} obj [Objects on which the operation will be applied]
     * @param {String} action [action to make; only 'remove' is implemented]
     * @param {Function} callback [description]
     * @return {T} [description]
     */
    this.each = function(conn, coll, obj, action, callback) {
        if (!obj && !action && !callback) {
            throw new Error({
                name: 'VALIDATION',
                message: 'Some arguments are missing!'
            });
        } else if (!callback) {
            if (typeof obj == 'function') {
                callback = obj;
                obj = undefined;
            }
            if (typeof action == 'function') {
                callback = action;
                action = undefined;
            }
        }
        if (!obj || !action)
            return callback({
                name: 'VALIDATION',
                message: 'Some arguments are missing!'
            });
        if (obj && typeof obj !== 'object')
            return callback('ARG1 must be an object!');
        if (typeof action !== 'string')
            return callback('ARG2 must be a string!');

        eORv(coll, function(req, res) {
            if (res === 'v') {

                if (obj instanceof Array) {
                    async.eachSeries(obj, function(item, cb) {
                        if (action === 'remove') {
                            if (item._type === 'vertex')
                                new Graph().removeVertex(conn, coll, 'id', item._id, cb);
                            if (item._type === 'edge')
                                new Graph().removeEdge(conn, coll, 'id', item._id, cb);
                        }
                    }, function(err) {
                        if (err) return callback({
                            name: 'ERROR',
                            message: err
                        });
                        return callback(err, "Finished By Sucess");
                    });
                } else {
                    if (action === 'remove') {
                        if (obj._type === 'vertex')
                            new Graph().removeVertex(conn, coll, 'id', obj._id, function(err, res) {
                                if (err) return callback({
                                    name: 'ERROR',
                                    message: err
                                });
                                return callback(err, res);
                            });
                        if (obj._type === 'edge')
                            new Graph().removeEdge(conn, coll, 'id', obj._id, function(err, res) {
                                if (err) return callback({
                                    name: 'ERROR',
                                    message: err
                                });
                                return callback(err, res);
                            });
                    }
                }
            } else {
                return callback({
                    name: 'WARN',
                    message: "Cannot use Vertex's methods!"
                });
            }
        });
    }

    /**
     * Gets all of the vertices with which the selected vertex is related according to the label of the connection.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} type [Type of the operation to apply to the selected vertex: 'in', 'out', 'all']
     * @param {String} id [ID of the vertex to select]
     * @param {String} label [Label of connection]
     * @param {Function} callback [description]
     * @return {T} [description]
     */
    this.bothByLabel = function(conn, coll, type, id, label, callback) {
        if (!type && !id && !label && !callback)
            throw new Error({
                name: 'VALIDATION',
                message: 'Some arguments are missing!'
            });
        else if(!callback){
            if(typeof type == 'function'){
                callback = type;
                type = undefined;
            }
            if(typeof id == 'function'){
                callback = id;
                id = undefined;
            }
            if(typeof label == 'function'){
                callback = label;
                label = undefined;
            }
        }
        if (!type || !id || !label)
            return callback({
                name: 'VALIDATION',
                message: 'Some arguments are missing!'
            });
        if (typeof type !== 'string' || typeof id !== 'string' || typeof label !== 'string')
            return callback({name : 'VALIDATION',message :'ARG1, ARG2 and ARG3 must be a strings!'});
        if (type !== 'in' && type !== 'out' && type !== 'all')
            return callback({name:'VALIDATION',message:"ARG1 must take as value 'in', 'out' or 'all'!"});

        var query = gremlin();
        async.auto({
            e: function(cb) {
               var query = gremlin();
               query("g.E.has('@class','"+label+"')");
               client.fetch(query,function(err,res){
                if(err) return cb({name :'ERROR', message :err});
                if(res.length==0) return cb({name :'ERROR',message :'Label Not Found'});
                return cb(null,res);
               });
            },
            v: function(cb) {
                new Graph().v(conn, coll, {"id":id}, 'all', function(err, res) {
                    if (err) return cb({
                        name: 'ERROR',
                        message: err
                    });
                    return cb(null, res);
                });
            },
            out: ['e', 'v', function(cb, results) {
                if (results.v && results.e) {
                    var acc = [],
                        arr = [];
                    new Graph().outE(conn, coll, {"id":id}, label, function(err, res) {
                        arr = res;
                        async.eachSeries(arr, function(item, callback1) {
                            new Graph().v(conn, coll, {"id": item._inV}, 'all', function(err, res) {
                                acc.push(res);
                                return callback1();
                            });
                        }, function(err) {
                            if (err) return cb(err);
                            return cb(null, acc);
                        });
                    });
                } else {
                    return cb('No row selected!', null);
                }
            }],
            in : ['e', 'v', function(cb, results) {
                if (results.v && results.e) {
                    var acc = [],
                        arr = [];
                    new Graph().inE(conn, coll, {"id": id}, label, function(err, res) {
                        arr = res;
                        async.eachSeries(arr, function(item, callback1) {
                            new Graph().v(conn, coll, {"id":item._outV}, 'all', function(err, res) {
                                acc.push(res);
                                callback1();
                            });
                        }, function(err) {
                            if (err) return cb(err);
                            return cb(null, acc);
                        });
                    });
                } else {
                    return cb({
                        name: 'WARN',
                        message: "No row selected!"
                    });
                }
            }],
            all: ['e', 'v', 'out', 'in', function(cb, results) {
                if (results.v && results.e) {
                    if (type === 'in')
                        return cb(null, results.in);
                    if (type === 'out')
                        return cb(null, results.out)
                    results.all = results.out.concat(results.in);
                    if (type === 'all')
                        return cb(null, results.all);
                } else {
                    return cb({
                        name: 'WARN',
                        message: "No row found!"
                    });

                }
            }]
        }, function(err, res) {
            return callback(err, res.all);
        });
    }

    /**
     * Gets the label of an edge or a vertex.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} id [ID of the vertex or the edge to select]
     * @param {Function} callback [description]
     * @return {T} [description]
     */
    this.getLabels = function(conn, coll, id, callback) {
        if(!id && !callback){
            throw new Error({
                name: 'VALIDATION',
                message: 'Some arguments are missing!'
            })
        }else if(!callback){
            if(typeof id =='function'){
                callback = id;
                id =undefined;
            }
        }
        if (!id)
            return callback({
                name: 'VALIDATION',
                message: 'Some arguments are missing!'
            });
        if (typeof id !== 'string')
            return callback({
                name: 'VALIDATION',
                message: "ARG1 must be a string!"
            });

        async.auto({
            v: function(cb) {
                new Graph().v(conn, coll, {"id": id}, function(err, res) {
                    if (err) return cb({
                        name: 'ERROR',
                        message: err
                    });
                    return cb(null, res);
                });
            },
            e: ['v',function(cb,results) {
                if(!results.v){
                new Graph().e(conn, coll, {"id": id}, function(err, res) {
                    if (err) return cb({
                        name: 'ERROR',
                        message: err
                    });
                    return cb(null, res);
                });
                }
                return cb(null)
            }],
            getP: ['v', 'e', function(cb, results) {
                var query = gremlin();
                if (results.e)
                    query('g.e(%s).outE.label', id);
                if (results.v)
                    query("g.v(%s).has('@class', '" + coll + "').outE.label", id);
                if (!results.v && !results.e)
                    return callback({name :'ERROR',message:'Element not found!'});
                client.execute(query, function(err, properties) {
                    if (err) return cb({
                        name: 'ERROR',
                        message: err
                    });
                    return cb(null, properties);
                });
            }]
        }, function(err, res) {
            return callback(err, res.getP.results);
        });
    }

    /**
     * Get the property value of a vertex.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} id [ID of the vertex to select]
     * @param {String} label [Label to select]
     * @param {Function} callback [description]
     * @return {T} [description]
     */
    this.getProperty = function(conn, coll, id, label, callback) {
        if(!id && !label && !callback){
            throw new Error({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        }else if(!callback){
            if(typeof id == 'function'){
                callback= id;
                id = undefined;
            }
            if(typeof label == 'function'){
                callback= label;
                label = undefined;
            }
        }
        if (!id || !label)
            return callback({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        if (typeof id !== 'string' || typeof label !== 'string')
            return callback({
                name: 'VALIDATION',
                message: "ARG1 and ARG2 must be a strings!"
            });

        eORv(coll, function(e, r) {
            if (r === 'v') {
                async.auto({
                    v: function(cb) {
                        new Graph().v(conn, coll, {"id": id}, function(err, res) {
                            if (err) return callback(err);
                            return cb(null, res);
                        });
                    },
                    e: ['v',function(cb,results) {
                        if(!results.v){
                        new Graph().e(conn, coll, {"id": id}, function(err, res) {
                            if (err) return cb(err);
                            return cb(null, res);
                        });
                        }
                        return cb(null)
                    }],
                    getP: ['v', 'e', function(cb, results) {
                        var query = gremlin();
                        if (results.e)
                            query('g.e(%s).' + label, id);
                        if (results.v)
                            query("g.v('" + id + "').has('@class', '" + coll + "')." + label);
                        if (!results.v && !results.e)
                            return callback({
                                name: 'WARN',
                                message: "Element not found!"
                            });
                        client.execute(query, function(err, properties) {
                            if(properties.results[0] == null)
                                return callback({name :'ERROR' , message :'property doesn \'t exist'})
                            if (err) return cb(err);
                            return cb(null, properties);
                        });
                    }]
                }, function(err, res) {
                    return callback(err, res.getP.results);
                });
            } else {
                return callback({
                    name: 'WARN',
                    message: "Cannot use Vertex's methods!"
                });
            }
        });
    }

    /**
     * Get the property keys of a vertex or an edge.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} id [ID of the element to select]
     * @param {Function} callback [description]
     * @return {T} [description]
     */
    this.getProperties = function(conn, coll, id, callback) {
         if(!id  && !callback){
            throw new Error({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        }else if(!callback){
            if(typeof id == 'function'){
                callback= id;
                id = undefined;
            }
           
        }
        if (!id)
            return callback({
                name: 'VALIDATION',
                message: 'Some arguments are missing!'
            });
        if (typeof id !== 'string')
            return callback({
                name: 'VALIDATION',
                message: "ARG1 and ARG2 must be a strings!"
            });

        async.auto({
            v: function(cb) {
                new Graph().v(conn, coll, {"id": id}, function(err, res) {
                    if (err) return cb(err);
                    return cb(null, res);
                });
            },
            e: ['v', function(cb, results) {
                if (!results.v) {
                    new Graph().e(conn, coll, {"id": id}, function(err, res) {
                        if (err) return cb(err);
                        return cb(null, res);
                    });
                } else return cb(null);
            }],
            getP: ['v', 'e', function(cb, results) {
                var query = gremlin();
                if (results.e)
                    query('g.e(%s).keys()', id);
                if (results.v)
                    query("g.v(%s).keys()", id);
                if (!results.v && !results.e)
                    return callback({
                        name: 'WARN',
                        message: "Element not found!"
                    });
                client.execute(query, function(err, properties) {
                    if (err) return cb({
                        name: 'ERROR',
                        message: err
                    });
                    return cb(null, properties.results);
                });
            }]
        }, function(err, res) {
            return callback(err, res.getP);
        });
    }

    /**
     * Finds all of the possible paths according to the number of interations.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} idVStart [ID of the vertex to start the path with]
     * @param {String} idVEnd [ID of the vertex to end the path with]
     * @param {String} nbIterations [Number of iterations]
     * @param {Function} callback [description]
     * @return {T} [description]
     */
    this.shortestPath = function(conn, coll, idVStart, idVEnd, nbIterations, callback) {
        if (!idVStart || !idVEnd || !nbIterations)
            return callback({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        if (typeof idVStart !== 'string' || typeof idVEnd !== 'string')
            return callback({
                name: 'VALIDATION',
                message: "ARG1 and ARG2 must be a strings!"
            });
        if (typeof nbIterations !== 'number')
            return callback({
                name: 'VALIDATION',
                message: "ARG3 must be number!"
            });

        eORv(coll, function(e, r) {
            if (r === 'v') {
                async.auto({
                    shortestP: function(cb) {
                        var query = gremlin();
                        query("g.v('"+idVStart+"').out.loop(1){it.object.id != '"+idVEnd+"' && it.loops < " + nbIterations + "}.path");
                        client.execute(query, function(err, path) {
                            if (err) return cb(err);
                            return cb(null, path.results.results);
                        });
                    }
                }, function(err, res) {
                    return callback(err, res.shortestP);
                });
            } else {
                return callback({
                    name: 'WARN',
                    message: "Cannot use Vertex's methods!"
                });
            }
        });
    }

    /**
     * Loop over a particular set of steps.
     *
     * @param {String} conn [Connection string]
     * @param {String} coll [Name of the calling collection]
     * @param {String} idV [ID of the vertex]
     * @param {String} condition1 [Global condition]
     * @param {String} condition2 [Condition applied to each element]
     * @param {Function} callback [description]
     * @return {T} [description]
     */
    this.loop = function(conn, coll, idV, condition1, condition2, callback) {
        if(!idV && !condition2 && !condition1 && !callback){
            throw new Error({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        }else if(!callback){
            if(typeof idV =='function'){
                callback = idV;
                idV = undefined;
            }
            if(typeof condition1 =='function'){
                callback = condition1;
                condition1 = undefined;
            }
            if(typeof condition2 =='function'){
                callback = condition2;
                condition2 = undefined;
            }
        }
        if (!idV || !condition1 || !condition2)
            return callback({
                name: 'ERROR',
                message: 'Some arguments are missing!'
            });
        if (typeof idV !== 'string' ||  typeof condition1 !== 'string' || typeof condition2 !== 'string')
            return callback({
                name: 'VALIDATION',
                message: "ARG1, ARG2 and ARG3 must be a strings!"
            });

        eORv(coll, function(e, r) {
            if (r === 'v') {
                var query = gremlin();
                async.auto({
                        v: function(cb) {
                            new Graph().v(conn, coll, {'id': idV}, function(err, record) {
                                if (err) return cb(err);
                                return cb(null, record);
                            });
                        },
                        loop: ['v', function(cb, results) {
                            if (results.v) {
                                condition1 = reWrite(condition1);
                                condition2 = reWrite(condition2, 'object.');
                                query("g.v('" + idV + "').has('@class', '" + coll + "').out.loop(1){" + condition1 + "}{" + condition2 + "}");
                                client.fetch(query, function(err, res) 
{                                    if (err) return cb({
                                        name: 'ERROR',
                                        message: err
                                    });
                                    return cb(null, res);
                                });
                            } else {
                                return callback({
                                    name: 'INFO',
                                    message: 'Vertex not found!'
                                });
                            }
                        }]
                    },
                    function(err, res) {
                        return callback(err, res.loop);
                    });
            } else {
                return callback({
                    name: 'WARN',
                    message: "Cannot use Vertex's methods!"
                });
            }
        });
    }
};

//////////////////////////////////////////////////////////

function extend(Parent, Child) {
    if (!Parent || !Child) return;
    var key;
    for (key in Parent) {
        if (typeof Parent[key] === 'function' && !Child[key])
            Child[key] = Parent[key];
    }
}

module.exports = function(orientAdapter) {
    extend(new Graph(), orientAdapter);
    return orientAdapter;
}
