# @aster-js/core

## Lifecycle

### Lazy
Lazy allow to get lazy references that will create the instance when its used not when its referenced.

Exemple: *Resolving circular references:*
```ts
class CustomService {
    constructor()  {
        console.debug("constructor");
    }
    hello(): number {
        console.debug("Hello!");
    }
}
```
```ts
const service = Lazy.get(
    () => new CustomService()),
    CustomService
);
console.debug("Reference to CustomService done!")
service.hello();
```

Output:

```
> Reference to CustomService done!
> constructor
> Hello!
```

> See full documentation on [Lazy](./doc/lazy.md)
### Disposable
Provide multiple way to reset or free handlers, resources or anything else the same way and more safely using this disposable implementation.
```ts
function $on(target: EventTarget, name: string, callback: EventListener): IDisposable {
    target.addEventListener(name, callback);
    return IDisposable.create(() => target.removeEventListener(name, callback));
}

const @event = $on(document, "click", ()=> console.info("Click !"));

// ... later
IDisposable.safeDispose(@event);
```
> See more about [Disposable usage](./doc/disposable.md).

### Function hooks
```typescript
// Make further fetch call log the request
FunctionHook.define(self, "fetch", {
    before: req => console.debug("Fetch", req)
});
```
Function hooks are using disposable to help remove any hooks.

> Full documentation: [FunctionHook](./doc/function-hook.md)

## Metadata
### `Tag()`

Attach metadata to Types and instances.

**Declaration**
```ts
// Local read-write tag
const apiUrlTag = Tag<string>("Api url");

// External read-only tag
export const ApiUrlTag = apiUrlTag.readOnly();

// Only way to add metadata will be using this decorator
export const apiUrl = (url: string) =>
    (target: Function) => apiUrlTag(target, url);
```
**Tag Consumer**
```ts
import { ApiUrlTag } from "./xxx";
// Tag Consumer
export class ApiClientBase {
    protected async getJson(relativeUrl: string): Promise<any> {
        // The metadata has been associated with the type
        // so we have to provide `this.constructor`
        const baseUrl = ApiUrlTag(this.constructor);

        const fullUrl = new URL(relativeUrl, baseUrl);
        const result = await fetch(fullUrl.toString());
        return await result.json();
    }
}
```
**Usage**
```ts
import { apiUrl, ApiClientBase } from "./xxx";

@apiUrl("https://my-api-client/v1/")
export class MyApiClient {
    getData(): any{
        return this.getJson("/data");
    }
}
```

> See more about [Tag()](./doc/tag.md) or [Tag.lazy()](./doc/lazy-tag.md)
