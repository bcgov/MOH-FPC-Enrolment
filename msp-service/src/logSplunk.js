var http = require('http');
var winston = require('winston');
var moment = require('moment');
var hostName = process.env.HOSTNAME ? process.env.HOSTNAME : '';
function logSplunkError(message) {
    // log locally
    winston.error(message);
    var body = JSON.stringify({
        message: message
    });
    var options = {
        hostname: process.env.LOGGER_HOST,
        port: process.env.LOGGER_PORT,
        path: '/log',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Splunk ' + process.env.SPLUNK_AUTH_TOKEN,
            'Content-Length': Buffer.byteLength(body),
            'logsource': hostName,
            'timestamp': moment().format('DD-MMM-YYYY'),
            'program': 'msp-service',
            'serverity': 'error'
        }
    };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            // console.log("Body chunk: " + JSON.stringify(chunk));
        });
        res.on('end', function () {
            // console.log('End of chunks');
        });
    });
    req.on('error', function (e) {
        console.error("error sending to splunk-forwarder: " + e.message);
    });
    // write data to request body
    req.write(body);
    req.end();
}
exports.logSplunkError = logSplunkError;
function logSplunkInfo(message) {
    // log locally
    winston.info(message);
    var body = JSON.stringify({
        message: message
    });
    var options = {
        hostname: process.env.LOGGER_HOST,
        port: process.env.LOGGER_PORT,
        path: '/log',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Api-Token ' + process.env.SPLUNK_AUTH_TOKEN,
            'Content-Length': Buffer.byteLength(body),
            'logsource': hostName,
            'timestamp': moment().format('DD-MMM-YYYY'),
            'method': 'MSP-Service - Pass Through',
            'program': 'msp-service',
            'serverity': 'info'
        }
    };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log("Body chunk: " + JSON.stringify(chunk));
        });
        res.on('end', function () {
            console.log('End of chunks');
        });
    });
    req.on('error', function (e) {
        console.error("error sending to splunk-forwarder: " + e.message);
    });
    // write data to request body
    req.write(body);
    req.end();
}
exports.logSplunkInfo = logSplunkInfo;