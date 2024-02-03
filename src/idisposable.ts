import type { Constructor, Func } from "./type";

if (!Symbol.dispose) Object.assign(Symbol, { dispose: Symbol("dispose") });

/**
 * - IDisposable is an interface constract for disposable object.
 * - IDisposable is also a mixin function to create disposable through composition
 * - IDisposable also contains static methods to create or safely dispose instances
 */
export interface IDisposable {
    [Symbol.dispose](): void;
}

export function IDisposable<T extends Object>(ctor: Constructor<T>): Constructor<T & Disposable>;
export function IDisposable(ctor: Constructor): Constructor {
    class CustomDisposable extends ctor { };
    for (const key of Reflect.ownKeys(DisposableHost.prototype)) {
        const desc = { ...Reflect.getOwnPropertyDescriptor(DisposableHost.prototype, key) };
        Reflect.defineProperty(CustomDisposable.prototype, key, desc);
    }
    return CustomDisposable;
}

export namespace IDisposable {

    /** @deprecated use Symbol.dispose instead */
    export const dispose: typeof Symbol.dispose = Symbol.dispose;

    /**
     * Create a new IDisposable from a callback
     * @param callback Callback to call when dispose is invoked
     * @returns Returns a new IDiposable instance
     */
    export function create(callback: Func): IDisposable {
        return { [Symbol.dispose]: () => void callback() };
    }

    /**
     * Dispose all provide instances, support any iterable instance.
     * @param instances Instances to dispose
     * @returns Returns all errors encountered during disposing each instances.
     */
    export function safeDisposeAll(instances: any): any[] {
        if (typeof instances === "object" && instances !== null && typeof instances[Symbol.iterator] === "function") {
            return [...instances].map(safeDispose);
        }
        return [];
    }

    /**
     * Dispose the provided instance and catch exceptions that may occur
     * @param instance Instance to dispose
     * @returns Returns the catched disposing error or undefined
     */
    export function safeDispose(instance: any): any {
        if (typeof instance === "object" && instance !== null && typeof instance[Symbol.dispose] === "function") {
            try {
                instance[Symbol.dispose]();
            }
            catch (ex) {
                return ex;
            }
        }
    }

    /**
     * Check if an instance is disposed, throw an error if it is
     * @param instance Instance to check
     */
    export function checkDisposed(instance: IDisposable & { readonly disposed: boolean }): void {
        if (instance.disposed) throw new DisposedError("Try to access to a disposed instance");
    }
}

/**
 * Error triggered when trying to use a diposed instance
 */
export class DisposedError extends Error { }

/**
 * Represents a class that contains dependencies to dispose
 */
export class DisposableHost implements IDisposable {
    private _disposed?: boolean;
    private _disposables?: Set<IDisposable>;

    get disposed(): boolean { return Boolean(this._disposed); }

    /**
     * Register all provided instances to dispose them when current instance will be disposed
     * @param disposables Instance to attach
     */
    registerForDispose(...disposables: IDisposable[]): void {
        if (this._disposables) {
            for (const disposable of disposables) {
                this._disposables.add(disposable);
            }
        }
        else {
            this._disposables = new Set(disposables);
        }
    }

    protected checkIfDisposed(): void {
        IDisposable.checkDisposed(this);
    }

    [Symbol.dispose](): void {
        if (!this._disposed) {
            this._disposed = true;

            IDisposable.safeDisposeAll(this._disposables);
            delete this._disposables;

            this.dispose && this.dispose();
        }
    }

    protected dispose?(): void;
}
