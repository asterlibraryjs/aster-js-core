import { assert } from "chai";
import { assert as sassert, spy } from "sinon";
import { Lazy } from "../src";

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

});
