export declare type Constructor<T> = {
    new (...args: any[]): T;
};
export declare function Configurable<T extends Constructor<{}>>(base: T): T;
