
## Disposable

`Disposable` provide a base implementation for `IDisposable`. 

`IDisposable` is a contract to ensure a total destruction of any instance that implement it.

### `IDisposable` sample

```typescript
export class CustomEventListener implements EventListenerObject, IDisposable {
    private readonly _targets: Set<EventSource> = new Set();

    constructor(
        private readonly _type: string,
        private readonly _options: AddEventListenerOptions
    ) { }

    listen(source: EventSource): void {
        if (this._targets.has(source)) {
            source.addEventListener(this._type, this, this._options);
            this._targets.add(source);
        }
    }

    handleEvent(evt: Event): void {
        evt.stopPropagation();
    }

    [IDisposable.dispose](): void {
        this._targets.forEach(src => src.removeEventListener(this._type, this));
        this._targets.clear();
    }
}

const listener = new CustomEventListener();
// Usage ...
listener.listen(domElement);

// Safe destruction
IDisposable.safeDispose(listener);

// Further usage will work has its not handled
// And keeps new references to html nodes and events
listener.listen(domElement);
```

### `Disposable` sample

Same sample but using `Disposable` base class

```typescript
export class CustomEventListener extends Disposable implements EventListenerObject {
    private readonly _targets: Set<EventSource> = new Set();

    constructor(
        private readonly _type: string,
        private readonly _options: AddEventListenerOptions
    ) {
        super();
    }

    listen(source: EventSource): void {
        this.checkIfDisposed();
        if (this._targets.has(source)) {
            source.addEventListener(this._type, this, this._options);
            this._targets.add(source);
        }
    }

    handleEvent(evt: Event): void {
        this.checkIfDisposed();
        evt.stopPropagation();
    }

    protected dispose(): void {
        this._targets.forEach(src => src.removeEventListener(this._type, this));
        this._targets.clear();
    }
}

const listener = new CustomEventListener();
// Usage ...
listener.listen(domElement);

// Safe destruction
IDisposable.safeDispose(listener);

// Further usage will throw a `DisposedError`
listener.listen(domElement);

// Trying to dispose it again will not throw errors
IDisposable.safeDispose(listener);
```