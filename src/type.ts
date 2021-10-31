
export interface Constructor<T = any, TArgs extends any[] = any[]> {
    new(...args: TArgs): T;
}

export type FuncMember<T, K extends keyof T> = T[K] extends Function ? K : never;

export type Func<TArgs extends any[] = [], TResult = any> = (...args: TArgs) => TResult;

export type AsyncFunc<TArgs extends any[] = [], TResult = any> = (...args: TArgs) => Promise<TResult>;

export type Action<TArgs extends any[] = []> = (...args: TArgs) => void;

export type AsyncAction<TArgs extends any[] = []> = (...args: TArgs) => Promise<void>;

const typeOfResult = typeof <any>null;

export type TypeOfResult = typeof typeOfResult;
