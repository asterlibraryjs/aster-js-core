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

    describe("array", () => {

        it(`Should not throw with valid arrays`, () => {
            assert.doesNotThrow(() => asserts.empty([]));
            assert.doesNotThrow(() => asserts.single([1]));
            assert.doesNotThrow(() => asserts.many([3, 2]));
            assert.doesNotThrow(() => asserts.notEmpty([1]));
            assert.doesNotThrow(() => asserts.notEmpty([1,2]));
        });

        it("`Should throw with invalid arrays`", () => {
            assert.throw(() => asserts.empty([1]));
            assert.throw(() => asserts.single([]));
            assert.throw(() => asserts.single([1,2]));
            assert.throw(() => asserts.many([]));
            assert.throw(() => asserts.many([2]));
            assert.throw(() => asserts.notEmpty([]));
        });

        it("`Should throw with null`", () => {
            assert.throw(() => asserts.empty(null));
            assert.throw(() => asserts.single(null));
            assert.throw(() => asserts.many(null));
            assert.throw(() => asserts.notEmpty(null));
        });

        it("`Should throw with undefined`", () => {
            assert.throw(() => asserts.empty(undefined));
            assert.throw(() => asserts.single(undefined));
            assert.throw(() => asserts.many(undefined));
            assert.throw(() => asserts.notEmpty(undefined));
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
