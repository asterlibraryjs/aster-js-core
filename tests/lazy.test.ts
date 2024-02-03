import { assert } from "chai";
import { assert as sassert, spy } from "sinon";
import { isLazyProxy, Lazy } from "../src";

describe("Lazy", () => {

    const ctorSpy = spy();

    class CustomType {
        constructor() {
            ctorSpy();
        }
        hello(): void { }
    }

    beforeEach(() => {
        ctorSpy.resetHistory();
    });

    it("Should return true to instanceof without calling constructor", () => {
        const lazy = new Lazy(() => new CustomType(), CustomType);
        const proxy = lazy.get();

        sassert.notCalled(ctorSpy);
        assert.instanceOf(proxy, CustomType);
        assert.isFalse(lazy.has());
    });

    it("Should not return true to instanceof when type is not provided", () => {
        const lazy = new Lazy(() => new CustomType());
        const proxy = lazy.get();

        sassert.notCalled(ctorSpy);
        assert.notInstanceOf(proxy, CustomType);
        assert.isFalse(lazy.has());
    });

    it("Should create the instance when calling a method", () => {
        const lazy = new Lazy(() => new CustomType(), CustomType);
        const proxy = lazy.get();

        proxy.hello();

        sassert.calledOnce(ctorSpy);
        assert.isTrue(lazy.has());
    });

    it("Should return true to instanceof even when not provided after the instance is created", () => {
        const lazy = new Lazy(() => new CustomType());
        const proxy = lazy.get();

        proxy.hello();

        assert.isTrue(lazy.has());
        sassert.calledOnce(ctorSpy);
        assert.instanceOf(proxy, CustomType);
    });

    it("Should return true to instanceof even when not provided after the instance is created", () => {
        const lazy = new Lazy(() => new CustomType());
        const proxy = lazy.get();

        lazy.build();

        assert.isTrue(lazy.has());
        sassert.calledOnce(ctorSpy);
        assert.instanceOf(proxy, CustomType);
    });

    it("Should spread properly properties", () => {
        const lazy = new Lazy(() => ({ id: 0, name: "test" }));
        const proxy = lazy.get();

        lazy.build();

        const result = { ...proxy };

        assert.deepEqual(result, { id: 0, name: "test" });
    });

    it("Should return true when using isLazyProxy over a Lazy proxy", () => {
        const proxy = Lazy.get(() => new CustomType());

        const result = isLazyProxy(proxy)

        assert.isTrue(result);
    });

    it("Should return false when using isLazyProxy over a basic object", () => {
        const result = isLazyProxy({})

        assert.isFalse(result);
    });

    it("Should return false when using isLazyProxy over null value", () => {
        const result = isLazyProxy(null)

        assert.isFalse(result);
    });

});
