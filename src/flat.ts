import { readable } from 'svelte/store';
import { isObservable, deferred } from './utils';
import observe from './observe';
import {
  ReadableStore,
  Unsubscribe,
  Observable,
  Fulfill,
  Reject,
  Deferred
} from './types';

type Store<T> = ReadableStore<T> & object;
type Subscribable<T> = Observable<T> | Store<T>;
type Any<T> = T | Observable<T> | Store<T>;

export default function flat<T>(
  subscribable: Subscribable<Any<T>>,
  initial?: T
): ReadableStore<Deferred<T>> {
  const is_observable = isObservable(subscribable);

  return readable((undefined as unknown) as Deferred<T>, set => {
    let inner_unsubscribe: Unsubscribe | null = null;
    let outer_unsubscribe: Unsubscribe | null = null;

    const { fulfill = (value: T) => set(value), reject } = (is_observable
      ? deferred<T>(set, initial)
      : {}) as { fulfill?: Fulfill<T>; reject?: Reject };

    function next(value: Any<T>) {
      if (inner_unsubscribe) {
        inner_unsubscribe();
        inner_unsubscribe = null;
      }
      if (isObservable(value))
        value = observe(value as Observable<T>) as Store<T>;

      if (isStore(value)) {
        inner_unsubscribe = value.subscribe(inner => fulfill(inner));
      } else {
        fulfill(value as T);
      }
    }
    function error(error: Error) {
      reject!(error);
    }

    if (is_observable) {
      const subscription = (subscribable as Observable<Any<T>>).subscribe({
        next,
        error
      });
      outer_unsubscribe = () => subscription.unsubscribe();
    } else {
      outer_unsubscribe = (subscribable as Store<Any<T>>).subscribe(next);
    }

    return () => {
      if (inner_unsubscribe) inner_unsubscribe();
      outer_unsubscribe!();
    };
  });
}

function isStore(value: any): value is Store<any> {
  return value && typeof value.subscribe === 'function';
}
