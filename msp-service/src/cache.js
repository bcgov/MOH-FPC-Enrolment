const { timestamp } = require("./timestamp");
const backend = require('./backend');
const stringify = require('json-stringify-safe');
const CACHE_FILE_PATH = process.env.CACHE_FILE_PATH || 'cache/';
const CronJob = require('cron').CronJob;
const fs = require('fs');
const CRON_EXPRESSION = process.env.CRON_EXPRESSION || '5 0 * * *';
const CACHE_IN_MEMORY = (process.env.CACHE_IN_MEMORY === 'true') || false;
const { logSplunkInfo, logSplunkError } = require("./logSplunk");

/**
 * The in-memory cache. DO NOT MODIFY DIRECTLY! Instead, use
 * `saveCacheInMemory()` and `loadCacheInMemory()`
 *
 * This will make changing the cache easier in the future if necessary.
 */
const cacheStore = CACHE_IN_MEMORY ? {} : null;

/** An array of strings for url fragments, e.g. ['/fpcareIntegration/rest/getMessages/'] */
const CACHE_URLS = process.env.CACHE_URLS_CSV ? 
    process.env.CACHE_URLS_CSV.replace(/ /g, '') // Remove all spaces, if any exist they're just a user entry error
    .split(',') // convert csv into array
    .map(url => url.replace(/\/+$/, "")) // Remove trailing slashes on each url if any
    : ''

/**
 * Load JSON and save for all URLS set from CACHE_URLS_CSV
 */
function updateCache() {
    CACHE_URLS.map(cacheResultFromURL);
}

/**
 * Middleware that checks if a URL has a cached resource, and if so, returns that resource.
 */
async function cacheMiddleware(req, res, next) {
    let url = req.originalUrl;
    url = url.replace('//', '/'); //Fix issue of duplicate slashes at beginning after routing through nginx
    try {
        // if we have cached JSON, return it
        const cachedJSON = await loadCacheFromUrl(url);
        res.json(cachedJSON)
    } catch (error) {
        // cache miss, or an unexpected application error
        next();
        if (CACHE_URLS.includes(url)){
            //The URL should be cached, but isn't. Try to reload it for future
            //requests (will not impact current request)
            logSplunkInfo(`Missing cache for resource that should be cached! Attempting to reload. url: ${url}`);
            cacheResultFromURL(url);
        }
        if (error !== "NO_CACHE") {
            logSplunkError({message: "Unexpected application error", error})
        }
    }
}

/**
 * Makes a request for the URL, and saves the response to a file.
 */
function cacheResultFromURL(url) {
    backend.getJSON(url, (response) => {
        if (CACHE_IN_MEMORY){
            saveCacheInMemory(url, response);
        } else {
            const nameAndPath = getNameAndPathFromUrl(url);
            saveJSONAsync(nameAndPath, response);
        }
    }, (error) => {
        logSplunkError({message: "Failed to update cache, network request failed", error});
    });
}

/**
 * Saves a JSON file to the filesystem 
 * @param {string} nameAndPath - filepath and filename
 * @param {JSON} responseBody  - the JSON to save
 */
function saveJSONAsync(nameAndPath, responseBody) {
    fs.writeFile(nameAndPath, stringify(responseBody), (err) => {
        if (err) {
            logSplunkError({message: "Failed to save file", error: err})
        }
        logSplunkInfo(`updated cache on filesystem for file: ${nameAndPath}`);
    });
}

/**
 * Checks if it has cached JSON for a given URL. If so, it returns it.
 * If it is not cached, it rejects "NO_CACHE".
 * 
 * @param {string} url - a url from req.originalUrl 
 */
function loadCacheFromUrl(url) {
    if (CACHE_IN_MEMORY){
        return loadCacheFromMemory(url);
    } else {
        return loadCacheFromFileSystem(url);
    }
}

function saveCacheInMemory(url, data){
    cacheStore[url] = data;
    logSplunkInfo(`updated cache in memory for url ${url}`);
}

function loadCacheFromMemory(url){
    return new Promise((resolve, reject) => {
        if (cacheStore[url]){
            resolve(cacheStore[url]);
        }
        else {
            reject("NO_CACHE")
        }
    })
}

function loadCacheFromFileSystem(url) {
    const nameAndPath = getNameAndPathFromUrl(url);
    return new Promise((resolve, reject) => {
        fs.readFile(nameAndPath, (err, data) => {
            if (!err) {
                resolve(JSON.parse(data));
            }
            else {
                const rejectVal = err.code === "ENOENT" ? "NO_CACHE" : err;
                reject(rejectVal);
            }
        });
    });
}

/**
 * Returns the path with the filename to be generated from URL
 * @param {string} url a fragment, like /fpcareIntegration/rest/getCalendar
 */
function getNameAndPathFromUrl(url) {
    return CACHE_FILE_PATH + convertUrlToFileName(url);
}

/**
 * Takes a url fragment /fpcareIntegration/rest/getCalendar 
 * returns -fpcareIntegration-rest-getCalendar.json
 */
function convertUrlToFileName(url) {
    return url.replace(/\//g, '-') + '.json';
}

/**
 * Setup a cron job to update the cache, using env var CRON_EXPRESSION
 */
function setupCron() {
    new CronJob(CRON_EXPRESSION, () => {
        const buildTime = timestamp(new Date());
        logSplunkInfo(`-----\nCron fired - ${buildTime}\n-----`);
        updateCache();
    }, null, true, 'America/Vancouver')
}

module.exports = {
    updateCache,
    loadCacheFromUrl,
    cacheMiddleware,
    setupCron,
}
