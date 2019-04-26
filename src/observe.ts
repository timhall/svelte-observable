import { readable } from 'svelte/store';
import { isObservable, deferred } from './utils';
import { Observable, ReadableStore, Deferred } from './types';

const noop = () => {};

export default function observe<T>(
  observable: any,
  initial?: T
): ReadableStore<Deferred<T>> {
  if (!isObservable(observable)) {
    return readable(observable as T, noop);
  }

  return readable((undefined as unknown) as Deferred<T>, set => {
    const { fulfill, reject } = deferred<T>(set, initial);

    const subscription = (observable as Observable<T>).subscribe({
      next(value) {
        fulfill(value);
      },
      error(err) {
        reject(err);
      }
    });

    return () => subscription.unsubscribe();
  });
}
