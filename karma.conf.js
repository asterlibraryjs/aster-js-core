const process = require("process");
const puppeteer = require("puppeteer");

module.exports = function (config) {
    process.env.CHROME_BIN = puppeteer.executablePath();
    config.set({
        frameworks: ["mocha", "chai", "sinon"],
        files: [
            ".bin/tests.js"
        ],
        exclude: [],
        colors: true,
        logLevel: config.LOG_INFO,
        reporters: ["mocha"],
        autoWatch: false,
        port: 8080,
        browsers: ["ChromeHeadlessNoSandbox"],
        browserDisconnectTolerance: 3,
        browserNoActivityTimeout: 100000,
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: "ChromeHeadless",
                flags: ["--no-sandbox", "--disable-setuid-sandbox", '--remote-debugging-port=9223']
            }
        },
        singleRun: true
    });
};
