
export interface ReadonlyTag<T> {

    has(target: object): boolean;

    get(target: object): T | undefined;

    toString(): string;
}

/**
 * Tag allow to attach value using a 
 */
export interface Tag<T> extends ReadonlyTag<T> {
    readOnly(): ReadonlyTag<T>;

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
        readOnly(): ReadonlyTag<T> {
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
