var express = require('express');
var bodyParser = require("body-parser");

var authEndpoint = require("./endpoints/auth/auth");
var uploadEndpoint = require("./endpoints/upload/upload");
var initEndpoint = require("./endpoints/init/init");
var profileEndpoint = require("./endpoints/profile/profile");
var mediaEndpoint = require("./endpoints/media/media");
// services
var authService = require("./services/authService");
var dbService = require("./services/dbService");
//
var config = require("./config");
var app = server = express();

//
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

/*
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
*/

// init services
dbService.init(config);
authService.init(dbService);

// init endpoints
authEndpoint.init(server, authService);
initEndpoint.init(server, dbService);
profileEndpoint.init(server, dbService);
mediaEndpoint.init(server, authService, dbService);
uploadEndpoint.init(server, config);

server.listen(6060, function() {
});