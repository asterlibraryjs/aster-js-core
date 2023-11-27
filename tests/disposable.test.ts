import { assert } from "chai";
import { IDisposable } from "../src";

describe("IDisposable", () => {

    it(`Should dispose a dynamic disposable`, () => {
        let state = { called: false };

        assert.isDefined(Symbol.dispose);

        using disposable = IDisposable.create(() => {
            state.called = true;
        })
        {
            assert.typeOf(disposable[Symbol.dispose], "function");
            assert.isFalse(state.called, "Not called in the using");
        }

        assert.isTrue(state.called, "Called after the using");
    });

    it(`Should dispose a dynamic disposable using IDisposable.safeDispose`, () => {
        let state = { called: false };

        assert.isDefined(Symbol.dispose);

        var disposable = IDisposable.create(() => {
            state.called = true;
        });

        assert.typeOf(disposable[Symbol.dispose], "function");
        assert.isFalse(state.called, "Not called in the using");

        IDisposable.safeDispose(disposable);

        assert.isTrue(state.called, "Called after the using");
    });
});
