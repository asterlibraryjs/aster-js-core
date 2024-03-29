import { assert } from "chai";
import { Tag, Tags } from "../src";

describe("Tag", () => {

    it(`Should create a new Tag`, () => {
        const tag = Tag<string>("My Description");

        assert.equal(tag.toString(), "My Description");
    });

    it(`Should return false when no value is associated`, () => {
        const tag = Tag<string>("My Description");
        class CustomType { }

        assert.isFalse(tag.has(CustomType));
        assert.isUndefined(tag(CustomType));
        assert.isUndefined(tag.get(CustomType));
    });

    it(`Should associate properly a value to a type`, () => {
        const tag = Tag<string>("My Description");
        class CustomType { }

        tag.set(CustomType, "Value");

        assert.isTrue(tag.has(CustomType));
        assert.equal(tag(CustomType), "Value");
        assert.equal(tag.get(CustomType), "Value");
    });

    it(`Should associate properly a value to a type using the tag function`, () => {
        const tag = Tag<string>("My Description");
        class CustomType { }

        tag(CustomType, "Value");

        assert.isTrue(tag.has(CustomType));
        assert.equal(tag(CustomType), "Value");
        assert.equal(tag.get(CustomType), "Value");
    });

    it(`Should override an existing value`, () => {
        const tag = Tag<string>("My Description");
        class CustomType { }

        tag.set(CustomType, "Value");
        tag.set(CustomType, "New Value");

        assert.isTrue(tag.has(CustomType));
        assert.equal(tag(CustomType), "New Value");
        assert.equal(tag.get(CustomType), "New Value");
    });

    it(`Should delete properly an associated value`, () => {
        const tag = Tag<string>("My Description");
        class CustomType { }

        tag.set(CustomType, "Value");
        tag.delete(CustomType);

        assert.isFalse(tag.has(CustomType));
        assert.isUndefined(tag.get(CustomType));
    });

    it(`Should not throw when delete and no value associated`, () => {
        const tag = Tag<string>("My Description");
        class CustomType { }

        tag.delete(CustomType);

        assert.doesNotThrow(() => tag.delete(CustomType));
    });

    it(`Should get values through readonly Tag`, () => {
        const tag = Tag<string>("My Description");
        const readonlyTag = tag.readOnly();
        class CustomType { }

        tag.set(CustomType, "Value");

        assert.isTrue(readonlyTag.has(CustomType));
        assert.equal(readonlyTag(CustomType), "Value");
        assert.equal(readonlyTag.get(CustomType), "Value");
    });

    it(`Should get not values through readonly Tag`, () => {
        const tag = Tag<string>("My Description");
        const readonlyTag = tag.readOnly();
        class CustomType { }

        assert.isFalse(readonlyTag.has(CustomType));
        assert.isUndefined(readonlyTag.get(CustomType));
    });

    it(`Should create dynamically the tag value`, () => {
        const tag = Tag.lazy("My Description", () => 0);

        const obj = {};

        assert.isFalse(tag.has(obj));
        assert.equal(tag(obj), 0);
        assert.equal(tag.get(obj), 0);
        assert.isTrue(tag.has(obj));
    });

    it(`Should create dynamically multiple tag value and keep this value for next time`, () => {
        const obj1 = {};
        const obj2 = {};

        assert.equal(Tags.hashId(obj1), 1);
        assert.equal(Tags.hashId(obj2), 2);
        assert.equal(Tags.hashId(obj1), 1);
        assert.equal(Tags.hashId(obj2), 2);
    });
});
