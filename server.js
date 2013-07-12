var http = require('http');
var url  = require('url');
var fs   = require('fs');
var path = require('path');

var currentDir = '';
var levelPattern  = /\.\/level\d?\d?\/?$/i;
var directoryPattern = /\/$/i;
var defaultFile = 'index.html';


http.createServer(function (request, response) {

    var url_parts = url.parse(request.url, true);

    var filePath = '.' + url_parts.pathname;

    console.log('extname: *' + path.extname(filePath) + '*');
    console.log('extname length: ' + path.extname(filePath).length);
    console.log('true?: ' + (path.extname(filePath) === "").toString());

    // file is a directory (ends in slash or has no extension)
    if (directoryPattern.test(filePath) || path.extname(filePath) === "") {
        // append a slash if there is not one already
        filePath   += (filePath[filePath.length - 1] == '/' ? '' : '/');

        // remember directory for future requests
        currentDir = filePath.substring(0, filePath.length - 1);
        // console.log('currentDir: ' + currentDir);

        // append the default file
        filePath   += defaultFile;
        // console.log('new filePath:       ' + filePath);
    }

    // file is not a directory
    else {
        // append filePath (without preceding '.') to current directory
        filePath = currentDir + filePath.substring(1);
        // console.log('filePath:           ' + filePath);
    }

    var extname = path.extname(filePath);
    var contentTypes = {
        ".html": "text/html",
        ".js"  : "text/javascript",
        ".css" : "text/css",
        ".xml" : "text/xml",
        ".png" : "image/png",
        ".jpg" : "image/jpeg",
        ".jpeg": "image/jpeg"
    };

    var contentType = contentTypes[extname] || 'text/plain';
    console.log('contentType:        ' + contentType);

    fs.exists(filePath, function(exists) {

        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });

    console.log('');
}).listen(8080);

console.log('Server running at http://localhost:8080/');
console.log('Close this window to stop the server...');
console.log('');
