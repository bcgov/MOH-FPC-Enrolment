// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

// Use Puppeteer-bundled chrome-headless-shell when no system Chrome is available (e.g. WSL2)
const { execSync } = require('child_process');
const os = require('os');
const path = require('path');

if (!process.env.CHROME_BIN) {
  const puppeteerCacheDir = path.join(os.homedir(), '.cache', 'puppeteer', 'chrome-headless-shell');
  try {
    const versions = require('fs').readdirSync(puppeteerCacheDir).filter(d => d.startsWith('linux-'));
    if (versions.length > 0) {
      versions.sort().reverse();
      const candidate = path.join(puppeteerCacheDir, versions[0], 'chrome-headless-shell-linux64', 'chrome-headless-shell');
      if (require('fs').existsSync(candidate)) {
        process.env.CHROME_BIN = candidate;
      }
    }
  } catch (_) {}
}

module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-jasmine-html-reporter'),
        require('karma-coverage'),
        require('@angular-devkit/build-angular/plugins/karma'),
        require('karma-spec-reporter')
      ],
      client: {
        clearContext: false // leave Jasmine Spec Runner output visible in browser
      },
      coverageIstanbulReporter: {
        dir: require('path').join(__dirname, '../../coverage'),
        reports: ['html', 'lcovonly'],
        fixWebpackSourcePaths: true
      },
      reporters: ['progress', 'kjhtml'],
      specReporter: {
        maxLogLines: 5, // logged lines per test
      },
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['ChromeHeadlessNoSandbox'],
      customLaunchers: {
        ChromeHeadlessNoSandbox: {
          base: 'ChromeHeadless',
          flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
        }
      },
      singleRun: false
    });
  };
  