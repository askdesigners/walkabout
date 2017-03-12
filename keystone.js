// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var express = require('express');
var handlebars = require('express-handlebars');
var sharedsession = require("express-socket.io-session");

var app = express(),
    keystone = require('keystone'),
    server,
    EventEmitter = require("events").EventEmitter;

var theEvents = new EventEmitter();

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
    'name': 'Walkabout',
    'brand': 'Walkabout',

    'sass': 'public',
    'static': 'public',
    'favicon': 'public/favicon.ico',
    'views': 'templates/views',
    'view engine': 'hbs',

    'custom engine': handlebars.create({
        layoutsDir: 'templates/views/layouts',
        partialsDir: 'templates/views/partials',
        defaultLayout: 'default',
        helpers: new require('./templates/views/helpers')(),
        extname: '.hbs',
    }).engine,

    'auto update': true,
    'session': true,
    'session store': 'mongo',
    'auth': true,
    'user model': 'User',
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
    _: require('lodash'),
    env: keystone.get('env'),
    utils: keystone.utils,
    editable: keystone.content.editable,
});

keystone.set('routes', require('./routes'));

keystone.set('nav', {
    users: 'users',
});

let thingsData = require('./factories/GameData/things').things;
let placesData = {};
placesData.definitions = require('./factories/GameData/places').definitions;
placesData.dimensions = require('./factories/GameData/places').dimensions;
placesData.descriptions = require('./factories/GameData/placeDescriptions').descriptions;

var Game = new require('./factories/Game')({ thingsData, placesData });

// Start Keystone to connect to your database and initialise the web server
keystone.initExpressApp(app);

var socketio = require('socket.io'),
    Messages;

keystone.start({
    onHttpServerCreated: function(){
        keystone.set('io', socketio.listen(keystone.httpServer));
    },
    onStart: function(){
        var io = keystone.get('io');
        var session = keystone.expressSession;

        // Share session between express and socketio
        // io.use(function(socket, next){
        //     session(socket.handshake, {}, next);
        // });

        io.use(sharedsession(session, {
            autoSave:true
        }));
        
        let Sockets = require('./Sockets/index')(Game, io);
        
    }
});