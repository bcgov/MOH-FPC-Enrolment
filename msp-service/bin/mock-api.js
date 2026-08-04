//This test server is used to return API responses in the dev environment
//This simulates the real-life behavior of the API endpoint that the msp-service redirects to

// import express from "express";
const express = require("express");
const app = express();

const MOCK_API_PORT = process.env.MOCK_API_PORT || 3001; //needs to match the TARGET_URL in start-local-service.sh
const responseCode = 200; //set this to whatever you like, eg. 200, 204, or 500

const generateDate = () => {
  return new Date().toLocaleDateString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
};

app.listen(MOCK_API_PORT, () => {
  console.log(`Mock api listening on port ${MOCK_API_PORT}`);
});

app.head("/", (req, res) => {
  console.log("[MOCK-API] ", generateDate(), "-- Responded with 200 (HEAD)");
  res.status(200).end();
});

app.use("/", (req, res) => {
  console.log(
    "[MOCK-API] ",
    generateDate(),
    "-- Successfully received request, responded with 200",
  );
  // console.log(`Password: ${req.headers.authorization}`) //to check whether the incoming request has ITRF authorizations or not in local development
  res.status(responseCode).end();
});
