#!/usr/bin/env node

/**
 * Apitaunt - test.js
 *
 */

"use strict";

var apitaunt = require('./../lib/apitaunt');

var argv = require('optimist')
    .usage([
        'USAGE: $0 [-p <port>] [<directory>]',
        'A quick and dirty way to mock APIs']
        .join('\n\n'))
    .option('port', {
        alias: 'p',
        'default': 9081,
        description: 'TCP port at which the files will be served'
    })
    .option('cache', {
        alias: 'c',
        description: '"Cache-Control" header setting, defaults to 3600'
    })
    .option('debug', {
        alias: 'd',
        description: 'debug mode'
    })
    .option('headers', {
        alias: 'H',
        description: 'additional headers (in JSON format)'
    })
    .option('header-file', {
        alias: 'f',
        description: 'JSON file of additional headers'
    })
    .option('help', {
        alias: 'h',
        description: 'display this help message'
    })
    .argv;

var dir = argv._[0] || '.';

var options = {
    "debug": false
};

if (argv.help) {
    require('optimist').showHelp(console.log);
    process.exit(0);
}

if (argv.debug) {
    options.debug = !!argv.debug;
}

if (argv.cache) {
    options.cache = argv.cache;
}

if (argv.headers) {
    options.headers = JSON.parse(argv.headers);
}

var server = new apitaunt.Server(+argv.port, dir, options);
server.run();

if(options.debug) {
    console.log('> serving "' + dir + '" at http://127.0.0.1:' + argv.port);
}