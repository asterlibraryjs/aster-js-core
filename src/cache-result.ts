import type { Func } from "./type";

export type CacheResultOptions = {
    readonly ignoreNull?: boolean;
    readonly ignoreUndefined?: boolean;
    readonly ttl?: number;
}

type CacheEntry = {
    readonly value: any;
    readonly timeout: number;
}

export function cacheResult(options: CacheResultOptions = {}) {
    const values = new WeakMap<any, CacheEntry>();

    return (_target: any, key: string, descriptor: any) => {
        if (typeof descriptor.value === "function") {
            descriptor.value = createOverride(values, descriptor.value, options);
        }
        else if (typeof descriptor.get === "function") {
            descriptor.get = createOverride(values, descriptor.get, options);
        }
        else {
            throw new Error(`"${key}" is not supported by memoize decorator`);
        }
    }
}

function createOverride(values: WeakMap<any, CacheEntry>, fn: Func<any[]>, { ignoreUndefined, ignoreNull, ttl }: CacheResultOptions) {
    return function (this: any, ...args: any[]) {
        const entry = values.get(this);
        if (entry && (entry.timeout === -1 || entry.timeout > Date.now())) {
            return entry.value;
        }
        else {
            values.delete(this);
        }

        const value = fn!.apply(this, args);

        if (
            (typeof value === "undefined" && ignoreUndefined)
            || (value === null && ignoreNull)
        ) {
            return value;
        }

        values.set(this, { value, timeout: ttl ? Date.now() + ttl : -1 });
        return value;
    };
}
