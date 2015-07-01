'use strict';

var express = require('express'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

module.exports = function(app) {

    app.use(logger('dev'));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(session({
        saveUninitialized: true,
        secret: 'sample',
        resave: true
    }));
};