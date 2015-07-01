'use strict';

var Waterline = require('waterline'),
    uuid = require('node-uuid');

module.exports = Waterline.Collection.extend({
    identity: 'relationship',
    orientdbClass: 'E',
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
        title: {
            type: 'string'
        },
        dateHour: {
            type: 'datetime'
        }
    },

    toJSON: function() {
        this.id = this._id;
        this._id = undefined;
        return this;
    }
});
