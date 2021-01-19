import { assert } from "chai";
import { asserts, TypeOfResult } from "../src";

describe("asserts", () => {

    describe("defined", () => {

        ["", true, false, 0, 1, -1, null, new Date(), {}, []].forEach(val => {
            it(`Should not throw with value: ${val}`, () => {
                assert.doesNotThrow(() => asserts.defined(val));
            });
        });

        it("`Should throw with value undefined`", () => {
            assert.throw(() => asserts.defined(undefined));
        });

    });

    describe("notDefined", () => {

        ["", true, false, 0, 1, -1, null, new Date(), {}, []].forEach(val => {
            it(`Should throw with value: ${val}`, () => {
                assert.throw(() => asserts.notDefined(val));
            });
        });

        it("`Should not throw with value undefined`", () => {
            assert.doesNotThrow(() => asserts.notDefined(undefined));
        });

    });

    describe("ensure", () => {

        ["", true, false, 0, 1, -1, new Date(), {}, []].forEach(val => {
            it(`Should not throw with value: ${val}`, () => {
                assert.doesNotThrow(() => asserts.ensure(val));
            });
        });

        it("`Should throw with value undefined`", () => {
            assert.throw(() => asserts.ensure(undefined));
        });

        it("`Should throw with value null`", () => {
            assert.throw(() => asserts.ensure(null));
        });

    });

    describe("ofType", () => {

        (<[any, TypeOfResult][]>[
            ["", "string"],
            [true, "boolean"],
            [false, "boolean"],
            [0, "number"],
            [1, "number"],
            [-1, "number"],
            [new Date(), "object"],
            [{}, "object"],
            [[], "object"],
            [null, "object"],
            [undefined, "undefined"],
            [() => { }, "function"]
        ]).forEach(([val, type]) => {
            it(`Should not throw with value: ${val} for typeof: ${type}`, () => {
                assert.doesNotThrow(() => asserts.ofType(val, type as any));
            });
        });

        (<[any, TypeOfResult][]>[
            ["", "undefined"],
            [true, "number"],
            [false, "number"],
            [0, "boolean"],
            [1, "string"],
            [-1, "object"],
            [new Date(), "string"],
            [{}, "string"],
            [[], "string"],
            [null, "undefined"],
            [undefined, "object"],
            [() => { }, "object"]
        ]).forEach(([val, type]) => {
            it(`Should throw with value: ${val} for typeof: ${type}`, () => {
                assert.throw(() => asserts.ofType(val, type as any));
            });
        });

    });

    describe("instanceOf", () => {

        class CustomType { }

        it("`Should not throw with matching instance`", () => {
            assert.doesNotThrow(() => asserts.instanceOf(new CustomType(), CustomType));
        });

        it("`Should throw with not matching instance`", () => {
            assert.throw(() => asserts.instanceOf(null, CustomType));
        });

    });

});
