function timestamp(time) {
    const timeZone = 'America/Vancouver'
    const buildTime = `${time.toLocaleDateString('en-CA', { timeZone })} at ${time.toLocaleTimeString('en-CA', { timeZone })} (${timeZone})`;
    return buildTime;
}
exports.timestamp = timestamp;