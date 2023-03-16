var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");

var port = 8080;
var WHITE = "\033[39m";
var RED = "\033[91m";
var GREEN = "\033[32m";

http.createServer(function (request, response) {

    var uri = url.parse(request.url).pathname;
    var filename = path.join(process.cwd(), uri);

    var contentTypesByExtension = {
        ".html":    "text/html",
        ".css":     "text/css",
        ".js":      "text/javascript",
        ".json":    "text/json",
        ".svg":     "text/svg+xml"
    }

    fs.exists(filename, function (exists) {
        if (!exists) {
            console.log(RED + "FAIL: " + filename);

            filename = path.join(process.cwd(), "/404.html");
        } else if (fs.statSync(filename).isDirectory()) {
            console.log(GREEN + "FLDR: " + WHITE + filename);

            filename += "/index.html";
        }

        fs.readFile(filename, "binary", function (err, file) {
            console.log(GREEN + "FILE: " + WHITE + filename);

            if (err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }
            var headers = {};
            var contentType = contentTypesByExtension[path.extname(filename)];
            if (contentType) {
                headers["Content-Type"] = contentType;
            }
            response.writeHead(200, headers);
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(parseInt(port, 10));

console.log("Webserver running on: http://localhost:" + port);