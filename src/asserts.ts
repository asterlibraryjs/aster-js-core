import { Constructor, TypeOfResult } from "./type";

/** Error thrown by assertion methods */
export class AssertionError extends Error { }

/**
 * Contains assertion method that will help validating and make levrage of typescript typeguard mecanism
 * to ensure any value has the expected value then cast it for the rest of the method usage
 */
export namespace asserts {

    /** Ensure the provided value is not undefined */
    export function defined<T>(value: T | undefined, message?: string): asserts value is T extends undefined ? never : T {
        if (typeof value === "undefined") {
            throw new AssertionError(message ?? "Value expected to be defined");
        }
    }

    /** Ensure the provided value is undefined */
    export function notDefined<T>(value: T | undefined, message?: string): asserts value is undefined {
        if (typeof value !== "undefined") {
            throw new AssertionError(message ?? "Value expected to be undefined");
        }
    }

    /** Ensure the provided value is a valid object */
    export function object<T>(value: unknown, message?: string): asserts value is object {
        if (typeof value === "object" && value !== null) {
            throw new AssertionError(message ?? "Value expected to be an object");
        }
    }

    /** Ensure their a valid value which is not undefined or null */
    export function ensure<T>(value: T | undefined | null, message?: string): asserts value is NonNullable<T> {
        if (typeof value === "undefined" || value === null) {
            throw new AssertionError(message ?? "Value expected to be defined and not null");
        }
    }

    /** Ensure the array is empty or throw an AssertionError */
    export function empty<T>(value: T[] | undefined | null, message?: string): asserts value is [] {
        if (typeof value === "undefined" || value === null || value.length !== 0) {
            throw new AssertionError(message ?? "A valid empty array is expected");
        }
    }

    /** Ensure the array is not empty or throw an AssertionError */
    export function notEmpty<T>(value: T[] | undefined | null, message?: string): asserts value is [T, ...T[]] {
        if (typeof value === "undefined" || value === null || value.length === 0) {
            throw new AssertionError(message ?? "A valid non empty array is expected");
        }
    }

    /** Ensure their is only 1 items in the array or throw an AssertionError */
    export function single<T>(value: T[] | undefined | null, message?: string): asserts value is [T] {
        if (typeof value === "undefined" || value === null || value.length !== 1) {
            throw new AssertionError(message ?? "A valid array with a single entry is expected");
        }
    }

    /** Ensure their is at least 2 items in the array or throw an AssertionError */
    export function many<T>(value: T[] | undefined | null, message?: string): asserts value is [T, T, ...T[]] {
        if (typeof value === "undefined" || value === null || value.length <= 1) {
            throw new AssertionError(message ?? "A valid array with more than 1 entry is expected");
        }
    }

    /** Do the ensure validation and return the value instead of just simple asserts typeguard */
    export function returns<T>(value: T | undefined | null, message?: string): NonNullable<T> {
        ensure<T>(value, message);
        return value;
    }

    /** Ensure the provided value is a valid number */
    export function ofType(value: unknown, type: "number", message?: string): asserts value is number;
    /** Ensure the provided value is a valid boolean */
    export function ofType(value: unknown, type: "boolean", message?: string): asserts value is boolean;
    /** Ensure the provided value is a valid string */
    export function ofType(value: unknown, type: "string", message?: string): asserts value is string;
    /** Ensure the provided value is a valid function */
    export function ofType(value: unknown, type: "function", message?: string): asserts value is Function;
    /** Ensure the provided value is undefined */
    export function ofType(value: unknown, type: "undefined", message?: string): asserts value is undefined;
    /** Ensure the provided value is a valid bigint */
    export function ofType(value: unknown, type: "bigint", message?: string): asserts value is bigint;
    /** Ensure the provided value is a valid symbol */
    export function ofType(value: unknown, type: "symbol", message?: string): asserts value is symbol;
    /** Ensure the provided value is a valid object */
    export function ofType(value: unknown, type: "object", message?: string): asserts value is object;
    export function ofType(value: unknown, type: TypeOfResult, message?: string): asserts value is any {
        if (typeof value !== type) {
            throw new AssertionError(message ?? `Expected typeof "${type}" but having a typeof "${typeof value}"`);
        }
    }

    /** Ensure the provided value is an instance of the provided type */
    export function instanceOf<T>(value: unknown, type: Constructor<T>, message?: string): asserts value is T {
        if (!(value instanceof type)) {
            throw new AssertionError(message ?? `Expected to be an instance of "${type.name}"`);
        }
    }

    /** Create a custom assertion callback with an existing predicate */
    export function create<T>(predicate: (value: unknown) => value is T): (value: unknown, message?: string) => asserts value is T {
        return (value: unknown, message?: string) => {
            if (predicate(value)) throw new AssertionError(message ?? "Assertion failed");
        }
    }
}
