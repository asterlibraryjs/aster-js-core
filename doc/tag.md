## Tag<T>

Tag allow to add custom typed metadata to an object an manage a read/write scope on the metadata.

A Tag is safe as it store its value in an internal WeekMap.

### Example

#### First file: Declaration

```typescript
export interface ApiMetadata {
    readonly name: string;
    readonly baseUrl: number;
}

// Local read-write tag
const apiMetadataTag = Tag<ApiMetadata>("api metadata");

// External read-only tag
export const ApiMetadataTag = apiMetadataTag.readOnly();

// Only way to add metadata will be using this decorator
export function apiMetadata(name: string, baseUrl: string): ClassDecorator {
    return (target: Function) => {
        apiMetadataTag.set(target, { name, baseUrl });
    }
}
```

#### Second file: Usage

```typescript
export abstract class ApiService {
    private readonly _metadata: ApiMetadata;

    constructor() {
        this._metadata = ApiMetadataTag(this.constructor);
    }
    // ...
```

#### Third file: Result

```typescript
@apiMetadata("fix", "https://fix.me.org/")
export class FixApiService extends ApiService {
// ...
```

### Reference

- `Tag<T>(description: string): Tag<T>`:
Function to create an new Read and Write `Tag`.

#### ReadonlyTag<T>
- `(target: object): T | undefined`:
Gets current tag value of the provided object.
- `has(target: object): boolean`:
Indicates whether or not the provided object has been tagged.

- `get(target: object): T | undefined`:
Gets current tag value of the provided object.

#### Tag<T> extends ReadonlyTag<T>

- `readOnly(): ReadonlyTag<T>`:
Gets a `ReadonlyTag` tag for current `Tag` instance.

- `set(target: object, value: T): void`:
Tags the target with the provided value.

- `delete(target: object): void`:
Delete the tag of the provided target.
