export type Unsubscribe = () => void;
export type Next<T> = (value: T) => void;

export interface Subscriber<T> {
  next?: Next<T>;
  error?(error: Error): void;
  complete?(): void;
}
export interface Subscription {
  unsubscribe: Unsubscribe;
}

export interface Observable<T> {
  subscribe(subscriber: Next<T> | Subscriber<T>): Subscription;
}

export interface ReadableStore<T> {
  subscribe(subscriber: Next<T>): Unsubscribe;
}

export type Fulfill<T> = (value: T) => void;
export type Reject = (error: Error) => void;
export type Deferred<T> = T | Promise<T>;
