const { logSplunkInfo, logSplunkError } = require("./logSplunk");

var https = require('https'),
    http = require('http'),
    util = require('util'),
    path = require('path'),
    fs = require('fs'),
    colors = require('colors'),
    winston = require('winston'),
    jwt = require('jsonwebtoken'),
    url = require('url'),
    stringify = require('json-stringify-safe'),
    express = require('express'),
    moment = require('moment');
    proxy = require('http-proxy-middleware');

const cache = require('./cache');
const BYPASS_MSP_CHECK = (process.env.BYPASS_MSP_CHECK === 'true') || false;

// verbose replacement
function logProvider(provider) {
    var logger = winston;

    var myCustomProvider = {
        log: logger.log,
        debug: logger.debug,
        info: logSplunkInfo,
        warn: logger.warn,
        error: logSplunkError
    }
    return myCustomProvider;
}

//
// Generate token for monitoring apps
//
if (process.env.USE_AUTH_TOKEN &&
    process.env.USE_AUTH_TOKEN == "true" &&
    process.env.AUTH_TOKEN_KEY &&
    process.env.AUTH_TOKEN_KEY.length > 0) {

    var monitoringToken = jwt.sign({
        data: {nonce: "status"}
    }, process.env.AUTH_TOKEN_KEY);
    logSplunkInfo("Monitoring token: " + monitoringToken);
}

//
// Init express
//
var app = express();

// Add status endpoint
app.get('/hello', function (req, res) {
    res.send("OK");
});

//
// Cache service
//
// only enable if there are URLs to cache
if (process.env.CACHE_URLS_CSV && process.env.CACHE_URLS_CSV.length){ 
    // console.log('debugging (index.js): enable cache');
    cache.updateCache();
    cache.setupCron();
    app.use('/', cache.cacheMiddleware);
}

//
// CAPTCHA Authorization, ALWAYS first
//
app.use('/', function (req, res, next) {
    // console.log('debugging (index.js): incoming request is: ', req);
    // Log it
    logSplunkInfo("incoming: " + req.url);
    logSplunkInfo(" x-authorization: " + req.headers["x-authorization"]);
    
    // Get authorization from browser
    var authHeaderValue = req.headers["x-authorization"];

    // Delete it because we add HTTP Basic later
    delete req.headers["x-authorization"];

    // Delete any attempts at cookies
    delete req.headers["cookie"];

    // Validate token if enabled
    if (process.env.USE_AUTH_TOKEN &&
        process.env.USE_AUTH_TOKEN == "true" &&
        process.env.AUTH_TOKEN_KEY &&
        process.env.AUTH_TOKEN_KEY.length > 0) {

        // Ensure we have a value
        if (!authHeaderValue) {
            denyAccess("missing header", res, req);
            return;
        }

        // Parse out the token
        var token = authHeaderValue.replace("Bearer ", "");

        var decoded = null;
        try {
            // Decode token
            decoded = jwt.verify(token, process.env.AUTH_TOKEN_KEY);
        } catch (err) {
            logSplunkError("jwt verify failed, x-authorization: " + authHeaderValue + "; err: " + err);
            denyAccess("jwt unverifiable", res, req);
            return;
        }

        // Ensure we have a nonce
        if (decoded == null ||
            decoded.data.nonce == null ||
            decoded.data.nonce.length < 1) {
            denyAccess("missing nonce", res, req);
            return;
        }

        if (!BYPASS_MSP_CHECK){
            // Check against the resource URL
            // typical URL:
            //    /MSPDESubmitApplication/2ea5e24c-705e-f7fd-d9f0-eb2dd268d523?programArea=enrolment
            var pathname = url.parse(req.url).pathname;
            var pathnameParts = pathname.split("/");

            // find the noun(s)
            var nounIndex = pathnameParts.indexOf("MSPDESubmitAttachment");
            if (nounIndex < 0) {
                nounIndex = pathnameParts.indexOf("MSPDESubmitApplication");
            }

            if (nounIndex < 0 ||
                pathnameParts.length < nounIndex + 2) {
                denyAccess("missing noun or resource id", res, req);
                return;
            }

            // Finally, check that resource ID against the nonce
            if (pathnameParts[nounIndex + 1] != decoded.data.nonce) {
                denyAccess("resource id and nonce are not equal: " + pathnameParts[nounIndex + 1] + "; " + decoded.data.nonce, res, req);
                return;
            }
        }
    }
    // OK its valid let it pass thru this event
    next(); // pass control to the next handler
});


// Create new HTTPS.Agent for mutual TLS purposes
if (process.env.USE_MUTUAL_TLS &&
    process.env.USE_MUTUAL_TLS == "true") {
    var httpsAgentOptions = {
        key: Buffer.from(process.env.MUTUAL_TLS_PEM_KEY_BASE64, 'base64'),
        passphrase: process.env.MUTUAL_TLS_PEM_KEY_PASSPHRASE,
        cert:  Buffer.from(process.env.MUTUAL_TLS_PEM_CERT, 'base64')
    };

    var myAgent = new https.Agent(httpsAgentOptions);
}

var proxy = proxy({
    target: process.env.TARGET_URL || "http://localhost:3000",
    agent: myAgent || http.globalAgent,
    secure: process.env.SECURE_MODE || false,
    keepAlive: true,
    changeOrigin: true,
    logLevel: 'info',
    logProvider: logProvider,
    //
    // Listen for the `error` event on `proxy`.
    //
    onError: function (err, req, res) {
        logSplunkError("proxy error: " + err + "; req.url: " + req.url + "; status: " + res.statusCode);
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });

        res.end('Error with proxy');
    },

    //
    // Listen for the `proxyRes` event on `proxy`.
    //
    onProxyRes: function (proxyRes, req, res) {
        winston.info('RAW Response from the target: ' + stringify(proxyRes.headers));
        // Delete set-cookie
        delete proxyRes.headers["set-cookie"];
    },

    //
    // Listen for the `proxyReq` event on `proxy`.
    //
    onProxyReq: function(proxyReq, req, res, options) {
        winston.info("PROXY REQ", stringify(proxyReq.headers));
        winston.info("REQ: ", stringify(req.headers));
        winston.info("REQ AUTH: ", stringify(req.headers.authorization));
        winston.info("RES: ", stringify(res.headers));

        var isTargetPathItrf = url.parse(req.url).pathname.split("/").indexOf("itrfIntegration") > 0;
        var targetItrfAuth = process.env.TARGET_USERNAME_PASSWORD_ITRF;
        var targetFpcareAuth = process.env.TARGET_USERNAME_PASSWORD;
        var targetAuth = isTargetPathItrf ? targetItrfAuth : targetFpcareAuth;
        winston.info("Is Target Path in ITRF? ", stringify(isTargetPathItrf));
        proxyReq.setHeader('User', `${targetAuth}`);
        //req.headers["Authorization"] = `Basic ${targetAuth}`;

        winston.info("PROXY REQ", stringify(proxyReq.headers));
        winston.info("REQ: ", stringify(req.headers));
        winston.info("REQ AUTH: ", stringify(req.headers.authorization));
        winston.info("RES: ", stringify(res.headers));
        //logSplunkInfo('RAW URL: ' + req.url + '; RAW headers: ', stringify(req.headers));
    }
});

// Add in proxy AFTER authorization
app.use('/', proxy);

// Start express
app.listen(8080);

/**
 * General deny access handler
 * @param message
 * @param res
 * @param req
 */
function denyAccess(message, res, req) {

    logSplunkError(message + " - access denied.  request: " + stringify(req.headers));

    res.writeHead(401);
    res.end();
}

logSplunkInfo('MyGovBC-MSP-Service server started on port 8080');

