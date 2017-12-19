var fs = require('fs');
var ip = require('ip');
var path = require('path');
var http = require('http');
var https = require('https');
var express = require('express');
var multer = require('multer');
// var serveIndex = require('serve-index');
// var argv = require('minimist')(process.argv.slice(2));
// var app = express();

// var default_host = ip.address();
// var default_port = argv.p || argv.port || 8888;
var default_folder = 'uploads';
// var version = argv.v || argv.version;
// var tls_enabled = argv.S || argv.tls;
// var cert_file = argv.C || argv.cert;
// var key_file = argv.K || argv.key;
// var help = argv.h || argv.help;

if (!fs.existsSync(default_folder)) {
  fs.mkdirSync(default_folder);
}

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, default_folder);
  },
  filename: function(req, file, cb) {
    var fieldName = 'file';
    req.body[fieldName] ? cb(null, req.body[fieldName]) : cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

var authService = require("../../services/authService");
var dbService = require("../../services/dbService");

class UploadEndpoint {
  
  init(server, config) {
    this.config = config;
    
    server.post('/upload/:sessionToken', upload.any(), function(req, res) {

      // Session handling...
      var session = authService.getSession(req.params.sessionToken);
      
      if (session == null) {
        console.log("SESSION_ERROR");
        res.end(JSON.stringify({status : "fail", data : "SESSION_ERROR"}));
        return;
      }

      let originalName = req.files[0].originalname;
      dbService.addImageForUser(session.userId, originalName, originalName);
      res.end();
    });
  }
}

module.exports = new UploadEndpoint();
