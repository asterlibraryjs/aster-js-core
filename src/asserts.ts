import { Constructor, TypeOfResult } from "./type";

export class AssertionError extends Error { }

export namespace asserts {

    export function defined<T>(value: T | undefined, message?: string): asserts value is T extends undefined ? never : T {
        if (typeof value === "undefined") {
            throw new AssertionError(message ?? "Value expected to be defined");
        }
    }

    export function notDefined<T>(value: T | undefined, message?: string): asserts value is undefined {
        if (typeof value !== "undefined") {
            throw new AssertionError(message ?? "Value expected to be undefined");
        }
    }

    export function object<T>(value: unknown, message?: string): asserts value is object {
        if (typeof value === "object" && value !== null) {
            throw new AssertionError(message ?? "Value expected to be an object");
        }
    }

    export function ensure<T>(value: T | undefined | null, message?: string): asserts value is NonNullable<T> {
        if (typeof value === "undefined" || value === null) {
            throw new AssertionError(message ?? "Value expected to be defined and not null");
        }
    }

    export function empty<T>(value: T[] | undefined | null, message?: string): asserts value is [T, ...T[]] {
        if (typeof value === "undefined" || value === null || value.length !== 0) {
            throw new AssertionError(message ?? "A valid empty array is expected");
        }
    }

    export function notEmpty<T>(value: T[] | undefined | null, message?: string): asserts value is [T, ...T[]] {
        if (typeof value === "undefined" || value === null || value.length === 0) {
            throw new AssertionError(message ?? "A valid non empty array is expected");
        }
    }

    export function single<T>(value: T[] | undefined | null, message?: string): asserts value is [T, ...T[]] {
        if (typeof value === "undefined" || value === null || value.length !== 1) {
            throw new AssertionError(message ?? "A valid array with a single entry is expected");
        }
    }

    export function many<T>(value: T[] | undefined | null, message?: string): asserts value is [T, ...T[]] {
        if (typeof value === "undefined" || value === null || value.length <= 1) {
            throw new AssertionError(message ?? "A valid array with more than 1 entry is expected");
        }
    }

    export function returns<T>(value: T | undefined | null, message?: string): NonNullable<T> {
        ensure<T>(value, message);
        return value;
    }

    export function ofType(value: unknown, type: "number", message?: string): asserts value is number;
    export function ofType(value: unknown, type: "boolean", message?: string): asserts value is boolean;
    export function ofType(value: unknown, type: "string", message?: string): asserts value is string;
    export function ofType(value: unknown, type: "function", message?: string): asserts value is Function;
    export function ofType(value: unknown, type: "undefined", message?: string): asserts value is undefined;
    export function ofType(value: unknown, type: "bigint", message?: string): asserts value is bigint;
    export function ofType(value: unknown, type: "symbol", message?: string): asserts value is symbol;
    export function ofType(value: unknown, type: "object", message?: string): asserts value is object;
    export function ofType(value: unknown, type: TypeOfResult, message?: string): asserts value is any {
        if (typeof value !== type) {
            throw new AssertionError(message ?? `Expected typeof "${type}" but having a typeof "${typeof value}"`);
        }
    }

    export function instanceOf<T>(value: unknown, type: Constructor<T>, message?: string): asserts value is T {
        if (!(value instanceof type)) {
            throw new AssertionError(message ?? `Expected to be an instance of "${type.name}"`);
        }
    }

    export function create<T>(predicate: (value: unknown) => value is T): (value: unknown, message?: string) => asserts value is T {
        return (value: unknown, message?: string) => {
            if (predicate(value)) throw new AssertionError(message ?? "Assertion failed");
        }
    }
}
