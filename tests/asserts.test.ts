import { assert } from "chai";
import { assert as sassert, spy } from "sinon";
import { Lazy } from "../src";

describe("ServiceCollection", () => {

    const ctorSpy = spy();

    class CustomType {
        constructor() {
            ctorSpy();
        }
    }

    beforeEach(() => {
        ctorSpy.resetHistory();
    })

    it("Should ", () => {
        const lazy = new Lazy(() => new CustomType());
        const proxy = lazy.get();

        sassert.notCalled(ctorSpy);
        assert.instanceOf(proxy, CustomType);
    });

});
