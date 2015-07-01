'use strict';

var orientAdapter = require('sails-orientdb');

require('./../../../lib/graph')(orientAdapter);

module.exports = {
  	// Setup Adapters
  	// Creates named adapters that have have been required
	adapters: {
	   'default': orientAdapter,
	   orient: orientAdapter,
	},

	// Build Connections Config
	// Setup connections using the named adapter configs
	connections: {
	   myLocalOrient: {
		   adapter: 'orient',
		   host: 'localhost',
		   port: 2424,
		   user: 'root',
		   password: 'root',
		   database: 'Sample'
	   }
	},

	defaults: {
	   migrate: 'safe'
	}
}