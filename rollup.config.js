import resolve from "@rollup/plugin-node-resolve";
import multiEntry from "@rollup/plugin-multi-entry";
import sourcemap from "rollup-plugin-sourcemaps";
import pkg from "./package.json"

export default [
    {
        input: ".bin/tests/*.test.js",
        output: [
            {
                file: ".bin/tests.js",
                format: "iife",
                compact: true,
                sourcemap: true,
                globals: {
                    chai: "chai",
                    sinon: "sinon"
                }
            }
        ],
        plugins: [
            resolve(),
            multiEntry(),
            sourcemap()
        ],
        external: [
            ...Object.keys(pkg.devDependencies || {})
        ]
    }
];
