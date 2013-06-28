var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

http.createServer(function (request, response) {

    var url_parts = url.parse(request.url, true);

    var filePath = '.' + url_parts.pathname;
    if (filePath == './')
        filePath = './index.html';

    var extname = path.extname(filePath);
    var contentTypes = {
        '.html': "text/html",
        '.js':   "text/javascript",
        '.css': 'text/css',
        '.xml': 'text/xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg':'image/jpeg'
    };

    var contentType = contentTypes[extname] || 'text/plain';

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

}).listen(8080);

console.log('Server running at http://localhost:8080/');
console.log('Close this window to stop the server...');
