
type HasTagDelegate = (target: object) => boolean;

type GetTagDelegate<T> = (target: object) => T;

interface GetSetTagDelegate<T> {
    (target: object): T;
    (target: object, value: T): void;
};

interface ReadonlyTagImpl<T> {
    readonly has: HasTagDelegate;

    readonly get: GetTagDelegate<T>;

    toString(): string;
}

interface TagImpl<T> {
    readOnly(): ReadonlyTag<T | undefined>;

    set(target: object, value: T): void;

    delete(target: object): boolean;
}

export type ReadonlyTag<T> = GetTagDelegate<T> & ReadonlyTagImpl<T>;

/** Tag allow to attach value using a weakmap */
export type Tag<T> = TagImpl<T> & GetSetTagDelegate<T> & ReadonlyTagImpl<T>;

function createReadOnlyTag<T>(description: string, has: HasTagDelegate, get: GetTagDelegate<T>): ReadonlyTag<T> {
    const readOnlyTag = Object.assign<GetTagDelegate<T>, ReadonlyTagImpl<T>>(
        target => get(target),
        {
            get, has,
            toString: () => description
        }
    );
    return Object.freeze<ReadonlyTag<T>>(readOnlyTag);
}

/** Create a new Tag */
export function Tag<T = any>(description: string, defaultValue?: T): Tag<T> {
    const store = new WeakMap();

    const has = (target: object) => store.has(target);
    const get = (target: object) => has(target) ? store.get(target) : defaultValue;
    const set = (target: object, value: T) => void store.set(target, value);

    const readOnlyTag = createReadOnlyTag<T>(description, has, get);

    return Object.assign<GetSetTagDelegate<T>, ReadonlyTagImpl<T>, TagImpl<T>>(
        (...args: [object] | [object, T]) => args.length == 1 ? get(args[0]) : set(args[0], args[1]),
        readOnlyTag,
        {
            readOnly: () => readOnlyTag,
            set,
            delete: target => store.delete(target)
        }
    );
}

export namespace Tag {
    export function lazy<T = any>(description: string, factory: (target: object) => T): ReadonlyTag<T>;
    export function lazy<T = any, S = any>(description: string, factory: (target: object, state: S) => T, state: S): ReadonlyTag<T>;
    export function lazy<T>(description: string, factory: (target: object, state: any) => T, state?: any): ReadonlyTag<T> {
        const store = new WeakMap();

        const has = (target: object) => store.has(target);
        const get = (target: object) => {
            if (!has(target)) {
                store.set(target, factory(target, state));
            }
            return store.get(target);
        };
        return createReadOnlyTag<T>(description, has, get);
    }
}
