const process = require("process");
const puppeteer = require("puppeteer");

module.exports = function (config) {
    process.env.CHROME_BIN = puppeteer.executablePath();
    config.set({
        frameworks: ["mocha", "chai", "sinon"],
        files: [
            { pattern: ".bin/tests.js", watched: false },
            { pattern: ".bin/tests.js.map", included: false, served: true, watched: false, nocache: true },
            { pattern: "node_modules/mocha/mocha.js.map", included: false, served: true, watched: false, nocache: true },
        ],
        exclude: [],
        colors: true,
        logLevel: config.LOG_INFO,
        reporters: ["mocha"],
        autoWatch: false,
        port: 8081,
        browsers: ["ChromeNoExtensions"],
        browserDisconnectTolerance: 3,
        browserNoActivityTimeout: 100000,
        customLaunchers: {
            ChromeNoExtensions: {
                base: "Chrome",
                flags: ["--disable-translate", "--disable-extensions", "--remote-debugging-port=9223"]
            }
        },
        singleRun: false
    });
};
