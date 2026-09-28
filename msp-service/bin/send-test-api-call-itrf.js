//This script sends a test API call to the msp-service
//If all three of the mock services are running, you'll see a successful log in the mock-api

import jwt from "jsonwebtoken";
import { exec } from "child_process";

const SECRET = "defaultSecret";
const SERVICE_PORT = 8080; //needs to be 8080 because that's what's in the index.js

const validNonce = "123e4567-e89b-12d3-a456-426655440000";

const token = jwt.sign(
  {
    data: {
      nonce: validNonce,
    },
  },
  SECRET,
  {
    expiresIn: "30m",
  }
);

// const decoded = jwt.verify(token, SECRET);

const url = `localhost:${SERVICE_PORT}/itrfIntegration/${validNonce}`;

const command = `curl -XPOST -H "X-Authorization: Bearer ${token}" -H "Content-Type: application/json" -d '{"body": "xyz", "logsource":"test curl request" }' ${url} `;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Execution error: ${error.message}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});