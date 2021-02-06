
export interface ReadonlyTag<T> {
    (target: object):T;

    has(target: object): boolean;

    get(target: object): T;

    toString(): string;
}

/**
 * Tag allow to attach value using a 
 */
export interface Tag<T> extends ReadonlyTag<T | undefined> {
    readOnly(): ReadonlyTag<T | undefined>;

    set(target: object, value: T): void;

    delete(target: object): void;
}

/** Create a new Tag */
export function Tag<T = any>(description: string, defaultValue?: T): Tag<T> {
    const store = new WeakMap();

    function customReadonlyTag(target: object): T {
        return (customReadonlyTag as any).get(target);
    };

    const readOnlyTag = Object.assign(customReadonlyTag, {
        has(target: object): boolean {
            return store.has(target);
        },
        get(target: object): T | undefined {
            return store.has(target) ? store.get(target) : defaultValue;
        },
        toString(): string {
            return description;
        }
    });
    Object.freeze(readOnlyTag);

    function customTag(target: object): T {
        return (customTag as any).get(target);
    };
    return Object.assign(customTag, {
        ...readOnlyTag,
        readOnly(): ReadonlyTag<T | undefined> {
            return readOnlyTag;
        },
        set(target: object, value: T): void {
            store.set(target, value);
        },
        delete(target: object): void {
            store.delete(target);
        }
    });
}

export namespace Tag {
    export function lazy<T = any>(description: string, factory: () => T): ReadonlyTag<T>;
    export function lazy<T = any, S = any>(description: string, factory: (state: S) => T, state: S): ReadonlyTag<T>;
    export function lazy<T>(description: string, factory: (state: any) => T, state?: any): ReadonlyTag<T> {
        const store = new WeakMap();

        function lazyTag(target: object): T {
            return (lazyTag as any).get(target);
        };

        const readOnlyTag = Object.assign(lazyTag, {
            has(target: object): boolean {
                return store.has(target);
            },
            get(target: object): T {
                if (!store.has(target)) {
                    store.set(target, factory(state));
                }
                return store.get(target);
            },
            toString(): string {
                return description;
            }
        });
        Object.freeze(readOnlyTag);
        return readOnlyTag;
    }
}