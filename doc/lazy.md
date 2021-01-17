
## Lazy<T>

`Lazy` will enable creating a value instance only when the instance is used:
- Creating a new Lazy will required a factory to create the expected instance
- A proxy can be used to avoid creating the instance just to get a reference to the final instance. Using the proxy will only create the instance if a member, property or method is called.

> This structure will also manage error state and keep track of the actual error state.

```typescript
const lazy = new Lazy(
    () => new DoNotInstanciateIfNotNecessary(),
    DoNotInstanciateIfNotNecessary
);

// Get a reference via proxy until build is required
// This will not create the instance
const ref = lazy.get();

// Calling a method will trigger the build, this will create the instance:
ref.doStuff();
```

## Reference

- `constructor(factory: ()=> T, ctor?: Constructor)`: Use a simple callback that returns the new instance as factory and the expected type `ctor`. The expected type is optional and mainly used for prototype reflection on the proxy, not providing the type will fallback on `Object` until the instance is created.
- `readonly disposed: boolean`: Indicate whether or not current instance is disposed.
- `build(): void`: Create the instance explicitly to replace the actual proxy.
- `has(): boolean`: Indicate whether or not the instance has been created.
- `get(): T`: Returns the instance if create or a proxy.

## Implements

- [IDisposable](./disposable.md)