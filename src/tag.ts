
export interface ReadonlyTag<T> {

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
    const readOnlyTag = {
        has(target: object): boolean {
            return store.has(target);
        },
        get(target: object): T | undefined {
            return store.has(target) ? store.get(target) : defaultValue;
        },
        toString(): string {
            return description;
        }
    };
    Object.freeze(readOnlyTag);
    return {
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
    };
}

export namespace Tag {
    export function lazy<T = any>(description: string, factory: () => T): ReadonlyTag<T>;
    export function lazy<T = any, S = any>(description: string, factory: (state: S) => T, state: S): ReadonlyTag<T>;
    export function lazy<T>(description: string, factory: (state: any) => T, state?: any): ReadonlyTag<T> {
        const store = new WeakMap();
        const readOnlyTag = {
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
        };
        Object.freeze(readOnlyTag);
        return readOnlyTag;
    }
}