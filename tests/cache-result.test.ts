import { assert } from "chai";
import { cacheResult } from "../src/cache-result";

describe("cacheResult", () => {

    it("Should return the value the first time for an accessor", () => {
        class Mock {
            @cacheResult()
            get value(): number { return 22; }
        }

        const instance = new Mock();

        assert.equal(instance.value, 22);
    });

    it("Should return the value the first time for a function", () => {
        class Mock {
            @cacheResult()
            value(): number { return 22; }
        }

        const instance = new Mock();

        assert.equal(instance.value(), 22);
    });

    it("Should always return the same value for an accessor", () => {
        let value = 0;
        class Mock {
            @cacheResult()
            get value(): number { return ++value; }
        }

        const instance = new Mock();

        assert.equal(instance.value, 1);
        assert.equal(instance.value, 1);
        assert.equal(instance.value, 1);
    });

    it("Should always return the same value for a function", () => {
        let value = 0;
        class Mock {
            @cacheResult()
            value(): number { return ++value; }
        }

        const instance = new Mock();

        assert.equal(instance.value(), 1);
        assert.equal(instance.value(), 1);
        assert.equal(instance.value(), 1);
    });

    it("Should ignore undefined values", () => {
        let value: number | undefined = undefined;
        class Mock {
            @cacheResult({ ignoreUndefined: true })
            value(): number | undefined {
                const result = value;
                if (typeof value === "undefined") value = 0;
                return result;
            }
        }

        const instance = new Mock();

        assert.isUndefined(instance.value());
        assert.equal(instance.value(), 0);
        assert.equal(instance.value(), 0);
    });

    it("Should ignore null values", () => {
        let value: number | null = null;
        class Mock {
            @cacheResult({ ignoreNull: true })
            value(): number | null {
                const result = value;
                if (value === null) value = 0;
                return result;
            }
        }

        const instance = new Mock();

        assert.isNull(instance.value());
        assert.equal(instance.value(), 0);
        assert.equal(instance.value(), 0);
    });

    it("Should not return the value after ttl over", async () => {
        let value = 0;
        class Mock {
            @cacheResult({ ttl: 100 })
            get value(): number { return ++value; }
        }

        const instance = new Mock();

        assert.equal(instance.value, 1);
        await new Promise<void>(r => setTimeout(() => r(), 200))
        assert.equal(instance.value, 2);
    });

});
