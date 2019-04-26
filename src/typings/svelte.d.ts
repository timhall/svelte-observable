declare module 'svelte/store' {
  export type Subscriber<T> = (value: T) => void;
  export type Unsubscribe = () => void;

  export interface ReadableStore<T> {
    subscribe(subscriber: Subscriber<T>): Unsubscribe;
  }

  export function readable<T>(
    initial: T,
    start: (set: (value: T) => void) => Unsubscribe | void
  ): ReadableStore<T>;
}
