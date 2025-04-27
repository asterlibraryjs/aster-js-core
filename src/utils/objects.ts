import { Constructor } from "../type";

const objClassPrototype = Object.getPrototypeOf(Object);

export function getSuperClass(typeOrInstance: any): Constructor | null {
    let result: Constructor | null = null;
    if (typeof typeOrInstance === "function") {
        result = Object.getPrototypeOf(typeOrInstance);
    }
    if (typeof typeOrInstance === "object") {
        result = Object.getPrototypeOf(typeOrInstance.constructor);
    }
    return result === objClassPrototype ? null : result;
}

/**
 * Returns all inheritance
 * @param typeOrInstance Type of instance to get inherited classes
 */
export function* getAllSuperClass(typeOrInstance: any): Iterable<Constructor> {
    let ctor = getSuperClass(typeOrInstance);
    while (ctor) {
        yield ctor;
        ctor = Object.getPrototypeOf(ctor);
        if (ctor === objClassPrototype) break;
    }
}

export type RawObject = Record<PropertyKey, unknown>;

/**
 * Check if provided instance is an object not null
 * @param value Value to check
 * @returns Returns true if the value is a valid object
 */
export function isObject(value: unknown): value is RawObject {
    return value !== null && typeof value === "object";
}

export function isRawObject(value: unknown): value is RawObject {
    return isObject(value) && Object.getPrototypeOf(value) === Object.prototype;
}

/**
 * Check either if the object is an anonymous object and has no value set
 * @param value
 * @returns
 */
export function isEmptyObject(value: unknown, ignoreUndefined: boolean = false): boolean {
    if (isRawObject(value)) {
        var keys = Object.keys(value);
        if (ignoreUndefined) {
            return keys.findIndex(k => typeof value[k] !== "undefined") === -1
        }
        return keys.length === 0;
    }
    return false;
}

export function* getObjectEntries<T extends object>(obj: T): Iterable<[keyof T, T[keyof T]]> {
    for (const key of Object.getOwnPropertyNames(obj)) {
        yield [key as keyof T, Reflect.get(obj, key)];
    }
    for (const key of Object.getOwnPropertySymbols(obj)) {
        yield [key as keyof T, Reflect.get(obj, key)];
    }
}

/** @deprecated Use structuredClone */
export function clone<T = any>(value: T, deep: boolean): T;
export function clone<T = any>(value: T[], deep: boolean): T[];
export function clone(value: any, deep: boolean): any {
    return structuredClone(value);
}
