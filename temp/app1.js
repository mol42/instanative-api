/*
var restify = require('restify');
var authEndpoint = require("./endpoints/auth/auth");

var server = restify.createServer();

authEndpoint.init(server);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
*/

const restify = require('restify');
const Multi = require('multi-rest');
const uuid = require('uuid');

var server = restify.createServer();

var upload_disk = new Multi({
    driver: {
        type: 'local',
        path: "./uploads/"
    },
    filename: (name) => { // the extention will be added automaticlly 
        return uuid.v4();
    },
    filefields: {
        video: {
            type: 'video',
            thumbnail: {
                width: 100,
                time: ['10%'],
                count: 1
            },
            required: false,
            extensions: ['mp4']
        },
        image: {
            type: 'picture',
            thumbnail: {
                width: 400,
                height: 300
            },
            required: true,
            extensions: ['png', 'jpg']
        }
    }
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.post('/upload', upload_disk ,function (req, res, next){
	res.send({success: true, files: req.files, message: "file uploaded :)"});
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});