'use strict';

var Waterline = require('waterline'),
    uuid = require('node-uuid');

module.exports = Waterline.Collection.extend({
    identity: 'vertex2',
    orientdbClass: 'V',
    connection: 'myLocalOrient',

    attributes: {
        _id: {
            type: 'text',
            primaryKey: true,
            unique: true,
            defaultsTo: function() {
                return uuid.v4();
            }
        },
        firstname: {
            type: 'string'
        },
        lastname: {
            type: 'string'
        },
        age: {
            type: 'integer'
        }
    },

    toJSON: function() {
        this.id = this._id;
        this._id = undefined;
        return this;
    }
});
