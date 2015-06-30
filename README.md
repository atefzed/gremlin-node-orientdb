# gremlin-node-orientdb

Gremlin-node-orientdb is a javascript wrapper around the Gremlin API using Rexster.

# Installation

#### Rexster

Rexster provides a RESTful shell to any Blueprints-complaint graph database. This HTTP web service provides: a set of standard low-level GET, POST, and DELETE methods, a flexible extension model which allows plug-in like development for external services (such as ad-hoc graph queries through Gremlin), and a browser-based interface called The Dog House.

A graph database hosted in the OrientDB can be configured in Rexster and then accessed using the standard RESTful interface powered by the Rexster web server.

**1/ Installation :**

You can get the latest stable release of Rexster from its Download Page. The latest stable release when this page was last updated was 2.5.0.

Or you can build a snapshot by executing the following Git and Maven commands:

```bash
$ git clone https://github.com/tinkerpop/rexster.git
$ cd rexster
$ mvn clean install
```

**2/ Configuration :**

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

**3/ Run :**

Locate the BIN folder in the Rexster directory, and enter this command line :

```bash
$ ./rexster.sh -s -c ../config/rexster.xml 
```

#### Clone from GitHub

```bash
$ git clone git@github.com:atefzed/gremlin-node-orientdb.git
$ cd gremlin-node-orientdb && npm install
```

# Examples

#### Using sails-orientdb

