## Tag.lazy<T>

Lazy Tags are read only [Tag](./tag.md) that enable attach metadata from a factory.

### Example 1

For this sample, we try to create a class decorator that register a list of action from a class declaration:

```typescript
const actionListenersTag = Tag.lazy<Map<string, string | symbol>>("Action Listeners", () => new Map());

export function action(actioName: string): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        actionListenersTag(target).set(actioName, propertyKey);
    };
}

export function getActionListener(instance: any, actioName: string): undefined | Function {
    const prototype = Object.getPrototypeOf(instance);
    const funcName = actionListenersTag(prototype).get(instance);
    return funcName && prototype[funcName];
}
```

### Example 2

This second example will use a state to assign a unique value for each tagged instance:

```typescript
const uniqueIdTag = Tag.lazy<number>("Action Listeners", (target, state) => ++state.lastId, { lastId = 0 });

const instance1 = {};
const instance2 = {};

console.debug(uniqueIdTag(instance1)); // 1
console.debug(uniqueIdTag(instance2)); // 2
console.debug(uniqueIdTag(instance1)); // 1
```
