import { Func, FuncMember } from "./type";
import { IDisposable } from "./idisposable";

/** Enumerate all hooks available during the function call lifecycle */
export interface FunctionHook<TArgs extends any[], TResult> {
    /**
     * Called before each function call.
     * @param args Actual function call arguments
     */
    before?(args: TArgs): void;
    /**
     * Called after the function is executed if no error are throwed.
     * @param result Actual function call result
     */
    after?(result: TResult): void;
    /**
     * Called each time a error is catched during the function call.
     * @param err Error catched
     */
    onError?(err: any): void;
    /**
     * Error catch by calling a hook. Hooks are safe and any hook that fail will be ignored.
     * If this hook throw error, the error will be ignored
     * @param err Error throwed ny a hook
     */
    onHookError?(err: any): void;
    /** Will always call this function at the end */
    always?(): void;
}

export namespace FunctionHook {

    export function define<
        T extends object, K extends keyof T, F extends FuncMember<T, K>
    >(target: T, fnName: K, hooks: FunctionHook<Parameters<T[F]>, ReturnType<T[F]>>): IDisposable {
        const fnSource = Reflect.get(target, fnName);

        let fnWithHooks = create(fnSource, hooks);
        const fnProxy = function (this: T, ...args: Parameters<T[F]>) {
            fnWithHooks.apply(this, args);
        };
        Reflect.set(target, fnName, fnProxy);

        return IDisposable.create(() => {
            const current = Reflect.get(target, fnName);
            if (current === fnProxy) {
                Reflect.set(target, fnName, fnSource);
            }
            else {
                fnWithHooks = fnSource;
            }
        });
    }

    export function create<TArgs extends any[], TResult>(fn: Func<TArgs, TResult>, hooks: FunctionHook<TArgs, TResult>): Func<TArgs, TResult> {
        return function (this: any, ...args: TArgs): TResult {
            callHook(hooks, "before", [...args]);
            try {
                const result = fn.apply(this, args);
                callHook(hooks, "after", result);
                return result;
            }
            catch (err) {
                callHook(hooks, "onError", err);
                throw err;
            }
            finally {
                callHook(hooks, "always");
            }
        } as Func<TArgs, TResult>;
    }

    function callHook<TArgs extends any[], TResult>(hooks: FunctionHook<TArgs, TResult>, name: keyof FunctionHook<TArgs, TResult>, ...args: any[]): void {
        const callback = hooks[name] as Function;
        if (!callback) return;

        try {
            callback.apply(hooks, args);
        }
        catch (err) {
            callHookFail(hooks, err);
        }
    }

    function callHookFail<TArgs extends any[], TResult>(hooks: FunctionHook<TArgs, TResult>, err: any): any {
        if (!hooks.onHookError) return;
        try {
            hooks.onHookError(err);
        }
        catch { }
    }
}
