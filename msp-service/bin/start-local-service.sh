# This script starts a local msp-service instance
# It includes the environment variables required for the service to run
# It also includes connections to a logger and to a target URL
# This script will connect to the mock API and logger if they are running

export PORT=8080
export LOGGER_HOST=localhost
export LOGGER_PORT=3000 # needs to match whatever's in mock-logger.js
export HOSTNAME=""
export TARGET_URL=http://localhost:3001
export TARGET_USERNAME_PASSWORD='YWJjZGVmZw=='
export TARGET_USERNAME_PASSWORD_ITRF='YWJjZGVmZy0taXRyZg=='
export USE_AUTH_TOKEN=true
export AUTH_TOKEN_KEY=defaultSecret
export BYPASS_MSP_CHECK=true

# if [ $1 = "--test" ]; then
    # echo "Running in test mode (local forwarder only)"
    # nodemon bin/mock-logger.js & node src/index.js server 
# else
    # echo "Running in development mode (mock-logger and forwarder)"
    # nodemon bin/mock-logger.js & nodemon src/index.js server
    # nodemon bin/mock-logger.js
    # nodemon bin/mock-api.js
    nodemon src/index.js server 
# fi