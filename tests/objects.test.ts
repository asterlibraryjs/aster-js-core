import { assert } from "chai";
import { utils } from "../src";

describe("objects", () => {

    it("Should find super class from type", () => {
        class A { }
        class B extends A { }
        const superClass = utils.getSuperClass(B);

        assert.equal(superClass, A);
    });

    it("Should find super class from instance", () => {
        class A { }
        class B extends A { }
        const superClass = utils.getSuperClass(new B());

        assert.equal(superClass, A);
    });

    it("Shouldn't find any super class", () => {
        class A { }
        const superClass = utils.getSuperClass(A);

        assert.isNull(superClass);
    });

    it("Should only find 1 super class", () => {
        class A { }
        class B extends A { }

        const all = [...utils.getAllSuperClass(new B())];

        assert.equal(all.length, 1);
        assert.deepEqual(all, [A]);
    });

    it("Should all 3 super class", () => {
        class A { }
        class B extends A { }
        class C extends B { }
        class D extends C { }

        const all = [...utils.getAllSuperClass(D)];

        assert.equal(all.length, 3);
        assert.deepEqual(all, [C, B, A]);
    });

    ["", 0, true, undefined, null].forEach(item => {
        it(`Shouldn't be "${item}" a valid object`, () => {
            assert.isFalse(utils.isObject(item));
        });
    });

    [{}, new (class { })()].forEach(item => {
        it(`Should be "${item}" a valid object`, () => {
            assert.isTrue(utils.isObject(item));
        });
    });

    it("Should be recognize as raw object", () => {
        assert.isTrue(utils.isRawObject({ }));
    });

    it("Shouldn't be recognize as raw object", () => {
        assert.isFalse(utils.isRawObject(new (class { })()));
    });

});
