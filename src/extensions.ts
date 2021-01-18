import { Constructor } from "./type";

/* Act like mixins but instead use the prototype descriptors to apply  */
export namespace Extensions {

    export function merge<Target, Extensions>(target: Constructor<Target>, extensions: Extensions): Constructor<Target & typeof Extensions>
    export function merge(target: Constructor, extensions: Record<string, any>): any {
        for (const key in extensions) {
            Reflect.set(target.prototype, key, extensions[key]);
        }
        return target;
    }

    export function extend<Target, Extensions>(target: Constructor<Target>, extensions: Extensions): Constructor<Target & typeof Extensions> ;
    export function extend(target: Constructor, extensions: Record<string, any>): any {
        return extend(class extends target { }, extensions);
    }
}
