import { Constructor } from "./type";

export interface IDisposable {
    [IDisposable.dispose](): void;
}

export function IDisposable<T extends Object>(ctor: Constructor<T>): Constructor<T & Disposable>;
export function IDisposable(ctor: Constructor): Constructor {
    class CustomDisposable extends ctor { };
    for (const key of Reflect.ownKeys(Disposable.prototype)) {
        const desc = { ...Reflect.getOwnPropertyDescriptor(Disposable.prototype, key) };
        Reflect.defineProperty(CustomDisposable.prototype, key, desc);
    }
    return CustomDisposable;
}

export namespace IDisposable {

    export const dispose = Symbol("dispose");

    export function create(callback: Function): IDisposable {
        return {
            [IDisposable.dispose]: () => {
                callback();
            }
        };
    }

    export function safeDisposeAll(instance: any): void {
        if (typeof instance === "object" && instance !== null && typeof instance[Symbol.iterator] === "function") {
            for (const item of instance) safeDispose(item);
        }
    }

    export function safeDispose(instance: any): void {
        if (typeof instance === "object" && instance !== null && typeof instance[dispose] === "function") {
            instance[dispose]();
        }
    }

    export function checkDisposed(instance: IDisposable & { readonly disposed: boolean }): void {
        if (instance.disposed) throw new DisposedError("Try to access to a disposed instance");
    }
}

export class DisposedError extends Error { }

/** Do not use, this class is used to type the IDisposable.mixin() result */
export class Disposable implements IDisposable {
    private _disposed?: boolean;
    private _children?: IDisposable[];

    get disposed(): boolean { return Boolean(this._disposed); }

    registerForDispose(disposable: IDisposable): void {
        if (!this._children) {
            this._children = [disposable];
        }
        else {
            this._children.push(disposable);
        }
    }

    protected checkIfDisposed(): void {
        IDisposable.checkDisposed(this);
    }

    [IDisposable.dispose](): void {
        if (!this._disposed) {
            this._disposed = true;

            IDisposable.safeDisposeAll(this._children);
            delete this._children;

            this.dispose && this.dispose();
        }
    }

    protected dispose?(): void;
}