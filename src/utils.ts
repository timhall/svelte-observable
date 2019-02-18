import { Observable, Deferred, Fulfill, Reject } from './types';

let OBSERVABLE: symbol | string | undefined;

export function isObservable(value: any): value is Observable<any> {
  // Lazy-load Symbol to give polyfills a chance to run
  if (!OBSERVABLE) {
    OBSERVABLE =
      (typeof Symbol === 'function' && Symbol.observable) || '@@observable';
  }

  return value && value[OBSERVABLE] && value[OBSERVABLE]() === value;
}

export interface Resolve<T> {
  fulfill: Fulfill<T>;
  reject: Reject;
}

export function deferred<T>(
  set: (value: Deferred<T>) => void,
  initial?: T
): Resolve<T> {
  let initialized = initial !== undefined;
  let resolve: (value: T) => void | undefined;
  let reject: (error: Error) => void | undefined;

  // Set initial value
  set(
    initialized
      ? initial!
      : new Promise<T>((_resolve, _reject) => {
          resolve = _resolve;
          reject = _reject;
        })
  );

  return {
    fulfill(value) {
      if (initialized) return set(Promise.resolve(value));

      initialized = true;
      resolve(value);
    },
    reject(error) {
      if (initialized) return set(Promise.reject(error));

      initialized = true;
      reject(error);
    }
  };
}
