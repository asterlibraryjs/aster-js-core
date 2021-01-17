const process = require("process");
const puppeteer = require("puppeteer");

module.exports = function (config) {
    process.env.CHROME_BIN = puppeteer.executablePath();
    config.set({
        basePath: "",
        frameworks: ["mocha", "chai", "sinon"],
        files: [
            ".bin/tests.js",
        ],
        exclude: [],
        colors: true,
        logLevel: config.LOG_INFO,
        reporters: ["mocha"],
        autoWatch: false,
        browsers: ["ChromeDebugging"],
        browserDisconnectTolerance: 3,
        browserNoActivityTimeout: 100000,
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: "ChromeHeadless",
                flags: ['--disable-translate', '--disable-extensions', '--remote-debugging-port=9876']
            },
            // ChromeDebugging: {
            //     base: 'Chrome',
            //     flags: ['--remote-debugging-port=9333']
            // }
        }
    });
};
