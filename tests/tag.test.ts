import { assert } from "chai";
import { Tag } from "../src";

describe("Tag", () => {

    it(`Should create a new Tag`, () => {
        const tag = Tag<string>("My Description");

        assert.equal(tag.toString(), "My Description");
    });

    it(`Should return false when no value is associate`, () => {
        const tag = Tag<string>("My Description");
        class CustomType {}

        assert.isFalse(tag.has(CustomType));
        assert.isUndefined(tag.get(CustomType));
    });

    it(`Should associate properly a value to a type`, () => {
        const tag = Tag<string>("My Description");
        class CustomType {}

        tag.set(CustomType, "Value");

        assert.isTrue(tag.has(CustomType));
        assert.equal(tag.get(CustomType), "Value");
    });


    it(`Should override an existing value`, () => {
        const tag = Tag<string>("My Description");
        class CustomType {}

        tag.set(CustomType, "Value");
        tag.set(CustomType, "New Value");

        assert.isTrue(tag.has(CustomType));
        assert.equal(tag.get(CustomType), "New Value");
    });

    it(`Should delete properly an associated value`, () => {
        const tag = Tag<string>("My Description");
        class CustomType {}

        tag.set(CustomType, "Value");
        tag.delete(CustomType);

        assert.isFalse(tag.has(CustomType));
        assert.isUndefined(tag.get(CustomType));
    });

    it(`Should not throw when delete and no value associated`, () => {
        const tag = Tag<string>("My Description");
        class CustomType {}

        tag.delete(CustomType);
        
        assert.doesNotThrow(()=> tag.delete(CustomType));
    });

    it(`Should get values through readonly Tag`, () => {
        const tag = Tag<string>("My Description");
        const readonlyTag = tag.readOnly();
        class CustomType {}

        tag.set(CustomType, "Value");

        assert.isTrue(readonlyTag.has(CustomType));
        assert.equal(readonlyTag.get(CustomType), "Value");
    });

    it(`Should get not values through readonly Tag`, () => {
        const tag = Tag<string>("My Description");
        const readonlyTag = tag.readOnly();
        class CustomType {}

        assert.isFalse(readonlyTag.has(CustomType));
        assert.isUndefined(readonlyTag.get(CustomType));
    });

});