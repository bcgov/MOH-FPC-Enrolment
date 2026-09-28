//This test server is used to return API responses in the dev environment
//This simulates the real-life behavior of Splunk or Dynatrace, who ordinarily return 200 or 204 codes when logs are successfully submitted to them.

// import express from "express";
const express = require('express')
const app = express();

const MOCK_LOGGER_PORT = process.env.MOCK_LOGGER_PORT || 3000; //needs to match the LOGGER_PORT in start-local-service.sh
const responseCode = 200; //set this to whatever you like, eg. 200, 204, or 500

app.listen(MOCK_LOGGER_PORT, () => {
  console.log(`Mock logger listening on port ${MOCK_LOGGER_PORT}`);
});

const generateDate = () => {
  return new Date().toLocaleDateString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
};

app.post("/log", (req, res) => {
  console.log("[MOCKLOGGER] ", generateDate(), "-- Responded with 200 (HEAD)");
  // console.log("[MOCKLOGGER] Bonus headers -- ", req.headers)
  res.status(responseCode).end();
});

app.head("/", (req, res) => {
  console.log("[MOCKLOGGER] ", generateDate(), "-- Responded with 200 (HEAD)");
  res.status(200).end();
});