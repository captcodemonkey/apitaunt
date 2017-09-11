/**
 * apitaunt - apitaunt.js
 *
 * Copyright (c) 2017 Craig McCoy
 * Licensed under the MIT license.
 * https://github.com/captcodemonkey/apitaunt/blob/master/LICENSE
 */

"use strict";

var http = require('http'),
    nodeStatic = require('node-static');

var Server = function (port, root, options) {
    this.debug = false;
    this.ext = ".json";
    this.port = port || 9090;
    this.pathToFile = null;
    this.fileName = null;

    if(typeof(options) !== "undefined") {
        this.debug = options.debug;
    }

    this.server = new nodeStatic.Server(root, options);
};

Server.prototype.run = function () {
    var that = this;


    http.createServer(function (request, response) {

        var path = require("path");

        // debug logging for status
        if(that.debug) {
            console.log("./ = %s", path.resolve("./"));
            console.log("> " + request.method + " " + request.url);
        }
        // handle the request
        that.handleRequest(request);


        // server files
        that.server.serve(request, response, function (err, res) {
            // if the initial request falls through, allow base request to replace it
            if (err) {
                that.handleBaseRequest(request);
                that.server.serve(request, response, function (err, res) {

                    if(err) {
                        response.writeHead(err.status, err.headers);
                        response.end();
                    }

                    if (!err && that.debug) {
                        console.log("> Found file " + request.url + " | " + res.message);
                    }
                });
            } else {
                if (that.debug) {
                    console.log("> Found file " + request.url + " | " + res.message);
                }
            }
        });

    })
    .addListener('error', function (err) {
        if (that.debug) {
            console.error("> Could't find " + request.url + " - " + err.message);
        }
    })
    .listen(that.port);

    if (that.debug) {
        console.log("> apitaunt is listening on http://127.0.0.1:" + that.port);
    }
};

Server.prototype.handleRequest = function (request) {
    var that = this;

    that.fileName = request.url.substring(request.url.lastIndexOf("/")).replace("/", "");
    that.pathToFile = request.url.substring(0, request.url.lastIndexOf("/"));
    request.url = that.pathToFile + "/" + request.method + "-" + that.fileName + that.ext;
};

Server.prototype.handleBaseRequest = function (request) {
    var that = this;
    request.url = that.pathToFile + "/" + that.fileName + "/" + request.method + ".index" + that.ext;
};


exports.Server = Server;