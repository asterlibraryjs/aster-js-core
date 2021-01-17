
## FunctionHook

`FunctionHook` provide a different hooks to listen function calls: Before and after the call and when an exception occur.

It will return a `IDisposable` to enable removing the effect safely.

### `FunctionHook` sample

```typescript
// Make further fetch call log the request
FunctionHook.define(self, "fetch", {
    before: req => console.debug("Fetch", req)
});
```

### Hooks

- `before?(args: TArgs): void`: Called before each function call.
Parameter `args` are current function call arguments.
     
- `after?(result: TResult): void`: Called after the function is executed if no error are throwed.
Parameter `result` is current function call result.

- `onError?(err: any): void`: Called each time a error is catched during the function call.
This function have to return an error.
Parameter `err` is the catched error.

- `onHookError?(err: any): void`: Error catch by calling a hook. Hooks are safe and any hook that fail will be ignored.
If this hook throw error, the error will be ignored.
Parameter `err` Error throwed ny a hook

- `always?(): void`: Will always call this function at the end acting like a finally.