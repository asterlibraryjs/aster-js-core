import { Tag } from "./tag";

export namespace Tags {
    /**
     * hashId allow to attribute a id to an instance to simplify the creation of hash codes.
     * Using hashId, you can create a hashCode by simply string concat two of these id with a separator.
     *
     * This is very usefull in case of compound keys where the key targets two objects
     * and have to be the key of a Map or a Set.
     *
     * @example
     * // This hash will be unique and can be reproduced
     * `${Tags.hashId.get(obj1)}-${Tags.hashId.get(obj2)}`;
     */
    export const hashId = Tag.lazy("hashId", (_, state) => ++state.lastId, { lastId: 0 });
}
