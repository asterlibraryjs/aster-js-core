import { IDisposable } from "./idisposable";
import { Constructor } from "./type";

const enum LazyState {
    proxy = 1,
    value = 2,
    faulted = 3,
    disposed = 4
}

export class Lazy<T extends object = object> implements IDisposable {
    private _value: any;
    private _state?: LazyState;
    private _prototype?: any;

    get disposed(): boolean { return this._state === LazyState.disposed; }

    constructor(
        private readonly _factory: () => T,
        ctor?: Constructor<T>
    ) {
        this._prototype = ctor?.prototype;
    }

    build(): boolean {
        IDisposable.checkDisposed(this);

        if(this._state === LazyState.value) return false;

        try {
            this._value = this._factory();
            this._state = LazyState.value;

            if (typeof this._value === "object") {
                this._prototype = Reflect.getPrototypeOf(this._value);
            }
        }
        catch (err) {
            this._value = err;
            this._state = LazyState.proxy;
        }
        return true;
    }

    has(): boolean {
        return this._state === LazyState.value;
    }

    get(): T {
        IDisposable.checkDisposed(this); // LazyState.disposed

        if (this._state === LazyState.faulted) throw this._value;

        if (typeof this._state === "undefined") {
            this._value = new Proxy(
                Object.create(null),
                this.createProxyHandler()
            );
            this._state = LazyState.proxy;
        }
        // LazyState.proxy &  LazyState.value
        return this._value;
    }

    [IDisposable.dispose](): void {
        if (this._state === LazyState.value) {
            IDisposable.safeDispose(this._value);
        }
        this._state = LazyState.disposed;
    }

    private getInstance(): T {
        this.build(); // CheckDisposed done
        if (this._state === LazyState.faulted) throw this._value;
        return this._value;
    }

    private createProxyHandler(): ProxyHandler<T> {
        return {
            get: (_: T, prop: keyof T) => {
                return this.getInstance()[prop];
            },
            set: (_: T, p: keyof T, value: any) => {
                this.getInstance()[p] = value;
                return true;
            },
            deleteProperty: (_: T, p: keyof T) => {
                delete this.getInstance()[p];
                return true;
            },
            getPrototypeOf: (_: T) => {
                return this._prototype ?? Object;
            }
        };
    }
}
