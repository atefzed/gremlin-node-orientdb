# Gremlin-node-orientdb

Gremlin-node-orientdb is a javascript wrapper around the Gremlin API using Rexster.

# Rexster

Rexster provides a RESTful shell to any Blueprints-complaint graph database. This HTTP web service provides: a set of standard low-level GET, POST, and DELETE methods, a flexible extension model which allows plug-in like development for external services (such as ad-hoc graph queries through Gremlin), and a browser-based interface called The Dog House.

A graph database hosted in the OrientDB can be configured in Rexster and then accessed using the standard RESTful interface powered by the Rexster web server.

#### Installation

You can get the latest stable release of Rexster from its Download Page. The latest stable release when this page was last updated was 2.5.0.

Or you can build a snapshot by executing the following Git and Maven commands:

```bash
$ git clone https://github.com/tinkerpop/rexster.git
$ cd rexster
$ mvn clean install
```

#### Configuration

In order to configure Rexster to connect to your OrientDB graph, locate the rexster.xml in the Rexster directory and add the following snippet of code:

```xml
<rexster>
  ...
  <graphs>
    ...
    <graph>
      <graph-enabled>true</graph-enabled>
      <graph-name>orientdbsample</graph-name>
      <graph-type>com.tinkerpop.rexster.OrientGraphConfiguration</graph-type>
      <graph-location>{{ DATABASE'S LOCATION }}</graph-location>
      <extensions>
        <allows>
           <allow>tp:gremlin</allow>
        </allows>
      </extensions>
      <properties>
        <username>{{ USERNAME }}</username>
        <password>{{ PASSWORD }}</password>
      </properties>
    </graph>
  ...
  </graphs>
</rexster>
```
For instance, for local database, replace `{{ DATABASE'S LOCATION }}` by `remote:localhost/{{ DATABASE'S NAME }}`.

#### Run

Locate the BIN folder in the Rexster directory, and enter this command line :

```bash
$ ./rexster.sh -s -c ../config/rexster.xml 
```

# Installation

```bash
$ git clone git@github.com:atefzed/gremlin-node-orientdb.git
$ cd gremlin-node-orientdb && npm install
```

# Examples

#### Using sails-orientdb

```javascript
var orientAdapter = require('sails-orientdb');

function extend(Parent, Child){
	var key;
	for(key in Parent){
		if(typeof Parent[key] === 'function' && !Child[key])
			Child[key] = Parent[key];
	}
}
var Graph = require('{{ PATH TO GRAPH.JS }}');
extend(new Graph(), orientAdapter);

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
		   port: {{ PORT }},
		   user: '{{ USERNAME }}',
		   password: '{{ PASSWORD }}',
		   database: "{{ DATABASE'S NAME }}"
	   }
	},

	defaults: {
	   migrate: 'safe'
	}
}
```

Simple request :

```javascript
  var o = app.models.{{ COLLECTION NAME }};
  o.inV('id', '#12:0', function(err, resp) {
    if (err) throw err;
    console.log(resp);
  });
```

Nested request :

```javascript
  var o = app.models.{{ COLLECTION NAME }};
  o.inV('id', '#12:0', function(error, resp) {
    if (error) throw error;
    o.dedup(resp, function(e, r){
      if (e) throw e;
      o.count(r, function(err, c){
        if (err) throw err;
        console.log(c);
      });
    });
  });
```


#### Without sails-orientdb

```javascript
var Graph = require('{{ PATH TO GRAPH.JS }}');
var g = new Graph();
g.filter('', '{{ COLLECTION NAME }}', {
  'lastname': 'test',
  'familySituation': 'single'
}, function(err, res) {
    if (err) throw err;
    console.log(res);
});
```

# Contributing

Contributions to the project are most welcome, so feel free to fork and improve.
